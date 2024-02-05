import React, { useState } from 'react';
import './Register.css'; // Assuming your CSS is in Register.css
import DashboardHeader from '../Dashboard/DashboardHeader/DashboardHeader';


function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://banking-app-backend-se4u.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, phone, email, password, confirmPassword }),
      });
  
      if (response.ok) 
      {
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log(data.message);
          // Redirect or handle success
        } else {
          console.log('Registered successfully, but no JSON response');
          // Handle non-JSON successful response
        }
      } else {
        throw new Error('Failed to register');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };
  

  return (
    <>
    <DashboardHeader/>
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input 
            type="password" 
            id="confirmPassword"
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="Confirm Password" 
          />
        </div>

        <button type="submit" className="register-button">Register</button>
      </form>
      <div className="login-links">
        <p>Already a user? <a href="/login">Log in</a></p>
      </div>
    </div>
    </>
  );
}

export default Register;
