import React from 'react';
import { PropTypes } from 'prop-types';
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';

const EditableTextItem = ({ initialText }) => {
  // ToDo: Fix: as of now it is taking empty value which should not be the case
  return <EditText name='editText' className='text-xl' defaultValue={initialText} placeholder={initialText} />;
};

// https://legacy.reactjs.org/docs/typechecking-with-proptypes.html
EditableTextItem.propTypes = {
  initialText: PropTypes.string.isRequired,
};

export default EditableTextItem;
