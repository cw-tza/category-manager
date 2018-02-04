const xmlMapper = require('../xml/category-xml-mapper')
const axios = require('axios')
const base64 = require('base-64')

require('./client-debug')

class Client {
  constructor (apiUrl, apiToken, coverId, vodServiceId) {
    this.coverId = coverId
    this.vodServiceId = vodServiceId
    this.axios = axios.create({
      baseURL: `${apiUrl}/categories`,
      headers: {
        put: {'Content-Type': 'application/xml'},
        post: {'Content-Type': 'application/xml'},
        common: {
          Authorization: `Basic ${base64.encode(apiToken)}`,
          Accept: 'application/xml'
        }
      }
    })
  }

  async get (page) {
    return this.axios
      .get('/categories', {params: {identifier_type: 'external_id', page: page}})
      .then(result => xmlMapper.read(result.data))
  }

  async post (category) {
    category.$ = {...category.$, coverId: this.coverId, serviceId: this.vodServiceId}

    return this.axios
      .post('/categories', xmlMapper.write(category), {params: {identifier_type: 'external_id'}})
      .then(result => result.status)
  }

  async put (category) {
    return this.axios
      .put(`/categories/${category.id}`, xmlMapper.write(category))
      .then(result => result.status)
  }
}

module.exports = Client
