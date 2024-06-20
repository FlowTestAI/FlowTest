// lib/axiosClient.ts
const axios = require('axios');
const axiosRetry = require('axios-retry').default;

const axiosClient = (baseUrl, accessId, accessKey) => {
  const client = axios.create({
    baseURL: `${baseUrl}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  axiosRetry(client, {
    retries: 3, // Number of retries
    retryDelay: (retryCount) => {
      return retryCount * 1000; // Time interval between retries (1000 ms = 1 second)
    },
    retryCondition: (error) => {
      // Retry on network errors or rate limit errors or 5xx server errors
      return error.response?.status === 500 || error.response?.status === 429 || error.code === 'ECONNABORTED';
    },
  });

  return client;
};

module.exports = {
  axiosClient,
};
