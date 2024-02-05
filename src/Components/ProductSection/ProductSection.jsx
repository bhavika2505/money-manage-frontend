import React, { useState, useRef } from 'react';
import DashboardHeader from '../Dashboard/DashboardHeader/DashboardHeader'
import SideNavbar from '../Dashboard/SideNavbar/SideNavbar'
import Products from '../Products/Products';
import ProductServices from '../ProductServices/ProductServices';
import { MdModeEdit } from 'react-icons/md';

function ProductSection() {
  const [businessName, setBusinessName] = useState('Business Name');
  const businessNameInputRef = useRef(null);
  const [activePage, setActivePage] = useState('');

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

    const renderActivePage = () => {
        switch (activePage) {
          case 'products':
            return <Products />;
          case 'services':
            return <ProductServices />;
          default:
            return <Products/>;
        }
      };
  return (
    <div className='container'>
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
              <button className="action-btn" onClick={setActivePageTo('products')}>Products</button>
              <button className="action-btn" onClick={setActivePageTo('services')}>Services</button>
            </div>
          </div>
          {renderActivePage()} {/* Call the function here to render the active page */}
        </div>
      </div>
    </div>
  )
}

export default ProductSection
