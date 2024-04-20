import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import FlowNode from 'components/atoms/flow/FlowNode';
import useCanvasStore from 'stores/CanvasStore';
import { getAllFlowTests } from 'stores/utils';
import useCollectionStore from 'stores/CollectionStore';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const ComplexNode = ({ id, data }) => {
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

  return (
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
            className='h-12 px-1 py-2 border rounded-lg outline-none max-w-48 border-neutral-500 text-neutral-500 outline-0 focus:w-auto focus:ring-0'
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
  );
};

ComplexNode.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ComplexNode;
