import axios from 'axios'

const baseURL = process.env.NODE_ENV === 'production' ? window.location.origin : window.location.origin.replace(':8080', ':3500')

const apiClient = axios.create({
    baseURL: `${baseURL}/api/v1`,
    headers: {
        'Content-type': 'application/json'
    }
})

export default apiClient