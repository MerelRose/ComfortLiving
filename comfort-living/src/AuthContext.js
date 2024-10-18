import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsLoggedIn(true);
        console.log('Gebruiker opgehaald uit sessie:', userData);
      } catch (error) {
        console.error('Invalid session data');
        sessionStorage.removeItem('user');
      }
    }
  }, []);
  
  const login = (userData) => {
    console.log('Login functie aangeroepen met:', userData);
    setUser(userData);
    setIsLoggedIn(true);
    sessionStorage.setItem('user', JSON.stringify(userData));
    console.log('Gebruiker ingelogd en opgeslagen:', userData);
  };
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    sessionStorage.removeItem('user');
    console.log('Gebruiker uitgelogd');
  };
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};