import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './AuthContext';
import logo from './logo.png';
import WoningDetail from './DetailPage';
import './App.css';
import LoginForm from './Login'; 
import Register from './Register';
import Search from './search';
import MyAccount from './MyAccount';
import WarningPopup from './WarningPopup';
import Home from './Home';
import Worker from './worker-dash';
import Admin from './admin-dash';

function Header({ setIsLoginOpen, setIsRegisterOpen }) {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <div className="header-bg">
        <img src={logo} className="logo" alt="logo" onClick={() => navigate('/')}/>
        <span className="slogan">Waar uw droomhuis werkelijkheid wordt!</span>
        <div className="button-group">
          {isLoggedIn ? (
            <>
              <button className="nav-btn" onClick={handleLogout}>Uitloggen</button>
              {isLoggedIn && user && !user.isEmployee && (
                <button className="nav-btn" onClick={() => navigate('/my-account')}>Mijn Account</button>
              )}
              {user.isEmployee && ( 
                <button className="nav-btn" onClick={() => navigate('/worker-dash')}>Worker Dashboard</button>
              )}       
              {user.admin && ( 
                <button className="nav-btn" onClick={() => navigate('/admin-dash')}>Admin Dashboard</button>
              )}
            </>
          ) : (
            <>
              <button className="nav-btn" onClick={() => setIsLoginOpen(true)}>Login</button>
              <button className="nav-btn" onClick={() => setIsRegisterOpen(true)}>Registreren</button>
            </>
          )}
          <button className="nav-btn" onClick={() => navigate('/search')}>Zoeken</button>
        </div>
      </div>
    </header>
  );
}

function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(AuthContext);

  useEffect(() => {
    setIsRegisterOpen(false);
    setIsLoginOpen(false); 
  }, [location.pathname]);

  useEffect(() => {
    console.log('Inlogstatus:', isLoggedIn ? 'Ingelogd' : 'Niet ingelogd');
    if (isLoggedIn) {
      console.log('Gebruikersgegevens:', user);
    }
  }, [isLoggedIn, user]);
  
  useEffect(() => {
    const storedUser   = sessionStorage.getItem('user');
    if (storedUser   && !isLoggedIn && location.pathname === '/') {
      navigate('/');
    }
  }, [isLoggedIn, location.pathname, navigate]);

  return (
    <>
      <Header setIsLoginOpen={setIsLoginOpen} setIsRegisterOpen={setIsRegisterOpen} />
      <div className="App">
        <WarningPopup />
        <LoginForm isOpen={isLoginOpen} togglePopup={() => setIsLoginOpen(false)} setIsRegisterOpen={setIsRegisterOpen} />
        <Register isOpen={isRegisterOpen} togglePopup={() => setIsRegisterOpen(false)} />
        <Routes className="content">
          <Route path="/search" element={<Search />} />
          <Route path="/" element={<Home />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/woning/:id" element={<WoningDetail />} />
          <Route path="/detailpage" element={<WoningDetail />} />
          <Route path="/worker-dash" element={user?.isEmployee ? <Worker /> : <Navigate to="/" />} />
          <Route path="/admin-dash" element={user?.admin === 1 ? <Admin /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

const AppWrapper = () => (
  <AuthProvider>
    <AppWithRouter />
  </AuthProvider>
);

export default AppWrapper;