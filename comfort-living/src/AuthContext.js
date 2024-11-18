import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsLoggedIn(true);
        console.log('Gebruiker opgehaald uit lokale opslag:', userData);
      } catch (error) {
        console.error('Ongeldige gebruikersgegevens in lokale opslag');
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  const login = (userData) => {
    console.log('Login functie aangeroepen met:', userData);
    setUser (userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('Gebruiker ingelogd en opgeslagen:', userData);
};

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    console.log('Gebruiker uitgelogd');
  };
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 