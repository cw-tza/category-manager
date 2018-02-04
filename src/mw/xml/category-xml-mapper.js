const reader = require('./category-xml-reader')
const writer = require('./category-xml-writer')

module.exports = {
  read: reader,
  write: writer
}