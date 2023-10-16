import client from './client'

const createCollection = (body) => client.post('/collection', body)

const getAllCollection = () => client.get('/collection')

export default {
    createCollection,
    getAllCollection
}
