const xml2js = require('xml2js');
const _ = require('lodash');

const presets = {
    rootName: 'category'
};

class XmlGenerator {

  constructor(type) {
    this.type = type;
  }

  generate(category, opts = presets) {

    const builder = new xml2js.Builder(opts);
    const remapped = this.remap({$: category.$});
    return builder.buildObject(remapped);
  }

  remap(category) {

    const attrs = (val, type) => ({$: _.isNil(val) ? {nil: true} : _.isNil(type) ? {}:{type:type}});

    const mapField = (val, type) => ({...attrs(val, type), _: _.defaultTo(val,'')});

    return _.mapKeys({
      id              : mapField(category.$.id, 'integer'),
      parentId        : mapField(category.$.parentId, 'integer'),
      isAdult         : mapField(category.$.isAdult, 'boolean'),
      name            : category.$.name,
      externalId      : mapField(category.$.externalId),
      parentExternalId: mapField(category.$.parentExternalId)
    }, (val, key)=>_.kebabCase(key));
  }
}

module.exports = {category: new XmlGenerator('category')};