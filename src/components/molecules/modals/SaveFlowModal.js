import React from 'react';
import { PropTypes } from 'prop-types';
import { InboxArrowDownIcon } from '@heroicons/react/24/outline';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { updateEnvironmentFile, updateFlowTest } from 'service/collection';
import { toast } from 'react-toastify';
import { BUTTON_TYPES, OBJ_TYPES } from 'constants/Common';
import Button from 'components/atoms/common/Button';
import { isSaveNeeded } from 'components/atoms/util';

export const saveHandle = (tab) => {
  if (tab.type == OBJ_TYPES.flowtest && tab.flowDataDraft) {
    if (isSaveNeeded(tab.flowData, tab.flowDataDraft)) {
      updateFlowTest(tab.pathname, tab.flowDataDraft, tab.collectionId)
        .then((result) => {
          console.log(
            `Updated flowtest: path = ${tab.pathname}, collectionId = ${tab.collectionId}, result: ${result}`,
          );
          toast.success(`Updated the flowtest: ${tab.pathname}`);
        })
        .catch((error) => {
          console.log(`Error updating flowtest = ${tab.pathname}: ${error}`);
          toast.error(`Error while updating flowtest: ${tab.pathname}`);
        });
    } else {
      toast.info('Nothing to save');
    }
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
    <Button
      btnType={BUTTON_TYPES.secondary}
      isDisabled={false}
      onClickHandle={() => saveHandle(tab)}
      fullWidth={true}
      onlyIcon={true}
      padding={'px-4 py-2.5'}
    >
      <Tippy content='Save' placement='top'>
        <InboxArrowDownIcon className='w-5 h-5' />
      </Tippy>
    </Button>
  );
};

SaveFlowModal.propTypes = {
  tab: PropTypes.object.isRequired,
};

export default SaveFlowModal;
