const {name, version} = require('../../package.json');
const Router = require('koa-router');
const Client = require('../mw/client');
const axios = require('axios');
const catTree = require('../category-trees');

const router = new Router();

const client = new Client(axios, 'categories', {baseURL: 'http://localhost:10006/rest', token: 'aTWsvir4jhYanftdWJZ'});

router.get('/middleware-categories', async ctx => {

  let mwCategories = await client.all();

  ctx.body = catTree.tree(mwCategories);
});

router.post('/category-paths', async (ctx) => {

  let paths = ctx.request.body;

  let mwTree = catTree.tree(await client.all());
  let merged = catTree.merge(mwTree, catTree(paths.map(catTree.pathAsTree)));
  let unsynced = catTree.treeFilter(merged, cat => cat.$.adi);

  let synced = await syncRemaining(unsynced, []);

  ctx.body = {synced};
});

async function syncRemaining(remaining, synced) {

  if (remaining.length)
    return synced;

  let next = remaining.shift();
  await client.sync(next.$);

  return await syncRemaining(remaining, [...synced, next]);
}

router.get('/', async ctx => {
  ctx.body = {
    app    : name,
    version: version
  };
});

module.exports = router;