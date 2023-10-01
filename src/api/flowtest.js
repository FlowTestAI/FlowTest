import client from './client'

const getAllFlowTest = () => client.get('/flowtest')

const getSpecificFlowTest = (id) => client.get(`/flowtest/${id}`)

const createNewFlowTest = (body) => client.post(`/flowtest`, body)

const updateFlowTest = (id, body) => client.put(`/flowtest/${id}`, body)

const deleteFlowTest = (id) => client.delete(`/flowtest/${id}`)

export default {
    getAllFlowTest,
    getSpecificFlowTest,
    createNewFlowTest,
    updateFlowTest,
    deleteFlowTest
}
