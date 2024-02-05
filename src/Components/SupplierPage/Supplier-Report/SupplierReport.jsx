import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import './SupplierReport.css';
import axios from 'axios';

function SupplierReport() {
  const [totalReceived, setTotalReceived] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    // Dynamic Data Fetching for Financial Summary
    const fetchFinancialData = async () => {
      try {
        const receivedResponse = await axios.get('https://banking-app-backend-se4u.onrender.com/api/totalreceived');
        const paidResponse = await axios.get('https://banking-app-backend-se4u.onrender.com/api/totalpaid');
        setTotalReceived(receivedResponse.data.total);
        setTotalPaid(paidResponse.data.total);
      } catch (error) {
        console.error('Error fetching financial data:', error);
      }
    };

    // Dynamic Data Fetching for Supplier List
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('https://banking-app-backend-se4u.onrender.com/api/suppliers');
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };
    // Log to check the actual values

    fetchFinancialData();
    fetchSuppliers();
  }, []);

  // Adding a new supplier (example function, implementation would require a form submission)
  const addSupplier = async (newSupplier) => {
    try {
      await axios.post('https://banking-app-backend-se4u.onrender.com/api/suppliers', newSupplier);
      setSuppliers([...suppliers, newSupplier]);
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  // Financial Summary Component
  const FinancialSummary = () => (
    <div>
      <h2>Financial Summary</h2>
      <p>Total Received: {totalReceived}</p>
      <p>Total Paid: {totalPaid}</p>
      <p>Payment Difference: {totalReceived - totalPaid}</p>
    </div>
  );

  // Supplier List Component
  const SupplierList = () => (
    <div>
      <h2>Suppliers</h2>
      {suppliers.map(supplier => (
        <div key={supplier.id}>
          <span>{supplier.name}</span>
          {/* More supplier details can be shown here */}

        </div>
      ))}
    </div>
  );

  console.log(totalReceived, totalPaid); 
  // Example of preparing data for a pie chart
const supplierNames = suppliers.map(supplier => supplier.name);
const supplierData = suppliers.map(supplier => supplier.paymentCount); // Assuming you have paymentCount or similar data


// Data for a bar chart
const pieChartData = {
  labels: ['Total Received', 'Total Paid', 'Payment Difference'],
  datasets: [{
    data: [totalReceived, totalPaid, totalReceived - totalPaid],
    backgroundColor: [
      'rgba(54, 162, 235, 0.6)', // color for total received
      'rgba(255, 99, 132, 0.6)', // color for total paid
      'rgba(75, 192, 192, 0.6)'  // color for payment difference
    ],
    borderWidth: 1,
  }]
};


return (
    <div>
      <FinancialSummary />
      <SupplierList />
      <SupplierList />
      <div className="chart-container">
        <Pie data={pieChartData} />
      </div>
    </div>
  );
  
}

export default SupplierReport;
