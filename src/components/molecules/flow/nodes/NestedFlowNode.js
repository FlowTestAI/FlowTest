import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import FlowNode from 'components/atoms/flow/FlowNode';
import useCanvasStore from 'stores/CanvasStore';
import { getAllFlowTests } from 'stores/utils';
import useCollectionStore from 'stores/CollectionStore';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { readFlowTest } from 'service/collection';
import { toast } from 'react-toastify';

// ToDo: Change standard select element(s) with headless list element
const NestedFlowNode = ({ id, data }) => {
  const { ipcRenderer } = window;

  const setFlowForComplexNode = useCanvasStore((state) => state.setFlowForComplexNode);
  const collectionId = useCanvasStore.getState().collectionId;
  const collection = useCollectionStore.getState().collections.find((c) => c.id === collectionId);
  const flowTests = getAllFlowTests(collection).map((fullPath) => {
    return ipcRenderer.relative(collection.pathname, fullPath);
  });

  if (data.relativePath) {
    if (!flowTests.find((f) => f === data.relativePath)) {
      setFlowForComplexNode(id, '');
    }
  }

  const handleMouseClick = (event, relativePath) => {
    if ((event.metaKey || event.ctrlKey) && event.type === 'click') {
      if (relativePath && relativePath.trim() != '') {
        readFlowTest(ipcRenderer.join(collection.pathname, relativePath), collectionId)
          .then((result) => {
            console.log(`Read flowtest: path = ${relativePath}, collectionId = ${collectionId}`);
          })
          .catch((error) => {
            console.log(`Error reading flowtest: ${error}`);
            toast.error(`Error reading flowtest`);
          });
      }
    }
  };

  return (
    <div onClick={(e) => handleMouseClick(e, data.relativePath)}>
      <FlowNode
        title='Flow Node'
        handleLeft={true}
        handleLeftData={{ type: 'target' }}
        handleRight={true}
        handleRightData={{ type: 'source' }}
      >
        <div>
          <Tippy
            content={data.relativePath && data.relativePath !== '' ? data.relativePath : 'Select a flow'}
            placement='top'
            maxWidth='none'
          >
            <select
              onChange={(event) => {
                const value = event.target?.value;
                setFlowForComplexNode(id, value);
              }}
              name='flow'
              value={data.relativePath ? data.relativePath : ''}
              className='h-12 p-2 border rounded outline-none cursor-default max-w-48 border-cyan-950 bg-background-light'
            >
              <option key='None' value=''>
                Select a flow
              </option>
              {flowTests.map((flowTestPath) => {
                return (
                  <option key={flowTestPath} value={flowTestPath} className='overflow-scroll'>
                    {flowTestPath}
                  </option>
                );
              })}
            </select>
          </Tippy>

          <p className='hidden'></p>
        </div>
      </FlowNode>
    </div>
  );
};

NestedFlowNode.propTypes = {
  data: PropTypes.object.isRequired,
};

export default NestedFlowNode;
