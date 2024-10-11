import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PandenList = () => {
  const [panden, setPanden] = useState([]);
  const [error, setError] = useState(null);

  // Fetch data when the component is mounted
  useEffect(() => {
    axios.get('http://localhost:3001/panden')
      .then((response) => {
        setPanden(response.data);
      })
      .catch((error) => {
        setError(error.message);
        console.error(error);
      });
  }, []);  // Empty array means this runs once after the component mounts

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Panden:</h1>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Postcode</th>
            <th>Straat</th>
            <th>Huisnummer</th>
            <th>Plaats</th>
          </tr>
        </thead>
        <tbody>
          {panden.map((pand) => (
            <tr key={pand.id}>
              <td>{pand.id}</td>
              <td>{pand.postcode}</td>
              <td>{pand.straat}</td>
              <td>{pand.huisnummer}</td>
              <td>{pand.plaats}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PandenList;
