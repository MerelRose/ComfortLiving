import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Serviceverzoeken = () => {
    const [serviceTypes, setServiceTypes] = useState([]);
    const [selectedServiceType, setSelectedServiceType] = useState('');
    const [opmerking, setOpmerking] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const response = await axios.get('http://localhost:3001/servicetype'); // Zorg ervoor dat deze URL correct is
                setServiceTypes(response.data);
            } catch (error) {
                console.error('Error fetching service types:', error);
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
            servicetype_id: selectedServiceType // Zorg ervoor dat dit niet null is
        };

        try {
            const response = await fetch('http://localhost:3001/serviceverzoek', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
            </form>
            {message && <p>{message}</p>}
        </div>
        </div>
    );
};

export default Serviceverzoeken;