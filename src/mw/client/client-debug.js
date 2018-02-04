const qs = require('querystring')

const request = (debug, config) => debug(
  `REQ ${config.method} ${config.baseURL}${config.url}`,
  `params: ${qs.stringify(config.params)}`,
  `body: ${config.request ? config.request.body : ''}`
)

const response = (debug, response) => debug(
  `RES ${response.status} ${response.config.url}`,
  `body: ${response.data}`
)

const error = (debug, error) => debug('Boom', error)

module.exports = require('axios-debug-log')({request, response, error})
