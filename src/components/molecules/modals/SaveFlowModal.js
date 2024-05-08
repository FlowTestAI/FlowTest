import React from 'react';
import { PropTypes } from 'prop-types';
import { InboxArrowDownIcon } from '@heroicons/react/24/outline';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { updateEnvironmentFile, updateFlowTest } from 'service/collection';
import { toast } from 'react-toastify';
import { OBJ_TYPES } from 'constants/Common';

export const saveHandle = (tab) => {
  if (tab.type == OBJ_TYPES.flowtest && tab.flowDataDraft) {
    updateFlowTest(tab.pathname, tab.flowDataDraft, tab.collectionId)
      .then((result) => {
        console.log(`Updated flowtest: path = ${tab.pathname}, collectionId = ${tab.collectionId}, result: ${result}`);
        toast.success(`Updated the flowtest: ${tab.pathname}`);
      })
      .catch((error) => {
        console.log(`Error updating flowtest = ${tab.pathname}: ${error}`);
        toast.error(`Error while updating flowtest: ${tab.pathname}`);
      });
  } else if (tab.type == OBJ_TYPES.environment && tab.variablesDraft) {
    updateEnvironmentFile(tab.name, tab.collectionId, tab.variablesDraft)
      .then((result) => {
        console.log(`Updated environment: name = ${tab.name}, collectionId = ${tab.collectionId}, result: ${result}`);
        toast.success(`Updated environment: ${tab.name}`);
      })
      .catch((error) => {
        console.log(`Error updating environment = ${tab.name}: ${error}`);
        toast.error(`Error while updating environment: ${tab.name}`);
      });
  }
};

const SaveFlowModal = ({ tab }) => {
  return (
    <>
      <div className='flex items-center justify-center h-12 pl-4 border-l border-neutral-300'>
        <button type='button' onClick={() => saveHandle(tab)}>
          <Tippy content='Save' placement='top'>
            <InboxArrowDownIcon className='w-5 h-5' />
          </Tippy>
        </button>
      </div>
    </>
  );
};

SaveFlowModal.propTypes = {
  tab: PropTypes.object.isRequired,
};

export default SaveFlowModal;
