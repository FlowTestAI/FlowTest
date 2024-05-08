import React from 'react';

const TextInputWithLabel = ({ children, placeHolder, onChangeHandler, name, value, label }) => {
  return (
    <div className='flex items-center justify-between h-full text-sm border rounded-md bg-background-light border-slate-700 text-slate-900'>
      <input
        type='text'
        placeholder={placeHolder}
        className='nodrag nowheel block w-full bg-transparent p-2.5 text-sm outline-none'
        name={name}
        onChange={onChangeHandler}
        value={value}
      />
      <div className='p-4 border-l rounded-tr rounded-br border-l-neutral-500'>{label}</div>
    </div>
  );
};

export default TextInputWithLabel;
