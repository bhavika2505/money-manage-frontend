import React, { useState, useEffect } from 'react';
import ExpenseBills from './ExpenseBills/ExpenseBills'
import './Expense.css'
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';


function Expense({ customers, suppliers }){
  const [showExpenseBills, setShowExpenseBills] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allExpenseBills, setAllExpenseBills] = useState([]);
  const [selectedExpenseBills, setSelectedExpenseBills] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [billNumberSearch, setBillNumberSearch] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [monthlyExpenditure, setMonthlyExpenditure] = useState(0);
  const [todaysExpenditure, setTodaysExpenditure] = useState(0);


  useEffect(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    // const today = now.toISOString().split('T')[0];
  
    const monthlyExpenses = allExpenseBills.filter(bill => {
      const billDate = new Date(bill.date);
      return billDate >= startOfMonth && billDate <= endOfMonth;
    });
  
    // const todaysExpenses = allExpenseBills.filter(bill => {
    //   return bill.date === today;
    // });
  
    const monthlyTotal = monthlyExpenses.reduce((acc, bill) => acc + parseFloat(bill.amount), 0);
    // const todaysTotal = todaysExpenses.reduce((acc, bill) => acc + parseFloat(bill.amount), 0);
  
    setMonthlyExpenditure(monthlyTotal);
    // setTodaysExpenditure(todaysTotal);
  }, [allExpenseBills]);
 
  useEffect(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0); // Set to the start of today in local time
  
    const endOfToday = new Date();
    endOfToday.setHours(23,59,59,999); // Set to the end of today in local time
  
    const todaysTotal = allExpenseBills.reduce((acc, bill) => {
      const billDate = new Date(bill.date); // Assume bill.date is in a valid date format
      if (billDate >= startOfToday && billDate <= endOfToday) {
        return acc + parseFloat(bill.amount || 0);
      }
      return acc;
    }, 0);
  
    setTodaysExpenditure(todaysTotal);
  }, [allExpenseBills]);
  
  
  


  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://banking-app-backend-se4u.onrender.com/api/categories');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categoriesData = await response.json();
        setCategories(categoriesData);
        setFilteredCategories(categoriesData); 
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Fetch all expense bills
    const fetchExpenseBills = async () => {
      try {
        const response = await fetch('https://banking-app-backend-se4u.onrender.com/api/expensebills');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const expenseBillsData = await response.json();
        setAllExpenseBills(expenseBillsData);
        setSelectedExpenseBills(expenseBillsData); // Display all bills initiall
      } catch (error) {
        console.error('Error fetching expense bills:', error);
      }
    };

    fetchCategories();
    fetchExpenseBills();
  }, []);



  const handleCategoryClick = categoryId => {
  
    // Filter the expense bills to show only those that belong to the selected category
    const filteredBills = allExpenseBills.filter(bill => bill.category === categoryId);
  
    console.log(`Filtered Bills:`, filteredBills);
    setSelectedExpenseBills(filteredBills);
  };
  


  const handleAddExpenseBillClick = () => {
    setShowExpenseBills(true);
  };

  const handleCloseExpenseBills = () => {
    setShowExpenseBills(false);
  };


    const addNewExpenseBill = (newBill) => {
    setAllExpenseBills(prevBills => [...prevBills, newBill]);
    setSelectedExpenseBills(prevBills => [...prevBills, newBill]);
  };

  const handleCategorySearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setCategorySearch(searchValue);
    
    if (searchValue) {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchValue)
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories); // Reset filtered categories back to the full list
    }
  };
  
  
  
  const handleBillNumberSearchChange = (e) => {
  const searchValue = e.target.value.toLowerCase();
  setBillNumberSearch(searchValue);

  if (searchValue) {
    const filteredBills = allExpenseBills.filter(bill =>
      bill.expenseNumber.toLowerCase().includes(searchValue)
    );
    setSelectedExpenseBills(filteredBills);
  } else {
    // If the search value is empty, reset to show all bills
    setSelectedExpenseBills(allExpenseBills);
  }
};

const applyFilters = () => {
  let filtered = allExpenseBills;

  // Filter by date range
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    filtered = filtered.filter(bill => {
      const billDate = new Date(bill.date);
      return billDate >= start && billDate <= end;
    });
  }

  // Filter by amount range
  if (minAmount || maxAmount) {
    filtered = filtered.filter(bill => {
      const amount = parseFloat(bill.amount);
      const min = parseFloat(minAmount);
      const max = parseFloat(maxAmount);
      return (!minAmount || amount >= min) && (!maxAmount || amount <= max);
    });
  }

  setSelectedExpenseBills(filtered);
};

// ... other handlers ...

// Handlers for date and amount range inputs
const handleStartDateChange = (e) => {
  setStartDate(e.target.value);
  applyFilters();
};

const handleEndDateChange = (e) => {
  setEndDate(e.target.value);
  applyFilters();
};

const handleMinAmountChange = (e) => {
  setMinAmount(e.target.value);
  applyFilters();
};

const handleMaxAmountChange = (e) => {
  setMaxAmount(e.target.value);
  applyFilters();
};
  
useEffect(() => {
  applyFilters();
}, [startDate, endDate, minAmount, maxAmount]);

const clearFilters = () => {
  // Reset all filter-related state
  setCategorySearch('');
  setBillNumberSearch('');
  setStartDate('');
  setEndDate('');
  setMinAmount('');
  setMaxAmount('');
  
  // Now reset the displayed bills to all bills
  setSelectedExpenseBills(allExpenseBills);
};

const enrichBillsWithCategoryNames = () => {
  return selectedExpenseBills.map(bill => {
    const category = categories.find(cat => cat._id === bill.category);
    return {
      ...bill,
      category: category ? category.name : 'Unknown' // Replace 'Unknown' with a default value if needed
    };
  });
};

const downloadPDF = () => {
  const enrichedBills = enrichBillsWithCategoryNames();
  const doc = new jsPDF();
  
  enrichedBills.forEach((bill, index) => {
    doc.text(20, 10 + (index * 10), `Expense Number: ${bill.expenseNumber}, Category: ${bill.category}, Amount: ${bill.amount}`);
    // Add more details as needed and manage the layout accordingly
  });

  doc.save('expense-bills.pdf');
};

const downloadExcel = () => {
  const enrichedBills = enrichBillsWithCategoryNames();
  const worksheet = XLSX.utils.json_to_sheet(enrichedBills.map(bill => {
    // Exclude the _id from the bill data
    const { _id, ...billWithoutId } = bill;
    return billWithoutId;
  }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'ExpenseBills');
  XLSX.writeFile(workbook, 'expense-bills.xlsx');
};




  return (
    <div>
       <h1>Expense</h1>
       <div className="sales-container">
      <div className="sales-item">
        <div className="sales-amount">₹{monthlyExpenditure}</div>
        <div className="sales-text">Monthly Expenditure</div>
      </div>

    <button className="sales-item">
      <div className="sales-amount">₹0</div>
      <div className="sales-text">Monthly Purchases</div>
    </button>
    <button className="sales-item action">
      <div className="sales-text">VIEW REPORTS</div>
    </button>
    <div className="sales-item">
    <div className="sales-amount">₹{todaysExpenditure}</div>
    <div className="sales-text">Today's Expenditure</div>
  </div>
    <button className="sales-item">
      <div className="sales-amount">₹0</div>
      <div className="sales-text">Today's OUT</div>
    </button>
    <button className="sales-item action">
      <div className="sales-text">CASHBOOK</div>
    </button>
  </div>
  <div className='search-bars'>
  <input
    type="text"
    value={categorySearch}
    onChange={handleCategorySearchChange}
    placeholder="Search by category"
  />

<input
    type="date"
    value={startDate}
    onChange={handleStartDateChange}
    placeholder="Start Date"
  />
  <input
    type="date"
    value={endDate}
    onChange={handleEndDateChange}
    placeholder="End Date"
  />
  <input
    type="number"
    value={minAmount}
    onChange={handleMinAmountChange}
    placeholder="Min Amount"
  />
  <input
    type="number"
    value={maxAmount}
    onChange={handleMaxAmountChange}
    placeholder="Max Amount"
  />
    <input
          type="text"
          value={billNumberSearch}
          onChange={handleBillNumberSearchChange}
          placeholder="Search by bill number"
    /> 
  <button onClick={clearFilters} className="clear-filters-button">
      Clear Filters
    </button>
</div>

<div className='download-buttons'>
        <button onClick={downloadPDF}>Download as PDF</button>
        <button onClick={downloadExcel}>Download as Excel</button>
      </div>

 

  <div className='expense-bills'>
  <div className='Expense-history'>
         {filteredCategories.map((category, index) => (
    <div 
      key={index} 
      className="category-item" // Add some CSS class for styling
      onClick={() => handleCategoryClick(category._id)}
    >
      {category.name}
    </div>
  ))}
      </div>

      {/* Display selected expense bills */}
      <div className='Selected-expense-bills'>
   
        {selectedExpenseBills.length > 0 ? (
          selectedExpenseBills.map((bill, index) => (
            <div key={index} className="bill-item"> {/* Add CSS class for styling */}
              {/* Render bill details here */}
              <p>Expense Number:{bill.expenseNumber}</p>
              <p>Expense Amount: {bill.amount} </p>
              <p>Item: {bill.items} </p>
              <p>Date: {new Date(bill.date).toLocaleDateString()}</p>
              {/* Add more bill details as needed */}
            </div>
          ))
        ) : (
          <p>Select a category to view expense bills.</p>
        )}
      </div>

      {showExpenseBills && (
  <ExpenseBills onClose={handleCloseExpenseBills} onNewExpenseBill={addNewExpenseBill} />
)}

  <div className="add-sale-container">
  {/* <div className="add-sale-message">
    Click here to add a Sale
    <span className="down-arrow">↓</span>
  </div> */}
  <button className="add-bill-button" onClick={handleAddExpenseBillClick}>
        <span className="bill-icon">📃</span> ADD EXPENSE BILL
      </button>

      {showExpenseBills && (
        <ExpenseBills onClose={handleCloseExpenseBills} />
      )}

</div>
    </div>
    </div>
  )
}

export default Expense
