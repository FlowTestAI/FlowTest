import React from 'react';
// import PropTypes from 'prop-types';
import FlowGPU from 'assets/icons/Flow-GPU-text-no-background-white.png';

const HomeLoadingScreen = () => {
  return (
    <div className='absolute z-50 flex flex-col items-center justify-center w-full h-full p-4 bg-slate-500/50'>
      <div className='h-72 w-72'>
        <img src={FlowGPU} alt='FlowTestAI app logo' />
      </div>
      <span className='mt-8 text-w hite loading loading-spinner loading-lg'></span>
    </div>
  );
};

// HomeLoadingScreen.propTypes = {};

export default HomeLoadingScreen;
