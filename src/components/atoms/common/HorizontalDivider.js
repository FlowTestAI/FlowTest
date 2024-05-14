import React from 'react';

const HorizontalDivider = ({ themeColor, themeStyles }) => {
  return (
    <div
      className={`h-[1px] w-full  ${themeColor ? themeColor : 'bg-gray-300'}  ${themeStyles ? themeStyles : ''}`}
    ></div>
  );
};

export default HorizontalDivider;
