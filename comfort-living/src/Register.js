import React, { useState } from 'react';
import './login.css'; // Zorg ervoor dat je deze CSS hebt voor stijlen

function RegisterForm({ isOpen, togglePopup }) {
  const [formData, setFormData] = useState({
    voornaam: '',
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

  // Function to send registration data to the backend
  const registerUser = async (userData) => {
    try {
      console.log('User data being sent:', userData); // Log user data before sending

      const response = await fetch('http://localhost:3001/klanten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Response status:', response.status); // Log response status
      const responseBody = await response.text(); // Get response body as text
      console.log('Response body:', responseBody); // Log response body

      if (!response.ok) {
        throw new Error('Er is een probleem opgetreden bij het registreren: ' + responseBody);
      }

      const data = JSON.parse(responseBody); // Parse response body
      setMessage('Registratie succesvol! Welkom ' + data.voornaam);
      console.log('Succesvolle registratie:', data);
    } catch (error) {
      console.error('Fout bij registratie:', error);
      setMessage('Er is iets misgegaan tijdens de registratie.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate birth date
    if (!formData.geboortedatum) {
      setMessage("Selecteer een geldige geboortedatum.");
      console.error("Geboortedatum niet ingevuld.");
      return;
    }

    const birthday = new Date(formData.geboortedatum);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDifference = today.getMonth() - birthday.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }

    // Validate age
    if (age < 18) {
      setMessage("Je moet 18 jaar of ouder zijn om te registreren.");
      console.error("Leeftijd is minder dan 18.");
      return;
    }

    // Validate required fields
    if (!formData.voornaam || !formData.achternaam || !formData.email || !formData.telefoonnummer || !formData.huidig_woonadres || !formData.geslacht || !formData.wachtwoord) {
      setMessage("Alle velden zijn verplicht.");
      console.error("Niet alle velden zijn ingevuld.");
      return;
    }

    // Validate password confirmation
    if (formData.wachtwoord !== bevestigWachtwoord) {
      setMessage("De wachtwoorden komen niet overeen.");
      console.error("Wachtwoorden komen niet overeen.");
      return;
    }

    // Send registration data
    registerUser({
      voornaam: formData.voornaam,
      email: formData.email,
      achternaam: formData.achternaam,
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
              <input type="tel" inputMode='numeric' name="telefoonnummer" value={formData.telefoonnummer} onChange={handleInputChange} />
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
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterForm;
