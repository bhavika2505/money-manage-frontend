import React, { useState, useEffect } from 'react';
import PurchaseBills from './PurchaseBill/PurchaseBill';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx";

function Purchase({ customers, suppliers }) {

  const [showPurchaseBill, setShowPurchaseBill] = useState(false);
  const [showPartyDropdown, setShowPartyDropdown] = useState(false);
  const [selectedPartyType, setSelectedPartyType] = useState('');
  const [partyList, setPartyList] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]); // State to store fetched data
  const [filteredPurchaseData, setFilteredPurchaseData] = useState([]); 
  const [monthlySalesTotal, setMonthlySalesTotal] = useState(0);
  const [todaysTotal, setTodaysTotal] = useState(0);
  const [amountRange, setAmountRange] = useState({ min: 0, max: Infinity });
  

  useEffect(() => {
    // Calculate Monthly Sales Total
    const totalPurchase = purchaseData.reduce((acc, bill) => acc + bill.amount, 0);
    setMonthlySalesTotal(totalPurchase);
  
    // Calculate Today's IN Total
    const today = new Date().setHours(0,0,0,0);
    const todaysSalesTotal = purchaseData
      .filter(bill => new Date(bill.billDate).setHours(0,0,0,0) === today)
      .reduce((acc, bill) => acc + bill.amount, 0);
    setTodaysTotal(todaysSalesTotal);
  }, [purchaseData]);

  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  });

  useEffect(() => {
    fetchPurchaseBillsByDate();
  }, [dateRange]);

  const refreshBills = () => {
    fetchPurchaseBillsByDate();
  };

  // Fetch data from the backend when the component mounts
  const fetchPurchaseBillsByDate = async () => {
    const { startDate, endDate } = dateRange;
    try {
      const response = await fetch(`https://banking-app-backend-se4u.onrender.com/api/purchase-bills-by-date?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPurchaseData(data);
    } catch (error) {
      console.error('Could not fetch purchase bills:', error);
    }
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
  const [filteredBills, setFilteredBills] = useState({ PurchaseBills: []});

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  useEffect(() => {
    fetchPurchaseBillsByDate();
  }, [dateRange]);
  
  const handleAmountRangeChange = (e, boundary) => {
    const value = e.target.value === '' ? (boundary === 'min' ? 0 : Infinity) : Number(e.target.value);
    setAmountRange(prev => ({ ...prev, [boundary]: value }));
  };
  
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filteredData = purchaseData.filter(bill =>
      (bill.billNumber.toLowerCase().includes(lowercasedSearchTerm) ||
      (bill.billTo?.name && bill.billTo.name.toLowerCase().includes(lowercasedSearchTerm))) &&
      bill.amount >= amountRange.min &&
      bill.amount <= amountRange.max
    );
    setFilteredPurchaseData(filteredData);
  }, [purchaseData, searchTerm, amountRange]);
  

  const handleAddNewParty = () => {
    console.log("Toggling party dropdown");
    setShowPartyDropdown(!showPartyDropdown);
  };

  const handlePartyTypeSelect = async (type) => {
    console.log("Selected party type:", type);
    console.log(customers, suppliers);
    setSelectedPartyType(type);
    setShowPartyDropdown(false);
    setPartyList(type === 'customers' ? customers : suppliers);
  };

  // Update your state with the new value when input changes
  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  // Handler for opening the PurchaseBill dialog
  const handleAddPurchaseBillClick = () => {
    setShowPurchaseBill(true);
  };

  // Handler for closing the PurchaseBill dialog
  const handleClosePurchaseBill = () => {
    setShowPurchaseBill(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Bill Number", "Date", "Amount", "Party Name"];
    const tableRows = [];
  
    // Determine if we should export filtered bills based on searchTerm
    const dataToExport = searchTerm ? filteredPurchaseData : purchaseData;
  
    // Make sure to handle potential undefined values
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
    doc.save(`purchase_bills_${new Date().toLocaleDateString()}.pdf`);
  };
  

  const exportExcel = () => {
    // Determine if we should export filtered bills based on searchTerm
    const dataToExport = searchTerm ? filteredPurchaseData : purchaseData;
  
    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(bill => ({
      "Bill Number": bill.billNumber,
      Date: new Date(bill.billDate).toLocaleDateString(),
      Amount: bill.amount,
      "Party Name": bill.billTo?.name
    })));
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PurchaseBills");
    const fileName = `purchase_bills_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };
  

  return (
    <div>
      <h1>Purchase</h1>
      <div className="sales-container">
    <button className="sales-item">
      <div className="sales-amount">₹0</div>
      <div className="sales-text">Monthly Sales</div>
    </button>
    <button className="sales-item">
    <div className="sales-amount">₹{monthlySalesTotal}</div>
    <div className="sales-text">Monthly Purchase</div>
    </button>
    <button className="sales-item action">
      <div className="sales-text">VIEW REPORTS</div>
    </button>
    <button className="sales-item">
      <div className="sales-amount">₹0</div>
      <div className="sales-text">Today's IN</div>
    </button>
    <button className="sales-item">
    <div className="sales-amount">₹{todaysTotal}</div>
      <div className="sales-text">Today's OUT</div>
    </button>
    <button className="sales-item action">
      <div className="sales-text">CASHBOOK</div>
    </button>
  </div>
  <div className='purchase-history'>
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
      <div className='amount-range'>
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
        {renderBills(filteredPurchaseData)}
  </div>
  </div>
  <div className="add-sale-container">
  {/* <div className="add-sale-message">
    Click here to add a Sale
    <span className="down-arrow">↓</span>
  </div> */}
  <button className="add-bill-button" onClick={handleAddPurchaseBillClick}>
        <span className="bill-icon">📃</span> ADD PURCHASE BILL
      </button>

      {showPurchaseBill && (
  <PurchaseBills 
    onClose={handleClosePurchaseBill}
    refreshBills={refreshBills} 
    customers={customers} 
    suppliers={suppliers} 
  />
)}
</div>
    </div>
  )
}

export default Purchase
