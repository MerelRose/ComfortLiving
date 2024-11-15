import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import './App.css';
import ChangePasswordPopup from './ChangePasswordPopup'; 
import ServiceVerzoeken from './ServiceVerzoeken'; // Zorg ervoor dat je de juiste bestandsnaam gebruikt


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
  const [isServicePopupOpen, setIsServicePopupOpen] = useState(false); // State voor serviceverzoeken popup
  const [message, setMessage] = useState('');

  const handleChangePassword = async (oldPassword, newPassword) => {
    try {
        const response = await fetch(`http://localhost:3001/klanten/${user.id}/wachtwoord`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                oudWachtwoord: oldPassword, // Send the old password
                nieuwWachtwoord: newPassword // Send the new password
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

  const handleResendEmail = async () => {
    try {
      const response = await fetch('http://localhost:3001/klanten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          voornaam: user.voornaam,
          achternaam: user.achternaam,
          geslacht: user.geslacht,
          geboortedatum: user.geboortedatum,
          huidig_woonadres: user.huidig_woonadres,
          telefoonnummer: user.telefoonnummer,
          wachtwoord: 'placeholderPassword', // Plaatsvervangend wachtwoord om validatie te passeren
        }),
      });
  
      if (response.ok) {
        setMessage('Verificatie e-mail is opnieuw verstuurd! Controleer je inbox & spam.');
      } else {
        const errorData = await response.json();
        setMessage(`Fout bij het opnieuw versturen van verificatie e-mail: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Fout bij opnieuw versturen verificatie e-mail:', error);
      setMessage('Er is iets misgegaan bij het opnieuw versturen van de verificatie e-mail.');
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
          <p><strong>Volledige naam:</strong> {user.voornaam} { user.tussenvoegsel} {user.achternaam}</p>
          <p><strong>Email:</strong> {user.email || 'Niet beschikbaar'}</p>
          <p><strong>Telefoonnummer:</strong> {user.telefoonnummer || 'Niet beschikbaar'}</p>
          <p><strong>Adres:</strong> {user.huidig_woonadres || 'Niet beschikbaar'}</p>
          <p><strong>Geslacht:</strong> {user.geslacht || 'Niet beschikbaar'}</p>
          <p><strong>Geboortedatum:</strong> {formatDate(user.geboortedatum)}</p>
<br />

          <button className='nav-btn' onClick={() => setIsPopupOpen(true)}>Wachtwoord Wijzigen</button>
          <button className='nav-btn' onClick={handleDeleteAccount}>Account Verwijderen</button>
          <button className='nav-btn' onClick={handleResendEmail}>Verificatie e-mail opnieuw versturen</button>
          <button className='nav-btn' onClick={() => setIsServicePopupOpen(true)}>Indienen Serviceverzoek</button>
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
      {isServicePopupOpen && (
        <ServiceVerzoeken
          user={user}
          onClose={() => setIsServicePopupOpen(false)}
        />
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default MyAccount;