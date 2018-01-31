const fs = require('await-fs');

const onCategoryPages = async (callback) => {

  const categoryPageFiles = [
    'categories-page-1.xml',
    'categories-page-2.xml',
    'categories-page-3.xml'
  ];

  const readFile = file => fs.readFile(`test/data/${file}`, 'utf-8');

  return callback(await Promise.all(categoryPageFiles.map(readFile)));
};

module.exports = {onCategoryPages};
