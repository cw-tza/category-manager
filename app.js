const merge = require('deepmerge');
const catparse = require('./category-parser');
const mw = require('./mw');
const t = require('traverse');
const rr = require('./test/data/categories');
const a = async () => {

  var p = catparse.indexedTree('a/b/c'.split('/').map((e, i) => ({name: e, id: i + 1, 'parent-id': i})));
  var d = catparse.indexedTree(await catparse.flat(rr));
  return merge(p, d);
};

a();