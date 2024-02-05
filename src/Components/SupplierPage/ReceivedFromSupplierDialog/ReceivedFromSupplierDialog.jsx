// ReceivedFromSupplierDialog.jsx
import React, { useState } from 'react';
import './ReceivedFromSupplierDialog.css'; // Ensure this CSS file is created and styled as needed
import { MdAttachFile } from "react-icons/md";

function ReceivedFromSupplierDialog({ isOpen, onClose, supplierName, supplierId, onSave }) {
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSave = () => {
    const paymentData = {
      amount,
      details,
      date,
      supplierId,  // Using supplierId here
    };
    onSave(paymentData);
    onClose();
  };

  if (!isOpen) return null; // Control visibility with the `isOpen` prop

  return (
    <div className="received-from-supplier-dialog-backdrop">
      <div className="received-from-supplier-dialog">
        <header className="received-from-supplier-dialog-header">
          <button onClick={onClose}>&lt; Back</button>
          <h2>You received ₹ {amount} from {supplierName}</h2>
        </header>
        <input
          type="number"
          placeholder="₹ Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        ></textarea>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className='payment-lst-btn'>
          {/* Add any additional UI elements here if needed */}
          <div className="received-from-supplier-dialog-actions">
            <button className="save-button" onClick={handleSave}>SAVE</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceivedFromSupplierDialog;
