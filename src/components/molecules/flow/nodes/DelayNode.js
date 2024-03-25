import * as React from 'react';
import { PropTypes } from 'prop-types';
import FlowNode from 'components/atoms/flow/FlowNode';
import useCanvasStore from 'stores/CanvasStore';

const DelayNode = ({ id, data }) => {
  const setDelayNodeValue = useCanvasStore((state) => state.setDelayNodeValue);

  /**
   * ToDo: Implement Debouncing for this function
   */
  const handleDelayInMsInputChange = (event) => {
    event.preventDefault();
    setDelayNodeValue(id, event.target.value);
  };

  return (
    <FlowNode
      title='Delay (ms)'
      handleLeft={true}
      handleLeftData={{ type: 'target' }}
      handleRight={true}
      handleRightData={{ type: 'source' }}
    >
      <div>
        <input
          type='number'
          placeholder='0'
          className='nodrag nowheel  mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-blue-300 focus:border-blue-100 focus:ring-blue-100'
          name='delay-in-ms'
          onChange={handleDelayInMsInputChange}
        />
      </div>
    </FlowNode>
  );
};

DelayNode.propTypes = {
  data: PropTypes.object.isRequired,
};

export default DelayNode;
