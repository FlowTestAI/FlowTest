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
          className='tw-min-h-80 tw-w-full tw-min-w-60 tw-rounded-lg tw-border tw-border-gray-300 tw-bg-gray-50 tw-p-2.5 tw-text-xs tw-text-gray-900 tw-outline-blue-300 focus:tw-border-blue-100 focus:tw-ring-blue-100'
        />
      </div>
    </FlowNode>
  );
};

export default OutputNode;
