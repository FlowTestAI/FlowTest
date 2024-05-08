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

  const cmdAndSPressed = useKeyPress(['Meta+s', 'Strg+s']);

  return (
    <div className='p-4'>
      {cmdAndSPressed && saveHandle(tab)}
      <table className='w-full leading-normal'>
        <thead>
          <tr className='text-xs font-bold tracking-wider text-left uppercase bg-ghost-50 text-ghost-600'>
            <th className='p-5 border border-ghost-200 max-w-4'>S. No.</th>
            <th className='p-5 border border-ghost-200 '>Key</th>
            <th className='p-5 border border-ghost-200'>Value</th>
            <th className='p-5 border border-ghost-200 max-w-4'>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(variables).map(([key, value], index) => (
            <tr key={index} className='text-sm border-b border-gray-200 text-ghost-700 hover:bg-ghost-50'>
              <td className='p-5 whitespace-no-wrap max-w-4'>{index + 1}</td>
              <td className='p-5 whitespace-no-wrap'>{key}</td>
              <td className='p-5 whitespace-no-wrap'>{value}</td>
              <td className='p-5 whitespace-no-wrap max-w-4'>
                <div
                  className='relative inline-block p-2 text-left transition duration-200 ease-out rounded-md cursor-pointer hover:bg-ghost-200'
                  onClick={() => {
                    setDeleteKey(key);
                    setConfirmActionModalOpen(true);
                  }}
                >
                  <TrashIcon className='w-4 h-4' aria-hidden='true' />
                </div>
                <div
                  className='relative inline-block p-2 text-left transition duration-200 ease-out rounded-md cursor-pointer hover:bg-ghost-200'
                  onClick={() => {
                    setEditKey(key);
                    setEditValue(value);
                    setEditVariableModalOpen(true);
                  }}
                >
                  <PencilSquareIcon className='w-4 h-4' aria-hidden='true' />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='mt-6'>
        <Button
          btnType={BUTTON_TYPES.tertiary}
          isDisabled={false}
          onClickHandle={() => setAddVariableModalOpen(true)}
          fullWidth={true}
        >
          <PlusIcon className='w-5 h-5' />
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
