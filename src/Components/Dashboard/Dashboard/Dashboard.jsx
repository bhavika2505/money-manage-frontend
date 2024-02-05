import React from 'react';
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import SideNavbar from '../SideNavbar/SideNavbar';
import './Dashboard.css';
import CashFlowGraph from '../../Cashflowgraph/CashFlowGraph';
import DateSelector from '../../DateSelector/DateSelector';
import Receivable from '../../Receivables/Receivable';
import Payables from '../../Payables/Payables';
import DropdownList from '../../DropdownList/DropdownList'

function Dashboard() {
  return (
    <div className='container'>
    <div className="business-header">
    <DashboardHeader />
      </div>
      <div className="side-navbar">
        <SideNavbar />
      </div>
        <div className="dashboard-content">
          <div className='date-dash'>
            <div className='dash-drop'>
              <h1>Dashboard</h1>
               {/* <DropdownList/> */}
            </div>
            <div className='dateselector'>
            <DateSelector />
            </div>
          </div>
          <CashFlowGraph />
          <div className='ables'>
            <Receivable />
            <Payables />
          </div>
        </div>
      </div>
  );
}

export default Dashboard;

