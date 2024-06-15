// lib/axiosClient.ts
const axios = require('axios');
const axiosRetry = require('axios-retry').default;

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosRetry(axiosClient, {
  retries: 3, // Number of retries
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Time interval between retries (1000 ms = 1 second)
  },
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return error.response?.status === 500 || error.code === 'ECONNABORTED';
  },
});

module.exports = axiosClient;
