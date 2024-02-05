import React from 'react';
import './DashboardHeader.css'; // Your CSS file for styling

function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <div className="logo">Equity</div>
      <div className="search-bar">
        <input type="search" placeholder="Search..." />
      </div>
      <div className="user-info">
        <img src="user.png" alt="Profile" className="profile-image" />
        <span className="username">Username</span>
        {/* Add dropdown for user settings if needed */}
      </div>
    </header>
  );
}

export default DashboardHeader;
