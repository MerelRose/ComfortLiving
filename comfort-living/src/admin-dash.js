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
  
    const handlePandInputChange = (e) => {
      const { name, value } = e.target;
      setNewPand({ ...newPand, [name]: value });
    };
  
    const handleContractInputChange = (e) => {
      const { name, value } = e.target;
      setNewContract({ ...newContract, [name]: value });
    };
  
    const handleWorkerFormSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:3001/medewerkers', newWorker, {
          headers: { 'api-key': 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6', 'Content-Type': 'application/json' },
        });
        setWorkers([...workers, response.data]);
        setShowWorkerForm(false);
      } catch (err) {
        setWorkerError("Failed to create worker.");
      }
    };
  
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
  
        {/* Panden Table */}
        <h2>Panden</h2>
        {panden.length === 0 ? <p>No panden found.</p> : (
          <table className="worker-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Postcode</th>
                <th>Straat</th>
              </tr>
            </thead>
            <tbody>
              {panden.map((pand) => (
                <tr key={pand.id}>
                  <td>{pand.id}</td>
                  <td>{pand.postcode}</td>
                  <td>{pand.straat}</td>
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
