import React from 'react';
import useEnvStore from 'stores/EnvStore';
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import { toast } from 'react-toastify';
import { TrashIcon } from '@heroicons/react/24/outline';

const Env = () => {
  const variables = useEnvStore((state) => state.variables);
  const handleAddRow = useEnvStore((state) => state.handleAddRow);
  const handleKeyChange = useEnvStore((state) => state.handleKeyChange);
  const handleValueChange = useEnvStore((state) => state.handleValueChange);

  const handleSave = ({ name, value, previousValue }) => {
    console.log('handle save');
    if (name === 'editVariableKey') {
      const existingVar = Object.keys(variables).find((key) => key === value);
      if (existingVar) {
        toast.error('A variable with the same name already exists');
      } else {
        handleKeyChange(value, previousValue);
      }
    } else {
      handleValueChange(name, value);
    }
  };

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
                <td>
                  <EditText name='editVariableKey' className='text-xl' value={key} onSave={handleSave} />
                </td>
                <td>
                  <EditText name={key} className='text-xl' value={value} onSave={handleSave} />
                </td>
                <td>
                  <div
                    className='relative inline-block p-2 text-left transition duration-200 ease-out rounded rounded-l-none hover:bg-slate-200'
                    onClick={() => {
                      console.log(`Delete ${key}`);
                    }}
                  >
                    <TrashIcon className='w-4 h-4' aria-hidden='true' />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleAddRow}>+ Add Variable</button>
      </div>
    </div>
  );
};

export default Env;
