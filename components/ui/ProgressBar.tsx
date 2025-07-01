
import React from 'react';

interface ProgressBarProps {
  progress: number; // A value between 0 and 100
  level?: 'Committed' | 'Aspirational';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, level = 'Committed' }) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const getColor = () => {
    if (level === 'Aspirational') {
      if (clampedProgress >= 70) return 'bg-green-500';
      if (clampedProgress >= 40) return 'bg-yellow-500';
      return 'bg-red-500';
    }
    // Committed level
    if (clampedProgress >= 85) return 'bg-green-500';
    if (clampedProgress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full bg-slate-200 rounded-full h-2.5">
      <div
        className={`${getColor()} h-2.5 rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${clampedProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
