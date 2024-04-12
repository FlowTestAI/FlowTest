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

export const promiseWithTimeout = (promise, ms) => {
  // Create a new promise that rejects in <ms> milliseconds
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error('Timed out in ' + ms + 'ms.'));
    }, ms);
  });

  // Returns a race between our timeout and the passed in promise
  return Promise.race([promise, timeout]);
};
