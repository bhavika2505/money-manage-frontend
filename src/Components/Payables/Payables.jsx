import React from 'react';
import './Payables.css'; // Your CSS file for styling
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = {
  totalAmount: 3000,
  paidAmount: 1000,
  dueAmount: 1500,
  remainingAccount: 500
};

const pieData = [
  { name: 'Paid Amount', value: sampleData.paidAmount },
  { name: 'Due Amount', value: sampleData.dueAmount },
  { name: 'Remaining Account', value: sampleData.remainingAccount }
];

const COLORS = ['#0088FE', ' #FF0000', '#00C49F']; // Different colors for each section

const Payables = () => {
  return (
    <div className="payables-widget">
      <h1>Payables Overview</h1>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={3}
            dataKey="value"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
    </div>
  );
};

export default Payables;
