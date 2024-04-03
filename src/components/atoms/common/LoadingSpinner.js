import React, { useState } from 'react';

const LoadingSpinner = ({ spinnerColor }) => {
  return (
    <div className='absolute z-50 flex items-center justify-center w-full h-full p-4 bg-slate-500/50'>
      <span className={`loading loading-spinner loading-lg ${spinnerColor}`}></span>
    </div>
  );
};

export default LoadingSpinner;
