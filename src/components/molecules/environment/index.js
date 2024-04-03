import React, { useState } from 'react';
import useEnvStore from 'stores/EnvStore';
import 'react-edit-text/dist/index.css';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import AddEnvVariableModal from '../modals/AddEnvVariableModal';
import ConfirmActionModal from '../modals/ConfirmActionModal';
import Button from 'components/atoms/common/Button';
import { BUTTON_TYPES, OBJ_TYPES } from 'constants/Common';

const Env = () => {
  const variables = useEnvStore((state) => state.variables);
  const handleAddVariable = useEnvStore((state) => state.handleAddVariable);
  const handleDeleteVariable = useEnvStore((state) => state.handleDeleteVariable);

  const [addVariableModalOpen, setAddVariableModalOpen] = useState(false);
  const [confirmActionModalOpen, setConfirmActionModalOpen] = useState(false);

  const [deleteKey, setDeleteKey] = useState('');

  return (
    <div className='p-4'>
      <table className='w-full leading-normal'>
        <thead>
          <tr>
            <th className='px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase border-r-0 max-w-4 rounded-tl-xl border-slate-400 bg-slate-200'>
              Serial Number
            </th>
            <th className='px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase border-slate-400 bg-slate-200'>
              Key
            </th>
            <th className='px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase border-slate-400 bg-slate-200 '>
              Value
            </th>
            <th className='px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase rounded-tr-xl border-slate-400 bg-slate-200'>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(variables).map(([key, value], index) => (
            <tr key={index} className='text-sm hover:bg-slate-100'>
              <td className='px-5 py-3 border-b border-gray-200 max-w-4'>
                <p className='text-gray-900 whitespace-no-wrap'>{index + 1}</p>
              </td>
              <td className='px-5 py-3 border-b border-gray-200'>
                <p className='text-gray-900 whitespace-no-wrap'>{key}</p>
              </td>
              <td className='px-5 py-3 border-b border-gray-200'>
                <p className='text-gray-900 whitespace-no-wrap'>{value}</p>
              </td>
              <td className='px-5 py-3 border-b border-gray-200'>
                <div
                  className='relative inline-block p-2 text-left transition duration-200 ease-out rounded rounded-l-none cursor-pointer hover:bg-slate-200'
                  onClick={() => {
                    setDeleteKey(key);
                    setConfirmActionModalOpen(true);
                  }}
                >
                  <TrashIcon className='w-4 h-4' aria-hidden='true' />
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
          <PlusIcon className='w-4 h-4' />
          <span>Add Variable</span>
        </Button>
      </div>
      <AddEnvVariableModal
        closeFn={() => setAddVariableModalOpen(false)}
        open={addVariableModalOpen}
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
