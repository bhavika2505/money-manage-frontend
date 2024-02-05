import React, { useState } from 'react';
import './GstBills.css'; 
import axios from 'axios';
 // Ensure your styles are set up correctly

function GstBills({ onClose, customers, suppliers, refreshBills  }) {
  // If you have state management for these values, you can replace them with state variables
  const [billNumber, setBillNumber] = useState('1');
  const [billDate, setBillDate] = useState('2024-01-18'); // Use YYYY-MM-DD format for date input
  const [billTo, setBillTo] = useState('');
  const [items, setItems] = useState('');
  const [amount, setAmount] = useState('');
  const [showPartyDropdown, setShowPartyDropdown] = useState(false);
  const [selectedPartyType, setSelectedPartyType] = useState('');
  const [partyList, setPartyList] = useState([]);
  const [onModel, setOnModel] = useState('');


  const handleAddNewParty = () => {
    console.log("Toggling party dropdown");
    setShowPartyDropdown(!showPartyDropdown);
  };


const handlePartyTypeSelect = (type) => {
  console.log("Selected party type:", type);
  setSelectedPartyType(type);
  setOnModel(type === 'customers' ? 'Customer' : 'Supplier'); // Set the onModel based on the type selected
  setShowPartyDropdown(false);
  setPartyList(type === 'customers' ? customers : suppliers);
};

  // Update your state with the new value when input changes
  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleSave = async () => {
    if (!billTo) {
      console.error('Bill To field is required');
      return; // Exit the function if billTo is empty
    }
    
  const gstBillData = {
    billNumber: billNumber,
    billDate: billDate,
    billTo: billTo,
    onModel: onModel, // Include onModel in the data to be sent
    items: items.split(',').map(item => item.trim()),
    amount: parseFloat(amount)
  };

    try {
      const savedBill = await postGstBill(gstBillData);
      console.log('Bill saved:', savedBill);

      refreshBills();
      onClose();
      // Additional actions after saving (e.g., notification, redirect)
    } catch (error) {
      console.error('Error saving bill:', error);
      // Error handling (e.g., user notification)
    }
  };

  const postGstBill = async (gstBillData) => {
    console.log('Sending GST bill data:', gstBillData);
    try {
      const response = await fetch('https://banking-app-backend-se4u.onrender.com/gstbills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gstBillData)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Sending GST bill data:', gstBillData);

      console.log('GST Bill added:', data);
      return data;
      
    } catch (error) {
      console.error('Error posting GST bill:', error);
      throw error;
    }
  };
  const handlePartySelect = (event) => {
    setBillTo(event.target.value);
    console.log("Selected Party ID:", event.target.value); // Log the selected ID for verification
  };
  
  

  return (
    <div className="gst-bills-overlay">
      <div className="gst-bills-dialog">
        <h3>GST Bill</h3>
        <div className="gst-bills-content">
          <div className="gst-bills-row">
            <label htmlFor="billNumber">GST Number</label>
            <input 
              id="billNumber" 
              value={billNumber} 
              onChange={handleInputChange(setBillNumber)} 
            />

            <label htmlFor="billDate">Date</label>
            <input 
              type="date" 
              id="billDate" 
              value={billDate} 
              onChange={handleInputChange(setBillDate)} 
            />
          </div>
          <div className="gst-bills-row">
            <label htmlFor="billTo">Bill To</label>
            <input 
              id="billTo" 
              placeholder="Search from your parties" 
              value={billTo}
              onChange={handleInputChange(setBillTo)}
            />
           <button onClick={handleAddNewParty}>+ ADD NEW PARTY</button>
            {showPartyDropdown && (
              <div className="party-dropdown">
                <button onClick={() => handlePartyTypeSelect('customers')}>Customer</button>
                <button onClick={() => handlePartyTypeSelect('suppliers')}>Supplier</button>
              </div>
            )}
            {selectedPartyType && Array.isArray(partyList) && (
              <select 
                  value={billTo}
                  onChange={handlePartySelect} // Utilize handlePartySelect here
              >
                  {partyList.map((party) => (
                  <option key={party._id} value={party._id}>{party.name}</option>
                  ))}
              </select>
            )}

          </div>
          <div className="gst-bills-row">
            <label htmlFor="items">Items</label>
            <input 
              id="items" 
              placeholder="Enter items from inventory" 
              value={items}
              onChange={handleInputChange(setItems)}
            />
            <button>+ ADD NEW ITEM</button>
          </div>
          <div className="gst-bills-row">
            <label htmlFor="amount">GST Bill Amount</label>
            <input 
              id="amount" 
              placeholder="Enter Amount" 
              value={amount}
              onChange={handleInputChange(setAmount)}
            />
          </div>
        </div>
        <div className='btn-sales'>
        <button className="btn-sales" onClick={handleSave}>Save</button>
        <button className="btn-sales" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default GstBills;
