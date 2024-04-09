import React from 'react';
import FlowTriangle from 'assets/icons/flow-triangle.png';
// import FlowTestAI from 'assets/icons/FlowTestAI-black.png';
// import FlowGPU from 'assets/icons/flow-GPU.png';
// import FlowTriangle from 'assets/icons/flow-triangle.png';

const AppLogo = ({ styleClasses }) => {
  return (
    <div className={styleClasses}>
      <img src={FlowTriangle} alt='FlowTestAI app logo' />
    </div>
  );
};

export default AppLogo;
