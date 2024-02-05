// SupplierDialog.jsx
import React, { useState } from 'react';
import './SupplierDialog.css'; // Your CSS file for styling
import axios from 'axios';

function SupplierDialog({ open, onClose, onAddSupplier }) {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleAdd2 = async (e) => {
    e.preventDefault();
    const supplier = { name, number, email }; // Use state variables

    try {
      await axios.post('https://banking-app-backend-se4u.onrender.com/supplier', supplier);
      console.log('Supplier added');
      // Reset the state variables
      setName('');
      setNumber('');
      setEmail('');
      onClose(); // Close dialog after adding
    } catch (error) {
      console.error('Error adding Supplier', error);
    }
  };

  if (!open) return null;

  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h1>Add Supplier</h1>
        <input
          type="text"
          placeholder="Supplier Name"
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
        <div className="dialog-actions">
          <button onClick={handleAdd2}>Add</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default SupplierDialog;
