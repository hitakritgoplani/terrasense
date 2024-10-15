import React from 'react'
import CardOptions from './CardOptions'
import '../styles/Cards.css'

export default function Cards() {
    const options = [
        {
            "name": "Terrain Classification",
            "details": "Explore the fascinating world of terrain recognition technology, a revolutionizing way for interacting with the natural landscape !",
            "color": "whitesmoke",
            "fontColor": "black",
            "route": "/terrain-classification"
        }
    ]
    return (
        <div className='card-div'>
            {options.map((option, i) => (<CardOptions fontColor={option.fontColor} route={option.route} color={option.color} name={option.name} details={option.details} key={i} />))}
        </div>

    )
}

