const base64 = require('base-64');
const parser = require('./parser').category;
const qs = require('querystring');
const axiosdebug = require('axios-debug-log')({
                                                request : (debug, config) =>
                                                  debug(
                                                    `REQ ${config.method} ${config.baseURL}${config.url}`,
                                                    `params: ${qs.stringify(config.params)}`,
                                                    `body: ${config.request ? config.request.body : ''}`
                                                  ),
                                                response: (debug, response) =>
                                                  debug(
                                                    `RES ${response.status} ${response.config.url}`,
                                                    `body: ${response.data}`
                                                  ),
                                                error   : (debug, error) => debug('Boom', error)
                                              });

const opts = (connectOpts) => ({
  baseURL: connectOpts.baseURL,
  headers: {
    common: {
      'Authorization': `Basic ${base64.encode(connectOpts.token)}`,
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

class Client {

  constructor(axios, resource, connectOpts = {}) {

    this.axios = axios.create(opts(connectOpts));
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
               .then(result => parser.parse(result.data))
  }

  async sync(data, params = {}) {

    const syncFn = data.id ? this.axios.put : this.axios.post;
    const path = data.id ? this.path + `/${data.id}` : this.path;
    const finalParams = data.id ? params : {...params, identifier_type: 'external_id'};
    return await syncFn(path, Client.payload(data), {params: finalParams}).then(result => result.status)
  }

  static payload(data) {

    const idTag = data.id ? '\n\t' + `<id type="integer">${data.id}</id>` : '';
    const parentExternalIdTag = data.parentExternalId ? `\n\t<parent-external-id>${data.parentExternalId}</parent-external-id>` : '';

    return `<category>${idTag}${parentExternalIdTag}
    <name>${data.name}</name>
    <external-id>${data.externalId}</external-id>
    <service-id type="integer">2</service-id>
    <is-adult type="boolean">${data.isAdult}</is-adult>
    <cover-id type="integer">1</cover-id>
</category>`;
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