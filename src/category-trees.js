const _ = require('lodash');
const arrayToTree = require('array-to-tree');
const uuid = require('uuid/v4');

module.exports = {
  tree,
  pathAsTree,
  merge,
  search,
  treeFilter
};

const indexByNameToLowerCase = category => category.name.toLowerCase();

function tree(mwCategories, indexFn = indexByNameToLowerCase) {

  const ROOT_ID = -1;

  const withRootIds = mwCategories.map(mwCat => _.defaults(mwCat, {parentId: ROOT_ID}));

  const topLevel = arrayToTree(withRootIds, {parentProperty: 'parentId', rootID: ROOT_ID});

  return _.toArray(topLevel)
          .map(top => indexed(top, indexFn))
          .reduce(_.merge)
}

function indexed(category, indexFn = indexByNameToLowerCase) {

  const indexChildren = children => children.map(c => indexed(c, indexFn))
                                            .reduce(_.merge, {});

  const mappedCategory = {
    ...indexChildren(_.toArray(category.children)),
    ['$']: _.omit(category, 'children')
  };

  const catIndex = indexFn(category);

  return {[catIndex]: mappedCategory}
}

function pathAsTree(path) {

  const joinChild = (last, next) => ({...next, children: [last]});

  const branch = [].concat(path.split('/')
                               .map(name => ({name: name}))
                               .map(cat => ({...cat, adi: true}))
                               .reduceRight(joinChild)
  );

  return indexed(branch[0])
}

function merge(mwTree, ...pathTrees) {

  let rootParentData = {
    id              : null,
    isAdult         : false,
    parentId        : null,
    externalId      : null,
    parentExternalId: null
  };

  return _.mapValues([...pathTrees, mwTree].reduce(_.merge), cat => cascadeData(cat, rootParentData));

  function cascadeData(category, parentData) {

    const $ = {
      ...category.$,
      adi             : category.$.adi || false,
      externalId      : category.$.externalId || uuid(),
      parentId        : category.$.parentId || parentData.id,
      parentExternalId: category.$.parentExternalId || parentData.externalId,
      isAdult         : category.$.isAdult || parentData.isAdult
    };

    const children = _.chain(category)
                      .omit('$')
                      .mapValues(child => cascadeData(child, $))
                      .value();

    return {$, ...children};
  }
}

function search(tree, ...paths) {

  const pathArrays = paths.map(path => path.split('/').map(name => name.toLowerCase()));

  return _.at(tree, pathArrays);
}

function treeFilter(tree, predicate) {

  function childFilter(cat) {

    return _.chain(cat)
            .omit('$')
            .pickBy(predicate)
            .flatMapDeep(childFilter)
            .value()
            .concat(cat);
  }

  return _.chain(tree)
          .pickBy(predicate)
          .flatMapDeep(childFilter)
          .value();
}
