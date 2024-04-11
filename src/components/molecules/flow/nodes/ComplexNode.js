import * as React from 'react';
import { PropTypes } from 'prop-types';
import FlowNode from 'components/atoms/flow/FlowNode';
import useCanvasStore from 'stores/CanvasStore';
import { getAllFlowTests } from 'stores/utils';
import useCollectionStore from 'stores/CollectionStore';

const ComplexNode = ({ id, data }) => {
  const { ipcRenderer } = window;

  const setFlowForComplexNode = useCanvasStore((state) => state.setFlowForComplexNode);
  const collectionId = useCanvasStore.getState().collectionId;
  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);
  const flowTests = getAllFlowTests(collection).map((fullPath) => {
    return ipcRenderer.relative(collection.pathname, fullPath);
  });

  const setFlow = (relativePath) => {
    setFlowForComplexNode(id, relativePath);
  };

  if (data.relativePath) {
    if (!flowTests.find((f) => f === data.relativePath)) {
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
          value={data.relativePath ? data.relativePath : ''}
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
