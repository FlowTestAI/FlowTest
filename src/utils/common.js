export const getInputType = (type) => {
  if (type == 'Number') {
    return 'number';
  } else {
    return 'text';
  }
};

export const getDefaultValue = (type) => {
  if (type === 'Number') {
    return 0;
  } else if (type === 'Boolean') {
    return false;
  } else {
    return '';
  }
};
