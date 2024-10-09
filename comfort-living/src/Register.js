import React, { useState } from 'react';
import './App.css';

function RegisterForm() {
  const [formData, setFormData] = useState({
    voornaam: '',
    achternaam: '',
    email: '',
    telefoonnummer: '',
    huidigewoonplaats: '',
    geslacht: '',
    geboortedatum: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    // You can now send the formData to your backend API or perform any other action
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <div className='content'>
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
          <option value="man">Man</option>
          <option value="vrouw">Vrouw</option>
          <option value="anders">Anders</option>
        </select>
        <br />
        <label>Geboortedatum:</label>
<div>
  <select name="dag" value={formData.dag} onChange={handleInputChange}>
    {Array.from({ length: 31 }, (_, i) => (
      <option value={i + 1}>{i + 1}</option>
    ))}
  </select>
  <select name="maand" value={formData.maand} onChange={handleInputChange}>
    {[
      "Januari",
      "Februari",
      "Maart",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Augustus",
      "September",
      "Oktober",
      "November",
      "December",
    ].map((month, i) => (
      <option value={i + 1}>{month}</option>
    ))}
  </select>
  <select name="jaar" value={formData.jaar} onChange={handleInputChange}>
    {Array.from({ length: 100 }, (_, i) => (
      <option value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
    ))}
  </select>
</div>
<br />
<button type="submit">Registreren</button>
      </form>
    </div>
  );
}

export default RegisterForm;