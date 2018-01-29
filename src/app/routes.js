const {name, version} = require('../../package.json');
const Router = require('koa-router');
const Client = require('../mw/client').Client;
const axios = require('axios');
const categoryTrees = require('../category-trees');
const sem = require('semaphore')(1);

const router = new Router();

const client = new Client(axios);

router.get('/middleware-categories', async ctx => {

  let mwCategories = await client.all();

  ctx.body = categoryTrees.tree(mwCategories);
});

router.post('/category-paths', async (ctx, next) => {

    let paths = ctx.request.body;

    let pathTrees = paths.map(path => categoryTrees.pathAsTree(path));

    let mwCategories = await client.all();

    let mwTree = categoryTrees.tree(mwCategories);

    let merged = categoryTrees.merge(mwTree,pathTrees);

    ctx.body = merged;
});

router.get('/', async ctx => {
  ctx.body = {
    app    : name,
    version: version
  };
});

module.exports = router;