import React from 'react';
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';

const EditableTextItem = ({ initialText }) => {
  // ToDo: Fix: as of now it is taking empty value which should not be the case
  return <EditText name='editText' className='tw-text-xl' defaultValue={initialText} placeholder={initialText} />;
};

export default EditableTextItem;
