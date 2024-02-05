import React, { useState } from 'react';
// Ensure your styles are set up correctly
import '../GstBills/GstBills.css';


function SalesBills({ onClose, customers, suppliers,refreshBills  }){
  // If you have state management for these values, you can replace them with state variables
  const [billNumber, setBillNumber] = useState('1');
  const [billDate, setBillDate] = useState('2024-01-18'); // Use YYYY-MM-DD format for date input
  const [billTo, setBillTo] = useState('');
  const [items, setItems] = useState('');
  const [amount, setAmount] = useState('');
  const [showPartyDropdown, setShowPartyDropdown] = useState(false);
  const [selectedPartyType, setSelectedPartyType] = useState('');
  const [partyList, setPartyList] = useState([]);
  
  const handleSubmit = async () => {
    const salesBillData = {
      billNumber,
      billDate,
      billTo,
      onModel: selectedPartyType === 'customers' ? 'Customer' : 'Supplier',
      items: items.split(','), // Assuming items are comma-separated
      amount: Number(amount)
    };
  
    try {
      const response = await fetch('https://banking-app-backend-se4u.onrender.com/salesbills', { // Adjust the URL as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(salesBillData)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Sales bill created:', result);
  
      onClose(); // Close the form or clear the fields here
      refreshBills();// Fetch the latest bills after posting new data
    } catch (error) {
      console.error('Could not create sales bill:', error);
      // Handle errors, e.g. by showing a message to the user
    }
  };
  

  const handleAddNewParty = () => {
    console.log("Toggling party dropdown");
    setShowPartyDropdown(!showPartyDropdown);
  };

  const handlePartyTypeSelect = async (type) => {
    console.log("Selected party type:", type);
    console.log(customers, suppliers);
    setSelectedPartyType(type);
    setShowPartyDropdown(false);
    setPartyList(type === 'customers' ? customers : suppliers);
  };
  
  // ...

const handlePartySelect = (party) => {
  setBillTo(party._id); // Set the ID of the selected party
  // ... other state updates as necessary
};



// ...


  // Update your state with the new value when input changes
  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  return (
    <div className="gst-bills-overlay">
      <div className="gst-bills-dialog">
        <h3>Sale Bill</h3>
        <div className="gst-bills-content">
          <div className="gst-bills-row">
            <label htmlFor="billNumber">Sale Bill Number</label>
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
            onChange={(e) => setBillTo(e.target.value)}
          >
            {partyList.map((party) => (
              <option key={party._id} value={party._id}>{party.name}</option> // Use party._id as value
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
            <label htmlFor="amount">Sale Bill Amount</label>
            <input 
              id="amount" 
              placeholder="Enter Amount" 
              value={amount}
              onChange={handleInputChange(setAmount)}
            />
          </div>
        </div>
        <button className="save-btn" onClick={handleSubmit}>Save Bill</button>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default SalesBills;
