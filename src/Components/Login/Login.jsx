import React, { useState } from 'react';
import './login.css'
import DashboardHeader from '../Dashboard/DashboardHeader/DashboardHeader';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the login logic here
  };

  return (
    <>
    <div className='login'>
    <DashboardHeader/>
    </div>
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="login-button">Login</button>
        <div className="login-links">
          <a href="/register">Register</a>
          <a href="/forgetpassword">Forgot Password?</a>
        </div>
      </form>
    </div>
    </>
  );
}

export default Login;
