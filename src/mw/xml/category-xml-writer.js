const xml2js = require('xml2js')
const _ = require('lodash')

const write = (category) => {
  const builder = new xml2js.Builder({rootName: 'category'})
  const remapped = remap({$: category.$})
  return builder.buildObject(remapped)

  function remap (category) {
    const attrs = (val, type) => ({$: _.isNil(val) ? {nil: true} : _.isNil(type) ? {} : {type: type}})

    const mapField = (val, type) => ({...attrs(val, type), _: _.defaultTo(val, '')})

    return _.mapKeys({
      id: mapField(category.$.id, 'integer'),
      parentId: mapField(category.$.parentId, 'integer'),
      isAdult: mapField(category.$.isAdult, 'boolean'),
      name: category.$.name,
      externalId: mapField(category.$.externalId),
      parentExternalId: mapField(category.$.parentExternalId)
    }, (val, key) => _.kebabCase(key))
  }
}

module.exports = write
