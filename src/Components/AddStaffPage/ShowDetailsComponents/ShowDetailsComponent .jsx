import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './showDetails.css';

const ShowDetailsComponent = ({ staffId,  name, email, number }) => {
  const [staffDetails, setStaffDetails] = useState(null);
  const [staff, setStaff] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchStaffData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`http://localhost:3000/api/staff/${staffId}`);
//         console.log(response)
//         setStaff(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch data');
//         setLoading(false);
//       }
//     };

//     if (staffId) {
//       fetchStaffData();
//     }
//   }, [staffId]); // Dependency array includes staffId


  useEffect(() => {
    //staffid
    console.log(staffId);
    const fetchStaffDetails = async () => {
      try {
        const response = await axios.get(`https://banking-app-backend-se4u.onrender.com/api/staffdetails/${staffId}`);
        // console.log(response)
        setStaffDetails(response.data);
      } catch (error) {
        console.error('Error fetching staff details:', error);
        // Handle error appropriately
      }
    };

    if (staffId) {
      fetchStaffDetails();
    }
  }, [staffId]);

  if (!staffDetails) {
    return <div>Loading staff details...</div>;
  }

  return (
    <div  className="details-container">
      <h2>Staff Details</h2>
      {/* Display staff details here. */}
      <p>Name: {name}</p>
    <p>Email: {email}</p>
    <p>Phone Number: {number}</p>
    <p>Salary: ${staffDetails.salary}</p>
      <p>Address: {staffDetails.address}</p>
      <p>Date of Birth: {staffDetails.dateOfBirth ? new Date(staffDetails.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
      <p>Emergency Contact: {staffDetails.emergencyContact}</p>
      <p>Employee ID: {staffDetails.employeeID}</p>
      <p>Start Date: {staffDetails.startDate ? new Date(staffDetails.startDate).toLocaleDateString() : 'N/A'}</p>
      <p>Department: {staffDetails.department}</p>
      <p>Supervisor: {staffDetails.supervisor}</p>
      <p>Pay Frequency: {staffDetails.payFrequency}</p>
      <p>Benefits: {staffDetails.benefits}</p>
      <p>Certifications: {staffDetails.certifications}</p>
      <p>Performance Feedback: {staffDetails.performanceFeedback}</p>
      <p>Leave Balance: {staffDetails.leaveBalance}</p>
      <p>Notes: {staffDetails.notes}</p>
    </div>
  );  
};

export default ShowDetailsComponent;
