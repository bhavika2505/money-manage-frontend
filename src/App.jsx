// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Dashboard from './Components/Dashboard/Dashboard/Dashboard';
import ForgotPassword from './Components/ForgetPassword/ForgetPassword';
import PayNow from './Components/Paynow/Paynow';
import Invoice from './Components/Invoice/Invoice';
import MyBusinessPage from './Components/MyBusiness/MyBusinessPage';
import SupplierPage from './Components/SupplierPage/SupplierPage';
import CustomerPage from './Components/CustomerPage/CustomerPage';
import AddStaffPage from './Components/AddStaffPage/AddStaffPage/AddStaffPage';
import StaffDetailsForm from './Components/AddStaffPage/StaffDetailsForm/StaffDetailsForm';
import StaffList from './Components/AddStaffPage/StaffList/StaffList';
import StaffDialog from './Components/AddStaffPage/StaffDialog/StaffDialog';
import SupplierReport from './Components/SupplierPage/Supplier-Report/SupplierReport';
import Bills from './Components/Bills/Bills';
import ProductSection from './Components/ProductSection/ProductSection';
import MoneyDashboard from './Components/Money/MoneyDashboard';


function App() {
  return (
    
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/paynow" component={<PayNow/>} />
      <Route path="/forgetpassword" element={<ForgotPassword />} />
      <Route path="/invoice" element={<Invoice />} />
      <Route path="/StaffList" element={<StaffList />} />
      <Route path="/mybusinesspage" element={<MyBusinessPage />} />
      <Route path="/add-staff-details" element={<StaffDetailsForm />} />
      <Route path="/supplierreport" element={<SupplierReport />} />
      <Route path="/bills" element={<Bills />} />
      <Route path="/productSection" element={<ProductSection/>} />
      <Route path="/money" element={<MoneyDashboard/>} />
    </Routes>
  );
}

export default App;
