import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from 'reactflow';
import useCanvasStore from 'stores/CanvasStore';
import Button from 'components/atoms/common/Button';
import { BUTTON_INTENT_TYPES, BUTTON_TYPES } from 'constants/Common';
import { XMarkIcon } from '@heroicons/react/24/outline';

// eslint-disable-next-line react/prop-types
export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
  const setEdges = useCanvasStore((state) => state.setEdges);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
          }}
          className='nodrag nopan'
        >
          <Button
            btnType={BUTTON_TYPES.secondary}
            intentType={BUTTON_INTENT_TYPES.error}
            classes={'rounded-full'}
            isDisabled={false}
            onlyIcon={true}
            onClickHandle={(evt) => {
              evt.stopPropagation();
              // alert(`remove ${id}`);
              setEdges(useCanvasStore.getState().edges.filter((e) => e.id !== id));
            }}
            fullWidth={false}
          >
            <XMarkIcon className='w-3 h-3' />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
