import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import './App.css';

const formatDate = (dateString) => {
  if (!dateString) return 'Niet beschikbaar';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Maanden zijn 0-geïndexeerd
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

function MyAccount() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  console.log('MyAccount - isLoggedIn:', isLoggedIn);
  console.log('MyAccount - user:', user);

  const handleChangePassword = async () => {
    if (!newPassword) {
      setMessage('Voer een nieuw wachtwoord in.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          newPassword: newPassword
        }),
        credentials: 'include'
      });

      if (response.ok) {
        setMessage('Wachtwoord succesvol gewijzigd.');
        setNewPassword('');
      } else {
        const errorData = await response.json();
        setMessage(`Fout bij het wijzigen van wachtwoord: ${errorData.message}`);
      }
    } catch (error) {
      setMessage(`Er is een fout opgetreden: ${error.message}`);
    }
  };
// account verwijderen
  const handleDeleteAccount = async () => {
    if (window.confirm('Weet u zeker dat u uw account wilt verwijderen?')) {
      try {
        const response = await fetch(`http://localhost:3001/klanten/${user.email}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          setMessage(`Klant met email ${user.email} is succesvol verwijderd.`);
          // Hier kan je eventueel de gebruiker uitloggen of de state resetten
        } else {
          const errorData = await response.json();
          setMessage(`Fout bij het verwijderen van account: ${errorData.message}`);
        }
      } catch (error) {
        setMessage(`Er is een fout opgetreden: ${error.message}`);
      }
    }
  };

  if (!isLoggedIn) {
    return <div className='content'>U bent niet ingelogd. Log in om uw account te bekijken.</div>;
  }

  return (
    <div className='content'>
      <h1>Mijn Account</h1>
      {user ? (
        <div className="user-info">
          <p><strong>Voornaam:</strong> {user.voornaam || 'Niet beschikbaar'}</p>
          <p><strong>Achternaam:</strong> {user.achternaam || 'Niet beschikbaar'}</p>
          <p><strong>Email:</strong> {user.email || 'Niet beschikbaar'}</p>
          <p><strong>Telefoonnummer:</strong> {user.telefoonnummer || 'Niet beschikbaar'}</p>
          <p><strong>Adres:</strong> {user.huidig_woonadres || 'Niet beschikbaar'}</p>
          <p><strong>Geslacht:</strong> {user.geslacht || 'Niet beschikbaar'}</p>
          <p><strong>Geboortedatum:</strong> {formatDate(user.geboortedatum)}</p>       
          
          <button className='nav-btn' onClick={handleDeleteAccount}>Verwijder uw Account</button>
          
          <div>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nieuw wachtwoord"
            />
            <button className='nav-btn' onClick={handleChangePassword}>Verander Wachtwoord</button>
          </div>
          {message && <p>{message}</p>}
        </div>
      ) : (
        <p>U w accountgegevens zijn niet beschikbaar.</p>
      )}
    </div>
  );
}

export default MyAccount;