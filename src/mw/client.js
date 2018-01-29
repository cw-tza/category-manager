const base64 = require('base-64');
const parser = require('./parser').category;

const DEFAULT_OPTS = {
  token   : 'f244pcHzIBKFqWXUj4u',
  resource: 'categories',
  baseURL : 'http://localhost:20007/rest',
  params  : {
    identifier_type: 'external_id',
  },
};

const DEFAULT_HEADERS = {
  common: {
    'Authorization': `Basic ${base64.encode(DEFAULT_OPTS.token)}`,
    'Content-type' : 'application/xml',
    'Accept'       : 'application/xml'
  }
};

class Client {

  constructor(axios, opts = {...DEFAULT_OPTS, headers: DEFAULT_HEADERS}) {

    this.axios = axios.create({
                                baseURL: opts.baseURL,
                                headers: opts.headers,
                                params : opts.params
                              });
    this.resource = opts.resource;
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

  async all() {

    const nextPage = async(page) => {

      let results = await this.get({page: page});

      if(results.length > 0) {
        results = results.concat(await nextPage(page + 1))
      }

      return results;
    };

    return await nextPage(1);
  }
}

module.exports = {Client, defaults: {...DEFAULT_OPTS, headers: DEFAULT_HEADERS}};