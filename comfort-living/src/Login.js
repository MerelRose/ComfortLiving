import React, { useState } from 'react';
import './login.css';

function LoginForm({ isOpen, togglePopup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');

    // Maak een POST-verzoek naar de backend
    try {
      const response = await fetch('http://localhost:3001/klanten/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username, // Zorg ervoor dat het veld overeenkomt met wat je backend verwacht
          wachtwoord: password, // Verstuur het wachtwoord
        }),
      });

      const data = await response.text(); // Als je JSON verwacht, gebruik response.json()

      if (response.ok) {
        setSuccessMessage('Login succesvol!');
        console.log(data); // Kan een succesbericht tonen
      } else {
        setErrorMessage(data); // Dit toont de foutmelding van de backend
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
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
