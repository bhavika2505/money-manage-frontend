import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SupplierPage.css';
import SupplierDialog from './SupplierDialog'; // Ensure this is the correct import path
import SupplierDetail from './SupplierDetail'; // Ensure this is the correct import path

function SupplierPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]); // Renamed for consistency
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [totalReceived, setTotalReceived] = useState(0);
  const [totalPaidToSuppliers, setTotalPaidToSuppliers] = useState(0);
const [paymentDifference, setPaymentDifference] = useState(0);

useEffect(() => {
  const fetchTotals = async () => {
      try {
          const responseReceived = await axios.get('https://banking-app-backend-se4u.onrender.com/totalreceivedfromsupplier');
          const totalReceived = responseReceived.data.totalReceived;
          setTotalReceived(totalReceived);

          const responsePaid = await axios.get('https://banking-app-backend-se4u.onrender.com/totalpaidtosupplier');
          const totalPaid = responsePaid.data.totalPaid;
          setTotalPaidToSuppliers(totalPaid);

          // Calculate the difference
          const difference = totalReceived - totalPaid;
          setPaymentDifference(difference);
      } catch (error) {
          console.error('Error fetching totals:', error);
      }
  };

  fetchTotals();
}, []);

  useEffect(() => {
    const fetchTotalReceivedFromSuppliers = async () => {
        try {
            const response = await axios.get('https://banking-app-backend-se4u.onrender.com/totalreceivedfromsupplier');
            console.log('Total received from suppliers:', response.data.totalReceived);
            // You can now set this value in your state or use it as needed
        } catch (error) {
            console.error('Error fetching total received from suppliers:', error);
        }
    };

    fetchTotalReceivedFromSuppliers();
}, []);

useEffect(() => {
  const fetchTotalPaidToSuppliers = async () => {
      try {
          const response = await axios.get('https://banking-app-backend-se4u.onrender.com/totalpaidtosupplier');
          console.log('Total paid to suppliers:', response.data.totalPaid);
          // You can now set this value in your state or use it as needed
      } catch (error) {
          console.error('Error fetching total paid to suppliers:', error);
      }
  };

  fetchTotalPaidToSuppliers();
}, []);



  
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('https://banking-app-backend-se4u.onrender.com/supplier');
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleSelectSupplier = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleCloseDetail = () => {
    setSelectedSupplier(null);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddSupplier = (newSupplier) => {
    setSuppliers([...suppliers, newSupplier]);
  };

  return (
    <div>
      <h2>Supplier Page</h2>
      <div className="financial-summary">
      <div className="amount-due">
        <span className="amount-title">You will give</span>
        <span className={`amount ${paymentDifference < 0 ? 'amount-negative' : ''}`}>₹{paymentDifference < 0 ? -paymentDifference : 0}</span>
      </div>
      <div className="amount-due">
        <span className="amount-title">You will get</span>
        <span className={`amount ${paymentDifference > 0 ? 'amount-positive' : ''}`}>₹{paymentDifference > 0 ? paymentDifference : 0}</span>
      </div>
      <button className="view-report-btn">VIEW REPORT</button>
    </div>
      <div className="dashboard">
        <button className="add-customer-btn" onClick={handleOpenDialog}>
          ADD SUPPLIER
        </button>
        {suppliers.map((supplier, index) => (
          <div key={index} className='supplierData'>
            <h4>{supplier.name}</h4>
            <button className="detail-btn" onClick={() => handleSelectSupplier(supplier)}>
              Details
            </button>
          </div>
        ))}
      </div>

      <SupplierDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onAddSupplier={handleAddSupplier}
      />

      {selectedSupplier && (
        <SupplierDetail 
          supplier={selectedSupplier}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}

export default SupplierPage;
