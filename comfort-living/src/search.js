import React, { useEffect, useState,useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './search.css';
import './App.css';

const PandenList = () => {
    const [panden, setPanden] = useState([]);
    const[originalPanden, setOriginalPanden]= useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLocation, setSearchLocation] = useState(''); // Location for search
    const [radius, setRadius] = useState(''); 
    const [filters, setFilters] = useState({
        type: '',
        prijsMin: '',
        prijsMax: '',
        oppervlakteMin: '',
        oppervlakteMax: '',
        energielabel: '',
        slaapkamersMin: '',
        slaapkamersMax: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();
    const hasFetched = useRef(false); // Gebruik een ref om bij te houden of de fetch is uitgevoerd

    const placeholderImage = "https://via.placeholder.com/500x600?text=No+Image"; // Placeholder image URL

    const fetchData = async () => {             
            try{
                const apiUrl = 'http://localhost:3001/panden';
                let response = await      
                axios.get(apiUrl, {
                    headers: {
                      "api-key": "AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6",
                      "Content-Type": "application/json"
                    }
                  })
                
                console.log("Panden fetched successfully:", response.data);
                 setPanden(response.data);
                 setOriginalPanden(response.data);
                hasFetched.current = true; // Zet de ref op true na een succesvolle fetch
            }
            catch(error) {
                    setError(error.message);
                console.error("Error fetching panden:", error);
            }
        }

    useEffect( () => {
        if (originalPanden.length === 0 && !hasFetched.current)
        {
            fetchData();
        }
    }, []); 

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleImageError = (event) => {
        event.target.src = placeholderImage; // Set to placeholder image if original image fails to load
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const toggleFilters = () => {
        setShowFilters(prev => !prev);
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const fetchGeocodeData = async (address) => {
        const apiKey = "6731fbce688b3964722793kmnb77be1";
        const url = `https://geocode.maps.co/search?q=${encodeURIComponent(address + ', Nederland')}&api_key=${apiKey}`;
        
        await delay(1100); // 1100 milliseconds

        try {
            const response = await axios.get(url);
            console.log(`Geocode data for "${address}":`, response.data);
            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                console.log(`Coordinates for "${address}":`, lat, lon);
                return { lat, lon }; // Return latitude and longitude
            } else {
                console.error(`No geocode results for "${address}"`);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching data for "${address}":`, error);
            return null;
        }
    };

    const filterPandenByLocation = async () => {
        if (!searchLocation || !radius) {
            console.log("Location or radius not provided, skipping location filter.");
            return; // No location or radius provided
        }
    
        // Convert radius to a number
        const radiusInKm = Number(radius);
    
        // Fetch geocode data for the specified location
        const geocodeData = await fetchGeocodeData(searchLocation);
        if (!geocodeData) {
            console.log(`No geocode data found for "${searchLocation}"`);
            return; // No geocode data found
        }
    
        const { lat, lon } = geocodeData; // Get latitude and longitude
        console.log(`Coordinates for "${searchLocation}":`, lat, lon);
    
        // Filter panden based on the radius
        const filteredPanden = originalPanden.filter(pand => {
            const pandLat = parseFloat(pand.latitude); // Latitude from the database
            const pandLon = parseFloat(pand.longitude); // Longitude from the database
    
            if (isNaN(pandLat) || isNaN(pandLon)) {
                console.log(`Invalid coordinates for pand:`, pand);
                return false; // Skip this pand if coordinates are invalid 
            }
    
            const distance = getDistanceFromLatLonInKm(lat, lon, pandLat, pandLon);
            console.log(`Distance from ${searchLocation} to ${pand.straat} ${pand.huisnummer}: ${distance} km`);
    
            return distance <= radiusInKm; // Filter based on distance
        });
    
        console.log(`Filtered panden count: ${filteredPanden.length}`);
        await setPanden(filteredPanden); // Update the state with filtered panden
    };

    // Function to calculate the distance between two coordinates
    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2 ) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180; // Convert degrees to radians
        const dLon = (lon2 - lon1) * Math.PI / 180; // Convert degrees to radians
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const filteredPanden = panden.filter((pand) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const matchesSearchTerm = pand.postcode.toLowerCase().includes(lowerSearchTerm) ||
                            pand.straat.toLowerCase().includes(lowerSearchTerm) ||
                            pand.plaats.toLowerCase().includes(lowerSearchTerm);

        const matchesType = filters.type ? pand.type === filters.type : true;
        const matchesPrijs = (!filters.prijsMin || pand.prijs >= filters.prijsMin) &&
                             (!filters.prijsMax || pand.prijs <= filters.prijsMax);
        const matchesOppervlakte = (!filters.oppervlakteMin || pand.oppervlakte >= filters.oppervlakteMin) &&
                                   (!filters.oppervlakteMax || pand.oppervlakte <= filters.oppervlakteMax);
        const matchesEnergielabel = filters.energielabel ? pand.energielabel === filters.energielabel : true;
        const matchesSlaapkamers = (!filters.slaapkamersMin || pand.slaapkamers >= filters.slaapkamersMin) &&
                                   (!filters.slaapkamersMax || pand.slaapkamers <= filters.slaapkamersMax);

        return matchesSearchTerm && matchesType && matchesPrijs && matchesOppervlakte && matchesEnergielabel && matchesSlaapkamers;
    });
    const fetchOriginalPanden = async () => {
        try {
            const response = await axios.get('http://localhost:3001/panden');
            console.log("Panden fetched successfully:", response.data);
            return response.data; // Return the original list of panden
        } catch (error) {
            console.error("Error fetching original panden:", error);
            return []; // Return an empty array on error
        } 
    };
    const handleFilter = async () => {
        console.log("Filtering panden by location and radius...");
       // const originalPanden = await fetchOriginalPanden(); // Fetch the original panden again if necessary
        //await setPanden(originalPanden); // Set the original panden to the state
     //  await  setPanden( await fetchOriginalPanden());
        filterPandenByLocation(); // Call the function to filter based on location and radius
    };
    const handleDetailsClick = (id) => {
        navigate(`/woning/${id}`);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='content'>
            <input 
                type="text" 
                placeholder="Zoek op postcode, straat, huisnummer of plaats" 
                value={searchTerm}
                onChange={handleSearch} 
                className='input'
            />
            <button onClick={toggleFilters} className="filter-button nav-btn">Filters</button>
            {showFilters && (
                <div className="filter-box filter-container">
                    <div className="filters">
                        <select 
                            className='options'
                            name="type" 
                            onChange={(e) => {
                                handleFilterChange(e);
                                // Reset price filters when type changes
                                setFilters(prevFilters => ({
                                    ...prevFilters,
                                    prijsMin: '',
                                    prijsMax: ''
                                }));
                            }}
                        >
                            <option value="">Type</option>
                            <option value="huur">Huur</option>
                            <option value="koop">Koop</option>
                            <option value="recreatie">Recreatie</option>
                            <option value="nieuwbouw">Nieuwbouw</option>
                        </select>

                        {/* Price Dropdowns */}
                        {(filters.type === 'koop' || filters.type === 'recreatie' || filters.type === 'nieuwbouw') && (
                            <>
                                <select 
                                    className='options'
                                    name="prijsMin" 
                                    onChange={handleFilterChange}
                                    value={filters.prijsMin}
                                >
                                    <option value="">Min prijs</option>
                                    <option value="0" selected="selected">€ 0</option>
                                    <option value="50000">€ 50.000</option>
                                    <option value="75000">€ 75.000</option>
                                    <option value="100000">€ 100.000</option>
                                    <option value="125000">€ 125.000</option>
                                    <option value="150000">€ 150.000</option>
                                    <option value="175000">€ 175.000</option>
                                    <option value="200000">€ 200.000</option>
                                    <option value="225000">€ 225.000</option>
                                    <option value="250000">€ 250.000</option>
                                    <option value=" 275000">€ 275.000</option>
                                    <option value="300000">€ 300.000</option>
                                    <option value="325000">€ 325.000</option>
                                    <option value="350000">€ 350.000</option>
                                    <option value="375000">€ 375.000</option>
                                    <option value="400000">€ 400.000</option>
                                    <option value="450000">€ 450.000</option>
                                    <option value="500000">€ 500.000</option>
                                    <option value="550000">€ 550.000</option>
                                    <option value="600000">€ 600.000</option>
                                    <option value="650000">€ 650.000</option>
                                    <option value="700000">€ 700.000</option>
                                    <option value="750000">€ 750.000</option>
                                    <option value="800000">€ 800.000</option>
                                    <option value="900000">€ 900.000</option>
                                    <option value="1000000">€ 1.000.000</option>
                                    <option value="1250000">€ 1.250.000</option>
                                    <option value="1500000">€ 1.500.000</option>
                                    <option value="2000000">€ 2.000.000</option>
                                    <option value="2500000">€ 2.500.000</option>
                                    <option value="3000000">€ 3.000.000</option>
                                    <option value="3500000">€ 3.500.000</option>
                                    <option value="4000000">€ 4.000.000</option>
                                    <option value="4500000">€ 4.500.000</option>
                                    <option value="5000000">€ 5.000.000</option>
                                </select>
                                <select 
                                    className='options'
                                    name="prijsMax" 
                                    onChange={handleFilterChange}
                                    value={filters.prijsMax}
                                >
                                    <option value="">Max prijs</option>
                                    <option value="0">€ 0</option>
                                    <option value="50000">€ 50.000</option>
                                    <option value="75000">€ 75.000</option>
                                    <option value="100000">€ 100.000</option>
                                    <option value="125000">€ 125.000</option>
                                    <option value="150000">€ 150.000</option>
                                    <option value="175000">€ 175.000</option>
                                    <option value="200000">€ 200.000</option>
                                    <option value="225000">€ 225.000</option>
                                    <option value="250000">€ 250.000</option>
                                    <option value="275000">€ 275.000</option>
                                    <option value="300000">€ 300.000</option>
                                    <option value="325000">€ 325.000</option>
                                    <option value="350000">€ 350.000</option>
                                    <option value="375000">€ 375.000</option>
                                    <option value="400000">€ 400.000</option>
                                    <option value="450000">€ 450.000</option>
                                    <option value="500000">€ 500.000</option>
                                    <option value="550000">€ 550.000</option>
                                    <option value="600000">€ 600.000</option>
                                    <option value="650000">€ 650.000</option>
                                    <option value="700000">€ 700.000</option>
                                    <option value="750000">€ 750.000</option>
                                    <option value="800000">€ 800.000</option>
                                    <option value="900000">€ 900.000</option>
                                    <option value="1000000">€ 1.000.000</option>
                                    <option value="1250000">€ 1.250.000</option>
                                    <option value="1500000">€ 1.500.000</option>
                                    <option value="2000000">€ 2.000.000</option>
                                    <option value="2500000">€ 2.500.000</option>
                                    <option value="3000000">€ 3.000.000</option>
                                    <option value="3500000">€ 3.500.000</option>
                                    <option value="4000000">€ 4.000.000</option>
                                    <option value="4500000">€ 4.500.000</option>
                                    <option value="5000000">€ 5.000.000</option>
                                    <option value="1000000000">Geen Limiet</option>
                                </select>
                            </>
                        )}

                        {/* Huur Price Dropdowns */}
                        {filters.type === 'huur' && (
                            <>
                                <select 
                                    className='options'
                                    name="prijsMin" 
                                    onChange={handleFilterChange}
                                    value={filters.prijsMin}
                                >
                                    <option value="">Min prijs</option>
                                    <option value="0">€0</option>
                                    <option value="500">€500</option>
                                    <option value="1000">€1.000</option>
                                    <option value="1500">€1.500</option>
                                    <option value="2000">€2.000</option>
                                    <option value="3000">€3.000</option>
                                    <option value="">geen min.</option>
                                </select>
                                <select 
                                    className='options'
                                    name="prijsMax" 
                                    onChange={handleFilterChange}
                                    value={filters.prijsMax}
                                >
                                    <option value="">Max prijs</option>
                                    <option value="500">€500</option>
                                    <option value="1000">€1.000</option>
                                    <option value="1500">€1.500</option>
                                    <option value="2000">€2.000</option>
                                    <option value="3000">€3.000</option>
                                    <option value="6000">€6.000</option>
                                    <option value="100000">Geen Max</option>
                                </select>
                            </>
                        )}

                        {/* Oppervlakte Filters */}
                        <select 
                            className='options'
                            name="oppervlakte" 
                            onChange={(e) => {
                                const value = e.target.value.split('-');
                                setFilters(prevFilters => ({
                                    ...prevFilters,
                                    oppervlakteMin: value[0],
                                    oppervlakteMax: value[1] || ''
                                }));
                            }} 
                            value={`${filters.oppervlakteMin}-${filters.oppervlakteMax}`}
                        >
                            <option value="">Kies Oppervlakte (m²)</option>
                            <option value="0-50">0 - 50 m²</option>
                            <option value="50-75">50 - 75 m²</option>
                            <option value="75-100">75 - 100 m²</option>
                            <option value="100-125">100 - 125 m²</option>
                            <option value="125-150">125 - 150 m²</option>
                            <option value="150-175">150 - 175 m²</option>
                            <option value="175-200">175 - 200 m²</option>
                            <option value="200-250">200 - 250 m²</option>
                            <option value="">Geen Max</option>
                        </select>

                        {/* Energielabel Filter */}
                        <select 
                            className='options'
                            name="energielabel" 
                            onChange={handleFilterChange}
                            value={filters.energielabel}
                        >
                            <option value="">Energielabel</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                            <option value="F">F</option>
                            <option value="G">G</option>
                        </select>

                        {/* Slaapkamers Filter */}
                        <select 
                            className='options'
                            name="slaapkamersMin" 
                            onChange={handleFilterChange} 
                            value={filters.slaapkamersMin}
                        >
                            <option value="">Min Slaapkamers</option>
                            {[0, 1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>

                        <select 
                            className='options'
                            name="slaapkamersMax" 
                            onChange={handleFilterChange} 
                            value={filters.slaapkamersMax}
                        >
                            <option value="">Max Slaapkamers</option>
                            {[0, 1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>

                        {/* Location Input */}
                        <input 
                            className='options'
                            type="text" 
                            placeholder="Locatie (optioneel)" 
 value={searchLocation} 
                            onChange={(e) => setSearchLocation(e.target.value)} 
                        />
<select 
    className='options'
    name="radius" 
    onChange={(e) => setRadius(e.target.value)} 
    value={radius}
>
    <option value="">Selecteer Radius (km)</option>
    <option value="1">1 km</option>
    <option value="5">5 km</option>
    <option value="10">10 km</option>
    <option value="20">20 km</option>
    <option value="50">50 km</option>
</select>
                        <button onClick={handleFilter} className="filter-button nav-btn">Zoeken</button>
                    </div>
                </div>
            )}
            <div className="panden-list">
                {filteredPanden.map((pand) => (
                    <div key={pand.id} className='spotlight'>
                        <img
                        className='spotlight-foto'
                        src={pand.fotos}
                        alt="Pand afbeelding"
                        onError={handleImageError}
                        />
                        <div className='spotlight-info'>
                        <h2>{pand.straat} {pand.huisnummer}</h2>
                        <p>{pand.plaats} {pand.postcode}</p>
                        <p>€ {pand.prijs} &#40;{pand.type}&#41;</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" role="presentation" viewBox="0 0 48 48" class="flex-0 mr-1"><path d="M38.5 32.25v-16.5a5 5 0 10-6.25-6.25h-16.5a5 5 0 10-6.25 6.25v16.5a5 5 0 106.25 6.25h16.5a5 5 0 106.25-6.25zm-6.25 3.25h-16.5a5 5 0 00-3.25-3.25v-16.5a5 5 0 003.25-3.25h16.5a5 5 0 003.25 3.25v16.5a5 5 0 00-3.25 3.25zM37 9a2 2 0 11-2 2 2 2 0 012-2zM11 9a2 2 0 11-2 2 2 2 0 012-2zm0 30a2 2 0 112-2 2 2 0 01-2 2zm26 0a2 2 0 112-2 2 2 0 01-2 2z"></path></svg>
                            {pand.oppervlakte}m²  
                            </span> 
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>          
                            <svg className='svg' width="20px" height="20px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#444" d="M4.28 7h2.72l-1.15-1.68c-0.542-0.725-1.36-1.216-2.295-1.319l-0.555-0.001v1.54c-0.011 0.063-0.018 0.136-0.018 0.211 0 0.69 0.56 1.25 1.25 1.25 0.017 0 0.034-0 0.050-0.001z"></path> <path fill="#444" d="M13 7v-0.28c0-0.003 0-0.007 0-0.010 0-0.934-0.749-1.693-1.678-1.71l-4.692-0c0.5 0.62 1.37 2 1.37 2h5z"></path> <path fill="#444" d="M15 5.1c-0.552 0-1 0.448-1 1v1.9h-12v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1v9h2v-2h12v2h2v-6.9c0-0.552-0.448-1-1-1z"></path> </g></svg>
                            {pand.slaapkamers}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" role="presentation" viewBox="0 0 48 48" class="flex-0 mr-1"><path d="M23.675 12.891l-6.852 13.063 7.032 1.628.492 7.872 7.31-13.373-7.51-1.63-.472-7.56zm2.45-8.897L27 18l6.274 1.362c1.62.351 2.295 1.818 1.5 3.274l-11.82 21.618c-.529.968-1.01.853-1.079-.248L21 30l-5.714-1.323c-1.612-.373-2.3-1.868-1.529-3.337L25.073 3.767c.511-.975.983-.874 1.052.227z"></path></svg>
                            {pand.energielabel}
                            </span>
                        </div>
                        <br></br>
                        <button className='nav-btn' onClick={() => handleDetailsClick(pand.id)}>Bekijk details</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PandenList;