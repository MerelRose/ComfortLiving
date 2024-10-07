import React, { useState, useEffect } from 'react';
import './warning.css';

export default function WarningPopup() {
  const [open, setOpen] = useState(true);  // Modal opens automatically on page load

  const handleClose = () => setOpen(false);

  useEffect(() => {}, []);

  return (
    <>
      {open && (
        <div className="modal">
          <div className="modal-content">
            <h2>Inappropriate Behavior Warning</h2>
            <p>
              Please be aware that inappropriate behavior may result in your account being blocked. 
              Adhere to community guidelines to avoid any disruptions to your account.
            </p>
            <button onClick={handleClose}>
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
}
