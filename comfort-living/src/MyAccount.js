import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import './App.css';

function MyAccount() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (isLoggedIn && user && user.id) {
      fetch(`http://localhost:3001/klanten/${user.id}`)
        .then(response => response.json())
        .then(data => {
          console.log('Opgehaalde gebruikersgegevens:', data);
          setUserData(data);
        })
        .catch(error => console.error('Fout bij het ophalen van gebruikersgegevens:', error));
    }
  }, [isLoggedIn, user]);

  // Hulpfunctie om de datumnotatie om te zetten
  const formatDate = (dateString) => {
    if (!dateString) return 'Niet beschikbaar';
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (!isLoggedIn) {
    return <div className='content'>U bent niet ingelogd. Log in om uw account te bekijken.</div>;
  }

  return (
    <div className='content'>
      <h1>Mijn Account</h1>
      {userData ? (
        <div className="user-info">
          {Object.entries(userData).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> {
                key === 'geboortedatum' ? formatDate(value) : (value || 'Niet beschikbaar')
              }
            </p>
          ))}
        </div>
      ) : (
        <p>Laden van gebruikersgegevens...</p>
      )}
    </div>
  );
}

export default MyAccount;