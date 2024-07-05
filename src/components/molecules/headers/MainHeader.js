import React from 'react';
import ThemeController from 'components/atoms/ThemeController';
import AppLogo from 'components/atoms/Logo';
import useSettingsStore from 'stores/SettingsStore';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const MainHeader = () => {
  const appVersion = useSettingsStore((state) => state.appVersion);

  return (
    // <header className='flex items-center justify-between px-4 py-3 font-semibold tracking-widest dark:bg-slate-800 dark:text-white'>
    <header className='flex items-center justify-between px-4 py-3 font-semibold tracking-widest'>
      <div className='flex items-center gap-3'>
        <AppLogo styleClasses='w-6 h-6' />
        <div className='flex items-baseline gap-1'>
          <h2>FlowTestAI</h2>
          <span className='text-xs font-normal'>
            <a href='https://github.com/FlowTestAI/FlowTest/releases' target='_blank' rel='noreferrer' className='link'>
              {`v${appVersion.current}`}
            </a>
          </span>
          {appVersion.current != appVersion.latest ? (
            <span className='text-xs font-normal'>
              <Tippy content={`v${appVersion.latest} available`} placement='top'>
                <ExclamationCircleIcon className='w-5 h-5' />
              </Tippy>
            </span>
          ) : (
            <></>
          )}
        </div>
      </div>
      <ThemeController />
    </header>
  );
};

export default MainHeader;
