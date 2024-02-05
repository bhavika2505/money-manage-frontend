// StaffDialog.jsx
import React, { useState, useEffect } from 'react';
import './StaffDialog.css'; // Create and import CSS for styling
import axios from 'axios';


function StaffDialog({ open, onClose, onAddStaff }) {
  const [name, setName] = useState('');
  const [office, setOffice] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [salary, setSalary] = useState('');


  const handleAdd = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const staff = { name, office, email, number, salary }; // Use state variables
  
    try {
      await axios.post('https://banking-app-backend-se4u.onrender.com/staff', staff);
      console.log('Staff member added');
      // Reset the state variables
      setName('');
      setOffice('');
      setEmail('');
      setNumber('');
      setSalary('');
      onAddStaff(staff); // Update the parent component's state
      onClose(); // Close the dialog
    } catch (error) {
      console.error('Error adding staff member:', error);
    }
  };
  
  

  if (!open) return null;

  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h1>Add Staff</h1>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Office" value={office} onChange={(e) => setOffice(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Phone Number" value={number} onChange={(e) => setNumber(e.target.value)} />
        <input type="Number" placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
        <div className="dialog-actions">
          <button onClick={handleAdd}>Add</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default StaffDialog;
