const base64 = require('base-64');

module.exports = token => ({
  headers: {
    common: {
      'Authorization': `Basic ${base64.encode(token)}`,
      'Accept': 'application/xml'
    },
    post: {
      'Content-Type': 'application/xml',
    },
    put: {
      'Content-Type': 'application/xml',
    }
  }
});