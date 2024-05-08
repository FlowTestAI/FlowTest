import * as React from 'react';
import { PropTypes } from 'prop-types';
import FlowNode from 'components/atoms/flow/FlowNode';
import useCanvasStore from 'stores/CanvasStore';
import NumberInput from 'components/atoms/common/NumberInput';

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
      <NumberInput
        onChangeHandler={handleDelayInMsInputChange}
        name={'delay-in-ms'}
        value={data.delay ? data.delay : 0}
      />
    </FlowNode>
  );
};

DelayNode.propTypes = {
  data: PropTypes.object.isRequired,
};

export default DelayNode;
