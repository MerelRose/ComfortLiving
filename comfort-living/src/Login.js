import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';

function LoginForm({ isOpen, togglePopup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const employeeEndpoint = 'http://localhost:3001/medewerkers/login';
    const customerEndpoint = 'http://localhost:3001/klanten/login';
    
    try {
      let response = await fetch(employeeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          wachtwoord: password,
        }),
      });

      let isEmployee = false; // Variabele om bij te houden of de gebruiker een medewerker is

      if (!response.ok) {
        response = await fetch(customerEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: username,
            wachtwoord: password,
          })
        });
      } else {
        isEmployee = true; // Als de response ok is, is de gebruiker een medewerker
      }

      const responseText = await response.text();
      let userData;
      try {
        userData = JSON.parse(responseText);
      } catch (e) {
        userData = null;
      }

      if (response.ok) {
        if (userData) {
          login({ ...userData, isEmployee }); // Voeg isEmployee toe aan de login
        } else {
          login({ isLoggedIn: true, isEmployee }); // Zorg ervoor dat isEmployee ook hier wordt toegevoegd
        }
        sessionStorage.setItem('user', JSON.stringify({ isLoggedIn: true, isEmployee })); // Sla isEmployee op in sessionStorage
        setSuccessMessage('Login succesvol!');
        togglePopup();
      } else {
        setErrorMessage(userData?.message || responseText || 'Ongeldige inloggegevens');
      }
    } catch (error) {
      setErrorMessage('Er is iets misgegaan. Probeer het opnieuw.');
    }
  };

  useEffect(() => {
    // Clear messages when the popup opens
    if (isOpen) {
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='popup'>
      <div className='popup-inner'>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Username/Email:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <br />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          <a type="button" tabindex="0" href="/wsp/password_forgotten">Wachtwoord vergeten?</a>
          <button type="submit">Inloggen</button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;