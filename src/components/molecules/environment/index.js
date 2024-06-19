import React, { useState } from 'react';
import useEnvStore from 'stores/EnvStore';
import 'react-edit-text/dist/index.css';
import { TrashIcon, PlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import AddEnvVariableModal from '../modals/AddEnvVariableModal';
import ConfirmActionModal from '../modals/ConfirmActionModal';
import Button from 'components/atoms/common/Button';
import { BUTTON_TYPES, OBJ_TYPES } from 'constants/Common';
import EditEnvVariableModal from '../modals/EditEnvVariableModal';
import { useKeyPress } from 'reactflow';
import { saveHandle } from '../modals/SaveFlowModal';
import Mousetrap from 'mousetrap';

const Env = ({ tab }) => {
  const variables = useEnvStore((state) => state.variables);
  const handleAddVariable = useEnvStore((state) => state.handleAddVariable);
  const handleDeleteVariable = useEnvStore((state) => state.handleDeleteVariable);

  const [addVariableModalOpen, setAddVariableModalOpen] = useState(false);
  const [editVariableModalOpen, setEditVariableModalOpen] = useState(false);
  const [confirmActionModalOpen, setConfirmActionModalOpen] = useState(false);

  const [deleteKey, setDeleteKey] = useState('');
  const [editKey, setEditKey] = useState('');
  const [editValue, setEditValue] = useState('');

  //const cmdAndSPressed = useKeyPress(['Meta+s', 'Strg+s']);
  // Bind Ctrl+S and Cmd+S
  Mousetrap.bind(['ctrl+s', 'command+s'], function (e) {
    e.preventDefault();
    saveHandle(tab);
    return false;
  });

  return (
    <div className='p-4'>
      <table className='w-full leading-normal'>
        <thead>
          <tr className='bg-ghost-50 text-ghost-600 text-left text-xs font-bold uppercase tracking-wider'>
            <th className='border-ghost-200 max-w-4 border p-5'>S. No.</th>
            <th className='border-ghost-200 border p-5 '>Key</th>
            <th className='border-ghost-200 border p-5'>Value</th>
            <th className='border-ghost-200 max-w-4 border p-5'>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(variables).map(([key, value], index) => (
            <tr key={index} className='text-ghost-700 hover:bg-ghost-50 border-b border-gray-200 text-sm'>
              <td className='whitespace-no-wrap max-w-4 p-5'>{index + 1}</td>
              <td className='whitespace-no-wrap p-5'>{key}</td>
              <td className='whitespace-no-wrap p-5'>{value}</td>
              <td className='whitespace-no-wrap max-w-4 p-5'>
                <div
                  className='hover:bg-ghost-200 relative inline-block cursor-pointer rounded-md p-2 text-left transition duration-200 ease-out'
                  onClick={() => {
                    setDeleteKey(key);
                    setConfirmActionModalOpen(true);
                  }}
                >
                  <TrashIcon className='h-4 w-4' aria-hidden='true' />
                </div>
                <div
                  className='hover:bg-ghost-200 relative inline-block cursor-pointer rounded-md p-2 text-left transition duration-200 ease-out'
                  onClick={() => {
                    setEditKey(key);
                    setEditValue(value);
                    setEditVariableModalOpen(true);
                  }}
                >
                  <PencilSquareIcon className='h-4 w-4' aria-hidden='true' />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='mt-6'>
        <Button
          btnType={BUTTON_TYPES.primary}
          isDisabled={false}
          onClickHandle={() => setAddVariableModalOpen(true)}
          fullWidth={true}
        >
          <PlusIcon className='h-5 w-5' />
          <span>Add Variable</span>
        </Button>
      </div>
      <AddEnvVariableModal
        closeFn={() => setAddVariableModalOpen(false)}
        open={addVariableModalOpen}
        handleAddVariable={(key, value) => handleAddVariable(key, value)}
      />
      <EditEnvVariableModal
        closeFn={() => setEditVariableModalOpen(false)}
        open={editVariableModalOpen}
        editKey={editKey}
        editValue={editValue}
        handleAddVariable={(key, value) => handleAddVariable(key, value)}
      />
      <ConfirmActionModal
        closeFn={() => setConfirmActionModalOpen(false)}
        open={confirmActionModalOpen}
        message='Do you want to delete this variable?'
        actionFn={() => {
          handleDeleteVariable(deleteKey);
          setConfirmActionModalOpen(false);
        }}
      />
    </div>
  );
};

export default Env;
