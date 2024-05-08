import React from 'react';

const Textarea = ({ placeHolder, onChangeHandler, name, value, rows }) => {
  return (
    <textarea
      placeholder={placeHolder}
      className='nodrag nowheel bg-background-light min-h-12 w-full min-w-72 resize rounded border border-slate-700 p-2.5 text-sm text-slate-900 outline-none'
      name={name}
      onChange={onChangeHandler}
      rows={rows}
      value={value}
    />
  );
};

export default Textarea;
