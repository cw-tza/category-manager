const _ = require('lodash');
const arrayToTree = require('array-to-tree');
const ROOT_ID = -1;

const DEFAULT_OPTS = {
  dataKey: '$',
  index  : category => category.name.toLowerCase()
};

function tree(mwCategories, opts = DEFAULT_OPTS) {

  const withRootIds = mwCategories.map(mwCat => ({...mwCat, parentId: mwCat.parentId || ROOT_ID}));
  const topLevel = arrayToTree(withRootIds, {parentProperty: 'parentId', rootID: ROOT_ID});

  return topLevel.map(top => indexed(top, opts)).reduce(_.merge, {});
}

function indexed(category, opts = DEFAULT_OPTS) {

  const indexChildren = children => children.map(c => indexed(c, opts)).reduce(_.merge, {});
  const mappedCategory = {...indexChildren(category.children || []), [opts.dataKey]: _.omit(category, 'children')};
  const catIndex = opts.index(category);

  return {[catIndex]: mappedCategory}
}

function pathAsTree(path) {

  const joinChild = (last, next) => ({...next, children: [last]});

  const branch = [].concat(path.split('/')
                               .map(name => ({name: name}))
                               .map(cat => ({...cat, adi: true}))
                               .reduceRight(joinChild));

  return indexed(branch[0], DEFAULT_OPTS)
}

function merge(mwTree, ...pathTrees) {

  return cascadeData([...pathTrees, mwTree].reduce(_.merge));
}

function cascadeData(tree) {

  return _.mapValues(tree, category => cascadeData(category));

  function cascadeData(category, parent = {$: {id: null, isAdult: false, externalId: null}}) {

    const children = _.mapValues(_.omit(category, '$'), child => cascadeData(child, category));

    return {
      $: mergeParentData(category.$, parent.$),
      ...children
    };

    function mergeParentData(data, parentData) {

      return {
        ...data,
        adi             : data.adi && _.isNil(data.id),
        parentId        : data.parentId || parentData.id,
        parentExternalId: data.parentExternalId || parentData.externalId,
        isAdult         : data.isAdult || parentData.isAdult
      }
    }
  }
}

function search(tree, ...paths) {

  const pathArrays = paths.map(path => path.split('/').map(name => name.toLowerCase()));

  return _.at(tree, pathArrays);
}

module.exports = {tree, pathAsTree, merge, search};