import React from 'react';
import Practice from './Practice';
import Home from './Home';
import Library from './Library';
import SelectQuestion from './components/SelectQuestion';
import SideNavBar from './components/SideNavBar';
import Strengths from './components/Strengths';

import './App.css';

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      {/* Include the SideNavBar component */}
      <SideNavBar />
      {/* Content area */}
      <div className="content">
        <Routes>
          <Route path="/" element={<SelectQuestion />} />
          <Route path="/Practice" element={<Practice />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Library" element={<Library />} />
          <Route path="/Strengths" element={<Strengths />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
