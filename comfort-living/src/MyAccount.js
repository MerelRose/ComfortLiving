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

const serviceTypeMapping = {
  1: 'Onderhoud buiten',
  2: 'Onderhoud riool/sanitair',
  3: 'Onderhoud binnen',
  4: 'Bezichtiging (eerste bezoek)',
  5: 'Onderhoud Elektra',
  6: 'Onderhoud beveiliging',
};

function MyAccount() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isServicePopupOpen, setIsServicePopupOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [serviceRequests, setServiceRequests] = useState([]);
  const [inschrijvingen, setInschrijvingen] = useState([]);
  const [pandDetails, setPandDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newIncome, setNewIncome] = useState('');
  const [opmerking, localSetOpmerking] = React.useState('');
  const [selectedServiceType, localSetSelectedServiceType] = React.useState('');



  useEffect(() => {
    const fetchServiceRequests = async () => {
      if (!user || !user.id) return;

      console.log('Fetching service requests for klantid:', user.id);
      try {
        const response = await fetch(`http://localhost:3001/serviceverzoek?klantid=${user.id}`, {
          method: 'GET',
          headers: {
            "api-key": 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Fout bij het ophalen van verzoeken');
        }

        const data = await response.json();
        const filteredRequests = data.filter(request => request.klantid === user.id);
        setServiceRequests(filteredRequests);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchInschrijvingen = async () => {
      if (!user || !user.id) return;

      console.log('Fetching inschrijvingen for userid:', user.id);
      try {
        const response = await fetch(`http://localhost:3001/inschrijvingen?userid=${user.id}`, {
          method: 'GET',
          headers: {
            "api-key": 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Fout bij het ophalen van inschrijvingen');
        }

        const data = await response.json();
        const filteredInschrijvingen = data.filter(inschrijving => inschrijving.userid === user.id);
        setInschrijvingen(filteredInschrijvingen);

        // Fetch pand details for each inschrijving
        const pandPromises = filteredInschrijvingen.map(inschrijving => 
          fetch(`http://localhost:3001/panden/${inschrijving.pandid}`, {
            method: 'GET',
            headers: {
              "api-key": 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6',
              'Content-Type': 'application/json',
            },
          }).then(response => {
            if (!response.ok) throw new Error('Fout bij het ophalen van pand');
            return response.json();
          }).then(pand => {
            setPandDetails(prev => ({ ...prev, [inschrijving.pandid]: pand }));
          })
        );

        await Promise.all(pandPromises);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
 setLoading(true);
      fetchServiceRequests();
      fetchInschrijvingen();
    }
  }, [isLoggedIn, user]);
  {isServicePopupOpen && (
    <ServiceVerzoeken
        user={user}
        onClose={() => setIsServicePopupOpen(false)} // Doorgeven van de onClose functie
    />
)}
  const handleChangePassword = async (oldPassword, newPassword) => {
    try {
      const response = await fetch(`http://localhost:3001/klanten/${user.id}/wachtwoord`, {
        method: 'PUT',
        headers: {
          "api-key": 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6',
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
          headers: {
            "api-key": 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6',
            'Content-Type': 'application/json',
          },
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
        const response = await fetch(`http://localhost:3001/klanten/resend-verification/${user.id}`, {
            method: 'POST',
            headers: {
                "api-key": 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6', // replace with your actual API key
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            setMessage(data.message); // Success message from the server
        } else {
            const errorData = await response.json();
            setMessage(`Fout bij het opnieuw verzenden van de e-mail: ${errorData.message}`);
        }
    } catch (error) {
        setMessage(`Er is een fout opgetreden: ${error.message}`);
    }
};

const [newAddress, setNewAddress] = useState('');

const handleChangeAddress = async () => {
  try {
      const response = await fetch(`http://localhost:3001/klanten/${user.id}/huidig-woonadres`, {
          method: 'PUT',
          headers: {
              "api-key": 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6', // replace with your actual API key
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              huidig_woonadres: newAddress,
          }),
      });

      if (response.ok) {
          const data = await response.json();
          setMessage(data.message);
          // Optionally reset the input field
          setNewAddress('');
      } else {
          const errorData = await response.json();
          setMessage(`Fout bij het wijzigen van het adres: ${errorData.message}`);
      }
  } catch (error) {
      setMessage(`Er is een fout opgetreden: ${error.message}`);
  }
};

const handleChangeIncome = async () => {
  try {
      const response = await fetch(`http://localhost:3001/klanten/${user.id}/bruto-jaarinkomen`, {
          method: 'PUT',
          headers: {
              "api-key": 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6', // replace with your actual API key
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              bruto_jaarinkomen: parseFloat(newIncome), // Ensure it's a number
          }),
      });

      if (response.ok) {
          const data = await response.json();
          setMessage(data.message);
          // Optionally reset the input field
          setNewIncome('');
      } else {
          const errorData = await response.json();
          setMessage(`Fout bij het wijzigen van het inkomen: ${errorData.message}`);
      }
  } catch (error) {
      setMessage(`Er is een fout opgetreden: ${error.message}`);
  }
};

  if (!isLoggedIn) {
    return <div className='content'>U bent niet ingelogd. Log in om uw account te bekijken.</div>;
  }

  if (!user) {
    return <div className='content'>Geen gebruikersinformatie beschikbaar.</div>;
  }

  return (
    <div className='content'>
      <h1>Mijn Account</h1>
        <div>
            <input 
                type="text" 
                value={newAddress} 
                onChange={(e) => setNewAddress(e.target.value)} 
                placeholder="Voer nieuw woonadres in" 
            />
            <button onClick={handleChangeAddress}>Adres Wijzigen</button>
        </div>
        
        {message && <p>{message}</p>}

        <div>
            <input 
                type="number" 
                value={newIncome} 
                onChange={(e) => setNewIncome(e.target.value)} 
                placeholder="Voer nieuw bruto jaarinkomen in" 
            />
            <button onClick={handleChangeIncome}>Inkomen Wijzigen</button>
        </div>

        {message && <p>{message}</p>}

      <div className="user-info">
        <p><strong>Volledige naam:</strong> {user.voornaam} {user.tussenvoegsel} {user.achternaam}</p>
        <p><strong>Email:</strong> {user.email || 'Niet beschikbaar'}</p>
        <p><strong>Telefoonnummer:</strong> {user.telefoonnummer || 'Niet beschikbaar'}</p>
        <p><strong>Adres:</strong> {user.huidig_woonadres || 'Niet beschikbaar'}</p>
        <p><strong>Geslacht:</strong> {user.geslacht || 'Niet beschikbaar'}</p>
        <p><strong>Geboortedatum:</strong> {formatDate(user.geboortedatum)}</p>
        <p><strong>Bruto jaarinkomen:</strong> {user.bruto_jaarinkomen}</p>
        <br />

        <button className='nav-btn' onClick ={() => setIsPopupOpen(true)}>Wachtwoord Wijzigen</button>
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
              <th>Omschrijving</th>
              <th>Service Type</th>
              <th>Datum Aanvraag</th>
              <th>Datum Afhandeling</th>
              <th>Status</th>
              <th>Bezichtiging</th>
            </tr>
          </thead>
          <tbody>
            {serviceRequests.map(request => (
              <tr key={request.id}>
                <td>{request.omschrijving}</td>
                <td>{serviceTypeMapping[request.servicetype_id] || 'Onbekend'}</td>
                <td>{formatDate(request.datum_aanvraag)}</td>
                <td>{formatDate(request.datum_afhandeling)}</td>
                <td>{request.status}</td>
                <td>{request.bezichtiging}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Mijn Inschrijvingen</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Fout: {error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Adres</th>
              <th>Aantal Pers.</th>
              <th>Datum</th>
              <th>Jaar Inkomen</th>
              <th>Bezichtiging</th>
            </tr>
          </thead>
          <tbody>
            {inschrijvingen.map(inschrijving => {
              const pand = pandDetails[inschrijving.pandid];
              return (
                <tr key={inschrijving.id}>
                  <td>{pand ? `${pand.straat} ${pand.huisnummer}` : 'Niet beschikbaar'}</td>
                  <td>{inschrijving.hoeveel_personen}</td>
                  <td>{formatDate(inschrijving.datum)}</td>
                  <td>€ {inschrijving.jaar_inkomen}</td>
                  <td>{inschrijving.bezichtiging}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      
    </div>

    
  );
}

export default MyAccount;