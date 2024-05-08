import React from 'react';
import { PropTypes } from 'prop-types';
import { Handle, Position } from 'reactflow';

const FlowNode = ({ children, title, handleLeft, handleLeftData, handleRight, handleRightData }) => {
  return (
    <>
      {handleLeft ? <Handle type={handleLeftData?.type} position={Position.Left} /> : ''}
      <div
        className={`${
          children ? 'flex-col' : 'items-center justify-center px-6 py-4'
        } bg-background-lighter flex rounded-md border-2 border-slate-300`}
      >
        {children ? (
          <>
            <div className='px-4 py-2 border-b-2 border-slate-300'>
              <h3 className='text-xl font-medium'>{title}</h3>
            </div>
            <div className='p-4'>{children}</div>
          </>
        ) : (
          <>
            <h3 className='text-xl font-medium'>{title}</h3>
            {children}
          </>
        )}
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

FlowNode.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  handleLeft: PropTypes.node.isRequired,
  handleLeftData: PropTypes.object.isRequired,
  handleRight: PropTypes.node.isRequired,
  handleRightData: PropTypes.object.isRequired,
};

export default FlowNode;
