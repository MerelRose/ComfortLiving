import React, { useState } from 'react';
import './App.css';

const ChangePasswordPopup = ({ isOpen, onClose, onChangePassword }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Wachtwoorden komen niet overeen.');
            return;
        }
        setMessage(''); // Reset message before calling the function
        onChangePassword(newPassword);
    };

    if (!isOpen) return null;

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Wachtwoord Wijzigen</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nieuw Wachtwoord:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Bevestig Wachtwoord:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {message && <p>{message}</p>}
                    <button type="submit">Wijzig Wachtwoord</button>
                    <button type="button" onClick={onClose}>Annuleer</button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPopup;
