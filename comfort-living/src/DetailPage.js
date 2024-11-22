import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import './App.css';
import './detailpage.css';

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet marker icon issue
L.Marker.prototype.options.icon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const WoningDetail = () => {
    const { id } = useParams();
    const [woning, setWoning] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isLoggedIn, user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const placeholderImage = "https://via.placeholder.com/500x600?text=No+Image"; // Placeholder image URL

    // State for the subscription form
    const [showInschrijfForm, setShowInschrijfForm] = useState(false);
    const [hoeveel_personen, setHoeveelPersonen] = useState('');
    const [jaar_inkomen, setJaarInkomen] = useState('');
    const [inschrijfMessage, setInschrijfMessage] = useState('');

    useEffect(() => {
        const fetchWoning = async () => {
            try {
                const response = await fetch(`http://localhost:3001/panden/${id}`, {             
                    headers: {
                        "api-key": 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6',
                        "Content-Type": "application/json"
                    }
                });
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
    
        if (!isLoggedIn) {
            setInschrijfMessage('U moet eerst inloggen om u in te kunnen schrijven.');
            console.log('Inschrijving mislukt: gebruiker niet ingelogd');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3001/inschrijvingen', {
                method: 'POST',
                headers: {
                    "api-key": 'AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userid: user.id,
                    pandid: parseInt(id), 
                    hoeveel_personen: parseInt(hoeveel_personen),
                    jaar_inkomen: parseFloat(jaar_inkomen),
                }),
            });
    
            const data = await response.json();
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

    const handleImageError = (event) => {
        event.target.src = placeholderImage;
    };



    if (loading) {
        return <div>Loading...</div>;
    }

    if (!woning) {
        return <div>Woning niet gevonden</div>;
    }

    const { latitude, longitude } = woning;

    return (
        <div className='content'>
            <div>
                <div className='pandfoto'>
                <img
                    src={woning.fotos}
                    alt="Pand afbeelding"
                    onError={handleImageError}
                />
                </div>

                <div className='pandinfo'>
                    <h1>{`${woning.straat} ${woning.huisnummer}`}</h1> 
                    {/* {woning.id} */}
                    <p>{woning.postcode} {woning.plaats}</p>
                    <p>Prijs &#40;{woning.type}&#41;: €{woning.prijs}</p>
                    <p>Omschrijving: {woning.omschrijving}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" role="presentation" viewBox="0 0 48 48" class="flex-0 mr-1"><path d="M38.5 32.25v-16.5a5 5 0 10-6.25-6.25h-16.5a5 5 0 10-6.25 6.25v16.5a5 5 0 106.25 6.25h16.5a5 5 0 106.25-6.25zm-6.25 3.25h-16.5a5 5 0 00-3.25-3.25v-16.5a5 5 0 003.25-3.25h16.5a5 5 0 003.25 3.25v16.5a5 5 0 00-3.25 3.25zM37 9a2 2 0 11-2 2 2 2 0 012-2zM11 9a2 2 0 11-2 2 2 2 0 012-2zm0 30a2 2 0 112-2 2 2 0 01-2 2zm26 0a2 2 0 112-2 2 2 0 01-2 2z"></path></svg>
                            {woning.oppervlakte}m²  
                        </span> 
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>          
                            <svg className='svg' width="20px" height="20px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#444" d="M4.28 7h2.72l-1.15-1.68c-0.542-0.725-1.36-1.216-2.295-1.319l-0.555-0.001v1.54c-0.011 0.063-0.018 0.136-0.018 0.211 0 0.69 0.56 1.25 1.25 1.25 0.017 0 0.034-0 0.050-0.001z"></path> <path fill="#444" d="M13 7v-0.28c0-0.003 0-0.007 0-0.010 0-0.934-0.749-1.693-1.678-1.71l-4.692-0c0.5 0.62 1.37 2 1.37 2h5z"></path> <path fill="#444" d="M15 5.1c-0.552 0-1 0.448-1 1v1.9h-12v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1v9h2v-2h12v2h2v-6.9c0-0.552-0.448-1-1-1z"></path> </g></svg>
                            {woning.slaapkamers}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" role="presentation" viewBox="0 0 48 48" class="flex-0 mr-1"><path d="M23.675 12.891l-6.852 13.063 7.032 1.628.492 7.872 7.31-13.373-7.51-1.63-.472-7.56zm2.45-8.897L27 18l6.274 1.362c1.62.351 2.295 1.818 1.5 3.274l-11.82 21.618c-.529.968-1.01.853-1.079-.248L21 30l-5.714-1.323c-1.612-.373-2.3-1.868-1.529-3.337L25.073 3.767c.511-.975.983-.874 1.052.227z"></path></svg>
                            {woning.energielabel}
                        </span>
                    </div>
                    <br></br>
                    <button className='nav-btn' onClick={handleOpenPopup}>Inschrijven</button>
                </div>
                {/* <p>Latitude: {latitude}</p>
                <p>Longitude: {longitude}</p> */}

                

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

            <div className='map'>
                <MapContainer
                    center={[latitude, longitude]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[latitude, longitude]}>
                        <Popup>
                            Latitude: {latitude} <br />
                            Longitude: {longitude}
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
};

export default WoningDetail;