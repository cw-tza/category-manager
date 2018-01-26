const arrayToTree = require('array-to-tree');
const traverse = require('traverse');
const deepcopy = require('deepcopy');

const tree = (categories) => arrayToTree(categories, {parentProperty: 'parent-id'});

const indexedTree = (categories, index = (obj) => obj.name) => {
  const indexer = (index) => (last, next) => {
    const next2 = {children: (next.children || []).reduce(indexer(index),{})};
    last[index(next2)] = next2;
    return last;
  };

  return categories.reduce(indexer(index), {});
};


module.exports = {tree, indexedTree, treeWalker: (t) => traverse(t)};