const fs = require('await-fs');

module.exports = async (file) => await fs.readFile(`test/data/${file}`, 'utf-8');