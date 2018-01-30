const {name, version} = require('../../package.json');
const Router = require('koa-router');
const Client = require('../mw/client');
const axios = require('axios');
const catTree = require('../category-trees');
const sem = require('semaphore')(1);

const router = new Router();

const client = new Client(axios, 'categories', {baseURL: 'http://localhost:10006/rest', token: 'aTWsvir4jhYanftdWJZ'});

router.get('/middleware-categories', async ctx => {

  let mwCategories = await client.all();

  ctx.body = catTree.tree(mwCategories);
});

router.post('/category-paths', async (ctx) => {


  let paths = ctx.request.body;

  let pathTrees = paths.map(path => catTree.pathAsTree(path));
  let mwTree = catTree.tree(await client.all());
  let merged = catTree.merge(mwTree, pathTrees);

  let unsynced = catTree.collectAdiChildren(merged);

  await syncRemaining(unsynced);

  async function syncRemaining(remaining) {

    if (!remaining.length) {
      return;
    }

    await client.sync(remaining.shift());

    return syncRemaining(remaining);
  }

  ctx.body = merged;
});

router.get('/', async ctx => {
  ctx.body = {
    app    : name,
    version: version
  };
});

module.exports = router;