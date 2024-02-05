import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerDialog from './CustomerDialog';
import CustomerDetail from './CustomerDetail';
import './CustomerPage.css';

function CustomerPage() {

  const [dialogOpen, setDialogOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentDifference, setPaymentDifference] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [totalPaymentsGiven, setTotalPaymentsGiven] = useState(0);

  useEffect(() => {
    const fetchTotalReceivedPayments = async () => {
      try {
        const response = await axios.get('https://banking-app-backend-se4u.onrender.com/receivedpayment');
        const payments = response.data;
    
        // Calculate the total amount
        const totalAmount = payments.reduce((acc, payment) => acc + payment.amount, 0);
        setTotalReceived(totalAmount);
      } catch (error) {
        console.error('Error fetching total received payments:', error.response?.data || error.message);
      }
    };
  
    fetchTotalReceivedPayments();
  }, []);

  
  useEffect(() => {
    const fetchPaymentsGiven = async () => {
      try {
        const response = await axios.get('https://banking-app-backend-se4u.onrender.com/paymentgave');
        const payments = response.data;
  
        // Calculate the total amount
        const totalAmount = payments.reduce((acc, payment) => acc + payment.amount, 0);
        setTotalPaymentsGiven(totalAmount);
      } catch (error) {
        console.error('Error fetching payments given:', error.response?.data || error.message);
      }
    };
  
    fetchPaymentsGiven();
  }, []);
   

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Ensure the endpoint matches the route defined in your server
        const response = await axios.get('https://banking-app-backend-se4u.onrender.com/customer'); // Note: '/customers' instead of '/customer'
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
  
    fetchCustomers();
  }, []);

  useEffect(() => {
    setPaymentDifference(totalReceived - totalPaymentsGiven);
  }, [totalReceived, totalPaymentsGiven]);

  
  const handleSelectCustomer = (customer) => {
    console.log(customer); // Add this line to log the selected customer
    setSelectedCustomer(customer);
  };
  

  const handleCloseDetail = () => {
    setSelectedCustomer(null);
  };
  

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };


  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAddCustomer = (customer) => {
    setCustomers([...customers, customer]);
  };

  

  return (
    <div>
      <h2>Customer page</h2>
      <div className="financial-summary">
        <div className="amount-due">
          <span className="amount-title">You will give</span>
          <span className={`amount ${paymentDifference < 0 ? 'amount-negative' : ''}`}>
          ₹{paymentDifference < 0 ? -paymentDifference : 0}
        </span>
        </div>
        <div className="amount-due">
          <span className="amount-title">You will get</span>
          <span className={`amount ${paymentDifference > 0 ? 'amount-positive' : ''}`}>₹{paymentDifference > 0 ? paymentDifference : 0}</span>
        </div>
            <button className="view-report-btn">VIEW REPORT</button>
          </div>
          <div className="dashboard">
        <button className="add-customer-btn" onClick={handleOpenDialog}>ADD CUSTOMER</button>
        {customers.map((customer, index) => (
          <div key={index} className='customerData'>
            <h4>{customer.name}</h4>
            {/* Un-comment the line below if you want to show the number as well */}
            {/* <p>{customer.number}</p> */}
            <button className="detail-btn" onClick={() => handleSelectCustomer(customer)}>Details</button>
          </div>
        ))}
       {selectedCustomer && (
          <div className="customer-detail-overlay">
            <CustomerDetail customer={selectedCustomer} onClose={handleCloseDetail} />
          </div>
        )}
        <CustomerDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onAddCustomer={handleAddCustomer}
        />
      </div>
    </div>
  );
}

export default CustomerPage;