const fs = require('await-fs');

module.exports =
    async (...files) => await Promise.all(files.map(file => fs.readFile(`test/data/${file}`, 'utf-8')));