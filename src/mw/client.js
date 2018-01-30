const base64 = require('base-64');
const parser = require('./parser').category;

const opts = (connectOpts) => ({
  baseURL: connectOpts.baseURL,
  params : {
    identifier_type: 'external_id',
  },
  headers: {
    common: {
      'Authorization': `Basic ${base64.encode(connectOpts.token)}`,
      'Content-type' : 'application/xml',
      'Accept'       : 'application/xml'
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
               .get(this.path, {params})
               .then(result => parser.parse(result.data))
  }

  async sync(data, params = {}) {

    const syncFn = data.id ? this.axios.put : this.axios.post;

    return await syncFn(this.path, Client.payload(data), {params})
        .then(result => result.status);
  }

  static payload(data) {

    return `<category>
                <cover-id type="integer">1</cover-id>
                <name>${data.name}</name>
                <service-id type="integer">2</service-id>
                <is-adult type="boolean">${data.isAdult}</is-adult>
                <external-id>${data.externalId}</external-id>` +
           (data.parentExternalId ? '' : `<parent-external-id>${data.parentExternalId}</parent-external-id>`) +
           (data.id ? '' : `<id type="integer">${data.id}</id>`) +
           `</category>`;
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