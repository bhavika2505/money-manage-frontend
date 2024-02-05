import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../MyBusiness/MyBusinessPage.css';
import DashboardHeader from '../Dashboard/DashboardHeader/DashboardHeader';
import SideNavbar from '../Dashboard/SideNavbar/SideNavbar';
import { MdModeEdit } from "react-icons/md";
import Sales from '../Sales/Sales';
import Expense from '../Expense/Expense'
import Purchase from '../Purchase/Purchase'


function Bills() {
    const [businessName, setBusinessName] = useState('Business Name');
    const businessNameInputRef = useRef(null);
    const [activePage, setActivePage] = useState('');
    
    const [customers, setCustomers] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
      const fetchSuppliers = async () => {
        try {
          const response = await axios.get('https://banking-app-backend-se4u.onrender.com/supplier');
          setSuppliers(response.data);
          console.log('Suppliers fetched:', response.data); // Log to confirm data
        } catch (error) {
          console.error('Error fetching suppliers:', error);
        }
      };
    
      const fetchCustomers = async () => {
        try {
          const response = await axios.get('https://banking-app-backend-se4u.onrender.com/customer');
          setCustomers(response.data);
          console.log('Customers fetched:', response.data); // Log to confirm data
        } catch (error) {
          console.error('Error fetching customers:', error);
        }
      };
    
      fetchSuppliers();
      fetchCustomers();
    }, []);
    
    
    const handleEditClick = () => {
      if (businessNameInputRef.current) {
        businessNameInputRef.current.focus();
      }
    };
  
    const handleNameChange = (e) => {
      setBusinessName(e.target.value);
    };
  
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.target.blur();
        console.log('Business name saved:', businessName);
      }
    };

    const setActivePageTo = (page) => () => {
        console.log(`Changing page to ${page}`);
        setActivePage(page);
    };


    const renderActivePage = (customers, suppliers) => {
      switch (activePage) {
          case 'Sales':
              return <Sales customers={customers} suppliers={suppliers} />;
          case 'Purchase':
              return <Purchase customers={customers} suppliers={suppliers} />;
          case 'Expense':
              return <Expense customers={customers} suppliers={suppliers} />;
          default:
              return <Sales customers={customers} suppliers={suppliers} />;
      }
  };

  return (
    <div className="container">
      <div className="business-header">
        <DashboardHeader />
      </div>
      <div className="side-navbar">
        <SideNavbar />
      </div>
      <div className="content-area">
        <div className="my-business-content">
          <div className="business-name-edit">
            <div className="business-name-container">
              <input 
                type="text" 
                value={businessName} 
                onChange={handleNameChange} 
                onKeyDown={handleKeyDown}
                className="business-name-input"
                ref={businessNameInputRef}
              />
              <MdModeEdit className="edit-icon" onClick={handleEditClick} />
            </div>
            <div className="action-buttons">
              <button className="action-btn" onClick={setActivePageTo('sales')}>Sales</button>
              <button className="action-btn" onClick={setActivePageTo('Purchase')}>Purchase</button>
              <button className="action-btn" onClick={setActivePageTo('Expense')}>Expense</button>
            </div>
          </div>
          {renderActivePage(customers, suppliers)} {/* Call the function here to render the active page */}
        </div>
      </div>
    </div>
  );
}

export default Bills;
