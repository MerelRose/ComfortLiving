import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Worker-dash.css';

const InschrijvingenList = () => {
  const [inschrijvingen, setInschrijvingen] = useState([]);
  const [klanten, setKlanten] = useState([]);
  const [panden, setPanden] = useState([]);
  const [serviceverzoeken, setServiceverzoeken] = useState([]);
  const [servicetypes, setServicetypes] = useState([]);
  const [selectedPand, setSelectedPand] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInschrijvingen = axios.get('http://localhost:3001/inschrijvingen');
    const fetchKlanten = axios.get('http://localhost:3001/klanten');
    const fetchPanden = axios.get('http://localhost:3001/panden');
    const fetchServiceverzoeken = axios.get('http://localhost:3001/serviceverzoek');
    const fetchServicetypes = axios.get('http://localhost:3001/servicetype');

    Promise.all([fetchInschrijvingen, fetchKlanten, fetchPanden, fetchServiceverzoeken, fetchServicetypes])
      .then(([inschrijvingenRes, klantenRes, pandenRes, serviceverzoekenRes, servicetypesRes]) => {
        setInschrijvingen(inschrijvingenRes.data);
        setKlanten(klantenRes.data);
        setPanden(pandenRes.data);
        setServiceverzoeken(serviceverzoekenRes.data);
        setServicetypes(servicetypesRes.data);
      })
      .catch((err) => {
        setError(err.message);
        console.error(err);
      });
  }, []);

  const getUserById = (userId) => klanten.find((klant) => klant.id === userId);
  const getPandById = (pandId) => panden.find((pand) => pand.id === pandId);
  const getServiceTypeById = (servicetypeId) => servicetypes.find((type) => type.id === servicetypeId);

  const pandInschrijvingenCount = panden.map((pand) => {
    const count = inschrijvingen.filter((inschrijving) => inschrijving.pandid === pand.id).length;
    return { ...pand, count };
  }).filter((pand) => pand.count > 0);

  const filteredInschrijvingen = selectedPand
    ? inschrijvingen.filter((inschrijving) => inschrijving.pandid === selectedPand.id)
    : inschrijvingen;

  const filteredServiceverzoeken = selectedStatus
    ? serviceverzoeken.filter((req) => req.status === selectedStatus)
    : [];

  // Initialize status counts
  const statusCounts = {
    klaar: serviceverzoeken.filter((req) => req.status === 'klaar').length,
    bezig: serviceverzoeken.filter((req) => req.status === 'bezig').length,
    nietBegonnen: serviceverzoeken.filter((req) => req.status === 'niet begonnen').length,
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='content'>
      <div className='main-container'>
        <div className='sidebar'>
          <h2>Panden</h2>
          {pandInschrijvingenCount.map((pand) => (
            <div
              key={pand.id}
              className={`item ${selectedPand?.id === pand.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedPand(pand);
                setSelectedStatus(null);
              }}
            >
              {pand.straat} {pand.huisnummer} ({pand.count})
            </div>
          ))}
          <br />
          <button onClick={() => {
            setSelectedPand(null);
            setSelectedStatus(null);
          }} className='nav-btn'>
            Toon alles
          </button>

          <h2>Serviceverzoeken</h2>
          <div
            className={`item ${selectedStatus === 'klaar' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('klaar')}
          >
            Klaar {statusCounts.klaar >= 0 && `(${statusCounts.klaar})`}
          </div>
          <div
            className={`item ${selectedStatus === 'bezig' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('bezig')}
          >
            Bezig {statusCounts.bezig >= 0 && `(${statusCounts.bezig})`}
          </div>
          <div
            className={`item ${selectedStatus === 'niet begonnen' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('niet begonnen')}
          >
            Niet Begonnen {statusCounts.nietBegonnen >= 0 && `(${statusCounts.nietBegonnen})`}
          </div>
        </div>

        <div className='inschrijvingen-list'>
          {selectedStatus ? (
            filteredServiceverzoeken.length === 0 ? (
              <p className='centered-message'>Geen serviceverzoeken beschikbaar voor deze status.</p>
            ) : (
              filteredServiceverzoeken.map((req) => {
                const servicetype = getServiceTypeById(req.servicetype_id);

                return (
                  <div key={req.id} className='inschrijving-card'>
                    <h2>Serviceverzoek #{req.id}</h2>
                    <p><strong>Beschrijving:</strong> {req.description}</p>
                    <p><strong>Status:</strong> {req.status}</p>
                    <p><strong>Contract_id:</strong> {req.contract_id}</p>
                    <p><strong>Datum aanvraag:</strong> {req.datum_aanvraag}</p>
                    <p><strong>Datum afhandeling:</strong> {req.datum_afhandeling}</p>
                    <p><strong>Service Type:</strong> {servicetype ? servicetype.omschrijving : 'Onbekend'}</p>
                  </div>
                );
              })
            )
          ) : (
            filteredInschrijvingen.length === 0 ? (
              <p className='centered-message'>Geen inschrijvingen beschikbaar voor dit pand.</p>
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
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default InschrijvingenList;
