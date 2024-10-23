import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './App.css'; 

const WoningDetail = () => {
    const { id } = useParams();
    const [woning, setWoning] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isLoggedIn, user } = useContext(AuthContext); // user toegevoegd aan context
    
    // State voor het inschrijfformulier
    const [showInschrijfForm, setShowInschrijfForm] = useState(false);
    const [hoeveel_personen, setHoeveelPersonen] = useState('');
    const [jaar_inkomen, setJaarInkomen] = useState('');
    const [inschrijfMessage, setInschrijfMessage] = useState('');

    useEffect(() => {
        const fetchWoning = async () => {
            try {
                const response = await fetch(`http://localhost:3001/panden/${id}`);
                if (!response.ok) throw new Error('Woning niet gevonden');
                const data = await response.json();
                setWoning(data);
            } catch (error) {
                console.error("Fout bij het ophalen van woningdata:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWoning();
    }, [id]);

    const handleInschrijven = async (e) => {
        e.preventDefault();
        
        if (!isLoggedIn) {
            setInschrijfMessage('U moet eerst inloggen om u in te kunnen schrijven.');
            return;
        }
    
        // Debug log toevoegen
        console.log('User ID:', user.id);
        console.log('Pand ID:', id);
        console.log('Personen:', hoeveel_personen);
        console.log('Inkomen:', jaar_inkomen);
    
        try {
            const response = await fetch('http://localhost:3001/inschrijvingen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: user.id,
                    pandid: parseInt(id), // Zorg ervoor dat id een number is
                    hoeveel_personen: parseInt(hoeveel_personen),
                    jaar_inkomen: parseFloat(jaar_inkomen)
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setInschrijfMessage('Inschrijving succesvol!');
                setShowInschrijfForm(false);
                setHoeveelPersonen('');
                setJaarInkomen('');
            } else {
                setInschrijfMessage(data.error || 'Er is iets misgegaan bij het inschrijven.');
            }
        } catch (error) {
            console.error('Fout bij inschrijven:', error);
            setInschrijfMessage('Er is een fout opgetreden bij het inschrijven.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!woning) {
        return <div>Woning niet gevonden</div>;
    }

    return (
        <div className='content'>
            <div>
                <h1>{`${woning.straat} ${woning.huisnummer}`}</h1>
                <p>Postcode: {woning.postcode}</p>
                <p>Plaats: {woning.plaats}</p>
                <p>Type: {woning.type}</p>
                <p>Omschrijving: {woning.omschrijving}</p>
                <p>Prijs: {woning.prijs}</p>

                {/* Inschrijfknop en formulier */}
                <button 
                    onClick={() => setShowInschrijfForm(!showInschrijfForm)}
                    className="inschrijf-btn"
                >
                    {showInschrijfForm ? 'Annuleren' : 'Inschrijven voor deze woning'}
                </button>

                {inschrijfMessage && (
                    <p className ="inschrijf-message">{inschrijfMessage}</p>
                )}

                {showInschrijfForm && (
                    <form onSubmit={handleInschrijven}>
                        <label>
                            Hoeveel personen:
                            <input 
                                type="number" 
                                value={hoeveel_personen} 
                                onChange={(e) => setHoeveelPersonen(e.target.value)}
                            />
                        </label>

                        <label>
                            Jaarinkomen:
                            <input 
                                type="number" 
                                value={jaar_inkomen} 
                                onChange={(e) => setJaarInkomen(e.target.value)}
                            />
                        </label>

                        <button type="submit">Inschrijven</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default WoningDetail;