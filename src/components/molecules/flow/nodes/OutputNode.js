import * as React from 'react';
import { PropTypes } from 'prop-types';
import FlowNode from 'components/atoms/flow/FlowNode';
import JsonEditor from 'components/atoms/JsonEditor';

const OutputNode = ({ id, data }) => {
  return (
    <FlowNode
      title='Output'
      handleLeft={true}
      handleLeftData={{ type: 'target' }}
      handleRight={true}
      handleRightData={{ type: 'source' }}
    >
      <div className='w-full text-xs text-gray-900 border border-gray-300 rounded-lg nodrag nowheel min-h-96 min-w-80 bg-gray-50 outline-blue-300 focus:border-blue-100 focus:ring-blue-100'>
        <JsonEditor
          name='output-text'
          value={data.output ? JSON.stringify(data.output, null, 2) : 'Run flow to see data'}
          placeholder='Run flow to see data'
          readOnly={true}
          maxLines={20}
        />
      </div>
    </FlowNode>
  );
};

OutputNode.propTypes = {
  data: PropTypes.object.isRequired,
};

export default OutputNode;
