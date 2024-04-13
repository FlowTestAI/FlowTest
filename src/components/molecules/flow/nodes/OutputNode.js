import * as React from 'react';
import { PropTypes } from 'prop-types';
import FlowNode from 'components/atoms/flow/FlowNode';

const OutputNode = ({ id, data }) => {
  console.log('output node id: ', id);
  console.log('output node data: ', data);

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
          value={data.output ? JSON.stringify(data.output, undefined, 4) : 'Run flow to see data'}
          placeholder='Run flow to see data'
          className='nodrag nowheel min-h-80 w-full min-w-60 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-xs text-gray-900 outline-blue-300 focus:border-blue-100 focus:ring-blue-100'
        />
      </div>
    </FlowNode>
  );
};

OutputNode.propTypes = {
  data: PropTypes.object.isRequired,
};

export default OutputNode;
