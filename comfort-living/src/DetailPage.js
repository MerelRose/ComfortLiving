import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './App.css';

const WoningDetail = () => {
    const { id } = useParams();
    const [woning, setWoning] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isLoggedIn, user } = useContext(AuthContext); 
    const [isOpen, setIsOpen] = useState(false);

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
                console.log('Woningdata succesvol opgehaald:', data);
                setWoning(data);
            } catch (error) {
                console.error('Fout bij het ophalen van woningdata:', error);
                console.log('Woning niet gevonden of andere fout:', error.message);
            } finally {
                setLoading(false);
            }
        };        

        fetchWoning();
    }, [id]);

    const handleInschrijven = async (e) => {
        e.preventDefault();
        console.log('Inschrijfformulier ingediend');
        console.log('Aantal personen:', hoeveel_personen);
        console.log('Jaar inkomen:', jaar_inkomen);
    
        // Controleer of de gebruiker is ingelogd voordat je de fetch uitvoert
        if (!isLoggedIn) {
            setInschrijfMessage('U moet eerst inloggen om u in te kunnen schrijven.');
            console.log('Inschrijving mislukt: gebruiker niet ingelogd');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3001/inschrijvingen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: user.id,
                    pandid: parseInt(id), 
                    hoeveel_personen: parseInt(hoeveel_personen),
                    jaar_inkomen: parseFloat(jaar_inkomen),
                }),
            });
    
            const data = await response.json();
    
            // Controleer of de inschrijving succesvol was
            if (response.ok) {
                console.log('Inschrijving succesvol:', data);
                setInschrijfMessage('Inschrijving succesvol!');
                setShowInschrijfForm(false);
                setHoeveelPersonen('');
                setJaarInkomen('');
            } else {
                console.log('Fout bij inschrijven:', data.error || 'Onbekende fout');
                setInschrijfMessage(data.error || 'Er is iets misgegaan bij het inschrijven.');
            }
        } catch (error) {
            console.error('Fout bij inschrijven:', error);
            setInschrijfMessage('Er is een fout opgetreden bij het inschrijven.');
        }
    };
    
    const handleOpenPopup = () => {
        console.log('Pop-up geopend');
        setIsOpen(true);
    };
    

    const handleClosePopup = (e) => {
        e.preventDefault();
        console.log('Pop-up gesloten');
        setIsOpen(false);
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
                <p>energielabel: {woning.prijs}</p>
                <p>aantal slaapkamers: {woning.prijs}</p>
                <p>Prijs: {woning.prijs}</p>

                <button className='nav-btn' onClick={handleOpenPopup}>Open Pop-up</button>

                {isOpen && (
                    <div className='popup'>
                        <div className='popup-inner'>
                            <h2>Inschrijfformulier</h2>
                            <form onSubmit={handleInschrijven}>
                                <label>Aantal personen:</label>
                                <input
                                    type="number"
                                    value={hoeveel_personen}
                                    onChange={(e) => setHoeveelPersonen(e.target.value)}
                                />
                                <br />
                                <label>Jaar inkomen:</label>
                                <input
                                    type="number"
                                    value={jaar_inkomen}
                                    onChange={(e) => setJaarInkomen(e.target.value)}
                                />
                                <br />
                                <button type="submit">Inschrijven</button>
                                <button onClick={handleClosePopup}>Sluiten</button>
                            </form>
                            {inschrijfMessage && (
                                <p className="inschrijf-message">{inschrijfMessage}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WoningDetail;
