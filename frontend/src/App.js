import React from 'react'
import './App.css';
import Header from './components/Header';
import Landing from './pages/Landing'
import Terrain from './pages/Terrain'
import Weapon from './pages/Weapon'
import Soil from './pages/Soil'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/terrain-classification" element={<Terrain/>} />
          <Route path="/display-weaponary" element={<Weapon/>} />
          <Route path="/soil-classification" element={<Soil/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
