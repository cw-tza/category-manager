const fs = require('await-fs')

let pages

const categories = (page) => pages[page]

const init = async () => {
  const categoryPageFiles = [
    'categories-page-1.xml',
    'categories-page-2.xml',
    'categories-page-3.xml'
  ]

  const readFile = file => fs.readFile(`test/data/${file}`, 'utf-8')

  return Promise.all(categoryPageFiles.map(readFile)).then(data => {
    pages = data
    return data
  })
}

const get = () => pages

module.exports = {init, categories, get}
