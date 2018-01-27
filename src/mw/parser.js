const xml2js = require('xml2js-es6-promise');
const xml2jsDefaults = require('xml2js').defaults['0.2'];
const {parseNumbers, parseBooleans} = require('xml2js/lib/processors');
const _ = require('lodash');

const presets = {
  clean: {
    ...{xml2jsDefaults},
    explicitArray    : false,
    explicitRoot     : false,
    parseNumbers     : true,
    parseBooleans    : true,
    trim             : true,
    ignoreAttrs      : true,
    emptyTag         : null,
    tagNameProcessors: [_.camelCase],
    valueProcessors  : [parseNumbers, parseBooleans]
  }
};

class Parser {

  constructor(type) {
    this.type = type;
  }

  async parse(xml, opts = presets.clean) {

    const parsed = await xml2js(xml, opts);

    return _.isNil(parsed) ? [] : parsed[this.type];
  }
}

module.exports = {
  category: new Parser('category'),
};
