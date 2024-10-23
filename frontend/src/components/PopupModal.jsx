import React, { useState } from 'react';
import '../App.css'

const PopupModal = ({ onClose, onSave }) => {
  const [sessionTitle, setSessionTitle] = useState(''); // State for input value

  const handleSave = () => {
    // Call the onSave function with the sessionTitle
    onSave(sessionTitle);
    // Close the modal
    onClose();
  };

  return (
    <div className="popup-modal">
        <div className="popup-header"> 🎉 Congrats!</div>
        <div className="popup-content">
            <input
            type="text"
            placeholder="Untitled Session"
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
            />
        </div>
        <div className="popup-footer">
            <button className="Button SaveCancel" onClick={handleSave}>Save</button>
            <button className="Button SaveCancel" onClick={onClose}>Cancel</button>
        </div>
    </div>
  );
};

export default PopupModal;
