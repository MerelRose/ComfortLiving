import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './Notificaties.css'; // Zorg ervoor dat je een CSS-bestand maakt voor styling

const Notificaties = ({ huurderId }) => {
  const [notificaties, setNotificaties] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchNotificaties = async () => {
      const response = await axios.get(`http://localhost:3001/notificaties/${huurderId}`);
      setNotificaties(response.data);
    };

    fetchNotificaties();
  }, [huurderId]);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  return (
    <div className="notificaties-container">
      <div className="inbox-icon" onClick={toggleDropdown}>
        <i className="fas fa-inbox"></i> {/* Inbox icon */}
        {notificaties.filter(n => n.status === 'ongelezen').length > 0 && (
          <span className="notification-count">{notificaties.filter(n => n.status === 'ongelezen').length}</span>
        )}
      </div>
      {showDropdown && (
        <div className="dropdown">
          <h2>Notificaties</h2>
          {notificaties.length === 0 ? (
            <p>Geen notificaties.</p>
          ) : (
            notificaties.map(notificatie => (
              <div key={notificatie.id} className="notificatie-item">
                <p>{notificatie.bericht}</p>
                <p>{new Date(notificatie.datum).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notificaties;