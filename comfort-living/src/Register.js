import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext'; // Access to the login functionality
import './login.css';

function RegisterForm({ isOpen, togglePopup }) {
  const [formData, setFormData] = useState({
    voornaam: '',
    tussenvoegsel: '',
    achternaam: '',
    email: '',
    telefoonnummer: '',
    huidig_woonadres: '',
    geslacht: '',
    geboortedatum: '',
    wachtwoord: '',
  });

  const [bevestigWachtwoord, setBevestigWachtwoord] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const { login } = useContext(AuthContext);

  const registerUser  = async (userData) => {
    try {
      console.log('User  data being sent:', userData);
  
      const response = await fetch('http://localhost:3001/klanten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const responseBody = await response.text();
      console.log('Response body:', responseBody);
  
      if (!response.ok) {
        throw new Error('Er is een probleem opgetreden bij het registreren: ' + responseBody);
      }
  
      const data = JSON.parse(responseBody);
      setMessage('Registratie succesvol! Welkom, ' + data.klant.voornaam + 'Controleer je e-mail om je account te verifiëren. ');
      setSuccessMessage('Je account is succesvol aangemaakt.'); // Set success message
      console.log('Succesvolle registratie:', data);
  
      const userInfo = {
        voornaam: data.klant.voornaam || 'Niet beschikbaar',
        tussenvoegsel: data.klant.tussenvoegsel || 'Niet beschikbaar',
        achternaam: data.klant.achternaam || 'Niet beschikbaar',
        email: data.klant.email,
        telefoonnummer: data.klant.telefoonnummer || 'Niet beschikbaar',
        huidig_woonadres: data.klant.huidig_woonadres || 'Niet beschikbaar',
        geslacht: data.klant.geslacht || 'Niet beschikbaar',
        geboortedatum: data.klant.geboortedatum || 'Niet beschikbaar',
        isLoggedIn: true,
      };
  
      sessionStorage.setItem('user', JSON.stringify(userInfo));
      login(userInfo); // Directly log in the user with the correct data
  
      // Close the popup after a short delay to allow the user to see the success message
      setTimeout(() => {
        togglePopup(); // Close the popup
      }, 2000); // Delay of 2 seconds

    } catch (error) {
      console.error('Fout bij registratie:', error);
      setMessage('Er is iets misgegaan tijdens de registratie.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate fields
    if (!formData.geboortedatum) {
      setMessage("Selecteer een geldige geboortedatum.");
      return;
    }

    const birthday = new Date(formData.geboortedatum);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDifference = today.getMonth() - birthday.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }

    if (age < 18) {
      setMessage("Je moet 18 jaar of ouder zijn om te registreren.");
      return;
    }

    if (!formData.voornaam || !formData.achternaam || !formData.email || !formData.telefoonnummer || !formData.huidig_woonadres || !formData.geslacht || !formData.wachtwoord) {
      setMessage("Alle velden zijn verplicht.");
      return;
    }

    if (formData.wachtwoord !== bevestigWachtwoord) {
      setMessage("De wachtwoorden komen niet overeen.");
      return;
    }

    // Validate phone number
    const phoneRegex = /^06[0-9]{8}$/;
    if (!phoneRegex.test(formData.telefoonnummer)) {
      setMessage("Voer een geldig Nederlands telefoonnummer in (bijv. 0612345678).");
      return;
    }

    // Send registration data
    registerUser ({
      voornaam: formData.voornaam ,
      tussenvoegsel: formData.tussenvoegsel,
      achternaam: formData.achternaam,
      email: formData.email,
      geslacht: formData.geslacht,
      geboortedatum: formData.geboortedatum,
      huidig_woonadres: formData.huidig_woonadres,
      telefoonnummer: formData.telefoonnummer,
      wachtwoord: formData.wachtwoord,
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <div className='contentl'>
      {isOpen && (
        <div className='popup'>
          <div className='popup-inner'>
            <h2>Registratieformulier</h2>
            <form onSubmit={handleSubmit}>
              <div className='name-container'>
                <label>Voornaam:</label>
                <input type="text" name="voornaam" value={formData.voornaam} onChange={handleInputChange} />
                <br />
                <label>Tussenvoegsel:</label>
                <input type="text" name="tussenvoegsel" value={formData.tussenvoegsel} onChange={handleInputChange} />
                <br />
                <label>Achternaam:</label>
                <input type="text" name="achternaam" value={formData.achternaam} onChange={handleInputChange} />
                <br />
              </div>
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
              <br />
              <label>Wachtwoord:</label>
              <input type="password" name="wachtwoord" value={formData.wachtwoord} onChange={handleInputChange} />
              <br />
              <label>Bevestig Wachtwoord:</label>
              <input type="password" name="bevestigWachtwoord" value={bevestigWachtwoord} onChange={(e) => setBevestigWachtwoord(e.target.value)} />
              <br />
              <label>Telefoonnummer:</label>
              <input type="tel" inputMode='numeric' name="telefoonnummer" value={formData.telefoonnummer} onChange={handleInputChange} required pattern="06[0-9]{8}" />
              <br />
              <label>Huidig woonadres:</label>
              <input type="text" name="huidig_woonadres" value={formData.huidig_woonadres} onChange={handleInputChange} />
              <br />
              <div className='name-container'>
                <label>Geslacht:</label>
                <select name="geslacht" value={formData.geslacht} onChange={handleInputChange}>
                  <option value="">Selecteer geslacht</option>
                  <option value="man">Man</option>
                  <option value="vrouw">Vrouw</option>
                </select>
                <br />
                <label>Geboortedatum:</label>
                <input type="date" name="geboortedatum" value={formData.geboortedatum} onChange={handleInputChange} />
                <br />
              </div>
              <button type="submit">Registreren</button>
              <button type="button" onClick={togglePopup}>Sluiten</button>
            </form>
            {message && <p>{message}</p>}
            {successMessage && <p>{successMessage}</p>} 
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterForm;