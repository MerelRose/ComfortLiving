import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './search.css';
import './App.css';

const PandenList = () => {
  const [panden, setPanden] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    prijsMin: '',
    prijsMax: '',
    oppervlakteMin: '',
    oppervlakteMax: '',
    locatie: '',
    energielabel: '',
    slaapkamersMin: '',
    slaapkamersMax: ''
  });
  const [showFilters, setShowFilters] = useState(false);
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
    const matchesLocatie = filters.locatie ? pand.plaats.toLowerCase().includes(filters.locatie.toLowerCase()) : true;
    const matchesEnergielabel = filters.energielabel ? pand.energielabel === filters.energielabel : true;
    const matchesSlaapkamers = (!filters.slaapkamersMin || pand.slaapkamers >= filters.slaapkamersMin) &&
                               (!filters.slaapkamersMax || pand.slaapkamers <= filters.slaapkamersMax);

    return matchesSearchTerm && matchesType && matchesPrijs && matchesOppervlakte && matchesLocatie && matchesEnergielabel && matchesSlaapkamers;
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

            {/* Koop Price Dropdowns */}
            {(filters.type === 'koop' || filters.type === 'recreatie' || filters.type === 'nieuwbouw') && (
              <>
                <select 
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
                </select>
                <select 
                  name="prijsMax" 
                  onChange={handleFilterChange}
                  value={filters.prijsMax}
                >
                  <option value="">Max prijs</option>
                  <option value="0" selected="selected">€ 0</option>
                  <option value="50000">€ 50.000</option>
                  <option value="75000">€ 75.000</option>
                  <option value="100000">€ 100.000</option>
                  <option value="125000">€ 125.000</option>
                  <option value="150000">€ 150.000</option>
                  <option value="175000">€ 175.000</option>
                  <option value="200000">€ 200.000</option>
                  < option value="225000">€ 225.000</option>
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
                  <option value=""> Geen Limiet.</option>

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
                  <option value="0">€0</option>
                  <option value="500">€500</option>
                  <option value="1000">€1.000</option>
                  <option value="1500">€1.500</option>
                  <option value="2000">€2.000</option>
                  <option value="3000">€3.000</option>
                  <option value="">geen min.</option>
                </select>
                <select 
                  name="prijsMax" 
                  onChange={handleFilterChange}
                  value={filters.prijsMax}
                >
                  <option value="">Max prijs</option>
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
            {/* Oppervlakte Filter */}
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
  <option value="50-75">50 - 75 m²</option>
  <option value="75-100">75 - 100 m²</option>
  <option value="100-125">100 - 125 m²</option>
  <option value="125-150">125 - 150 m²</option>
  <option value="150-175">150 - 175 m²</option>
  <option value="175-200">175 - 200 m²</option>
  <option value="200-250">200 - 250 m²</option>
  <option value="">Geen Max</option>
</select>

            {/* Locatie Filter */}
            {/* <input 
              type="text" 
              name="locatie" 
              placeholder="Locatie" 
              value={filters.locatie} 
              onChange={handleFilterChange} 
            /> */}

            {/* Energielabel Filter */}
            <select 
              name="energielabel" 
              onChange={handleFilterChange}
              value={filters.energielabel}
            >
              <option value="">Energielabel</option>
              <option value="A">A</option>
              <option value="B">B</option>
              < option value="C">C</option>
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
            
          </div>
        </div>
      )}
      <div className="panden-list">
        {filteredPanden.map((pand) => (
          <div key={pand.id} className="pand-item" onClick={() => handleDetailsClick(pand.id)}>
            <h3>{pand.straat} {pand.huisnummer}, {pand.plaats}</h3>
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