// PaymentDialog.jsx
import React, { useState } from 'react';
import './PaymentDialog.css'; // Make sure to create this CSS file and style as needed
import { MdAttachFile } from "react-icons/md";

function PaymentDialog({ isOpen, onClose, customerName, customerId, onSave }) {
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFileName(uploadedFile.name); // Set the file name when file is selected
    }
  };

  const handleSave = () => {
    const paymentData = {
        amount,
        details,
        date,
        customerId,
    };

    if (onSave) {
        onSave(paymentData); // Call the onSave function passed as a prop
    }

    onClose(); // Close the dialog after saving
};

  if (!isOpen) return null; // Make sure to use the `isOpen` prop to control visibility

  return (
    <div className="payment-dialog-backdrop">
      <div className="payment-dialog">
        <header className="payment-dialog-header">
          <button onClick={onClose}>&lt; Back</button>
          <h2>You gave ₹ {amount} to {customerName}</h2>
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
          style={{ display: 'none' }} // Hide the default input
          id="file-upload" // Reference for the label
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

export default PaymentDialog;
