import React from 'react';

const NumberInput = ({ placeHolder, onChangeHandler, name, value }) => {
  return (
    <input
      type='number'
      placeholder={placeHolder}
      className='nodrag nowheel bg-background-light block w-full rounded border border-slate-700 p-2.5 text-sm text-slate-900 outline-none'
      name={name}
      onChange={onChangeHandler}
      value={value}
    />
  );
};

export default NumberInput;
