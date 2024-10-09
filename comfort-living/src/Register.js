import React, { useState } from 'react';
import './App.css'; // Ensure you have this CSS file to apply styles

function RegisterForm({ isOpen, togglePopup }) {
  const [formData, setFormData] = useState({
    voornaam: '',
    achternaam: '',
    email: '',
    telefoonnummer: '',
    huidigewoonplaats: '',
    geslacht: '',
    geboortedatum: '',
  });

  const [dag, setDag] = useState('');
  const [maand, setMaand] = useState('');
  const [jaar, setJaar] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Make the birthday based on the selected day, month, and year
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

    // Check if the user is 18 years or older
    if (age < 18) {
      setMessage("Je moet 18 jaar of ouder zijn om te registreren.");
      console.error("Leeftijd is minder dan 18.");
      return;
    }

    // Check if all fields are filled
    if (!formData.voornaam || !formData.achternaam || !formData.email || !formData.telefoonnummer || !formData.huidigewoonplaats || !formData.geslacht) {
      setMessage("Alle velden zijn verplicht.");
      console.error("Niet alle velden zijn ingevuld.");
      return;
    }

    // Validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage("Ongeldig e-mailadres. Vul een correct e-mailadres in.");
      console.error("Ongeldig e-mailadres:", formData.email);
      return;
    }

    // Validate phone number
    const phoneNumber = formData.telefoonnummer.trim();
    const mobileRegex = /^06\d{8}$/; // Mobile numbers start with 06 and have 10 digits
    const internationalRegex = /^\+31\s?6\d{8}$/; // International number +31 6 and 10 digits

    if (!mobileRegex.test(phoneNumber) && !internationalRegex.test(phoneNumber)) {
      setMessage("Ongeldig telefoonnummer. Vul een geldig Nederlands telefoonnummer in (bijv. 06xxxxxxxx of +31 6xxxxxxxx).");
      console.error("Ongeldig telefoonnummer:", formData.telefoonnummer);
      return;
    }

    // If all validations pass
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
                <option value="anders">Anders</option>
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
              {message && <p style={{ color: message.includes("succesvol") ? "green" : "red" }}>{message}</p>}
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
