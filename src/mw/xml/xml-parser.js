const xml2js = require('xml2js-es6-promise');
const {parseNumbers, parseBooleans} = require('xml2js/lib/processors');
const _ = require('lodash');

const parse = async (xml) => {

  let result = await xml2js(xml, {
    explicitArray    : false,
    explicitRoot     : false,
    trim             : true,
    ignoreAttrs      : true,
    emptyTag         : null,
    tagNameProcessors: [_.camelCase],
    valueProcessors  : [parseNumbers, parseBooleans]
  });

  return _.isNil(result) ? [] : result['category']
};

module.exports = parse;
