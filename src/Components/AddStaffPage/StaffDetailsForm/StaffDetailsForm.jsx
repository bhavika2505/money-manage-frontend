import React, { useState } from 'react';
import axios from 'axios';
import { IoMdClose } from "react-icons/io"; 
import { useNavigate } from 'react-router-dom';
import './StaffDetailsForm.css'

const StaffDetailsForm = (props) => {
  const [formData, setFormData] = useState({
    staff : props.staffId,
    address: '',
    dateOfBirth: '',
    emergencyContact: '',
    employeeID: '',
    startDate: '',
    department: '',
    supervisor: '',
    salary: 0,
    payFrequency: '',
    benefits: '',
    certifications: '',
    performanceFeedback: '',
    leaveBalance: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     // Send a POST request to your backend API
  //     const response = await axios.post('https://banking-app-backend-se4u.onrender.com/api/staffdetails', formData);
  
  //     // Check the response and handle it accordingly
  //     if (response.status === 201) {
  //       console.log('StaffDetails added successfully:', response.data.staffDetails);
  //       // Reset the form or redirect to a different page if needed
  //     } else {
  //       console.error('Error adding StaffDetails:', response.data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error adding StaffDetails:', error.message);
  //   }
  // };

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const staffId = formData.staff; // Assuming 'staff' field holds the staff ID
    const staffDetailsUrl = `https://banking-app-backend-se4u.onrender.com/api/staffdetails/${staffId}`;

    try {
      // First, check if the staff details already exist
      let response;
      try {
        response = await axios.get(staffDetailsUrl);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Staff details do not exist, prepare to create new
          response = await axios.post('https://banking-app-backend-se4u.onrender.com/api/staffdetails', formData);
        } else {
          throw error; // Other errors are re-thrown to be caught by the outer try-catch
        }
      }

      // If GET request was successful or POST request was made
      if (response.status === 200) {
        // Staff details exist, update them
        response = await axios.put(staffDetailsUrl, formData);
      }

      if (response.status === 200 || response.status === 201) {
        console.log('StaffDetails processed successfully:', response.data);
        // Handle success here (e.g., clear form, show message)
      } else {
        console.error('Error processing StaffDetails:', response.data.message);
      }
    } catch (error) {
      console.error('Error in processing StaffDetails:', error.message);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="staff-details-form">
      
      <h2>Staff Details Form</h2>


      <div>
        <label htmlFor="address">Address:</label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        ></textarea>
      </div>

      <div>
        <label htmlFor="dateOfBirth">Date of Birth:</label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="emergencyContact">Emergency Contact:</label>
        <input
          type="text"
          id="emergencyContact"
          name="emergencyContact"
          value={formData.emergencyContact}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="employeeID">Employee ID:</label>
        <input
          type="text"
          id="employeeID"
          name="employeeID"
          value={formData.employeeID}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="department">Department:</label>
        <input
          type="text"
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="supervisor">Supervisor:</label>
        <input
          type="text"
          id="supervisor"
          name="supervisor"
          value={formData.supervisor}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="salary">Salary:</label>
        <input
          type="text"
          id="salary"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="payFrequency">Pay Frequency:</label>
        <input
          type="text"
          id="payFrequency"
          name="payFrequency"
          value={formData.payFrequency}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="benefits">Benefits:</label>
        <textarea
          id="benefits"
          name="benefits"
          value={formData.benefits}
          onChange={handleChange}
        ></textarea>
      </div>

      <div>
        <label htmlFor="certifications">Certifications:</label>
        <textarea
          id="certifications"
          name="certifications"
          value={formData.certifications}
          onChange={handleChange}
        ></textarea>
      </div>

      <div>
        <label htmlFor="performanceFeedback">Performance Feedback:</label>
        <textarea
          id="performanceFeedback"
          name="performanceFeedback"
          value={formData.performanceFeedback}
          onChange={handleChange}
        ></textarea>
      </div>

      <div>
        <label htmlFor="leaveBalance">Leave Balance:</label>
        <input
          type="text"
          id="leaveBalance"
          name="leaveBalance"
          value={formData.leaveBalance}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="notes">Notes:</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        ></textarea>
      </div>

      <button type="submit">Submit</button>
    
    </form>
  );
};

export default StaffDetailsForm;
