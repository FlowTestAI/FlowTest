import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'production' ? window.location.origin : window.location.origin.replace(':3001', ':3500');

const client = axios.create({
  baseURL: `${baseURL}/api/v1`,
  headers: {
    'Content-type': 'application/json',
  },
});

const getAllAuthKeys = () => client.get('/authkey');

const getAuthKey = (id) => client.get(`/authkey/${id}`);

const createNewAuthKey = (body) => client.post(`/authkey`, body);

const updateAuthKey = (id, body) => client.put(`/authkey/${id}`, body);

const deleteAuthKey = (id) => client.delete(`/authkey/${id}`);

export default {
  getAllAuthKeys,
  getAuthKey,
  createNewAuthKey,
  updateAuthKey,
  deleteAuthKey,
};
