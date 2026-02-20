import React from 'react';
import '../styles/ProgressBar.css';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, showLabel = true }) => {
  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
      {showLabel && <span className="progress-label">{percentage}%</span>}
    </div>
  );
};

export default ProgressBar;
