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
              <h2>{pand.straat} {pand.huisnummer}</h2>
              <p>{pand.plaats} {pand.postcode}</p>
              <p>€ {pand.prijs}/maand</p>
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

      {/* Section for panden with energielabel A */}
      <h1 className='pand-overview'>Onze beste panden (Energielabel A):</h1>
      <div className='scroll-container'>
        {filteredPandenA.slice(0, maxCardsToShow).map((pand) => (
          <div key={pand.id} className='spotlight'>
          <img
            className='spotlight-foto'
            src={pand.foto}
            alt="Pand afbeelding"
            onError={handleImageError}
          />
          <div className='spotlight-info'>
            <h2>{pand.straat} {pand.huisnummer}</h2>
            <p>{pand.plaats} {pand.postcode}</p>
            <p>€ {pand.prijs}/maand</p>
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

      {/* Section for all panden */}
      <h1 className='pand-overview'>Onze Top 5:</h1>
      <div className='scroll-container'>
        {panden.slice(0, maxCardsToShow).map((pand) => (
          <div key={pand.id} className='spotlight'>
          <img
            className='spotlight-foto'
            src={pand.foto}
            alt="Pand afbeelding"
            onError={handleImageError}
          />
          <div className='spotlight-info'>
            <h2>{pand.straat} {pand.huisnummer}</h2>
            <p>{pand.plaats} {pand.postcode}</p>
            <p>€ {pand.prijs}/maand</p>
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

export default FilteredPandenList;