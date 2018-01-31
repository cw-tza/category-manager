const Router = require('koa-router');
const catTree = require('../../category-trees');
const _ = require('lodash');
const Client = require('../../mw/client');

const client = new Client('http://localhost:10006/rest', 'aTWsvir4jhYanftdWJZ');

require('../../../mock/axios-mocks')(client);

const onGet = async(ctx) =>{

  let paths = ctx.request.query.paths.split(',');
  let mwTree = catTree.tree(await client.all());
  let searchResult = catTree.search(mwTree, ...paths);
  ctx.body = _.chain(searchResult)
    .map( (value, index)=>({path: paths[index], value:_.defaultTo(value, 'NOT FOUND')}))
    .value()
};

const onPost = async (ctx) => {

  let paths = ctx.request.body;

  let mwTree = catTree.tree(await client.all());
  let merged = catTree.merge(mwTree, ...paths.map(catTree.pathAsTree));
  let fromAdi = catTree.treeFilter(merged, cat => cat.$.adi);

  ctx.body = await syncRemaining(fromAdi, []);

  async function syncRemaining(remaining, synced) {

    if (!remaining.length) {
      return synced;
    }

    let next = remaining.pop();
    await client.sync(next);

    return await syncRemaining(remaining, [...synced, next]);
  }
};

module.exports = new Router().get('/category-paths', onGet)
                             .post('/category-paths', onPost);
