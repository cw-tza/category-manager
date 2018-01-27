const qs = require('qs');
const axios = require('axios');
const externalIdParam = qs.stringify({identifier_type: 'external_id'});

axios.interceptors.request.use(config => config.params.append(externalIdParam));
axios.defaults.baseURL = 'http://localhost:20007/rest';

const headers = {
  common: {
    'Authorization': 'Basic ZjI0NHBjSHpJQktGcVdYVWo0dQ==',
    'Content-type' : 'application/xml',
    'Accept'       : 'application/xml'
  }
};

const mw = axios.create({headers});

module.exports = ({
  categories: {get: async (params={}) => (await mw.get('/categories', {params})).data}
});
