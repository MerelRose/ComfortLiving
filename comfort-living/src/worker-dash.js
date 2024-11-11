import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Worker-dash.css';

const InschrijvingenList = () => {
  const [inschrijvingen, setInschrijvingen] = useState([]);
  const [klanten, setKlanten] = useState([]);
  const [panden, setPanden] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch inschrijvingen
    const fetchInschrijvingen = axios.get('http://localhost:3001/inschrijvingen');
    // Fetch klanten
    const fetchKlanten = axios.get('http://localhost:3001/klanten');
    // Fetch panden
    const fetchPanden = axios.get('http://localhost:3001/panden');

    Promise.all([fetchInschrijvingen, fetchKlanten, fetchPanden])
      .then(([inschrijvingenRes, klantenRes, pandenRes]) => {
        setInschrijvingen(inschrijvingenRes.data);
        setKlanten(klantenRes.data);
        setPanden(pandenRes.data);
      })
      .catch((err) => {
        setError(err.message);
        console.error(err);
      });
  }, []);

  const getUserById = (userId) => {
    return klanten.find((klant) => klant.id === userId);
  };

  const getPandById = (pandId) => {
    return panden.find((pand) => pand.id === pandId);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='content'>
      <h1>Inschrijvingen Overzicht</h1>
      <div className='inschrijvingen-list'>
        {inschrijvingen.map((inschrijving) => {
          const user = getUserById(inschrijving.userid);
          const pand = getPandById(inschrijving.pandid);

          return (
            <div key={inschrijving.id} className='inschrijving-card'>
              <h2>Inschrijving #{inschrijving.id}</h2>
              <p><strong>Datum:</strong> {new Date(inschrijving.datum).toLocaleDateString()}</p>
              <p><strong>Hoeveel Personen:</strong> {inschrijving.hoeveel_personen}</p>
              <p><strong>Jaar Inkomen:</strong> {inschrijving.jaar_inkomen || "Niet opgegeven"}</p>
              
              {user ? (
                <>
                  <h3>Klantinformatie:</h3>
                  <p><strong>Naam:</strong> {user.naam}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                </>
              ) : (
                <p>Klantinformatie niet beschikbaar</p>
              )}

              {pand ? (
                <>
                  <h3>Pandinformatie:</h3>
                  <p><strong>Adres:</strong> {pand.straat} {pand.huisnummer}, {pand.plaats}</p>
                  <p><strong>Postcode:</strong> {pand.postcode}</p>
                  <p><strong>Type:</strong> {pand.type}</p>
                  <p><strong>Prijs:</strong> €{pand.prijs}</p>
                </>
              ) : (
                <p>Pandinformatie niet beschikbaar</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InschrijvingenList;
