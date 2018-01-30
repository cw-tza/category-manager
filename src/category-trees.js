const _ = require('lodash');
const arrayToTree = require('array-to-tree');
const uuid = require('uuid/v4');
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

function merge(mwTree, pathTrees) {

  return cascadeData([...pathTrees, mwTree].reduce(_.merge));
}

function cascadeData(tree) {

  return _.mapValues(tree, category => cascadeData(category));

  function cascadeData(category, parentData = {id: null, isAdult: false, parentId: null, externalId: null}) {

    const $ = mergeParentData(category.$, parentData);

    const children = _.mapValues(_.omit(category, '$'), child => cascadeData(child, $));

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

function collectAdiChildren(tree) {

  const isAdiChild = value => value.$.adi;

  function adiChildren(cat) {

    return _.chain(cat)
            .omit('$')
            .pickBy(isAdiChild)
            .mapValues(adiChildren)
            .values()
            .value()
            .concat(cat);
  }

  return _.chain(tree)
          .pickBy(isAdiChild)
          .mapValues(adiChildren)
          .values()
          .flattenDeep()
          .map('$')
          .value();
}


module.exports = {tree, pathAsTree, merge, search, collectAdiChildren};