import React from 'react';
import ThemeController from 'components/atoms/ThemeController';
import AppLogo from 'components/atoms/Logo';
import FlowGPU from 'assets/icons/flow-GPU.png';
import FlowTriangle from 'assets/icons/flow-triangle.png';

const MainHeader = () => {
  return (
    <header className='flex items-center justify-between px-4 py-2 font-semibold tracking-widest border-b border-neutral-300'>
      <div className='flex items-center gap-4'>
        <AppLogo styleClasses='w-6 h-6' />
        <div className='w-6 h-6'>
          <img src={FlowGPU} alt='FlowTestAI app logo' />
        </div>
        <div className='w-6 h-6'>
          <img src={FlowTriangle} alt='FlowTestAI app logo' />
        </div>
        <h2>FlowTestAI</h2>
      </div>
      <ThemeController />
    </header>
  );
};

export default MainHeader;
