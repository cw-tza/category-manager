const Client = require('../../mw/client');
const Router = require('koa-router');
const catTree = require('../../category-trees');
const client = new Client('http://localhost:10006/rest', 'aTWsvir4jhYanftdWJZ');

const mocking = require('../../../mock/axios-mocks');

mocking(client);

const onGet = async ctx => {
  let mwCategories = await client.all();
  ctx.body = catTree.tree(mwCategories);
};

module.exports = new Router().get('/middleware-categories', onGet);
