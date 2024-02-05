import React, { useState } from 'react';
import './SideNavbar.css';
import { MdMenu } from 'react-icons/md'; // Assuming you're using react-icons for consistency
import { Link } from 'react-router-dom';

function SideNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="menu-button" onClick={() => setIsOpen(!isOpen)}>
        <MdMenu /> {/* Menu icon */}
      </button>
      <nav className={`side-navbar ${isOpen ? 'active' : ''}`}>
        <ul className="nav-links">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/invoice">Invoice</Link></li>
          <li><Link to="/mybusinesspage">Business Page</Link></li>
          <li><Link to="/bills">Bills</Link></li>
          <li><Link to='/productSection'>Products</Link></li>
          <li><Link to='/money'>Money</Link></li>
        </ul>
      </nav>
    </>
  );
}

export default SideNavbar;
