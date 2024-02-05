// PaymentToSupplierDialog.jsx
import React, { useState } from 'react';
import './PaymentToSupplierDialog.css'; // Ensure this CSS file is created and styled as needed
import { MdAttachFile } from "react-icons/md";

function PaymentToSupplierDialog({ isOpen, onClose, supplierName, supplierId, onSave }) {
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFileName(uploadedFile.name);
    }
  };

  const handleSave = () => {
    const paymentData = {
        amount,
        details,
        date,
        supplierId,
    };

    if (onSave) {
        onSave(paymentData);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="payment-dialog-backdrop">
      <div className="payment-dialog">
        <header className="payment-dialog-header">
          <button onClick={onClose}>&lt; Back</button>
          <h2>You paid ₹ {amount} to {supplierName}</h2>
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
        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <div className='payment-lst-btn'>
          {/* <div className='filedetails'>
            <label htmlFor="file-upload" className='addAttachment'>
              <MdAttachFile />
              Attach bills
            </label>
            {fileName && <div className="file-name">{fileName}</div>}
          </div> */}
          <div className="payment-dialog-actions">
            <button className="save-button" onClick={handleSave}>SAVE</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentToSupplierDialog;
