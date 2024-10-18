import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import './App.css';

function MyAccount() {
  const { isLoggedIn, user } = useContext(AuthContext);

  console.log('MyAccount - isLoggedIn:', isLoggedIn);
  console.log('MyAccount - user:', user);

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
          <p><strong>Gebo ortedatum:</strong> {user.geboortedatum || 'Niet beschikbaar'}</p>
        </div>
      ) : (
        <p>U bent ingelogd, maar er zijn geen gedetailleerde gebruikersgegevens beschikbaar.</p>
      )}
    </div>
  );
}

export default MyAccount;