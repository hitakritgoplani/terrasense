import React from 'react'
import '../styles/CardOptions.css'
import { Link } from 'react-router-dom';

export default function CardOptions(props) {
    return (
        <Link to={props.route}>
            <div className="outer-div">
                <div className="inner-div" style={{ backgroundColor: props.color, color:props.fontColor }}>
                    <span className="details">{props.name}</span>
                    <span className="details">{props.details}</span>
                </div>
            </div>
        </Link>
    )
}