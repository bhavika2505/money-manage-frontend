import React from 'react';
import { BarChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import './CashFlowGraph.css';

const data = [
    { name: 'Jan 2023', Incoming: 120000, Outgoing: 80000, Profit: 40000 },
    { name: 'Feb 2023', Incoming: 110000, Outgoing: 90000, Profit: 20000 },
    { name: 'Mar 2023', Incoming: 150000, Outgoing: 120000, Profit: 30000 },
    { name: 'Apr 2023', Incoming: 90000, Outgoing: 130000, Profit: -40000 },
    { name: 'May 2023', Incoming: 130000, Outgoing: 85000, Profit: 45000 },
    { name: 'Jun 2023', Incoming: 120000, Outgoing: 70000, Profit: 50000 },
    { name: 'Jul 2023', Incoming: 160000, Outgoing: 80000, Profit: 80000 },
    { name: 'Aug 2023', Incoming: 140000, Outgoing: 76000, Profit: 64000 },
    { name: 'Sep 2023', Incoming: 130000, Outgoing: 88000, Profit: 42000 },
    { name: 'Oct 2023', Incoming: 125000, Outgoing: 65000, Profit: 60000 },
    { name: 'Nov 2023', Incoming: 140000, Outgoing: 85000, Profit: 55000 },
    { name: 'Dec 2023', Incoming: 150000, Outgoing: 70000, Profit: 80000 },
  ].map(item => ({
    ...item,
    Profit: item.Incoming - item.Outgoing, // Calculate Profit for each entry
  }));  

  const CashFlowGraph = () => {
    return (
      <ResponsiveContainer width="90%" height={300} className="cash-flow-container">
        <h1>Cash Flow</h1>
        <p>Cash coming in and going out of your business.</p>
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          className="cash-flow-bar-chart"
        >
          <CartesianGrid strokeDasharray="3 3" className="cash-flow-grid" />
          <XAxis dataKey="name" className="cash-flow-x-axis" />
          <YAxis className="cash-flow-y-axis" />
          <Tooltip className="cash-flow-tooltip" />
          <Legend className="cash-flow-legend" />
          <Bar dataKey="Incoming" fill="#0088FE" className="bar-incoming" />
          <Bar dataKey="Outgoing" fill="#00C49F" className="bar-outgoing" />
          <Line 
            type="monotone" 
            dataKey="Profit" 
            stroke="#000" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            className="line-profit"
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  export default CashFlowGraph;