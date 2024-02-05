import React, { useState, useEffect } from 'react';
import './Sales.css'; // Make sure to create a Sales.css file for styling
import GstBills from './GstBills/GstBills';
import SalesBills from './SalesBills/SalesBills';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx";

function Sales({ customers, suppliers }) {
  const [showGstDialog, setShowGstDialog] = useState(false);
  const [showGstBillsDialog, setShowGstBillsDialog] = useState(false);
  const [showSalesBillsDialog, setShowSalesBillsDialog] = useState(false);
  const [bills, setBills] = useState({ salesBills: [], gstBills: [] });
  const [monthlySalesTotal, setMonthlySalesTotal] = useState(0);
  const [todaysTotal, setTodaysTotal] = useState(0);
  const [showOnlyGstData, setShowOnlyGstData] = useState(false);
  const [amountRange, setAmountRange] = useState({ min: 0, max: Infinity });
  // ... existing useEffect for fetchBillsByDate

  useEffect(() => {
    // Calculate Monthly Sales Total
    const totalSales = bills.salesBills.reduce((acc, bill) => acc + bill.amount, 0);
    const totalGst = bills.gstBills.reduce((acc, bill) => acc + bill.amount, 0);
    setMonthlySalesTotal(totalSales + totalGst);

    // Calculate Today's IN Total
    const today = new Date().setHours(0,0,0,0);
    const todaysSalesTotal = bills.salesBills
      .filter(bill => new Date(bill.billDate).setHours(0,0,0,0) === today)
      .reduce((acc, bill) => acc + bill.amount, 0);
    const todaysGstTotal = bills.gstBills
      .filter(bill => new Date(bill.billDate).setHours(0,0,0,0) === today)
      .reduce((acc, bill) => acc + bill.amount, 0);
    setTodaysTotal(todaysSalesTotal + todaysGstTotal);
  }, [bills]);

  
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  });

  useEffect(() => {
    fetchBillsByDate();
  }, [dateRange]);

  const fetchBillsByDate = async () => {
    const { startDate, endDate } = dateRange;
    try {
      const response = await fetch(`https://banking-app-backend-se4u.onrender.com/api/bills-by-date?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error('Could not fetch bills:', error);
    }
  };

  const refreshBills = () => {
    fetchBillsByDate();
  };

const renderBills = (billArray) =>

  billArray.map((bill, index) => (
    <div key={index} style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 15px',
      backgroundColor: '#afbebe',
      marginBottom: '10px',
    }}>
      <p><strong>Bill Number:</strong> {bill.billNumber}</p>
      <p><strong>Date:</strong> {new Date(bill.billDate).toLocaleDateString()}</p>
      <p><strong>Amount:</strong> {bill.amount}</p>
      <p><strong>Party Name:</strong> {bill.billTo?.name}</p>
    </div>
  ));




    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBills, setFilteredBills] = useState({ salesBills: [], gstBills: [] });
  
    useEffect(() => {
      fetchBillsByDate();
    }, [dateRange]);

    const handleAmountRangeChange = (e, boundary) => {
      setAmountRange(prev => ({
        ...prev, 
        [boundary]: e.target.value ? Number(e.target.value) : (boundary === 'min' ? 0 : Infinity)
      }));
    };

    useEffect(() => {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filterBills = billArray => billArray.filter(bill => {
        const searchTermMatch = bill.billNumber.toLowerCase().includes(lowercasedSearchTerm) ||
          (bill.billTo?.name && bill.billTo.name.toLowerCase().includes(lowercasedSearchTerm));
        const amountMatch = bill.amount >= amountRange.min && bill.amount <= amountRange.max;
        return searchTermMatch && amountMatch;
      });
    
      setFilteredBills({
        salesBills: filterBills(bills.salesBills),
        gstBills: filterBills(bills.gstBills)
      });
    }, [bills, searchTerm, amountRange]);
    
    
    

    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };
  

  const handleAddSaleClick = () => {
    setShowGstDialog(true);
  };

  const handleCloseDialog = () => {
    setShowGstDialog(false);
  };




  const handleYesClick = () => {
    setShowGstDialog(false); // Close the GST dialog
    setShowGstBillsDialog(true); // Open the GST Bills dialog
  };

  const handleCloseGstBills = () => {
    setShowGstBillsDialog(false);
  };


  const handleNoClick = () => {
    setShowGstDialog(false);
    setShowSalesBillsDialog(true);
  };

  const handleCloseSalesBills = () => {
    setShowSalesBillsDialog(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Bill Number", "Date", "Amount", "Party Name"];
    const tableRows = [];
  
    // Use searchTerm to determine if we should export filtered or all bills
    const dataToExport = searchTerm ? [...filteredBills.salesBills, ...filteredBills.gstBills] : [...bills.salesBills, ...bills.gstBills];
  
    dataToExport.forEach(bill => {
      const billData = [
        bill.billNumber,
        new Date(bill.billDate).toLocaleDateString(),
        bill.amount.toString(),
        bill.billTo?.name || "" // Handle undefined names
      ];
      tableRows.push(billData);
    });
  
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save(`sales_bills_${new Date().toLocaleDateString()}.pdf`);
  };
  

  const exportExcel = () => {
    // Use searchTerm to determine if we should export filtered or all bills
    const dataToExport = searchTerm
      ? [...filteredBills.salesBills, ...filteredBills.gstBills]
      : [...bills.salesBills, ...bills.gstBills];
  
    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(bill => ({
      "Bill Number": bill.billNumber,
      Date: new Date(bill.billDate).toLocaleDateString(),
      Amount: bill.amount,
      "Party Name": bill.billTo?.name
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SalesBills");
    // Generate file name with date to ensure uniqueness
    const fileName = `sales_bills_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };
  
  


  return (
    <>
    <h1>Sales</h1>
    <div className="sales-container">
    <div className="sales-item">
      <div className="sales-amount">₹{monthlySalesTotal}</div>
      <div className="sales-text">Monthly Sales</div>
    </div>
    <button className="sales-item">
      <div className="sales-amount">₹0</div>
      <div className="sales-text">Monthly Purchases</div>
    </button>
    <button className="sales-item action">
      <div className="sales-text">VIEW REPORTS</div>
    </button>
    <div className="sales-item">
      <div className="sales-amount">₹{todaysTotal}</div>
      <div className="sales-text">Today's IN</div>
    </div>
    <button className="sales-item">
      <div className="sales-amount">₹0</div>
      <div className="sales-text">Today's OUT</div>
    </button>
    <button className="sales-item action">
      <div className="sales-text">CASHBOOK</div>
    </button>
  </div>
   {/* Search bar */}
  
   
  <div className='sales-history'>
      {/* Include inputs to change the date range */}
      <div className='sales-top'>
      <div>
        <label>from:</label>
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
        />
        <label>To:</label>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
        />
      </div>
      <div className='amount-range-filters'>
        <input
          type="number"
          placeholder="Min Amount"
          value={amountRange.min || ''}
          onChange={(e) => handleAmountRangeChange(e, 'min')}
        />
        <input
          type="number"
          placeholder="Max Amount"
          value={amountRange.max === Infinity ? '' : amountRange.max}
          onChange={(e) => handleAmountRangeChange(e, 'max')}
        />
      </div>
      <div className='searchbar'>
   <input

        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      </div>
      </div>
      <div className='download'>
      <button onClick={exportPDF}>Download PDF</button>
      <button onClick={exportExcel}>Download Excel</button>
      </div>
      <div>
      <h1>Bills</h1>

        <h2>Sales Bills</h2>
        {renderBills(filteredBills.salesBills)}
        <h2>GST Bills</h2>
        {renderBills(filteredBills.gstBills)}
      </div>
      {/* <button onClick={onClose}>Close</button> */}
    
      </div>
  <div className="add-sale-container">
  {/* <div className="add-sale-message">
    Click here to add a Sale
    <span className="down-arrow">↓</span> 
  </div> */}
  <button className="add-bill-button" onClick={handleAddSaleClick}>
        <span className="bill-icon">📃</span> ADD SALE BILL
      </button>

      {showGstDialog && (
        <div className="dialog-overlay" onClick={handleCloseDialog}>
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <h2>Is your business GST registered?</h2>
            <p>Click on Yes to enable GST invoice and Reports</p>
            <div className="dialog-actions">
              <button onClick={handleYesClick}>YES</button>
              <button onClick={handleNoClick}>NO</button>
            </div>
            <div className="dialog-footer">
              <span>Create GST Invoices</span>
              <span>Create Simple Bills</span>
            </div>
          </div>
        </div>
      )}
     {showGstBillsDialog && (
  <GstBills 
    onClose={handleCloseGstBills} 
    refreshBills={refreshBills} 
    customers={customers} 
    suppliers={suppliers} 
  />
)}

{showSalesBillsDialog && (
  <SalesBills 
    onClose={handleCloseSalesBills} 
    refreshBills={refreshBills} 
    customers={customers} 
    suppliers={suppliers} 
  />
)}

</div>

  </>
  );
}

export default Sales;
