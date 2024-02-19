import { useState } from 'react';

export default (apiFunc) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const request = async (...args) => {
    try {
      const result = await apiFunc(...args);
      setData(result.data);
    } catch (err) {
      console.log(err);
      setError(err || 'Unexpected Error!');
      setData(null);
    }
  };

  return {
    data,
    error,
    request,
  };
};
