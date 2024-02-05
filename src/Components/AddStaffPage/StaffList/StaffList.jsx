import React, { useState, useEffect } from 'react';
import './StaffList.css';
import { VscBellDot, VscSearch } from "react-icons/vsc";
import StaffDetailsForm from '../StaffDetailsForm/StaffDetailsForm';
import { IoIosAdd } from "react-icons/io";
import AttendanceCalendar from '../AttendanceCalendar/AttendanceCalendar';
import ShowDetailsComponent from '../ShowDetailsComponents/ShowDetailsComponent ';

import axios from 'axios';

const StaffList = ({ staffMembers }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStaffId, setCurrentStaffId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [staffDetails, setStaffDetails] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

// Call this function whenever you want to force a re-render
const triggerForceUpdate = () => {
setForceUpdate(prev => prev + 1); // Increment the forceUpdate state to trigger a re-render
};

  const calculateTotalDue = (staffId) => {
    const staffMember = staffMembers.find(member => member._id === staffId);
    if (!staffMember || !staffMember.salary) return 0;

    const baseSalary = parseFloat(staffMember.salary);
    if (isNaN(baseSalary)) {
      console.error('Base salary is not a number.');
      return 0;
    }
    
    const month = new Date().getMonth() + 1; // Current month
    const year = new Date().getFullYear(); // Current year

    // Use the attendanceData from state instead of the staffMember object
    return calculateSalary(baseSalary, attendanceData, month, year);
  };


  const calculateSalary = (baseSalary, attendanceData, month, year) => {
    const workingDays = getWorkingDaysInMonth(month, year); 
    const { totalPresent, totalAbsent, totalHalfDays, totalLeaves } = getAttendanceTotals(attendanceData, month, year);

    const paidLeaves = 2;
    const paidHalfDays = 2;
    let deduction = 0;
    const dailyRate = baseSalary / workingDays; // Calculate the daily rate of salary
    
    // Assume totalAbsent represents the total number of leave days taken
    if (totalAbsent > paidLeaves) {
      deduction += (totalAbsent - paidLeaves) * dailyRate;
    }
    const finalSalary = baseSalary - deduction;
    return finalSalary;
  };
  const getAttendanceTotals = (attendanceData, month, year) => {
    let totalPresent = 0, totalAbsent = 0, totalHalfDays = 0, totalLeaves = 0;
    // Define the start and end dates of the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // The 0th of the next month is the last day
  
  attendanceData.forEach(record => {
  // First, convert the record's date string to a Date object
  const recordDate = new Date(record.date);

  // Check if the record's date is within the desired month and year
  if (recordDate >= startDate && recordDate <= endDate) {
    // Now, use 'present' boolean field instead of 'status' string
    if (record.present) {
      totalPresent++;
    } else {
      // If not present, increment totalAbsent
      totalAbsent++;
      // You may need to adjust this logic if you have more detailed attendance statuses
    }
  }
  });
  
  return { totalPresent, totalAbsent, totalHalfDays, totalLeaves };
  };

  useEffect(() => {
    const fetchData = async () => {
        try {
            // Use currentStaffId instead of staffId
            const response = await fetch(`https://banking-app-backend-se4u.onrender.com/api/attendance/${currentStaffId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAttendanceData(data); // Set the fetched attendance data
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    if (currentStaffId) {
        fetchData();
    }
  }, [currentStaffId,triggerForceUpdate]);

  const getWorkingDaysInMonth = (month, year) => {
    let workingDays = 0;
    // Logic to calculate the number of working days in the month
    // Assuming Saturday (6) is a working day, Sunday (0) is not.
    const date = new Date(year, month - 1, 1); // Start at the beginning of the month
    while (date.getMonth() === month - 1) {
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0) { // 0 is Sunday
        workingDays++;
      }
      date.setDate(date.getDate() + 1);
    }
    return workingDays;
  };

  const selectStaff = (staffId) => {
    setCurrentStaffId(staffId);

    // Find the staff member by ID and set the staffDetails state
    const selectedStaff = staffMembers.find(member => member._id === staffId);
    if (selectedStaff) {
      setStaffDetails({
        name: selectedStaff.name,
        email: selectedStaff.email,
        number: selectedStaff.number, // Assuming the phone number is stored in 'phone' field
        // Add other details as needed
      });
      
    } else {
      // Handle the case where the staff member is not found
      console.error("Staff member not found");
    }
  };

  

  const toggleDialog = (staff) => {
    setCurrentStaffId(staff._id);
    setIsDialogOpen(!isDialogOpen);
  };

  const toggleDetailsDialog = (staff) => {
    setCurrentStaffId(staff._id);
    console.log(staff.name)
    setIsDetailsDialogOpen(!isDetailsDialogOpen);
  };

  const showDetails = (staff) => {
    // You can add any logic here if needed before opening the dialog
    toggleDetailsDialog(staff);
  };

  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredStaffMembers = staffMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="staff-list">
      <div className="staff-calendar">
        {currentStaffId && <AttendanceCalendar staffId={currentStaffId} />}
      </div>

      <div className="staff-header">
        <div className="total-due">
          <h2>Salary To Pay at End of the Month</h2>
          <span>{currentStaffId ? `\$${calculateTotalDue(currentStaffId).toFixed(2)}` : 'Select a staff member'}</span>
        </div>
      </div>

      <div className="search-bar">
        <VscSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search Staff"
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="staff-members">
  {filteredStaffMembers.map((staff, index) => (
    <div key={index} className="staff-member" onClick={() => selectStaff(staff._id)}>
      <div className='staff-d'>
      <div className='name-col'>
        <div className="staff-avatar">
          <span className='initial-char'>{staff.name.charAt(0)}</span>
        </div>
        <div className="staff-details">
      <h3>{staff.name}</h3>
    </div>
        </div>
        <div className="staff-salary">
          <p>₹{staff.salary}</p>
        </div>
        </div>
      <div className="staff-actions">
        <button className="add-details-button" onClick={(e) => { e.stopPropagation(); toggleDialog(staff); }}>
          Add Details<IoIosAdd />
        </button>
        {/* Show Details Button */}
         <button className="show-details-button" onClick={(e) => { e.stopPropagation(); showDetails(staff); }}>
          Show Details
        </button>
      </div>
    </div>
  ))}
</div>

{isDetailsDialogOpen && (
        <div className="dialog-background">
          <div className="dialog2">
            {/* You can create and import a new component for showing the details */}
            <ShowDetailsComponent staffId={currentStaffId}   name={staffDetails.name}
        email={staffDetails.email}
        number={staffDetails.number} />
            <button className='detailsclosebtn' onClick={toggleDetailsDialog}>Close</button>
          </div>
        </div>
      )}

      {isDialogOpen && (
        <div className="dialog-background">
          <div className="dialog1">
            <StaffDetailsForm staffId={currentStaffId} />
            <button className='detailsclosebtn' onClick={toggleDialog}>Close</button>
          </div>
        </div>
      )}

      <button className="add-staff-button">ADD STAFF</button>
    </div>
  );
};

export default StaffList;
