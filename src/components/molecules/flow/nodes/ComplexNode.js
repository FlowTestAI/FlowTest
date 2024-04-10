import * as React from 'react';
import { PropTypes } from 'prop-types';
import FlowNode from 'components/atoms/flow/FlowNode';
import useCanvasStore from 'stores/CanvasStore';
import { getAllFlowTests } from 'stores/utils';
import useCollectionStore from 'stores/CollectionStore';

const ComplexNode = ({ id, data }) => {
  const setFlowForComplexNode = useCanvasStore((state) => state.setFlowForComplexNode);
  const collectionId = useCanvasStore((state) => state.collectionId);
  const flowTests = getAllFlowTests(useCollectionStore.getState().collections.find((c) => c.id === collectionId));

  const setFlow = (pathname) => {
    setFlowForComplexNode(id, pathname);
  };

  if (data.pathname) {
    if (!flowTests.find((f) => f === data.pathname)) {
      setFlow('');
    }
  }

  return (
    <FlowNode
      title='Flow Node'
      handleLeft={true}
      handleLeftData={{ type: 'target' }}
      handleRight={true}
      handleRightData={{ type: 'source' }}
    >
      <div>
        <select
          onChange={(e) => setFlow(e.target.value)}
          name='flow'
          value={data.pathname ? data.pathname : ''}
          className='h-12 outline-none max-w-32'
        >
          <option key='None' value=''>
            None
          </option>
          {flowTests.map((ft) => (
            <option key={ft} value={ft}>
              {ft}
            </option>
          ))}
        </select>
      </div>
    </FlowNode>
  );
};

ComplexNode.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ComplexNode;
