import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Paynow.css'


const PayNow = () => {
    return (
        <>
            <h1>Pay Now</h1>
            <div>
                <Link to="/money-transfer"><button className="paynow-button">Money Transfer</button></Link>
                <Link to="/cards"><button className="paynow-button">Cards</button></Link>
                <Link to="/bill-payments"><button className="paynow-button">Bill Payments</button></Link>
                <Link to="/recharge"><button className="paynow-button">Recharge</button></Link>
                <Link to="/payment-solutions"><button className="paynow-button">Payment Solutions</button></Link>
            </div>        
        </>        
    );
};

export default PayNow;
