import React, { useContext } from 'react';
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
          <p><strong>Geboortedatum:</strong> {formatDate(user.geboortedatum)}</p>        </div>
      ) : (
        <p>U bent ingelogd, maar er zijn geen gedetailleerde gebruikersgegevens beschikbaar.</p>
      )}
    </div>
  );
}

export default MyAccount;