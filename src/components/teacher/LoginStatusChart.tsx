import React from 'react';
import '../../styles/LoginStatusChart.css';

interface LoginStatusChartProps {
  totalStudents: number;
  loggedInCount: number;
}

const LoginStatusChart: React.FC<LoginStatusChartProps> = ({ totalStudents, loggedInCount }) => {
  const percentage = totalStudents === 0 ? 0 : Math.round((loggedInCount / totalStudents) * 100);
  
  // Calculate SVG circle properties for donut chart
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="login-status-chart">
      <div className="donut-container">
        <svg viewBox="0 0 100 100" className="donut-svg">
          {/* Background circle (not logged in) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="12"
          />
          
          {/* Logged in circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#0066cc"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className="donut-progress"
          />
        </svg>
        
        {/* Centered percentage */}
        <div className="donut-center">
          <div className="percentage">{percentage}%</div>
          <div className="label">Logged In</div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color logged-in"></span>
          <span className="legend-text">Logged In: {loggedInCount}</span>
        </div>
        <div className="legend-item">
          <span className="legend-color not-logged-in"></span>
          <span className="legend-text">Not Logged In: {totalStudents - loggedInCount}</span>
        </div>
      </div>
    </div>
  );
};

export default LoginStatusChart;
