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
    console.log(`\n handleDelayInMsInputChange :: ${delayInMs} \n`);
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
          className='nodrag nowheel  tw-mb-2 tw-block tw-w-full tw-rounded-lg tw-border tw-border-gray-300 tw-bg-gray-50 tw-p-2.5 tw-text-sm tw-text-gray-900 tw-outline-blue-300 focus:tw-border-blue-100 focus:tw-ring-blue-100'
          name='delay-in-ms'
          onChange={handleDelayInMsInputChange}
        />
      </div>
    </FlowNode>
  );
};

export default DelayNode;
