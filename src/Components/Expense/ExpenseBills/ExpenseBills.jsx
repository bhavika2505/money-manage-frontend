import React, { useState, useEffect } from 'react';
import './ExpenseBills.css';

function ExpenseBills({ onClose, onNewExpenseBill }) {
  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [expenseNumber, setExpenseNumber] = useState('');
  const [date, setDate] = useState('');
  const [items, setItems] = useState(['']); // Initialize items as an array with an empty string
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://banking-app-backend-se4u.onrender.com/categories');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setShowAddCategory(true);
  };

  const handleSaveCategory = async () => {
    if (newCategory) {
      try {
        const response = await fetch('https://banking-app-backend-se4u.onrender.com/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCategory }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newCategoryObject = await response.json();
        setCategories([...categories, newCategoryObject]);
        setNewCategory('');
      } catch (error) {
        console.error('Could not create category:', error);
      }
    }
    setShowAddCategory(false);
  };

  const handleCancelAddCategory = () => {
    setNewCategory('');
    setShowAddCategory(false);
  };


const handleSubmit = async (event) => {
event.preventDefault();
const newExpenseBill = {
expenseNumber,
date,
items,
amount: parseFloat(amount),
categoryId: category
};

console.log('Submitting expense bill:', newExpenseBill); // Debug: Log the bill being submitted

try {
const response = await fetch('https://banking-app-backend-se4u.onrender.com/api/expensebills', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(newExpenseBill)
});


if (!response.ok) {
  const errorData = await response.text(); // Or response.json() if response is in JSON format
  console.error('Error response:', errorData); // Debug: Log the error response data
  throw new Error(`HTTP error! status: ${response.status}`);
}

const result = await response.json();
console.log('Expense bill created:', result); // Debug: Log the successful result
// onNewExpenseBill(result);
onClose();
} catch (error) {
console.error('Could not create expense bill:', error); // Debug: Log the caught error
}
};

  const handleAddNewItem = () => {
    setItems([...items, '']); // Add another empty string to represent a new textarea
  };

  const handleSaveItem = (index, value) => {
    const newItems = [...items];
    newItems[index] = value; // Update the item at the specific index
    setItems(newItems);
    // Here you can close the edit mode for this item if you have such a state
  };

  const handleCancelItem = (index) => {
    const newItems = items.filter((_, itemIndex) => itemIndex !== index);
    setItems(newItems); // Remove the item at the specific index
  };
  
  return (
    <div className="expense-bills-overlay">
      <div className="expense-bills-dialog">
        <h1>Add Expense</h1>
        <div className="expense-bills-form">
          <div className="form-group">
            <label htmlFor="expenseNo">Expense No.</label>
            <input 
              id="expenseNo" 
              value={expenseNumber}
              onChange={(e) => setExpenseNumber(e.target.value)} 
              placeholder="1" 
            />
            <label htmlFor="expenseDate">Date</label>
            <input 
              type="date" 
              id="expenseDate"
              value={date}
              onChange={(e) => setDate(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select 
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat, index) => (
                <option key={index} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {!showAddCategory && (
            <button onClick={handleAddCategory}>Add New Category</button>
          )}
          {showAddCategory && (
            <div>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
              />
              <button onClick={handleSaveCategory}>Save</button>
              <button onClick={handleCancelAddCategory}>Cancel</button>
            </div>
          )}
          <div className="form-group">
          {items.map((item, index) => (
              <div key={index} className="form-group">
                <label htmlFor={`expenseItem-${index}`}>Add Expense Item (Optional)</label>
                <textarea
                  id={`expenseItem-${index}`}
                  value={item}
                  onChange={(e) => handleSaveItem(index, e.target.value)}
                  placeholder="Enter item"
                ></textarea>
                <button onClick={() => handleSaveItem(index, items[index])}>Save</button>
                <button onClick={() => handleCancelItem(index)}>Cancel</button>
              </div>
            ))}
            <button onClick={handleAddNewItem}>More Item</button>
          </div>
          <div className="form-group">
            <label htmlFor="expenseAmount">Expense Amount</label>
            <input 
              id="expenseAmount" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="Enter Amount" 
            />
          </div>
          <button className="save-btn" onClick={handleSubmit}>Save Bill</button>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseBills;
