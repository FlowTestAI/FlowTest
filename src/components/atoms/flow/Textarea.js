import React from 'react';

const Textarea = ({ id, placeHolder, onChangeHandler, name, value, rows }) => {
  return (
    <textarea
      id={id}
      placeholder={placeHolder}
      className='nodrag nowheel min-h-12 w-full min-w-72 resize rounded border border-slate-700 bg-background-light p-2.5 text-sm text-slate-900 outline-none'
      name={name}
      onChange={onChangeHandler}
      rows={rows}
      value={value}
    />
  );
};

export default Textarea;
