import React, { useState } from 'react';
import './login.css';

function LoginForm({ isOpen, togglePopup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Username: ${username}, Password: ${password}`);
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
          <button type="submit">Login</button>
          <button type="button" onClick={togglePopup}>Sluiten</button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
