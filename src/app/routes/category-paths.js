const Router = require('koa-router');
const catTree = require('../../category-trees');
const Client = require('../../mw/client');

const router = new Router();
const client = new Client('http://localhost:10006/rest', 'categories', 'aTWsvir4jhYanftdWJZ');

const onPost = async (ctx) => {

  let paths = ctx.request.body;

  let mwTree = catTree.tree(await client.all());
  let merged = catTree.merge(mwTree, ...paths.map(catTree.pathAsTree));
  let unsynced = catTree.treeFilter(merged, cat => cat.$.adi);

  ctx.body = await syncRemaining(unsynced, []);

  async function syncRemaining(remaining, synced) {

    if (!remaining.length) {
      return synced;
    }

    let next = remaining.pop();
    await client.sync(next);

    return await syncRemaining(remaining, [...synced, next]);
  }
};

router.post('/category-paths', onPost);

module.exports = router;