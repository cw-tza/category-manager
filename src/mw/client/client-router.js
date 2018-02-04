const Client = require('./client-factory')
const config = require('./client-config')
const _ = require('lodash')

class ClientRouter {
  constructor () {
    this.portals = _.mapValues(config.get('portal'), value => new Client(value.url, value.apiToken, value.defaultCoverId, value.vodServiceId));
  }

  async sync (category, tenant) {
    const proxy = this.portals[tenant]
    return proxy[category.$.id ? 'put' : 'post'](category)
  }

  async all (tenant) {
    const proxy = this.portals[tenant]
    const nextPage = async (page) => {
      let results = await proxy.get({page: page})

      if (results.length > 0) {
        results = results.concat(await nextPage(page + 1))
      }

      return results
    }

    return nextPage(1)
  }
}

module.exports = ClientRouter
