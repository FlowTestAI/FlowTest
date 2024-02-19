import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'production' ? window.location.origin : window.location.origin.replace(':3001', ':3500');

const client = axios.create({
  baseURL: `${baseURL}/api/v1`,
  headers: {
    'Content-type': 'application/json',
  },
});

const getFlowTest = (path) => client.get(`/flowtest?path=${path}`);

const createNewFlowTest = (name, path, flowData) => client.post(`/flowtest`, { name, path, flowData });

const updateFlowTest = (path, flowData) => client.put(`/flowtest`, { path, flowData });

const deleteFlowTest = (path) => client.delete(`/flowtest?path=${path}`);

const runRequest = (body) => client.put(`/request`, body);

export default {
  getFlowTest,
  createNewFlowTest,
  updateFlowTest,
  deleteFlowTest,
  runRequest,
};
