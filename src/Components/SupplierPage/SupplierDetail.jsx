import React, { useState, useEffect } from 'react';
import './SupplierDetail.css';
import { MdCancel } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";
import PaymentToSupplierDialog from './PaymentToSupplierDialog/PaymentToSupplierDialog';
import ReceivedFromSupplierDialog from './ReceivedFromSupplierDialog/ReceivedFromSupplierDialog';
import axios from 'axios';

function SupplierDetail({ supplier, onClose }) {
  const [showPaymentToSupplierDialog, setShowPaymentToSupplierDialog] = useState(false);
  const [showReceivedFromSupplierDialog, setShowReceivedFromSupplierDialog] = useState(false);
  const [paymentsToSupplier, setPaymentsToSupplier] = useState([]);
  const [paymentsFromSupplier, setPaymentsFromSupplier] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [allPayments, setAllPayments] = useState([]);
  // useEffect(() => {
  //   const fetchPayments = async () => {
  //     try {
  //       // Fetch payments received from the supplier
  //       const receivedResponse = await axios.get(`https://banking-app-backend-se4u.onrender.com/receivedfromsupplier/${supplier._id}`);
  //       setPaymentsFromSupplier(receivedResponse.data); // Corrected function name
  
  //       // Fetch payments made to the supplier
  //       const givenResponse = await axios.get(`https://banking-app-backend-se4u.onrender.com/paymenttosupplier/${supplier._id}`);
  //       setPaymentsToSupplier(givenResponse.data); // Corrected function name
  //     } catch (error) {
  //       console.error('Error fetching payments:', error);
  //     }
  //   };
  //   fetchPayments();
  // }, [supplier._id]); // Ensure you're using the correct property here
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Fetch payments received from the supplier
        const receivedResponse = await axios.get(`https://banking-app-backend-se4u.onrender.com/receivedfromsupplier/${supplier._id}`);
        const receivedPayments = receivedResponse.data.map(payment => ({ ...payment, type: 'received' }));
  
        // Fetch payments made to the supplier
        const givenResponse = await axios.get(`https://banking-app-backend-se4u.onrender.com/paymenttosupplier/${supplier._id}`);
        const givenPayments = givenResponse.data.map(payment => ({ ...payment, type: 'given' }));
  
        // Combine and sort the payments
        const combinedPayments = [...receivedPayments, ...givenPayments];
        combinedPayments.sort((a, b) => new Date(b.date) - new Date(a.date));
        combinedPayments.reverse();

        setAllPayments(combinedPayments); // Assuming you have a state variable `allPayments`
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };
    fetchPayments();
  }, [supplier._id]);
  


  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  const openPaymentToSupplierDialog = () => setShowPaymentToSupplierDialog(true);
  const closePaymentToSupplierDialog = () => setShowPaymentToSupplierDialog(false);
  
  const openReceivedFromSupplierDialog = () => setShowReceivedFromSupplierDialog(true);
  const closeReceivedFromSupplierDialog = () => setShowReceivedFromSupplierDialog(false);

  const savePaymentToSupplier = async (paymentData) => {
    try {
      // Prepare the form data
      const formData = new FormData();
      formData.append('amount', paymentData.amount);
      formData.append('details', paymentData.details);
      formData.append('date', paymentData.date);
      formData.append('supplierId,', supplier._id); // Assuming customer ID is passed in props
     

      // Make the POST request to your server's endpoint for 'paymentgave'
      const response = await axios.post('https://banking-app-backend-se4u.onrender.com/paymenttosupplier', formData, {
          headers: {
              'Content-Type': 'application/json',
          },
      });

      console.log(response.data); // Log the response data
      closePaymentToSupplierDialog(); 
      fetchPayments();// Close the dialog
  } catch (error) {
      console.error('Error saving payment:', error);
  }
  };

  const saveReceivedPaymentFromSupplier = async (paymentData) => {
    try {
       const formData = new FormData();
       formData.append('amount', paymentData.amount);
       formData.append('details', paymentData.details);
       formData.append('date', paymentData.date);
       formData.append('supplierId', supplier._id); // Pass the customer ID
      //  if (paymentData.file) {
      //    formData.append('file', paymentData.file);
      //  }
 
       // Make the POST request
       const response = await axios.post('https://banking-app-backend-se4u.onrender.com/receivedfromsupplier', formData, {
         headers: {
           'Content-Type': 'application/json',
         },
       });
 
       console.log(response.data); // Log the response data
       closeReceivedFromSupplierDialog();
       fetchPayments();// Close the dialog
     } catch (error) {
       console.error('Error saving received payment:', error);
     }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`https://banking-app-backend-se4u.onrender.com/supplier/${supplier._id}`);
      console.log(response.data);
      onClose(); // Close the SupplierDetail component
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  return (
    <div className="supplier-detail-overlay">
      <div className="supplier-detail">
        <header className="supplier-detail-header">
          <button onClick={onClose} className="back-button"><MdCancel /></button>
          <div className="supplier-detail-name">
            <h2>{supplier.name}</h2>
            <span>Supplier</span>
          </div>
          <button className="settings-button" onClick={() => setShowDeleteDialog(true)}>Delete</button>
        </header>
        <div className='trans-history'>
        <div className='history-dashboard'>
          <h3>All Payments</h3>
          {allPayments.map((payment, index) => (
            <div key={index} className={`payment-flex-container ${payment.type}-container`}>
              <div className={`payment-history ${payment.type}-payment-history`}>
                <div className={`payment-history-amount ${payment.type}-history-amount`}>
                  <p>₹{payment.amount}</p>
                </div>
                <div className={`payment-history-dd ${payment.type}-history-dd`}>
                  <p>Type: {payment.type === 'received' ? 'Received' : 'Given'}</p>
                  <p>Details: {payment.details}</p>
                  <p>Date: {new Date(payment.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

        <div className='supplier-details-lower'>
        <div className="transactions-intro">
          <p>Only you and {supplier.name} can see these entries</p>
          <RiSecurePaymentFill />
        </div>
        <div className="transaction-buttons">
          <button className="transaction-button you-gave" onClick={openPaymentToSupplierDialog}>Send ₹</button>
          <button className="transaction-button you-got" onClick={openReceivedFromSupplierDialog}>Received ₹</button>
        </div>
        </div>
        {/* Rest of your component */}
      </div>

      {showPaymentToSupplierDialog && (
        <PaymentToSupplierDialog
          isOpen={showPaymentToSupplierDialog}
          onClose={closePaymentToSupplierDialog}
          onSave={savePaymentToSupplier}
          supplierName={supplier.name}
        />
      )}

      {showReceivedFromSupplierDialog && (
        <ReceivedFromSupplierDialog
          isOpen={showReceivedFromSupplierDialog}
          onClose={closeReceivedFromSupplierDialog}
          onSave={saveReceivedPaymentFromSupplier}
          supplierName={supplier.name}
        />
      )}

      {showDeleteDialog && (
        <DeleteConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          supplierName={supplier.name}
        />
      )}
    </div>
  );
}

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, supplierName }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-confirmation-dialog-overlay">
      <div className="delete-confirmation-dialog">
        <h2>Are you sure you want to delete {supplierName}?</h2>
        <div className="delete-confirmation-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetail;
