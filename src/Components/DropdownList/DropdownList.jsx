import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import './DropdownList.css';

const DropdownList = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <Dropdown>
      <button onClick={toggleDropdown} className="dropdown-toggle-button">
        <MdOutlineArrowDropDownCircle />
      </button>
      <Dropdown.Menu 
        className={`dropp ${isDropdownOpen ? '' : 'display-none'}`} // Apply conditional class
      >
        <Dropdown.Item href="#/add-widget" className="custom-dropdown-item">Add Widget</Dropdown.Item>
        <Dropdown.Item href="#/create-dashboard" className="custom-dropdown-item">Create Dashboard</Dropdown.Item>
        <Dropdown.Item href="#/manage-dashboards" className="custom-dropdown-item">Manage Dashboards</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownList;
