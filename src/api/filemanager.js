import axios from 'axios'

const baseURL = process.env.NODE_ENV === 'production' ? window.location.origin : window.location.origin.replace(':3001', ':3500')

const client = axios.create({
    baseURL: `${baseURL}/api/v1`,
    headers: {
        'Content-type': 'application/json'
    }
})

const createDirectory = (body) => client.post('/file-manager/directory', body)

const deleteDirectory = (path) => client.delete(`/file-manager/directory?path=${path}`)

const createFile = (body) => client.post('/file-manager/file', body)

const updateFile = (body) => client.put('/file-manager/file', body)

const deleteFile = (path) => client.delete(`/file-manager/file?path=${path}`)

export default {
    createDirectory,
    deleteDirectory,
    createFile,
    updateFile,
    deleteFile
}
