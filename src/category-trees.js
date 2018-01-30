const _ = require('lodash');
const arrayToTree = require('array-to-tree');
const uuid = require('uuid/v4');
const ROOT_ID = -1;

const DEFAULT_OPTS = {
  dataKey: '$',
  index  : category => category.name.toLowerCase()
};

function tree(mwCategories, opts = DEFAULT_OPTS) {

  const withRootIds = mwCategories.map(mwCat => _.defaults(mwCat, {parentId: ROOT_ID}));
  const topLevel = arrayToTree(withRootIds, {parentProperty: 'parentId', rootID: ROOT_ID});

  return topLevel.reduce((old, top) => ({...old, ...indexed(top, opts)}), {});
}

function indexed(category, opts = DEFAULT_OPTS) {

  const indexChildren = children => children.map(c => indexed(c, opts))
                                            .reduce(_.merge, {});

  const mappedCategory = {
    ...indexChildren(_.toArray(category.children)),
    [opts.dataKey]: _.omit(category, 'children')
  };

  const catIndex = opts.index(category);

  return {[catIndex]: mappedCategory}
}

function pathAsTree(path) {

  const joinChild = (last, next) => ({...next, children: [last]});

  const branch = [].concat(path.split('/')
                               .map(name => ({name: name}))
                               .map(cat => ({...cat, adi: true}))
                               .reduceRight(joinChild)
  );

  return indexed(branch[0], DEFAULT_OPTS)
}

function merge(mwTree, ...pathTrees) {

  return cascadeData([...pathTrees, mwTree].reduce(_.merge));
}

function cascadeData(tree) {

  let topLevelParentData = {
    id              : null,
    isAdult         : false,
    parentId        : null,
    externalId      : null,
    parentExternalId: null
  };

  return _.mapValues(tree, cat => cascadeData(cat, topLevelParentData));

  function cascadeData(category, parentData) {

    const $ = mergeParentData(category.$, parentData);

    const children = _.chain(category)
                      .omit('$')
                      .mapValues(child => cascadeData(child, $))
                      .value();

    return {$, ...children};

    function mergeParentData(data, parentData) {

      return {
        ...data,
        adi             : data.adi || false,
        externalId      : data.externalId || uuid(),
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

module.exports = {tree, pathAsTree, merge, search, treeFilter};