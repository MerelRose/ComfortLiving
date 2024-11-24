import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // Make sure this line exists

const Serviceverzoeken = ({ onClose }) => { // Voeg onClose toe als prop
    const { user } = useContext(AuthContext); // Access user from AuthContext

    const [serviceTypes, setServiceTypes] = useState([]);
    const [selectedServiceType, setSelectedServiceType] = useState('');
    const [opmerking, setOpmerking] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const response = await axios.get('http://localhost:3001/servicetype', {
                    headers: {
                        "api-key": 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6',
                        "Content-Type": "application/json"
                    }
                });
                setServiceTypes(response.data);
            } catch (error) {
                console.error('Error fetching service types:', error);
                setMessage('Failed to fetch service types.'); // Set an error message if needed
            }
        };

        fetchServiceTypes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Geselecteerde servicetype_id:', selectedServiceType); // Dit zou de geselecteerde waarde moeten loggen

        const serviceRequestData = {
            omschrijving: opmerking,
            status: 'aangevraagd',
            servicetype_id: selectedServiceType, // Zorg ervoor dat dit niet null is
            klantid: user.id
        };

        try {
            const response = await fetch('http://localhost:3001/serviceverzoek', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "api-key": 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6',
                },
                body: JSON.stringify(serviceRequestData), // Stuur de servicetype_id mee
            });

            if (response.ok) {
                setMessage('Serviceverzoek succesvol ingediend!');
                setOpmerking(''); // Reset de opmerking
                setSelectedServiceType(''); // Reset de geselecteerde servicetype
            } else {
                const errorData = await response.json();
                setMessage(`Fout bij het indienen van het verzoek: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Er is een fout opgetreden:', error);
            setMessage(`Er is een fout opgetreden: ${error.message}`);
        }
    };

    return (
        <div className='popup'>
            <div className='popup-inner'>
                <h2>Indienen Serviceverzoek</h2>
                <form onSubmit={handleSubmit}>
                    <label>Opmerking:</label>
                    <textarea 
                        value={opmerking} 
                        onChange={(e) => setOpmerking(e.target.value)} 
                        required 
                    />
                    <br />

                    <label>Service Type:</label>
                    <select 
                        value={selectedServiceType} 
                        onChange={(e) => setSelectedServiceType(e.target.value)}
                        required
                    >
                        <option value="">Selecteer een service type</option>
                        {serviceTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.omschrijving}
                            </option>
                        ))}
                    </select>
                    <br />

                    <button type="submit">Indienen</button>
                    <button type="button" onClick={onClose}>Sluiten</button> {/* Sluit de popup */}
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default Serviceverzoeken;