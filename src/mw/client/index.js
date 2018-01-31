const parse = require('../xml/xml-parser');
const build = require('../xml/xml-builder');
const axios = require('axios');
require('./client-debug');
const headers = require('./client-headers');

class Client {

  constructor(baseURL, token) {

    this.axios = axios.create({baseURL: baseURL, headers: headers(token)});
    this.path = '/categories'
  }

  async get(params = {}) {

    return this.axios
               .get(this.path, {params: {identifier_type: 'external_id', ...params}})
               .then(result => parse(result.data))
  }

  async sync(data, params = {}) {

    const syncFn = data.$.id ? this.axios.put : this.axios.post;
    const path = data.$.id ? this.path + `/${data.$.id}` : this.path;
    const finalParams = data.$.id ? params : {...params, identifier_type: 'external_id'};
    return await syncFn(path, build(data), {params: finalParams}).then(result => result.status)
  }

  async all() {

    const nextPage = async (page) => {

      let results = await this.get({page: page});

      if (results.length > 0) {
        results = results.concat(await nextPage(page + 1))
      }

      return results;
    };

    return await nextPage(1);
  }
}

module.exports = Client;