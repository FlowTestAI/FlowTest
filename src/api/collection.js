import axios from 'axios'

const baseURL = process.env.NODE_ENV === 'production' ? window.location.origin : window.location.origin.replace(':3001', ':3500')

const client = axios.create({
    baseURL: `${baseURL}/api/v1`,
    headers: {
        'Content-type': 'multipart/form-data'
    }
})

const createCollection = (file, rootPath) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file, file.name);
    bodyFormData.append('rootPath', rootPath)
    return client.post('/collection', bodyFormData);
}

const getAllCollection = () => client.get('/collection')

const getCollection = (id) => client.get(`/collection/${id}`)

const deleteCollection = (id) => client.delete(`/collection/${id}`)

export default {
    createCollection,
    getAllCollection,
    deleteCollection,
    getCollection
}
