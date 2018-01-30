const base64 = require('base-64');
const parse = require('./xml-parser');
const generate = require('./xml-generator');
const axios = require('axios');
require('./client-debug');

class Client {

  constructor(baseURL, resource, token) {

    this.axios = axios.create({
                                baseURL: baseURL,
                                headers: {
                                  common: {
                                    'Authorization': `Basic ${base64.encode(token)}`,
                                    'Accept'       : 'application/xml'
                                  },
                                  post  : {
                                    'Content-Type': 'application/xml',
                                  },
                                  put   : {
                                    'Content-Type': 'application/xml',
                                  }
                                }
                              });
    this.resource = resource;
    this.path = '/' + this.resource;
    setupInterceptors(this.axios);

    function setupInterceptors(axiosClient) {

      axiosClient
        .interceptors
        .request
        .use(config => config);
    }
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
    return await syncFn(path, generate(data), {params: finalParams}).then(result => result.status)
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