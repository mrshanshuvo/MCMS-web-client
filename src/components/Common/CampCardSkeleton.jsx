import React from 'react';

const CampCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4 animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded-xl" />
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-gray-200 rounded w-20" />
        <div className="h-9 bg-gray-200 rounded-lg w-28" />
      </div>
    </div>
  );
};

export default CampCardSkeleton;
