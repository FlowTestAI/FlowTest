import React from 'react';
import ThemeController from 'components/atoms/ThemeController';
import AppLogo from 'components/atoms/Logo';

const MainHeader = () => {
  return (
    // <header className='flex items-center justify-between px-4 py-3 font-semibold tracking-widest dark:bg-slate-800 dark:text-white'>
    <header className='flex items-center justify-between px-4 py-3 font-semibold tracking-widest'>
      <div className='flex items-center gap-3'>
        <AppLogo styleClasses='w-6 h-6' />
        <div className='flex items-baseline gap-1'>
          <h2>FlowTestAI</h2>
          <span className='text-xs font-normal'>v1.1.0</span>
        </div>
      </div>
      <ThemeController />
    </header>
  );
};

export default MainHeader;
