import * as React from 'react';
import FlowNode from 'components/atoms/flow/FlowNode';

/**
 * I have commented the code which is not required but do check it once
 */
const DelayNode = ({ data }) => {
  const [value, setValue] = React.useState(data.delay ? data.delay : 0);
  data.delay = value;

  /**
   * ToDo: Implement Debouncing for this function
   */
  const handleDelayInMsInputChange = (event) => {
    event.preventDefault();
    const delayInMs = event.target.value;
    setValue(delayInMs);
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

export default DelayNode;
