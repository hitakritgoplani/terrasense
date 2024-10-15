import React, { useState } from 'react';
import '../styles/Soil.css'
import Legend from '../components/Legend';

function TerrainClassification() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      console.error('No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage); // Use 'image' as the key

    try {
      const response = await fetch('http://127.0.0.1:5000/soil', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error('Error uploading image:', response.statusText);
        return;
      }

      const blob = await response.blob();
      const imageURL = URL.createObjectURL(blob);
      setProcessedImage(imageURL);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="terrain-root">

      <h1 className="heading">Soil Classification</h1>
      {/* <div className='legend-root'>
        <Legend className='legend' />
      </div> */}

      <form action="/upload" method="post" encType="multipart/form-data" className="form-root">
        <label for="imageUpload" className="btn-choose">Select Image</label>
        <input id="imageUpload" style={{ visibility: "hidden"}} type="file" accept="image/*"
          onChange={handleImageChange} />
        <button className='btn' type="button" onClick={handleImageUpload}>
          Process Image
        </button>
      </form>

      <div className="results">

        <div className="original">
          {selectedImage ? (
            <img src={URL.createObjectURL(selectedImage)} alt="Original" />
          ) : (
            <h2>Original Image will be displayed here</h2>
          )}
        </div>
        <div className="masked">
          {processedImage ? (
            <img src={processedImage} alt="Processed" />
          ) : (
            <h2>Processed Image will be displayed here</h2>
          )}
        </div>

      </div>

    </div>
  );
}

export default TerrainClassification;