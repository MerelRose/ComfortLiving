import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import logo from './logo.png';
import './App.css';
import Login from './Login';
import MyAccount from './MyAccount';

function App() {
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
            <button className="nav-btn" onClick={() => window.location.href = '/my-account'}>My Account</button>
          </div>
        </div>
      </header>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/my-account" element={<MyAccount />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;