import React from 'react';
import ThemeController from 'components/atoms/ThemeController';

const MainHeader = () => {
  return (
    <header className='flex items-center justify-between px-4 py-2 font-semibold tracking-widest border-b border-neutral-300'>
      <h2>FlowTestAI</h2>
      <ThemeController />
    </header>
  );
};

export default MainHeader;
