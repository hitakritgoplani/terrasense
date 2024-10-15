from flask import Flask, jsonify, request, Response
import cv2
import numpy as np
import torch
import albumentations as album
import segmentation_models_pytorch as smp
from flask_cors import CORS
# import tensorflow as tf

application = Flask(__name__)
CORS(application)

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = torch.load('./models/best_model.pth', map_location=DEVICE)
preprocessing_fn = smp.encoders.get_preprocessing_fn('resnet50', 'imagenet')

class_names = ['urban_land', 'agriculture_land', 'rangeland', 'forest_land', 'water', 'barren_land', 'unknown']
class_rgb_values = [[0, 255, 255], [255, 255, 0], [255, 0, 255], [0, 255, 0], [0, 0, 255], [255, 255, 255], [0, 0, 0]]
class_indices = [class_names.index(cls.lower()) for cls in class_names]
class_rgb_values =  np.array(class_rgb_values)[class_indices]

def get_validation_augmentation():
    train_transform = [
        album.CenterCrop(height=1024, width=1024, always_apply=True),
    ]
    return album.Compose(train_transform)

def to_tensor(x, **kwargs):
    return x.transpose(2, 0, 1).astype('float32')

def get_preprocessing(preprocessing_fn=None):
    _transform = []
    if preprocessing_fn:
        _transform.append(album.Lambda(image=preprocessing_fn))
    _transform.append(album.Lambda(image=to_tensor, mask=to_tensor))

    return album.Compose(_transform)

def reverse_one_hot(image):
    x = np.argmax(image, axis = -1)
    return x

def colour_code_segmentation(image, label_values):
    colour_codes = np.array(label_values)
    x = colour_codes[image.astype(int)]
    return x

def process_img(img):
    image = cv2.imdecode(np.frombuffer(img.read(), np.uint8), cv2.IMREAD_COLOR)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = get_validation_augmentation()(image=image)['image']
    image = get_preprocessing(preprocessing_fn)(image=image)['image']
    x_tensor = torch.from_numpy(image).to(DEVICE).unsqueeze(0)
    pred_mask = model(x_tensor)
    pred_mask = pred_mask.detach().squeeze().cpu().numpy()
    pred_mask = np.transpose(pred_mask,(1,2,0))
    pred_mask = colour_code_segmentation(reverse_one_hot(pred_mask), class_rgb_values)
    return pred_mask

def process_soil(img):
    img = cv2.imdecode(np.frombuffer(img, np.uint8), cv2.IMREAD_COLOR)
    img = cv2.resize(img, (200, 200))
    height, width, _ = img.shape
    mask = np.zeros((height, width), dtype = img.dtype)
    for i in range(height) :
        for j in range(width) :
            if(   img[i][j][0] > 100
          and img[i][j][0] < 200
          and img[i][j][1] > 100
          and img[i][j][1] < 200
          and img[i][j][2] > 100
          and img[i][j][2] < 200) :
                mask[i][j] = 1

    img = cv2.bitwise_and(img, img, mask=mask)
    img=img.astype(np.float32)
    img=img/255
    img = np.array([img]).reshape(-1, 200, 200, 3)
    # model = tf.keras.models.load_model('static/soil_model.h5')
    pred = model.predict(img)
    return pred

@application.route('/')
def index():
    return 'hello'

@application.route('/hi', methods=["GET"])
def hi():
    return 'hi'

@application.route('/predict', methods=["POST"])
def predict():
    image = request.files['image']
    image.save('static/image.png')
    img = cv2.imread('static/image.png')
    pred = cv2.resize(img, (1024, 1024))
    cv2.imwrite('static/image.png', pred)
    img = open('static/image.png', 'rb')
    pred = process_img(img)
    _, encoded_image = cv2.imencode('.png', pred)
    return Response(encoded_image.tobytes(), content_type='image/png')

@application.route('/soil', methods=["POST"])
def soil():
    image = request.files['image']
    pred = process_soil(image)
    return jsonify({'alluvial': str(pred[0][0]*100), 'black': str(pred[0][1]*100), 'dessert': str(pred[0][2]*100), 'red': str(pred[0][3]*100)})

if __name__ == "__main__":
    application.run(host="0.0.0.0", port=5000)