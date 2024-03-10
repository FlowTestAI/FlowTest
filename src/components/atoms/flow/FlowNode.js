import React from 'react';
import { Handle, Position } from 'reactflow';

const FlowNode = ({ children, title, handleLeft, handleLeftData, handleRight, handleRightData }) => {
  return (
    <>
      {handleLeft ? <Handle type={handleLeftData?.type} position={Position.Left} /> : ''}
      <div
        className={`${
          children ? 'flex-col px-4 py-2' : 'items-center justify-center px-6 py-4'
        } flex rounded-md border-2 border-neutral-200 bg-white`}
      >
        <h3 className={`${children ? 'mb-4' : ''}  text-base font-semibold`}>{title}</h3>
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
