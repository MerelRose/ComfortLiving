import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Worker-dash.css';

const InschrijvingenList = () => {
  const [inschrijvingen, setInschrijvingen] = useState([]);
  const [klanten, setKlanten] = useState([]);
  const [panden, setPanden] = useState([]);
  const [serviceverzoeken, setServiceverzoeken] = useState([]);
  const [servicetypes, setServicetypes] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [selectedPand, setSelectedPand] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const fetchInschrijvingen = axios.get('http://localhost:3001/inschrijvingen');
    const fetchKlanten = axios.get('http://localhost:3001/klanten');
    const fetchPanden = axios.get('http://localhost:3001/panden');
    const fetchServiceverzoeken = axios.get('http://localhost:3001/serviceverzoek');
    const fetchServicetypes = axios.get('http://localhost:3001/servicetype');
    const fetchContracts = axios.get('http://localhost:3001/contracten');

    Promise.all([fetchInschrijvingen, fetchKlanten, fetchPanden, fetchServiceverzoeken, fetchServicetypes, fetchContracts])
      .then(([inschrijvingenRes, klantenRes, pandenRes, serviceverzoekenRes, servicetypesRes, contractsRes]) => {
        setInschrijvingen(inschrijvingenRes.data);
        setKlanten(klantenRes.data);
        setPanden(pandenRes.data);
        setServiceverzoeken(serviceverzoekenRes.data);
        setServicetypes(servicetypesRes.data);
        setContracts(contractsRes.data);
      })
      .catch((err) => {
        setError(err.message);
        console.error(err);
      });
  }, []);

  const getUserById = (userId) => klanten.find((klant) => klant.id === userId);
  const getPandById = (pandId) => panden.find((pand) => pand.id === pandId);
  const getServiceTypeById = (servicetypeId) => servicetypes.find((type) => type.id === servicetypeId);
  const getContractById = (contractId) => contracts.find((contract) => contract.id === contractId);

  const updateServiceRequestStatus = (requestId) => {
    console.log("Request ID:", requestId);
    console.log("Nieuwe status:", newStatus);
    axios.put(`http://localhost:3001/serviceverzoek/${requestId}`, { status: newStatus })
      .then(response => {
        console.log("Update succes:", response.data);
        setServiceverzoeken(prevRequests => 
          prevRequests.map(req => req.id === requestId ? { ...req, status: newStatus } : req)
        );
        setNewStatus('');
      })
      .catch(err => {
        console.error("Error updating status:", err);
        setError("Er is een fout opgetreden bij het bijwerken van de status.");
      });
  };
  

  const planBezichtiging = (inschrijvingId) => {
    if (!selectedDate) {
        alert("Selecteer alstublieft een datum en tijd.");
        return;
    }

    const bezichtiging = moment(selectedDate).format('YYYY-MM-DD HH:mm:ss.SSSSSS');

    axios.put(`http://localhost:3001/inschrijvingen/${inschrijvingId}`, { bezichtiging })
        .then(response => {
            // Update the local state with the updated inschrijving
        })
        .catch(err => {
            console.error("Error planning bezichtiging:", err);
            setError("Er is een fout opgetreden bij het plannen van de bezichtiging.");
        });
};

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

  const statusCounts = {
    afgehandeld: serviceverzoeken.filter((req) => req.status === 'afgehandeld').length,
    inbehandeling: serviceverzoeken.filter((req) => req.status === 'in behandeling').length,
    afgewezen: serviceverzoeken.filter((req) => req.status === 'afgewezen').length,
    aangevraagd: serviceverzoeken.filter((req) => req.status === 'aangevraagd').length,
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
          <h2>Serviceverzoeken</h2>
          <div
            className={`item ${selectedStatus === 'afgehandeld' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('afgehandeld')}
          >
            Afgehandeld {statusCounts.afgehandeld >= 0 && `(${statusCounts.afgehandeld})`}
          </div>
          <div
            className={`item ${selectedStatus === 'in behandeling' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('in behandeling')}
          >
            In Behandeling {statusCounts.inbehandeling >= 0 && `(${statusCounts.inbehandeling})`}
          </div>
          <div
            className={`item ${selectedStatus === 'afgewezen' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('afgewezen')}
          >
            Afgewezen {statusCounts.afgewezen >= 0 && `(${statusCounts.afgewezen})`}
          </div>
          <div
            className={`item ${selectedStatus === 'aangevraagd' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('aangevraagd')}
          >
            Aangevraagd {statusCounts.aangevraagd >= 0 && `(${statusCounts.aangevraagd})`}
          </div>
        </div>

        <div className='inschrijvingen-list'>
          {selectedStatus ? (
            filteredServiceverzoeken.length === 0 ? (
              <p className='centered-message'>Geen serviceverzoeken beschikbaar voor deze status.</p>
            ) : (
              filteredServiceverzoeken.map((req) => {
                const servicetype = getServiceTypeById(req.servicetype_id);
                const contract = getContractById(req.contract_id);
                const klant = contract ? getUserById(contract.klantid) : null;
                const pand = contract ? getPandById(contract.pandid) : null;

                return (
                  <div key={req.id} className='inschrijving-card'>
                    <h2>Serviceverzoek #{req.id}</h2>
                    <p><strong>Beschrijving:</strong> {req.description}</p>
                    <p><strong>Status:</strong> {req.status}</p>
                    <p><strong>Contract _id:</strong> {req.contract_id}</p>
                    <p><strong>Datum aanvraag:</strong> {req.datum_aanvraag}</p>
                    <p><strong>Datum afhandeling:</strong> {req.datum_afhandeling}</p>
                    <p><strong>Service Type:</strong> {servicetype ? servicetype.omschrijving : 'Onbekend'}</p>
                    {klant && (
                      <>
                        <h3>Klantinformatie:</h3>
                        <p><strong>Naam:</strong> {klant.voornaam} {klant.tussenvoegsel} {klant.achternaam}</p>
                        <p><strong>Email:</strong> {klant.email}</p>
                      </>
                    )}
                    {pand && (
                      <>
                        <h3>Pandinformatie:</h3>
                        <p><strong>Adres:</strong> {pand.straat} {pand.huisnummer}, {pand.plaats}</p>
                        <p><strong>Postcode:</strong> {pand.postcode}</p>
                        <p><strong>Type:</strong> {pand.type}</p>
                        <p><strong>Prijs:</strong> €{pand.prijs}</p>
                      </>
                    )}
                    <select 
                      value={newStatus} 
                      onChange={(e) => {
                        console.log("Selected status:", e.target.value);
                        setNewStatus(e.target.value);
                      }}
                    >
                      <option value="">Selecteer status</option>
                      <option value="afgehandeld">Afgehandeld</option>
                      <option value="in behandeling">In Behandeling</option>
                      <option value="afgewezen">Afgewezen</option>
                      <option value="aangevraagd">Aangevraagd</option>
                    </select>
                    <button onClick={() => updateServiceRequestStatus(req.id)}>Update Status</button>
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
                    <p><strong>Bezichtiging:</strong> {inschrijving.bezichtiging || "Niet gepland"}</p>
                    
                    {user ? (
                      <>
                        <h3>Klantinformatie:</h3>
                        <p><strong>Naam:</strong> {user.voornaam} {user.tussenvoegsel} {user.achternaam}</p>
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
                    <button onClick={() => setShowCalendar(true)}>Plan Bezichtiging</button>
                    {showCalendar && (
                      <div>
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => setSelectedDate(date)}
                          showTimeSelect
                          dateFormat="Pp"
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          placeholderText="Selecteer datum en tijd"
                        />
                        <button onClick={() => planBezichtiging(inschrijving.id)}>Bevestig Bezichtiging</button>
                        <button onClick={() => setShowCalendar(false)}>Annuleer</button>
                      </div>
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