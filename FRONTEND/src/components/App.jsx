// src/App.jsx
import React from 'react'

import {BrowserRouter, Routes, Route} from "react-router-dom";

import Home from "./pages/Home.jsx";

function App() {

  return (
    
    <div style={{marginTop : '-3.5rem'}}>
      <BrowserRouter >
        <Routes>
        <Route path="/" element={<Home />} />
        </Routes>
  </BrowserRouter >
  </div>
  )}
  export default App;
  