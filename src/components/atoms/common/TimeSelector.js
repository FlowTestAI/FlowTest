import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ClockIcon } from '@heroicons/react/24/outline';

const TimeSelector = ({ optionsData, defaultOptionData, onSelectHandler = () => null }) => {
  return (
    <div className='flex items-center justify-between gap-2 pl-4 outline-none'>
      <ClockIcon className='w-5 h-5' />
      <select
        onChange={onSelectHandler}
        name='timer-selector'
        className='w-32 h-12 px-1 py-2 bg-transparent outline-0 focus:ring-0'
      >
        <option key='default' value={defaultOptionData.value ? defaultOptionData.value : ''}>
          {defaultOptionData.label ? defaultOptionData.label : 'None'}
        </option>
        {optionsData.map((optionData, index) => (
          <option key={index} value={optionData.value}>
            {optionData.label}
          </option>
        ))}
      </select>
    </div>
  );
};

TimeSelector.propTypes = {};

export default TimeSelector;
