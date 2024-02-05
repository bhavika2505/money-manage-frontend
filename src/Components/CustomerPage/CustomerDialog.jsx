import React, { useState } from 'react';
import './CustomerDialog.css';
import axios from 'axios';


function CustomerDialog({ open, onClose }) {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    const customer = { name, number, email }; // Use state variables

    try {
      await axios.post('https://banking-app-backend-se4u.onrender.com/customer', customer);
      console.log('Customer added');
      // Reset the state variables
      setName('');
      setNumber('');
      setEmail('');
      onClose(); // Close dialog after adding
    } catch (error) {
      console.error('Error adding customer', error);
    }
  };

  if (!open) return null;

  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h1>Add Customer</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="dialogbtn">
          <div className='dialog-actions'>
            <button onClick={handleAdd}>Add</button>
          </div>
          <div className='dialog-actions'>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDialog;
