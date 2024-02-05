import React, { useState, useRef } from 'react';
import DashboardHeader from '../Dashboard/DashboardHeader/DashboardHeader'
import SideNavbar from '../Dashboard/SideNavbar/SideNavbar'
import { MdModeEdit } from 'react-icons/md';
import './MoneyDashboard.css';
import { PiBankFill } from "react-icons/pi";
import { FcMoneyTransfer } from "react-icons/fc";
import { BsQrCode } from "react-icons/bs";
import { MdOutlineMoneyOff } from "react-icons/md";

function MoneyDashboard() {
    const [businessName, setBusinessName] = useState('Business Name');
    const businessNameInputRef = useRef(null);

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
                        <div className="add-bank-account">
                          
                           <button className='add-bank-btn'> 
                          <div className='bank-icon'> <PiBankFill /></div>
                           <div className='bank-btn-title'><h1>Add your Bank Account</h1><br/> <span>Get payments via QR or Payment links</span></div>
                           </button>
                        </div>
                    </div>
                    <div className='money-dash'>
                    <div className="balance-view">
                        <div className="balance">
                            Balance
                            <span>₹ 0</span>
                        </div>
                        <button className="view-payments-history-btn">
                            View Payments History
                        </button>
                    </div>
                    <div className="request-money-order-qr">
                        <button className="request-money-btn">
                          <div className='money-icons'>
                          <FcMoneyTransfer />
                          </div >
                            Request Money
                        </button>
                        <button className="order-qr-code-btn">
                          <div className='money-icon'> 
                          <BsQrCode />
                          </div>
                            Order QR Code
                        </button>
                    </div>
                    <div className="sending-payments-disabled">
                        Sending Payments Disabled
                        <button className="view-history-btn">
                            View History
                        </button>
                    </div>
                    <div className="collect-pending-money">
                      <button>
                        <div className='pending-icon'>
                        <h3>Collect pending money</h3>
                        <MdOutlineMoneyOff />
                        </div>
                        </button>
                    </div>
                    <div className="staff-payment">
                        <button className="staff-payment-btn">
                            Staff Payment
                        </button>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default MoneyDashboard;
