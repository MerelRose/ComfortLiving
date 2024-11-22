import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './search.css';
import './App.css';
import './login.css';
import './admin-dash.css';

const AdminDashboard = () => {
    const [workers, setWorkers] = useState([]);
    const [panden, setPanden] = useState([]);
    const [contracten, setContracten] = useState([]);
    const [externePartijen, setExternePartijen] = useState([]);
    const [workerError, setWorkerError] = useState(null);
    const [pandenError, setPandenError] = useState(null);
    const [contractenError, setContractenError] = useState(null);
    const [externePartijenError, setExternePartijenError] = useState(null);

    const [showWorkerForm, setShowWorkerForm] = useState(false);
    const [showPandenForm, setShowPandenForm] = useState(false);
    const [showContractenForm, setShowContractenForm] = useState(false);
    const [showExternePartijForm, setShowExternePartijForm] = useState(false);
    const [editExternePartij, setEditExternePartij] = useState(null);
    const [editMedewerker, setEditMedewerker] = useState(null);
    const [editPand, setEditPand] = useState(null);

    const [newWorker, setNewWorker] = useState({
        voornaam: '',
        tussenvoegsel: '',
        achternaam: '',
        email: '',
        contract_uren: '',
        geboortedatum: '',
        wachtwoord: '',
        telefoonnummer: '',
        geslacht: '',
        contract_verval_datum: '',
        huidig_adres: '',
        opmerkingen: '',
    });

    const [newPand, setNewPand] = useState({
        postcode: '',
        straat: '',
        huisnummer: '',
        plaats: '',
        langitude: '',
        altitude: '',
    });

    const [newContract, setNewContract] = useState({
        pandid: '',
        klantid: '',
    });

    const [newExternePartij, setNewExternePartij] = useState({
        bedrijfsnaam: '',
        contactpersoon: '',
        email_contactpersoon: '',
        telefoonnummer_bedrijf: '',
        telefoon_contactpersoon: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const workerResponse = await axios.get('http://localhost:3001/medewerkers', {
                    headers: { 'api-key': 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6' },
                });
                setWorkers(workerResponse.data);

                const pandResponse = await axios.get('http://localhost:3001/panden', {
                    headers: { 'api-key': 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6' },
                });
                setPanden(pandResponse.data);

                const contractResponse = await axios.get('http://localhost:3001/contracten', {
                    headers: { 'api-key': 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6' },
                });
                setContracten(contractResponse.data);

                const externePartijResponse = await axios.get('http://localhost:3001/externepartij', {
                    headers: { 'api-key': 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6' },
                });
                setExternePartijen(externePartijResponse.data);
            } catch (err) {
                setExternePartijenError(err.message);
            }
        };
        fetchData();
    }, []);
  
    useEffect(() => {
      const fetchWorkers = async () => {
        try {
          const response = await axios.get('http://localhost:3001/medewerkers', {
            headers: { 'api-key': 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6' },
          });
          setWorkers(response.data);
        } catch (err) {
          setWorkerError(err.message);
        }
      };
  
      const fetchPanden = async () => {
        try {
          const response = await axios.get('http://localhost:3001/panden', {
            headers: { 'api-key': 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6' },
          });
          setPanden(response.data);
        } catch (err) {
          setPandenError(err.message);
        }
      };
  
      const fetchContracten = async () => {
        try {
          const response = await axios.get('http://localhost:3001/contracten', {
            headers: { 'api-key': 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6' },
          });
          setContracten(response.data);
        } catch (err) {
          setContractenError(err.message);
        }
      };
  
      fetchWorkers();
      fetchPanden();
      fetchContracten();
    }, []);
  
    const handleWorkerInputChange = (e) => {
      const { name, value } = e.target;
      setNewWorker({ ...newWorker, [name]: value });
    };
 //panden 
    const handlePandInputChange = (e) => {
      const { name, value } = e.target;
      setEditPand({ ...editPand, [name]: value }); // Update the editPand state
    };

    const handleEditPandClick = (pand) => {
      setEditPand(pand); // Set the selected pand for editing
    };
  
  const handlePandEditSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.put(`http://localhost:3001/panden/${editPand.id}`, editPand, {
              headers: { 'api-key': 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6', 'Content-Type': 'application/json' },
          });
          setPanden(
              panden.map((pand) =>
                  pand.id === editPand.id ? response.data : pand
              )
          );
          setEditPand(null); // Clear the edit state
      } catch (err) {
          setPandenError("Failed to update pand.");
      }
  };
  
  const handleDeletePand = async (id) => {
      try {
          await axios.delete(`http://localhost:3001/panden/${id}`, {
              headers: { 'api-key': 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6' },
          });
          // Update the state to remove the deleted pand
          setPanden(panden.filter(pand => pand.id !== id));
      } catch (err) {
          setPandenError("Failed to delete pand.");
      }
  };
  
    const handleContractInputChange = (e) => {
      const { name, value } = e.target;
      setNewContract({ ...newContract, [name]: value });
    };
  
    const handleWorkerFormSubmit = async (e) => {
      e.preventDefault();
      try {
          const { admin, ...workerData } = newWorker; // Exclude admin field
          const response = await axios.post('http://localhost:3001/medewerkers', workerData, {
              headers: { 'api-key': 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6', 'Content-Type': 'application/json' },
          });
          setWorkers([...workers, response.data]);
          setShowWorkerForm(false);
      } catch (err) {
          setWorkerError("Failed to create worker.");
      }
  };

  const handleEditMedewerkerClick = (worker) => {
    setEditMedewerker(worker);
  };

  const handleMedewerkerEditSubmit = async (e) => {
    e.preventDefault();
    try {
        const { admin, geboortedatum, contract_verval_datum, ...updatedData } = editMedewerker; // Exclude admin field

        // Format dates to 'YYYY-MM-DD'
        const formattedGeboortedatum = new Date(geboortedatum).toISOString().split('T')[0];
        const formattedContractVervalDatum = new Date(contract_verval_datum).toISOString().split('T')[0];

        const response = await axios.put(`http://localhost:3001/medewerkers/${updatedData.id}`, {
            ...updatedData,
            geboortedatum: formattedGeboortedatum,
            contract_verval_datum: formattedContractVervalDatum,
        }, {
            headers: { 'api-key': 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6', 'Content-Type': 'application/json' },
        });

        setWorkers(
            workers.map((medewerker) =>
                medewerker.id === updatedData.id ? response.data : medewerker
            )
        );
        setEditMedewerker(null);
    } catch (err) {
        console.error(err);
        setWorkerError("Failed to update medewerker.");
    }
};

    const handleDeleteMedewerker = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/medewerkers/${id}`, {
                headers: { 'api-key': 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6' },
            });
            setWorkers(workers.filter(worker => worker.id !== id));
        } catch (err) {
            setWorkerError("Failed to delete medewerker.");
        }
    }
  
    const handlePandFormSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:3001/panden', newPand, {
          headers: { 'api-key': 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6', 'Content-Type': 'application/json' },
        });
        setPanden([...panden, response.data]);
        setShowPandenForm(false);
      } catch (err) {
        setPandenError("Failed to create pand.");
      }
    };
  
    const handleContractFormSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:3001/contracten', newContract, {
          headers: { 'api-key': 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6', 'Content-Type': 'application/json' },
        });
        setContracten([...contracten, response.data]);
        setShowContractenForm(false);
      } catch (err) {
        setContractenError("Failed to create contract.");
      }
    };

    const handleExternePartijInputChange = (e) => {
        const { name, value } = e.target;
        setNewExternePartij({ ...newExternePartij, [name]: value });
    };

    const handleExternePartijEditChange = (e) => {
        const { name, value } = e.target;
        setEditExternePartij({ ...editExternePartij, [name]: value });
    };

    const handleExternePartijFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/externepartij', newExternePartij, {
                headers: { 'api-key': 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6', 'Content-Type': 'application/json' },
            });
            setExternePartijen([...externePartijen, response.data]);
            setShowExternePartijForm(false);
        } catch (err) {
            setExternePartijenError("Failed to create externe partij.");
        }
    };

    const handleExternePartijEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:3001/externepartij/${editExternePartij.id}`, editExternePartij, {
                headers: { 'api-key': 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6', 'Content-Type': 'application/json' },
            });
            setExternePartijen(
                externePartijen.map((partij) =>
                    partij.id === editExternePartij.id ? response.data : partij
                )
            );
            setEditExternePartij(null);
        } catch (err) {
            setExternePartijenError("Failed to update externe partij.");
        }
    };

    const handleDeleteExternePartij = async (id) => {
      try {
          await axios.delete(`http://localhost:3001/externepartij/${id}`, {
              headers: { 'api-key': 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6' },
          });
          // Update the state to remove the deleted externe partij
          setExternePartijen(externePartijen.filter(partij => partij.id !== id));
      } catch (err) {
          setExternePartijenError("Failed to delete externe partij.");
      }
  };

    return (
        <div className="content">
            <h1>Admin Dashboard</h1>

            <button className="create-button" onClick={() => setShowWorkerForm(true)}>Create Worker</button>
            <button className="create-button" onClick={() => setShowPandenForm(true)}>Create Pand</button>
            <button className="create-button" onClick={() => setShowContractenForm(true)}>Create Contract</button>
            <button className="create-button" onClick={() => setShowExternePartijForm(true)}>Create Externe Partij</button>

            {/* Externe Partij Form Modal */}
            {showExternePartijForm && (
                <div className="form-modal">
                    <div className="form-container">
                        <h2>Create New Externe Partij</h2>
                        <form onSubmit={handleExternePartijFormSubmit}>
                            {Object.keys(newExternePartij).map((key) => (
                                <input
                                    key={key}
                                    type="text"
                                    name={key}
                                    placeholder={key}
                                    value={newExternePartij[key]}
                                    onChange={handleExternePartijInputChange}
                                    required
                                />
                            ))}
                            <button type="submit">Submit</button>
                            <button type="button" onClick={() => setShowExternePartijForm(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Externe Partij Form Modal */}
            {editExternePartij && (
                <div className="form-modal">
                    <div className="form-container">
                        <h2>Edit Externe Partij</h2>
                        <form onSubmit={handleExternePartijEditSubmit}>
                            {Object.keys(editExternePartij).map((key) => (
                                <input
                                    key={key}
                                    type="text"
                                    name={key}
                                    placeholder={key}
                                    value={editExternePartij[key]}
                                    onChange={handleExternePartijEditChange}
                                    required
                                />
                            ))}
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setEditExternePartij(null)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Externe Partijen Table */}
            <h2>Externe Partijen</h2>
            {externePartijen.length === 0 ? (
                <p>No externe partijen found.</p>
            ) : (
                <table className="worker-table">
                    <thead>
                        <tr>
                            <th>Bedrijfsnaam</th>
                            <th>Contactpersoon</th>
                            <th>Email</th>
                            <th>Telefoonnummer Bedrijf</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {externePartijen.map((partij) => (
                            <tr key={partij.id}>
                                <td>{partij.bedrijfsnaam}</td>
                                <td>{partij.contactpersoon}</td>
                                <td>{partij.email_contactpersoon}</td>
                                <td>{partij.telefoonnummer_bedrijf}</td>
                                <td>
                                  <button onClick={() => setEditExternePartij(partij)}>Edit</button>
                                  <button onClick={() => handleDeleteExternePartij(partij.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
{/* Worker Form Modal */}
{showWorkerForm && (
          <div className="form-modal">
            <div className="form-container">
              <h2>Create New Worker</h2>
              <form onSubmit={handleWorkerFormSubmit}>
                {Object.keys(newWorker).map((key) => (
                  <input
                    key={key}
                    type={key === 'wachtwoord' ? 'password' : 'text'}
                    name={key}
                    placeholder={key}
                    value={newWorker[key]}
                    onChange={handleWorkerInputChange}
                    required={key !== 'tussenvoegsel' && key !== 'opmerkingen'}
                  />
                ))}
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowWorkerForm(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}

{editMedewerker && (
    <div className="form-modal">
        <div className="form-container">
            <h2>Edit Medewerker</h2>
            <form onSubmit={handleMedewerkerEditSubmit}>
                {Object.keys(editMedewerker).map((key) => (
                    key !== 'admin' && ( // Exclude admin field
                        <input
                            key={key}
                            type={key === 'wachtwoord' ? 'password' : 'text'}
                            name={key}
                            placeholder={key}
                            value={editMedewerker[key]}
                            onChange={(e) => setEditMedewerker({ ...editMedewerker, [key]: e.target.value })}
                            required={key !== 'tussenvoegsel' && key !== 'opmerkingen'}
                        />
                    )
                ))}
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditMedewerker(null)}>Cancel</button>
            </form>
        </div>
    </div>
)}
        {/* Workers Table */}
        <h2>Workers</h2>
        {workers.length === 0 ? <p>No workers found.</p> : (
          <table className="worker-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Voornaam</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <tr key={worker.id}>
                  <td>{worker.id}</td>
                  <td>{worker.voornaam}</td>
                  <td>{worker.email}</td>
                  <td>
                    <button onClick={() => setEditMedewerker(worker)}>Edit</button>
                    <button onClick={() => handleDeleteMedewerker(worker.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
  
        {/* Panden Form Modal */}
        {showPandenForm && (
          <div className="form-modal">
            <div className="form-container">
              <h2>Create New Pand</h2>
              <form onSubmit={handlePandFormSubmit}>
                {Object.keys(newPand).map((key) => (
                  <input
                    key={key}
                    type="text"
                    name={key}
                    placeholder={key}
                    value={newPand[key]}
                    onChange={handlePandInputChange}
                    required
                  />
                ))}
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowPandenForm(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Pand Form Modal */}
        {editPand && (
            <div className="form-modal">
                <div className="form-container">
                    <h2>Edit Pand</h2>
                    <form onSubmit={handlePandEditSubmit}>
                        <input
                            type="text"
                            name="straat"
                            placeholder="Straat"
                            value={editPand.straat}
                            onChange={handlePandInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="huisnummer"
                            placeholder="Huisnummer"
                            value={editPand.huisnummer}
                            onChange={handlePandInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="bij_voegsel"
                            placeholder="Tussenvoegsel (optioneel)"
                            value={editPand.bij_voegsel || ''}
                            onChange={handlePandInputChange}
                        />
                        <input
                            type="text"
                            name="postcode"
                            placeholder="Postcode"
                            value={editPand.postcode}
                            onChange={handlePandInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="plaats"
                            placeholder="Plaats"
                            value={editPand.plaats}
                            onChange={handlePandInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="fotos"
                            placeholder="Foto's (optioneel)"
                            value={editPand.fotos || ''}
                            onChange={handlePandInputChange}
                        />
                        <input
                            type="number"
                            name="prijs"
                            placeholder="Prijs"
                            value={editPand.prijs}
                            onChange={handlePandInputChange}
                            required
                        />
                        <textarea
                            name="omschrijving"
                            placeholder="Omschrijving"
                            value={editPand.omschrijving}
                            onChange={handlePandInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="oppervlakte"
                            placeholder="Oppervlakte in m²"
                            value={editPand.oppervlakte}
                            onChange={handlePandInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="energielabel"
                            placeholder="Energielabel"
                            value={editPand.energielabel || ''}
                            onChange={handlePandInputChange}
                        />
                        <input
                            type="number"
                            name="slaapkamers"
                            placeholder="Aantal slaapkamers"
                            value={editPand.slaapkamers}
                            onChange={handlePandInputChange}
                            required
                        />
                        <input
                            type="date"
                            name="aangeboden_sinds"
                            placeholder="Aangeboden sinds"
                            value={editPand.aangeboden_sinds}
                            onChange={handlePandInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="type"
                            placeholder="Type"
                            value={editPand.type}
                            onChange={handlePandInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="latitude"
                            placeholder="Latitude"
                            value={editPand.latitude}
                            onChange={handlePandInputChange}
                        />
                        <input
                            type="number"
                            name="longitude"
                            placeholder="Longitude"
                            value={editPand.longitude}
                            onChange={handlePandInputChange}
                        />
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setEditPand(null)}>Cancel</button>
                    </form>
                </div>
            </div>
        )}
  
            {/* Panden Table */}
            <h2>Panden</h2>
            {panden.length === 0 ? <p>No panden found.</p> : (
                <table className="worker-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Postcode</th>
                            <th>Straat</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {panden.map((pand) => (
                            <tr key={pand.id}>
                                <td>{pand.id}</td>
                                <td>{pand.postcode}</td>
                                <td>{pand.straat}</td>
                                <td>
                                    <button onClick={() => handleEditPandClick(pand)}>Edit</button>
                                    <button onClick={() => handleDeletePand(pand.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
  
        {/* Contracten Form Modal */}
        {showContractenForm && (
          <div className="form-modal">
            <div className="form-container">
              <h2>Create New Contract</h2>
              <form onSubmit={handleContractFormSubmit}>
                <input type="number" name="pandid" placeholder="Pand ID" value={newContract.pandid} onChange={handleContractInputChange} required />
                <input type="number" name="klantid" placeholder="Klant ID" value={newContract.klantid} onChange={handleContractInputChange} required />
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowContractenForm(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}
  
        {/* Contracten Table */}
        <h2>Contracten</h2>
        {contracten.length === 0 ? <p>No contracts found.</p> : (
          <table className="worker-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Pand ID</th>
                <th>Klant ID</th>
              </tr>
            </thead>
            <tbody>
              {contracten.map((contract) => (
                <tr key={contract.id}>
                  <td>{contract.id}</td>
                  <td>{contract.pandid}</td>
                  <td>{contract.klantid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
};

export default AdminDashboard;
