import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch(status?.toLowerCase()) {
      case 'published':
        return { color: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-500' };
      case 'draft':
        return { color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-400' };
      case 'cancelled':
        return { color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500' };
      case 'done':
        return { color: 'text-blue-600', bg: 'bg-blue-50', dot: 'bg-blue-500' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-400' };
    }
  };
  
  const config = getStatusConfig();
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {status || 'Unknown'}
    </div>
  );
};

export default StatusBadge;
