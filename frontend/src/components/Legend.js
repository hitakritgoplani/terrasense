import React from 'react'
import '../styles/Legend.css'

export default function Legend() {
    return (
        <div className="legend">
            <div>
                <h2>Legend</h2>
            </div>
            <div className='legend-items-root'>
            <div className="legend-item">
                <div className="color agri-land"></div>
                <span>Agricultural Land</span>
            </div>
            <div className="legend-item">
                <div className="color urban-land"></div>
                <span>Urban Land</span>
            </div>
            <div className="legend-item">
                <div className="color range-land"></div>
                <span>Range Land</span>
            </div>
            <div className="legend-item">
                <div className="color forest-land"></div>
                <span>Forest Land</span>
            </div>
            <div className="legend-item">
                <div className="color water"></div>
                <span>Water</span>
            </div>
            <div className="legend-item">
                <div className="color barren-land"></div>
                <span>Barren Land</span>
            </div>
            <div className="legend-item">
                <div className="color unknown"></div>
                <span>Unknown</span>
            </div>
            </div>
        </div>
    );
}
