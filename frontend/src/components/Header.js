import React from 'react'
import logo from '../images/logo.png'
import '../styles/Header.css'

export default function Header() {
    return (
        <header>
            <a href="/">
                <img className="logo" src={logo} alt='logo'/>
            </a>
        </header>

    )
}
