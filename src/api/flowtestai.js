import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'production' ? window.location.origin : window.location.origin.replace(':3001', ':3500');

const client = axios.create({
  baseURL: `${baseURL}/api/v1`,
  headers: {
    'Content-type': 'application/json',
  },
});

const createFlowTestAI = (body) => client.post(`/flowtest/ai`, body);

export default {
  createFlowTestAI,
};
