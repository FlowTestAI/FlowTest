import React from 'react';
import { Handle, Position } from 'reactflow';

const FlowNode = ({ children, title, handleLeft, handleLeftData, handleRight, handleRightData }) => {
  return (
    <>
      {handleLeft ? <Handle type={handleLeftData?.type} position={Position.Left} /> : ''}
      <div
        className={`${
          children ? 'tw-flex-col tw-px-4 tw-py-2' : 'tw-items-center tw-justify-center tw-px-6 tw-py-4'
        } tw-flex tw-rounded-md tw-border-2 tw-border-neutral-200 tw-bg-white`}
      >
        <h3 className={`${children ? 'tw-mb-4' : ''}  tw-text-base tw-font-semibold`}>{title}</h3>
        {children}
      </div>
      {handleRight ? (
        <Handle
          type={handleRightData.type}
          position={Position.Right}
          id={handleRightData.id}
          style={handleRightData.styles}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default FlowNode;
