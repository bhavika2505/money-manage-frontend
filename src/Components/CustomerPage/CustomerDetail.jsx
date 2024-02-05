// CustomerDetail.jsx
import React, { useState, useEffect } from 'react';
import './CustomerDetail.css'; // Make sure to create this CSS file and style as needed
import { MdCancel } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";
import PaymentDialog from './PaymentDialog/PaymentDialog';
import ReceivedPaymentDialog from './ReceivedPaymentDialog/ReceivedPaymentDialog';
import axios from 'axios'; 

function CustomerDetail({ customer, onClose }) {
  // You can add more data to display as needed
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceivedDialog, setShowReceivedDialog] = useState(false);
  const [receivedPayments, setReceivedPayments] = useState([]);
  const [givenPayments, setGivenPayments] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [allPayments, setAllPayments] = useState([]);

const handleOpenDeleteDialog = () => setShowDeleteDialog(true);
const handleCloseDeleteDialog = () => setShowDeleteDialog(false);

  const openPaymentDialog = () => {
    setShowPaymentDialog(true); // This should open the PaymentDialog
  };

  const closePaymentDialog = () => {
    setShowPaymentDialog(false); // This should close the PaymentDialog
  };

  const openReceivedDialog = () => setShowReceivedDialog(true); // Function to open "You Got" dialog
  const closeReceivedDialog = () => setShowReceivedDialog(false);

  const savePaymentGave = async (paymentData) => {
    try {
        // Prepare the form data
        const formData = new FormData();
        formData.append('amount', paymentData.amount);
        formData.append('details', paymentData.details);
        formData.append('date', paymentData.date);
        formData.append('customerId', customer._id); // Assuming customer ID is passed in props
       

        // Make the POST request to your server's endpoint for 'paymentgave'
        const response = await axios.post('https://banking-app-backend-se4u.onrender.com/paymentgave', formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(response.data); // Log the response data
        closePaymentDialog(); // Close the dialog
    } catch (error) {
        console.error('Error saving payment:', error);
    }
};

  const saveReceivedPayment = async (paymentData) => {
    try {
      // Prepare the form data
      const formData = new FormData();
      formData.append('amount', paymentData.amount);
      formData.append('details', paymentData.details);
      formData.append('date', paymentData.date);
      formData.append('customerId', customer._id); // Pass the customer ID
      if (paymentData.file) {
        formData.append('file', paymentData.file);
      }

      // Make the POST request
      const response = await axios.post('https://banking-app-backend-se4u.onrender.com/receivedpayment', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data); // Log the response data
      closeReceivedDialog(); // Close the dialog
    } catch (error) {
      console.error('Error saving received payment:', error);
    }
  };

  // useEffect(() => {
  //   const fetchPayments = async () => {
  //       try {
  //           // Fetch received payments
  //           const receivedResponse = await axios.get(`https://banking-app-backend-se4u.onrender.com/receivedpayments/${customer._id}`);
  //           const sortedReceivedPayments = receivedResponse.data.sort((a, b) => new Date(b.date) - new Date(a.date));
  //           setReceivedPayments(sortedReceivedPayments);

  //           // Fetch given payments
  //           const givenResponse = await axios.get(`https://banking-app-backend-se4u.onrender.com/paymentgave/${customer._id}`);
  //           setGivenPayments(givenResponse.data);
  //       } catch (error) {
  //           console.error('Error fetching payments:', error);
  //       }
  //   };
  //   fetchPayments();
  // }, [customer._id]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const receivedResponse = await axios.get(`https://banking-app-backend-se4u.onrender.com/receivedpayments/${customer._id}`);
        const givenResponse = await axios.get(`https://banking-app-backend-se4u.onrender.com/paymentgave/${customer._id}`);

        const receivedWithTypes = receivedResponse.data.map(payment => ({ ...payment, type: 'received' }));
        const givenWithTypes = givenResponse.data.map(payment => ({ ...payment, type: 'given' }));

        const combinedPayments = [...receivedWithTypes, ...givenWithTypes];
        combinedPayments.sort((a, b) => new Date(b.date) - new Date(a.date));
        combinedPayments.reverse();

        setAllPayments(combinedPayments);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };
    fetchPayments();
  }, [customer._id]);


  const handleDelete = async () => {
    try {
      const response = await axios.delete(`https://banking-app-backend-se4u.onrender.com/customer/${customer._id}`);
      console.log(response.data);
  
      // Close the dialog box
      onClose(); // Replace with your method to close the dialog
  
      // Update the customer list UI
      // Assuming you have a state variable `customers` that holds the list of customers
      setCustomers(customers.filter(cust => cust._id !== customer._id));
  
      // Optionally, you might want to navigate away or refresh the component where the list is displayed
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };
  
  const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, customerName }) => {
    if (!isOpen) return null;
  
    return (
      <div className="delete-confirmation-dialog">
        <h2>Are you sure you want to delete {customerName}?</h2>
        <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm}>Yes</button>
      </div>
    );
  };
  
  

  return (
    <div className="customer-detail">
      <header className="customer-detail-header">
        <button onClick={onClose} className="back-button"><MdCancel /></button>
        <div className="customer-detail-name">
          <h2>{customer.name}</h2>
          <span>Customer</span> {/* This can be dynamic if you have different types */}
        </div>
        <button className="settings-button" onClick={handleOpenDeleteDialog}>Delete</button>
      </header>

 <div className='trsns-history'>
      <div className='history-dashboard'>
        <h3>All Payments</h3>
        {allPayments.map((payment, index) => (
          <div key={index} className={`payment-flex-container ${payment.type}-container`}>
            <div className={`payment-history ${payment.type}-payment-history`}>
              <div className={`payment-history-amount ${payment.type}-history-amount`}>
                <p>₹{payment.amount}</p>
              </div>
              <div className={`payment-history-dd ${payment.type}-history-dd`}>
                <p>Type: {payment.type}</p>
                <p>Details: {payment.details}</p>
                <p>Date: {new Date(payment.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
        customerName={customer.name}
      />

      <div className="transactions-intro">
        <p>Only you and {customer.name} can see these entries</p>
        <RiSecurePaymentFill />
      </div>

      <div className="transaction-buttons">
        <button className="transaction-button you-gave" onClick={openPaymentDialog}>Send ₹</button>
        <button className="transaction-button you-got" onClick={openReceivedDialog}>Received ₹</button>
      </div>

      {showPaymentDialog && (
        <PaymentDialog 
          isOpen={showPaymentDialog}
          onClose={closePaymentDialog}
          customerName={customer.name}
          onSave={savePaymentGave} 
        />
      )}

      {showReceivedDialog && (
        <ReceivedPaymentDialog
          isOpen={showReceivedDialog}
          onClose={closeReceivedDialog}
          customerName={customer.name}
          onSave={saveReceivedPayment}
        />
      )}
      {/* If you have transactions to display, map over them here */}
    </div>
  );
}

export default CustomerDetail;
