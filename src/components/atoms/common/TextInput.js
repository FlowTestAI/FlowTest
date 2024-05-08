import React from 'react';

const TextInput = ({ id, placeHolder, onChangeHandler, name, value }) => {
  return (
    <input
      id={id}
      type='text'
      placeholder={placeHolder}
      className='nodrag nowheel bg-background-light block w-full rounded border border-slate-700 p-2.5 text-sm text-slate-900 outline-none'
      name={name}
      onChange={onChangeHandler}
      value={value}
    />
  );
};

export default TextInput;
