import React, { useState, useContext } from 'react';
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
    
    try {
      const response = await fetch('http://localhost:3001/klanten/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          wachtwoord: password,
        }),
      });
  
      const responseText = await response.text();
      console.log('Server response:', responseText); // Log de ruwe server respons
  
      let userData;
      try {
        userData = JSON.parse(responseText);
      } catch (e) {
        console.log('Response is niet in JSON formaat:', responseText);
        userData = null;
      }
  
      if (response.ok) {
        if (userData) {
          login(userData);
        } else {
          // Als er geen userData is, log toch in met minimale gegevens
          login({ isLoggedIn: true });
        }
        sessionStorage.setItem('user', JSON.stringify({ isLoggedIn: true }));
        console.log('Succesvol ingelogd.');
        setSuccessMessage('Login succesvol!');
        togglePopup();
      } else {
        setErrorMessage(userData?.message || responseText || 'Ongeldige inloggegevens');
      }
    } catch (error) {
      console.error('Fout bij het inloggen:', error);
      setErrorMessage('Er is iets misgegaan. Probeer het opnieuw.');
    }
  };

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
          <button type="submit">Login</button>
          <button type="button" onClick={togglePopup}>Sluiten</button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;