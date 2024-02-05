import React, { useState, useEffect } from 'react';
import './AddStaffPage.css';
import { VscBellDot } from "react-icons/vsc";
import { PiNoteFill } from "react-icons/pi";
import StaffDialog from '../StaffDialog/StaffDialog';
import StaffList from '../StaffList/StaffList';
import axios from 'axios'; 

function AddStaffPage() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // State to track data loading
  const [updateKey, setUpdateKey] = useState(0);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddStaff = (newStaff) => {
    setStaffMembers(prevStaffMembers => {
      setUpdateKey(prevKey => prevKey + 1); // Update the key when new staff is added
      return [...prevStaffMembers, newStaff];
    });
    handleCloseDialog();
  };
  
  const [hasStaff, setHasStaff] = useState(false);

  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        const response = await axios.get('https://banking-app-backend-se4u.onrender.com/staff');
        const staffArray = response.data.staff || [];
        console.log(staffArray);
        setStaffMembers(staffArray);
        setHasStaff(staffArray.length > 0);
        setUpdateKey(prevKey => prevKey + 1); // Increment the key after fetching
      } catch (error) {
        console.error('Error fetching staff members:', error);
      } finally {
        setIsDataLoaded(true); // Set to true after data is fetched or in case of error
      }
    };
  
    fetchStaffMembers();
  }, []);
  

  


 
  // Define any state or functions you need for interactivity here

  return (
    <div className="add-staff-page"  key={updateKey}>
      {isDataLoaded && !hasStaff ? (
        <div className='staff-img'>
          <header className="add-staff-header">
            <img src="adduser.png" alt="Add User" />
            <h1>Add Users</h1>
            {/* Here you will add back arrow and menu icons */}
          </header>
          
          <section className="add-staff-actions">
            <div className='subimg'>
              <div className="action-item">
                <img src="permission.png" alt="Give Permission" />
                <h3>Give Permission</h3>
              </div>
              <div className="action-item">
                <img src="money-manage.png" alt="Manage Salary" />
                <h3>Manage Salary</h3>
              </div>
              <div className="action-item">
                <img src="attendace.png" alt="Mark Attendance" />
                <h3>Mark Attendance</h3>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <StaffList staffMembers={staffMembers} />
      )}

      

      <section className="how-it-works">
        <h2>HOW IT WORKS</h2>
        <p>Add Staff, Business Partners or Family members</p>
        <div className="works-item">
          < PiNoteFill/>
          <p>Give access to Partners & Staff on their phone number</p>
        </div>
        <div className="works-item">
          <VscBellDot />
          <p>Manage Salary, Attendance & Payments for Staff</p>
        </div>
      </section>

      <button className="add-staff-button" onClick={handleOpenDialog}>ADD STAFF</button>

      <StaffDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onAddStaff={handleAddStaff}
      />
    </div>
  );
}

export default AddStaffPage;