import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './search.css';
import './App.css';

const FilteredPandenList = () => {
  const [panden, setPanden] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/panden')
      .then((response) => {
        const filteredData = response.data.filter((pand) => pand.energielabel === 'A');
        setPanden(filteredData);
      })
      .catch((error) => {
        setError(error.message);
        console.error(error);
      });
  }, []); 

  const handleDetailsClick = (id) => {
    navigate(`/woning/${id}`);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='scroll-container'>
      {panden.map((pand) => (
        <div key={pand.id} className='pand-card'>
          <p>{pand.id}</p>
          <p>{pand.postcode}</p>
          <p>{pand.straat}</p>
          <p>{pand.huisnummer}</p>
          <p>{pand.plaats}</p>
          <p>{pand.Omschrijving}</p>
          <p>{pand.type}</p>
          <p>Energielabel: {pand.energielabel}</p>
          <p>{pand.prijs} €</p>
          <button className='nav-btn' onClick={() => handleDetailsClick(pand.id)}>Bekijk details</button>
        </div>
      ))}
    </div>
  );
};

export default FilteredPandenList;
