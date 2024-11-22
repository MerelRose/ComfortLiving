import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import './App.css';
import ChangePasswordPopup from './ChangePasswordPopup'; 
import ServiceVerzoeken from './ServiceVerzoeken';

const formatDate = (dateString) => {
  if (!dateString) return 'Niet beschikbaar';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

function MyAccount() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isServicePopupOpen, setIsServicePopupOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceRequests = async () => {
      if (!user || !user.id) return; // Prevent fetching if user is null

      console.log('Fetching service requests for klantid:', user.id);
      try {
        const response = await fetch(`http://localhost:3001/serviceverzoek?klantenid=${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Fout bij het ophalen van serviceverzoeken');
        }

        const data = await response.json();
        setServiceRequests(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchServiceRequests();
    }
  }, [isLoggedIn, user]); // Add user to dependencies

  const handleChangePassword = async (oldPassword, newPassword) => {
    try {
      const response = await fetch(`http://localhost:3001/klanten/${user.id}/wachtwoord`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oudWachtwoord: oldPassword,
          nieuwWachtwoord: newPassword
        }),
        credentials: 'include'
      });

      if (response.ok) {
        setMessage('Wachtwoord succesvol gewijzigd.');
        setIsPopupOpen(false);
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
          logout();
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
          wachtwoord: 'placeholderPassword',
        }),
      });

      if (response.ok) {
        setMessage('Verificatie e-mail is opnieuw verstuurd! Controleer je inbox & spam.');
      } else {
        const errorData = await response.json();
        setMessage(`Fout bij het opnieuw verzenden van de e-mail: ${errorData.message}`);
      }
    } catch (error) {
      setMessage(`Er is een fout opgetreden: ${error.message}`);
    }
  };

  if (!isLoggedIn) {
    return <div className='content'>U bent niet ingelogd. Log in om uw account te bekijken.</div>;
  }

  if (!user) {
    return <div className='content'>Geen gebruikersinformatie beschikbaar.</div>; // Fallback for user being null
  }

  return (
    <div className='content'>
      <h1>Mijn Account</h1>

      <div className="user-info">
        <p><strong>Volledige naam:</strong> {user.voornaam} {user.tussenvoegsel} {user.achternaam}</p>
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

      <h2>Mijn Serviceverzoeken</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Fout: {error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Klant ID</th>
              <th>Omschrijving</th>
              <th>Contract ID</th>
              <th>Service Type ID</th>
              <th>Datum Aanvraag</th>
              <th>Datum Afhandeling</th>
              <th>Status</th>
              <th>Bezichtiging</th>
            </tr>
          </thead>
          <tbody>
            {serviceRequests.map(request => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.klantenid}</td>
                <td>{request.omschrijving}</td>
                <td>{request.contract_id}</td>
                <td>{request.servicetype_id}</td>
                <td>{formatDate(request.datum_aanvraag)}</td>
                <td>{formatDate(request.datum_afhandeling)}</td>
                <td>{request.status}</td>
                <td>{request.bezichtiging}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyAccount;