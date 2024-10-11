import React, { useState } from 'react';
import './App.css'; // Zorg ervoor dat je deze CSS hebt voor stijlen

function RegisterForm({ isOpen, togglePopup }) {
  const [formData, setFormData] = useState({
    voornaam: '',
    achternaam: '',
    email: '',
    telefoonnummer: '',
    huidigewoonplaats: '',
    geslacht: '',
    geboortedatum: '',
    wachtwoord: '', // Wachtwoordveld toegevoegd
    bevestigWachtwoord: '', // Bevestiging van wachtwoord toegevoegd
  });

  const [dag, setDag] = useState('');
  const [maand, setMaand] = useState('');
  const [jaar, setJaar] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Maak de geboortedatum gebaseerd op de geselecteerde dag, maand en jaar
    if (!dag || !maand || !jaar) {
      setMessage("Selecteer een geldige geboortedatum.");
      console.error("Geboortedatum niet correct geselecteerd.");
      return;
    }

    const geboortedatum = `${dag.toString().padStart(2, '0')}-${maand.toString().padStart(2, '0')}-${jaar}`;
    const birthday = new Date(jaar, maand - 1, dag);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDifference = today.getMonth() - birthday.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }

    // Controleer of de gebruiker 18 jaar of ouder is
    if (age < 18) {
      setMessage("Je moet 18 jaar of ouder zijn om te registreren.");
      console.error("Leeftijd is minder dan 18.");
      return;
    }

    // Controleer of alle velden zijn ingevuld
    if (!formData.voornaam || !formData.achternaam || !formData.email || !formData.telefoonnummer || !formData.huidigewoonplaats || !formData.geslacht || !formData.wachtwoord || !formData.bevestigWachtwoord) {
      setMessage("Alle velden zijn verplicht.");
      console.error("Niet alle velden zijn ingevuld.");
      return;
    }

    // Controleer of de wachtwoorden overeenkomen
    if (formData.wachtwoord !== formData.bevestigWachtwoord) {
      setMessage("De wachtwoorden komen niet overeen.");
      console.error("Wachtwoorden komen niet overeen.");
      return;
    }

    // Valideer e-mailadres
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage("Ongeldig e-mailadres. Vul een correct e-mailadres in.");
      console.error("Ongeldig e-mailadres:", formData.email);
      return;
    }

    // Valideer telefoonnummer
    const phoneNumber = formData.telefoonnummer.trim();
    const mobileRegex = /^06\d{8}$/; // Mobiele nummers beginnen met 06 en hebben 10 cijfers
    const internationalRegex = /^\+31\s?6\d{8}$/; // Internationaal nummer +31 6 en 10 cijfers

    if (!mobileRegex.test(phoneNumber) && !internationalRegex.test(phoneNumber)) {
      setMessage("Ongeldig telefoonnummer. Vul een geldig Nederlands telefoonnummer in (bijv. 06xxxxxxxx of +31 6xxxxxxxx).");
      console.error("Ongeldig telefoonnummer:", formData.telefoonnummer);
      return;
    }

    // Als alle validaties slagen
    setMessage("Registratie succesvol!");
    console.log("Succesvolle registratie:", { ...formData, geboortedatum });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <div className='content'>
      {isOpen && (
        <div className='popup'>
          <div className='popup-inner'>
            <h2>Registratieformulier</h2>
            <form onSubmit={handleSubmit}>
              <label>Voornaam:</label>
              <input type="text" name="voornaam" value={formData.voornaam} onChange={handleInputChange} />
              <br />
              <label>Achternaam:</label>
              <input type="text" name="achternaam" value={formData.achternaam} onChange={handleInputChange} />
              <br />
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
              <br />
              <label>Wachtwoord:</label> 
              <input type="password" name="wachtwoord" value={formData.wachtwoord} onChange={handleInputChange} />
              <br />
              <label>Bevestig Wachtwoord:</label> 
              <input type="password" name="bevestigWachtwoord" value={formData.bevestigWachtwoord} onChange={handleInputChange} />
              <br />
              <label>Telefoonnummer:</label> 
              <input type="tel" name="telefoonnummer" value={formData.telefoonnummer} onChange={handleInputChange} />
              <br />
              <label>Huidige woonplaats:</label>
              <input type="text" name="huidigewoonplaats" value={formData.huidigewoonplaats} onChange={handleInputChange} />
              <br />
              <label>Geslacht:</label>
              <select name="geslacht" value={formData.geslacht} onChange={handleInputChange}>
                <option value="">Selecteer geslacht</option>
                <option value="man">Man</option>
                <option value="vrouw">Vrouw</option>
              </select>
              <br />
              <label>Geboortedatum:</label>
              <div>
                <select name="dag" value={dag} onChange={(e) => setDag(e.target.value)}>
                  <option value="">Dag</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <select name="maand" value={maand} onChange={(e) => setMaand(e.target.value)}>
                  <option value="">Maand</option>
                  {["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"].map((month, i) => (
                    <option key={i} value={i + 1}>{month}</option>
                  ))}
                </select>
                <select name="jaar" value={jaar} onChange={(e) => setJaar(e.target.value)}>
                  <option value="">Jaar</option>
                  {Array.from({ length: 100 }, (_, i) => (
                    <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                  ))}
                </select>
              </div>
              <br />
              <button type="submit">Registreren</button>
              <button type="button" onClick={togglePopup}>Sluiten</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterForm;
