const Router = require('koa-router');
const catTree = require('../../category-trees');
const Client = require('../../mw/client');

const router = new Router();
const client = new Client('http://localhost:10006/rest', 'categories', 'aTWsvir4jhYanftdWJZ');

const onGet = async ctx => {

  let mwCategories = await client.all();

  ctx.body = catTree.tree(mwCategories);
};

router.get('/middleware-categories', onGet);

module.exports = router;

