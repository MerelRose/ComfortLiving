import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './search.css';
import './App.css';

const PandenList = () => {
    const [panden, setPanden] = useState([]);
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

    useEffect(() => {
        axios.get('http://localhost:3001/panden')
            .then((response) => {
                console.log("Panden fetched successfully:", response.data);
                setPanden(response.data);
            })
            .catch((error) => {
                setError(error.message);
                console.error("Error fetching panden:", error);
            });
    }, []); 

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
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

    // Fetch geocode data for the specified location
    const geocodeData = await fetchGeocodeData(searchLocation);
    if (!geocodeData) {
        console.log(`No geocode data found for "${searchLocation}"`);
        return; // No geocode data found
    }

    const { lat, lon } = geocodeData; // Get latitude and longitude
    console.log(`Coordinates for "${searchLocation}":`, lat, lon);

    // Filter panden based on the radius
    const filteredPanden = panden.filter(pand => {
        const pandLat = pand.latitude; // Assuming your pand data includes latitude
        const pandLon = pand.longitude; // Assuming your pand data includes longitude

        // Check if pandLat and pandLon are valid numbers
        if (typeof pandLat !== 'number' || typeof pandLon !== 'number') {
            console.log(`Invalid coordinates for pand:`, pand);
            return false; // Skip this pand if coordinates are invalid 
        }

        const distance = getDistanceFromLatLonInKm(lat, lon, pandLat, pandLon);
        console.log(`Distance from ${searchLocation} to ${pand.straat} ${pand.huisnummer}: ${distance} km`);

        return distance <= radius; // Filter based on distance
    });

    console.log(`Filtered panden count: ${filteredPanden.length}`);
    setPanden(filteredPanden); // Update the state with filtered panden
};

// Function to calculate the distance between two coordinates
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
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

    const handleFilter = async () => {
        console.log("Filtering panden by location and radius...");
        await filterPandenByLocation();
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
            <button onClick={toggleFilters} className="filter-button">Filters</button>
            {showFilters && (
                <div className="filter-box">
                    <div className="filters">
                        <select 
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
                                    name="prijsMin" 
                                    onChange={handleFilterChange}
                                    value={filters.prijsMin}
                                >
                                    <option value="">Min prijs</option>
                                    <option value="0">€ 0</option>
                                    <option value="50000">€ 50.000</option>
                                    {/* Add more options as needed */}
                                </select>
                                <select 
                                    name="prijsMax" 
                                    onChange={handleFilterChange}
                                    value={filters.prijsMax}
                                >
                                    <option value="">Max prijs</option>
                                    <option value="0">€ 0</option>
                                    <option value="50000">€ 50.000</option>
                                    {/* Add more options as needed */}
                                </select>
                            </>
                        )}

                        {/* Huur Price Dropdowns */}
                        {filters.type === 'huur' && (
                            <>
                                <select 
                                    name="prijsMin" 
                                    onChange={handleFilterChange}
                                    value={filters.prijsMin}
                                >
                                    <option value="">Min prijs</option>
                                    < option value="0">€0</option>  
                                    <option value="500">€500</option>
                                    {/* Add more options as needed */}
                                </select>
                                <select 
                                    name="prijsMax" 
                                    onChange={handleFilterChange}
                                    value={filters.prijsMax}
                                >
                                    <option value="">Max prijs</option>
                                    <option value="1000">€1.000</option>
                                    <option value="1500">€1.500</option>
                                    {/* Add more options as needed */}
                                </select>
                            </>
                        )}

                        {/* Oppervlakte Filters */}
                        <select 
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
                            {/* Add more options as needed */}
                        </select>

                        {/* Energielabel Filter */}
                        <select 
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
                            type="text" 
                            placeholder="Locatie (optioneel)" 
                            value={searchLocation} 
                            onChange={(e) => setSearchLocation(e.target.value)} 
                        />
                        <input 
                            type="number" 
                            placeholder="Radius (km, optioneel)" 
                            value={radius} 
                            onChange={(e) => setRadius(e.target.value)} 
                        />
                        <button onClick={handleFilter} className="filter-button">Zoeken</button>
                    </div>
                </div>
            )}
            <div className="panden-list">
                {filteredPanden.map((pand) => (
                    <div key={pand.id} className="pand-item" onClick={() => handleDetailsClick(pand.id)}>
                        <h3>{pand.straat} {pand.huisnummer}, {pand.plaats}</h3>
                        <p>Type: {pand.type}</p>
                        <p>Prijs: €{pand.prijs}</p>
                        <p>Oppervlakte: {pand.oppervlakte} m²</p>
                        <p>Slaapkamers: {pand.slaapkamers}</p>
                        <p>Energielabel: {pand.energielabel}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PandenList;