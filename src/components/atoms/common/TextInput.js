import React from 'react';

const TextInput = ({ id, placeHolder, onChangeHandler, name, value, disableState }) => {
  const mainStyles =
    'nodrag nowheel block w-full rounded border border-slate-700 bg-background-light p-2.5 text-sm outline-none';
  const intentStyles = disableState ? 'cursor-not-allowed text-slate-400' : 'text-slate-900';
  return (
    <input
      id={id}
      type='text'
      placeholder={placeHolder}
      className={`${mainStyles} ${intentStyles}`}
      name={name}
      onChange={onChangeHandler}
      value={value}
      disabled={disableState}
    />
  );
};

export default TextInput;
