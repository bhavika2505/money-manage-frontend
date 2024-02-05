import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AttendanceCalender.css';

const AttendanceCalendar = ({ staffId }) => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isPresent, setIsPresent] = useState(false);
    const [isFiveDayWeek, setIsFiveDayWeek] = useState(false);
    
    const isNonWorkingDay = (date) => {
      if (isFiveDayWeek) {
          return date.getDay() === 0 || date.getDay() === 6; // 0 is Sunday, 6 is Saturday
      }
      return date.getDay() === 0; // Only Sunday is non-working in a 6-day week
  };

    const isSunday = (date) => {
      return date.getDay() === 0; // 0 is Sunday
  };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://banking-app-backend-se4u.onrender.com/api/attendance/${staffId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAttendanceData(data);
            } catch (error) {
                console.error('Error fetching attendance data:', error);
            }
        };

        if (staffId) {
            fetchData();
        }
    }, [staffId]);

    const handleDateSelect = (date) => {
      if (isNonWorkingDay(date)) {
        alert("Attendance cannot be recorded on non-working days");
        return; // Prevent further actions if it's a non-working day
    }
        setSelectedDate(date);
        const attendance = attendanceData.find(record =>
            new Date(record.date).toDateString() === date.toDateString()
        );
        setIsPresent(attendance ? attendance.present : false);
    };

    

    const postAttendance = async () => {
      if (isNonWorkingDay(selectedDate)) {
        alert("Attendance cannot be recorded on non-working days");
        return; // Prevent posting attendance data if it's a non-working day
    }
        try {
          const existingRecord = attendanceData.find(record =>
            new Date(record.date).toDateString() === selectedDate.toDateString()
          );
      
          const method = existingRecord ? 'PUT' : 'POST';
          const url = existingRecord
            ? `https://banking-app-backend-se4u.onrender.com/api/attendance/${existingRecord._id}`
            : 'https://banking-app-backend-se4u.onrender.com/api/attendance';
      
          const response = await fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              staffId: existingRecord ? undefined : staffId, // Exclude staffId when updating
              date: selectedDate,
              present: isPresent,
            }),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error("Not a JSON response");
          }
      
          const responseData = await response.json();
      
          if (existingRecord) {
            setAttendanceData(prevData =>
              prevData.map(record => record._id === existingRecord._id ? responseData : record)
            );
          } else {
            setAttendanceData(prevData => [...prevData, responseData]);
          }
        } catch (error) {
          console.error('Fetch error:', error.message);
        }
      };
      
    
    const tileClassName = ({ date, view }) => {
      if (view === 'month') {
        if (isNonWorkingDay(date)) {
            return 'non-working-day'; // Add a class for non-working days
        }
            const attendanceRecord = attendanceData.find(record => 
                new Date(record.date).toDateString() === date.toDateString());
    
            if (attendanceRecord) {
                return attendanceRecord.present ? 'present' : 'absent';
            }
            return 'unmarked';
        }
    };

    const getMonthlyAttendanceTotals = () => {
      const currentMonth = selectedDate.getMonth();
      const currentYear = selectedDate.getFullYear();
  
      const monthlyAttendance = attendanceData.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
      });
  
      const totalPresent = monthlyAttendance.filter(record => record.present).length;
      const totalAbsent = monthlyAttendance.length - totalPresent;
  
      return { totalPresent, totalAbsent };
  };
    
    return (
      <>
       <div className="toggle-five-day-week">
          <label>
              <input
                  type="checkbox"
                  checked={isFiveDayWeek}
                  onChange={() => setIsFiveDayWeek(!isFiveDayWeek)}
              />
              5-Day Work Week
          </label>
      </div>

        <div className="attendance-calendar">
            <Calendar
                value={selectedDate}
                onClickDay={handleDateSelect}
                tileClassName={tileClassName}
            />

                <div className="attendance-controls">
                  <div>
                    <button className='presentbtn' onClick={() => setIsPresent(true)}>
                        Mark as Present
                    </button>
                    <button className='absentbtn' onClick={() => setIsPresent(false)}>
                        Mark as Absent
                    </button>
                    </div>
                    <div>
                    <button className='savebtn' onClick={postAttendance}>
                        {attendanceData.some(record => 
                          new Date(record.date).toDateString() === selectedDate.toDateString())
                          ? 'Edit Attendance' : 'Save Attendance'}
                    </button>
                    </div>
                </div>

            <div className="attendance-totals">
            <div className='present-count'>Monthly Present Days: {getMonthlyAttendanceTotals().totalPresent}</div>
            <div className='absent-count'>Monthly Absent Days: {getMonthlyAttendanceTotals().totalAbsent}</div>
        </div>
        </div>
        </>
    );
};

export default AttendanceCalendar;