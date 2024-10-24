import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import './App.css';
import ChangePasswordPopup from './ChangePasswordPopup'; 

const formatDate = (dateString) => {
  if (!dateString) return 'Niet beschikbaar';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Maanden zijn 0-geïndexeerd
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

function MyAccount() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleChangePassword = async (newPassword) => {
    try {
      const response = await fetch(`http://localhost:3001/klanten/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wachtwoord: newPassword // Alleen het nieuwe wachtwoord doorgeven
        }),
        credentials: 'include'
      });

      if (response.ok) {
        setMessage('Wachtwoord succesvol gewijzigd.');
        setIsPopupOpen(false); // Sluit de popup
      } else {
        const errorData = await response.json();
        setMessage(`Fout bij het wijzigen van wachtwoord: ${errorData.message}`);
      }
    } catch (error) {
      setMessage(`Er is een fout opgetreden: ${error.message}`);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Weet u zeker dat u uw account wilt verwijderen?')) {
      try {
        const response = await fetch(`http://localhost:3001/klanten/${user.id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          setMessage(`Klant met id ${user.id} is succesvol verwijderd.`);
          logout(); // Gebruiker uitloggen na succesvol verwijderen van account
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
          <p><strong>Voor - en achternaam:</strong> {user.voornaam} {user.achternaam}</p>
          <p><strong>Email:</strong> {user.email || 'Niet beschikbaar'}</p>
          <p><strong>Telefoonnummer:</strong> {user.telefoonnummer || 'Niet beschikbaar'}</p>
          <p><strong>Adres:</strong> {user.huidig_woonadres || 'Niet beschikbaar'}</p>
          <p><strong>Geslacht:</strong> {user.geslacht || 'Niet beschikbaar'}</p>
          <p><strong>Geboortedatum:</strong> {formatDate(user.geboortedatum)}</p>  
          
          <button className='nav-btn' onClick={() => setIsPopupOpen(true)}>Wachtwoord Wijzigen</button>
          <button className='nav-btn' onClick={handleDeleteAccount}>Account Verwijderen</button>
        </div>
      ) : (
        <p>Geen gebruikersinformatie beschikbaar.</p>
      )}

      {isPopupOpen && (
        <ChangePasswordPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onChangePassword={handleChangePassword}
        />
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default MyAccount;
