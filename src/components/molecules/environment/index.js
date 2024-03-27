import React, { useState } from 'react';
import useEnvStore from 'stores/EnvStore';
import 'react-edit-text/dist/index.css';
import { TrashIcon } from '@heroicons/react/24/outline';
import AddEnvVariableModal from '../modals/AddEnvVariableModal';
import ConfirmActionModal from '../modals/ConfirmActionModal';

const Env = () => {
  const variables = useEnvStore((state) => state.variables);
  const handleAddVariable = useEnvStore((state) => state.handleAddVariable);
  const handleDeleteVariable = useEnvStore((state) => state.handleDeleteVariable);

  const [addVariableModalOpen, setAddVariableModalOpen] = useState(false);
  const [confirmActionModalOpen, setConfirmActionModalOpen] = useState(false);

  const [deleteKey, setDeleteKey] = useState('');

  return (
    <div className='p-4'>
      {/* <div>Test Tab panel for environment</div> */}
      <div className='overflow-x-auto'>
        <table className='table table-zebra'>
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Key</th>
              <th>Value</th>
              {/* <th>New Value</th> */}
            </tr>
          </thead>
          <tbody>
            {Object.entries(variables).map(([key, value], index) => (
              <tr key={index}>
                <th>{index}</th>
                <td>{key}</td>
                <td>{value}</td>
                <td>
                  <div
                    className='relative inline-block p-2 text-left transition duration-200 ease-out rounded rounded-l-none hover:bg-slate-200'
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
        <button onClick={() => setAddVariableModalOpen(true)}>+ Add Variable</button>
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
