import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Worker-dash.css';

const InschrijvingenList = () => {
  const [inschrijvingen, setInschrijvingen] = useState([]);
  const [klanten, setKlanten] = useState([]);
  const [panden, setPanden] = useState([]);
  const [selectedPand, setSelectedPand] = useState(null); // Track selected pand
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInschrijvingen = axios.get('http://localhost:3001/inschrijvingen');
    const fetchKlanten = axios.get('http://localhost:3001/klanten');
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

  const pandInschrijvingenCount = panden.map((pand) => {
    const count = inschrijvingen.filter((inschrijving) => inschrijving.pandid === pand.id).length;
    return { ...pand, count };
  }).filter((pand) => pand.count > 0);

  const filteredInschrijvingen = selectedPand
    ? inschrijvingen.filter((inschrijving) => inschrijving.pandid === selectedPand.id)
    : inschrijvingen;

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='content'>
      {/* <h1>Inschrijvingen Overzicht</h1> */}
      <div className='main-container'>
        {/* Sidebar for panden */}
        <div className='sidebar'>
          <h2>Inschrijvingen</h2>
          {pandInschrijvingenCount.map((pand) => (
            <div
              key={pand.id}
              className={`pand-item ${selectedPand?.id === pand.id ? 'active' : ''}`} // Apply 'active' class if selected
              onClick={() => setSelectedPand(pand)}
            >
              <p>{pand.straat} {pand.huisnummer} ({pand.count})</p>
            </div>
          ))}
          <button onClick={() => setSelectedPand(null)} className='nav-btn'>
            Toon alles
          </button>
        </div>

        {/* Main inschrijvingen list */}
        <div className='inschrijvingen-list'>
          {filteredInschrijvingen.length === 0 ? (
            <p>Geen inschrijvingen beschikbaar voor dit pand.</p>
          ) : (
            filteredInschrijvingen.map((inschrijving) => {
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
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default InschrijvingenList;
