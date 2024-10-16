import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import logo from './logo.png';
import WoningDetail from './DetailPage';
import './App.css';
import LoginForm from './Login'; 
import Register from './Register';
import Search from './search';
import MyAccount from './MyAccount';
import WarningPopup from './WarningPopup';

function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setIsRegisterOpen(false);
    setIsLoginOpen(false); 
  }, [location.pathname]);

  return (
    <>
      <header>
        <div className="header-bg">
          <img src={logo} className="logo" alt="logo" />
          <span className="slogan">Waar uw droomhuis werkelijkheid wordt!</span>
          <div className="button-group">
            {/* <input type="text" className="nav-btn" placeholder="Search.." /> */}
            
            <button className="nav-btn" onClick={() => window.location.href = '/search'}>Search</button>
            <button className="nav-btn" onClick={() => setIsLoginOpen(true)}>Login</button>
            <button className="nav-btn" onClick={() => setIsRegisterOpen(true)}>Register</button>
            <button className="nav-btn" onClick={() => window.location.href = '/my-account'}>My Account</button>
          </div>
        </div>
      </header>

      <div className="App">
        <WarningPopup />
        <Register isOpen={isRegisterOpen} togglePopup={() => setIsRegisterOpen(false)} />
        <LoginForm isOpen={isLoginOpen} togglePopup={() => setIsLoginOpen(false)} />
        <Routes className="content">
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/login" element={<div />} />
        <Route path="/woning/:id" element={<WoningDetail />} />

        <Route path="/detailpage" element={<WoningDetail />} />
        <Route path="/register" element={<div />} />
      </Routes>
      </div>

     
    </>
  );
}

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
