const _ = require('lodash');
const traverse = require('traverse');
const copy = require('deepcopy');

const predicate = query => _.isFunction(query) ? query : (object => _.isMatch(object, query));

class Category {

  constructor(params, children) {

    this.id = params.id;
    this.parentId = params.parentId;
    this.externalId = params.externalId;
    this.name = params.name;
    this.categoryType = params.categoryType;
    this.isAdult = params.isAdult;
    this.ageRating = params.ageRating;
    this.coverId = params.coverId;
    this.position = params.position;
    this.serviceId = params.serviceId;
    this.children = children || [];
  }

  child(query) {

    return _.find(this.children, predicate(query));
  }

  get isRoot() {
    return _.toBoolean(this.parentId);
  }

  get isLeaf() {

    return _.isEmpty(children);
  }

  index(indexFn) {

    function indexer(node) {

      if (this.notRoot && this.parent.key === 'children') {
        this.update({[indexFn(node)]: node})
      }
    }
    const indexed = traverse(this).map(indexer);
    return {[indexFn(this)]: indexed};
  }
}

const c = new Category({id: 3, name: 'c', parentId: 1});
const d = new Category({id: 4, name: 'd', parentId: 2});
const e = new Category({id: 5, name: 'e', parentId: 2});
const b = new Category({id: 2, name: 'b', parentId: 1}, [d, e]);
const a = new Category({id: 1, name: 'a'}, [b, c]);


const aaa= a.index(x=>x.name);
console.dir(aaa)
module.exports = Category;