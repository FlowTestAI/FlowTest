import React from 'react';
import ThemeController from 'components/atoms/ThemeController';
import AppLogo from 'components/atoms/Logo';

const MainHeader = () => {
  return (
    <header className='flex items-center justify-between px-4 py-2 font-semibold tracking-widest border-b border-neutral-300'>
      <div className='flex items-center gap-2'>
        <AppLogo styleClasses='w-6 h-6' />
        <h2>FlowTestAI</h2>
      </div>
      <ThemeController />
    </header>
  );
};

export default MainHeader;
