const Client  = require('./src/mw/client');
const axios = require('axios');

(async () => {
    await new Client(axios).all();
})();

