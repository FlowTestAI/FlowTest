import React from 'react';
import FlowTestAI from 'assets/icons/FlowTestAI-black.png';

const AppLogo = ({ styleClasses }) => {
  return (
    <div className={styleClasses}>
      <img src={FlowTestAI} alt='FlowTestAI app logo' />
    </div>
  );
};

export default AppLogo;
