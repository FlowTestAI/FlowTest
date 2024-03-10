import * as React from 'react';
import FlowNode from 'components/atoms/flow/FlowNode';

const OutputNode = ({ data }) => {
  const [output, setOutput] = React.useState(undefined);

  data.setOutput = setOutput;

  return (
    <FlowNode
      title='Output'
      handleLeft={true}
      handleLeftData={{ type: 'target' }}
      handleRight={true}
      handleRightData={{ type: 'source' }}
    >
      <div>
        <textarea
          name='output-text'
          value={output ? JSON.stringify(output, undefined, 4) : 'Run flow to see data'}
          placeholder='Run flow to see data'
          className='nodrag nowheel min-h-80 w-full min-w-60 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-xs text-gray-900 outline-blue-300 focus:border-blue-100 focus:ring-blue-100'
        />
      </div>
    </FlowNode>
  );
};

export default OutputNode;
