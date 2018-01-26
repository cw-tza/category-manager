const xml2js = require('xml2js-es6-promise');
const xml2jsDefaults = require('xml2js').defaults['0.2'];
const {parseNumbers, parseBooleans} = require('xml2js/lib/processors');
const changeCase = require('change-case');
const Category = require('./category');

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
    tagNameProcessors: [changeCase.camelCase],
    valueProcessors  : [parseNumbers, parseBooleans]
  }
};

async function parse(xml, opts = presets.clean) {

  const categories = await xml2js(xml, opts);

  const toDomain = category => new Category(category);

  return (categories.category || []).map(toDomain);
}

module.exports = {
  parse: parse,
};
