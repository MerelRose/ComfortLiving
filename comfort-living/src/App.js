import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import logo from './logo.png';
import './App.css';
import Login from './Login';
import Register from './Register';
import MyAccount from './MyAccount';
import WarningPopup from './WarningPopup';

function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // State to manage popup visibility

  const toggleRegisterPopup = () => {
    setIsRegisterOpen(!isRegisterOpen);
  };

  return (
    <BrowserRouter>
      <header>
        <div className="header-bg">
          <img src={logo} className="logo" alt="logo" width="10%" height="auto"/>
          <span className="slogan">Waar uw droomhuis werkelijkheid wordt</span>
          <div className="button-group">
            <input type="text" className="nav-btn" placeholder="Search.."/>
            <button className="nav-btn">Search</button>
            <button className="nav-btn" onClick={() => window.location.href = '/login'}>Login</button>
            <button className="nav-btn" onClick={toggleRegisterPopup}>Register</button>
            <button className="nav-btn" onClick={() => window.location.href = '/my-account'}>My Account</button>
          </div>
        </div>
      </header>

      <div className="App">
        <WarningPopup />
        {/* Pass the state and toggle function to Register component */}
        <Register isOpen={isRegisterOpen} togglePopup={toggleRegisterPopup} />
      </div>

      <Routes className="content">
        <Route path="/login" element={<Login />} />
        <Route path="/my-account" element={<MyAccount />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
