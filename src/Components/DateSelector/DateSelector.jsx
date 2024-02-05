import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import './DateSelector.css';
import 'react-datepicker/dist/react-datepicker.css';
import { SlCalender } from "react-icons/sl";

const DateSelector = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const resetDates = () => {
        setStartDate(new Date());
        setEndDate(new Date());
    };

    return (
        <div className='picker'>
            <div onClick={resetDates}>
                <SlCalender />
            </div>
            <div>
                <DatePicker
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                />
                <DatePicker
                    selected={endDate}
                    onChange={date => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                />
            </div>
        </div>
    );
};

export default DateSelector;
