import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './App.css'; 
const WoningDetail = () => {
    const { id } = useParams(); // Haal het ID uit de URL
    const [woning, setWoning] = useState(null);
    const [loading, setLoading] = useState(true);

    // Gebruik useEffect om woningdata op te halen zodra de component is gemount
    useEffect(() => {
        const fetchWoning = async () => {
            try {
                // Log het ID om te controleren of het correct uit de URL wordt gehaald
                console.log("ID uit URL:", id);

                // Doe een fetch-verzoek naar de backend om woninggegevens op te halen
                const response = await fetch(`http://localhost:3001/panden/${id}`);
                console.log(`Fetching from: http://localhost:3001/panden/${id}`);
                // Log de status van de response
                console.log("Response status:", response.status);

                // Als de response niet ok is (bijvoorbeeld een 404), gooi een fout
                if (!response.ok) throw new Error('Woning niet gevonden');

                // Zet de response-data om in JSON en sla het op in de state
                const data = await response.json();
                console.log("Data van woning:", data); // Log de opgehaalde data
                
                setWoning(data); // Sla de woningdata op in de state
            } catch (error) {
                // Log eventuele fouten
                console.error("Fout bij het ophalen van woningdata:", error);
            } finally {
                // Zet loading op false, ongeacht of er een fout was
                setLoading(false);
            }
        };

        fetchWoning(); // Roep de functie aan
    }, [id]); // Voer opnieuw uit wanneer het ID verandert

    // Laat een loading message zien als de data nog wordt opgehaald
    if (loading) {
        return <div>Loading...</div>;
    }

    // Als er geen woningdata is gevonden, geef een foutmelding
    if (!woning) {
        return <div>Woning niet gevonden</div>;
    }

    // Toon de woningdetails zodra de data is opgehaald
    return (
        <div className='content'>

        <div>
            <h1>{`${woning.straat} ${woning.huisnummer}`}</h1>
            <p>Postcode: {woning.postcode}</p>
            <p>Plaats: {woning.plaats}</p>
            <p>Type: {woning.type}</p>
            <p>Omschrijving: {woning.omschrijving}</p>
            <p>Prijs: {woning.prijs}</p>
            {/* Andere details kunnen hier worden toegevoegd */}
        </div>
        </div>
    );
};

export default WoningDetail;
