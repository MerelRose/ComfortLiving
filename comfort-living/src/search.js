import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './search.css';
import './App.css';

const PandenList = () => {
  const [panden, setPanden] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/panden')
      .then((response) => {
        setPanden(response.data);
      })
      .catch((error) => {
        setError(error.message);
        console.error(error);
      });
  }, []); 

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPanden = panden.filter((pand) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      pand.postcode.toLowerCase().includes(lowerSearchTerm) ||
      pand.straat.toLowerCase().includes(lowerSearchTerm) ||
      pand.plaats.toLowerCase().includes(lowerSearchTerm)
    );
  });

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
      {filteredPanden.map((pand) => (
        <div key={pand.id} className='pand-kaart'>
          <p>{pand.id}</p>
          <p>{pand.postcode}</p>
          <p>{pand.straat}</p>
          <p>{pand.huisnummer}</p>
          <p>{pand.plaats}</p>
          <p>{pand.Omschrijving}</p>
          <p>{pand.type}</p>
          <p>{pand.GPS}</p>
          <button 
            className='nav-btn' 
            onClick={() => handleDetailsClick(pand.id)}
          >
            Bekijk details
          </button>
        </div>
      ))}
    </div>
  );
};

export default PandenList;