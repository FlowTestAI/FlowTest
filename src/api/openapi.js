import client from './client'

const parseOpenApiSpec = () => client.get('/parse/')

export default {
    parseOpenApiSpec
}
