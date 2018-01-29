const fs = require('await-fs');

const read = file => fs.readFile(`test/data/${file}`, 'utf-8');

module.exports = (...files) => Promise.all(files.map(read));