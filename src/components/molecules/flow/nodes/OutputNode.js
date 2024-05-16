import * as React from 'react';
import { PropTypes } from 'prop-types';
import FlowNode from 'components/atoms/flow/FlowNode';
import { Editor } from 'components/atoms/Editor';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import OuputNodeExpandedModal from 'components/molecules/modals/OutputNodeExpandedModal';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const OutputNode = ({ id, data }) => {
  const [outputExpandedModal, setOutputExpandedModal] = React.useState(false);

  return (
    <FlowNode
      title='Output'
      handleLeft={true}
      handleLeftData={{ type: 'target' }}
      handleRight={true}
      handleRightData={{ type: 'source' }}
    >
      {data.output ? (
        <button type='button' onClick={() => setOutputExpandedModal(true)}>
          <Tippy content='Expand' placement='top'>
            <ArrowsPointingOutIcon className='w-5 h-5' />
          </Tippy>
        </button>
      ) : (
        <></>
      )}
      <div className='w-full text-xs text-gray-900 border border-gray-300 rounded-lg nodrag nowheel min-w-72 bg-gray-50 outline-blue-300 focus:border-blue-100 focus:ring-blue-100'>
        {data.output ? (
          <Editor
            name='output-text'
            value={JSON.stringify(data.output, null, 2)}
            readOnly={true}
            classes={'w-96 h-96'}
          />
        ) : (
          <div className='p-2'>{'Run flow to see data'}</div>
        )}
      </div>
      <OuputNodeExpandedModal
        closeFn={() => setOutputExpandedModal(false)}
        open={outputExpandedModal}
        data={data.output}
      />
    </FlowNode>
  );
};

OutputNode.propTypes = {
  data: PropTypes.object.isRequired,
};

export default OutputNode;
