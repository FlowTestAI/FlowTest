import axios from 'axios'

const baseURL = process.env.NODE_ENV === 'production' ? window.location.origin : window.location.origin.replace(':3001', ':3500')

const client = axios.create({
    baseURL: `${baseURL}/api/v1`,
    headers: {
        'Content-type': 'application/json'
    }
})

const getAllFlowTest = () => client.get('/flowtest')

const getSpecificFlowTest = (id) => client.get(`/flowtest/${id}`)

const createNewFlowTest = (body) => client.post(`/flowtest`, body)

const updateFlowTest = (id, body) => client.put(`/flowtest/${id}`, body)

const deleteFlowTest = (id) => client.delete(`/flowtest/${id}`)

const runRequest = (body) => client.put(`/request`, body)

export default {
    getAllFlowTest,
    getSpecificFlowTest,
    createNewFlowTest,
    updateFlowTest,
    deleteFlowTest,
    runRequest
}
