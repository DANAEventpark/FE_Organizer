import React from 'react';

const ProgressBar = ({ current, max }) => {
  const percentage = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#e96a52] rounded-full" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-gray-600 min-w-[50px]">{current}/{max}</span>
    </div>
  );
};

export default ProgressBar;
