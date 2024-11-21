import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './search.css';
import './App.css';
import './home.css';

const FilteredPandenList = () => {
  const [panden, setPanden] = useState([]);
  const [filteredPandenA, setFilteredPandenA] = useState([]); // Stores panden with energielabel 'A'
  const [filteredPandenId0, setFilteredPandenId0] = useState([]); // Stores panden with id === 0
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const maxCardsToShow = 5; // Max number of cards to show
  const placeholderImage = "https://via.placeholder.com/500x600?text=No+Image"; // Placeholder image URL

  useEffect(() => {
    const apiUrl = 'http://localhost:3001/panden'; // Base URL for the API

    axios.get(apiUrl, {
      headers: {
        "api-key": "AIzaSyD-1uJ2J3QeQK9nKQJ9v6ZJ1Jzv6J1Jzv6",
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        setPanden(response.data);

        // Filter for energielabel A
        const filteredDataA = response.data.filter((pand) => pand.energielabel === 'A');
        setFilteredPandenA(filteredDataA);

        // Filter for id === 0
        const filteredDataId0 = response.data.filter((pand) => pand.id === 2);
        setFilteredPandenId0(filteredDataId0);
      })
      .catch((error) => {
        setError(error.response ? error.response.data : error.message); // More detailed error handling
        console.error(error);
      });
  }, []);

  const handleDetailsClick = (id) => {
    navigate(`/woning/${id}`);
  };

  const handleImageError = (event) => {
    event.target.src = placeholderImage; // Set to placeholder image if original image fails to load
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='content'>
      {/* Spotlight section for panden with id === 0 */}
      <h1 className='pand-overview'>Spotlight:</h1>
      <div className='scroll-container'>
        {filteredPandenId0.slice(0, maxCardsToShow).map((pand) => (
          <div key={pand.id} className='spotlight'>
            <img
              className='spotlight-foto'
              src={pand.foto}
              alt="Pand afbeelding"
              onError={handleImageError}
            />
            <div className='spotlight-info'>
              <p>{pand.straat} {pand.huisnummer}, {pand.plaats}</p>
              <p>{pand.postcode}</p>
              <p>{pand.type}</p>
              <p>Energielabel: {pand.energielabel}</p>
              <p>€ {pand.prijs}</p>
              <button className='nav-btn' onClick={() => handleDetailsClick(pand.id)}>Bekijk details</button>
            </div>
          </div>
        ))}
      </div>

      {/* Section for panden with energielabel A */}
      <h1 className='pand-overview'>Onze beste panden (Energielabel A):</h1>
      <div className='scroll-container'>
        {filteredPandenA.slice(0, maxCardsToShow).map((pand) => (
          <div key={pand.id} className='pand-card'>
            <img
              className='pand-foto'
              src={pand.foto}
              alt="Pand afbeelding"
              onError={handleImageError}
            />
            <p>{pand.straat} {pand.huisnummer}, {pand.plaats}</p>
            <p>{pand.postcode}</p>
            <p>{pand.type}</p>
            <p>Energielabel: {pand.energielabel}</p>
            <p>€ {pand.prijs}</p>
            <button className='nav-btn' onClick={() => handleDetailsClick(pand.id)}>Bekijk details</button>
          </div>
        ))}
      </div>

      {/* Section for all panden */}
      <h1 className='pand-overview'>Onze Top 5:</h1>
      <div className='scroll-container'>
        {panden.slice(0, maxCardsToShow).map((pand) => (
          <div key={pand.id} className='pand-card'>
            <img
              className='pand-foto'
              src={pand.foto}
              alt="Pand afbeelding"
              onError={handleImageError}
            />
            <p>{pand.straat} {pand.huisnummer}, {pand.plaats}</p>
            <p>{pand.postcode}</p>
            <p>{pand.type}</p>
            <p>Energielabel: {pand.energielabel}</p>
            <p> € {pand.prijs}</p>
            <button className='nav-btn' onClick={() => handleDetailsClick(pand.id)}>Bekijk details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilteredPandenList;