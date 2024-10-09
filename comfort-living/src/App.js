import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import logo from './logo.png';
import './App.css';
import LoginForm from './Login'; // Change this to import the LoginForm
import Register from './Register';
import MyAccount from './MyAccount';
import WarningPopup from './WarningPopup';

function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // State to manage register popup visibility
  const [isLoginOpen, setIsLoginOpen] = useState(false); // State to manage login popup visibility

  const toggleRegisterPopup = () => {
    setIsRegisterOpen(!isRegisterOpen);
  };

  const toggleLoginPopup = () => {
    setIsLoginOpen(!isLoginOpen);
  };

  return (
    <BrowserRouter>
      <header>
        <div className="header-bg">
          <img src={logo} className="logo" alt="logo" width="10%" height="auto" />
          <span className="slogan">Waar uw droomhuis werkelijkheid wordt</span>
          <div className="button-group">
            <input type="text" className="nav-btn" placeholder="Search.." />
            <button className="nav-btn">Search</button>
            <button className="nav-btn" onClick={toggleLoginPopup}>Login</button> {/* Toggle login popup */}
            <button className="nav-btn" onClick={toggleRegisterPopup}>Register</button>
            <button className="nav-btn" onClick={() => window.location.href = '/my-account'}>My Account</button>
          </div>
        </div>
      </header>

      <div className="App">
        <WarningPopup />
        <Register isOpen={isRegisterOpen} togglePopup={toggleRegisterPopup} />
        <LoginForm isOpen={isLoginOpen} togglePopup={toggleLoginPopup} /> {/* Add LoginForm here */}
      </div>

      <Routes className="content">
        <Route path="/my-account" element={<MyAccount />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
