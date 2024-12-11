import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Parameters from './Components/Parametres/Parameters'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageHome from './pages/PageHome'
import PageParam from './pages/PageParam'








function App() {
  

  return (
    <> 
      
      <Router>
      <Routes>
        <Route path="/" element={<PageHome />} />
        <Route path="/Problem1" element={<PageParam />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
