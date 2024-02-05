import React, { useState } from 'react';
import '../../Sales/GstBills/GstBills.css';

function PurchaseBills({ onClose, customers, suppliers, refreshBills }) {
  const [billNumber, setBillNumber] = useState('1');
  const [billDate, setBillDate] = useState('2024-01-18');
  const [billTo, setBillTo] = useState('');
  const [items, setItems] = useState('');
  const [amount, setAmount] = useState('');
  const [showPartyDropdown, setShowPartyDropdown] = useState(false);
  const [selectedPartyType, setSelectedPartyType] = useState('');
  const [partyList, setPartyList] = useState([]);

  const handleSubmit = async () => {
    const purchaseBillData = {
      billNumber,
      billDate,
      billTo,
      onModel: selectedPartyType === 'customers' ? 'Customer' : 'Supplier',
      items: items.split(','), 
      amount: Number(amount)
    };

    try {
      const response = await fetch('http://localhost:8084/purchasebills', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchaseBillData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Purchase bill created:', result);
      onClose();
      refreshBills();
    } catch (error) {
      console.error('Could not create purchase bill:', error);
    }
  };

  const handleAddNewParty = () => {
    setShowPartyDropdown(!showPartyDropdown);
  };

  console.log('Customers:', customers); // Debug: Check customers
  console.log('Suppliers:', suppliers); // Debug: Check suppliers

  // ... other functions ...

  const handlePartyTypeSelect = (type) => {
    console.log("Selected party type:", type); // Debug: Check selected type
    setSelectedPartyType(type);
    setShowPartyDropdown(false);
    const list = type === 'customers' ? customers : suppliers;
    setPartyList(list);
    console.log('Party List:', list); // Debug: Check updated party list
  };

  const handlePartySelect = (partyId) => {
    setBillTo(partyId);
  };

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  return (
    <div className="gst-bills-overlay">
      <div className="gst-bills-dialog">
        <h3>Purchase Bill</h3>
        <div className="gst-bills-content">
          <div className="gst-bills-row">
            <label htmlFor="billNumber">Purchase Bill Number</label>
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
                {partyList.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
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
          </div>
          <div className="gst-bills-row">
            <label htmlFor="amount">Purchase Bill Amount</label>
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

export default PurchaseBills;
