// src/components/common/Loading.tsx

import React from 'react';

export const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2 text-gray-600">Chargement...</span>
    </div>
  );
};
