const {name, version} = require('../../../package.json');
const Router = require('koa-router');
const router = new Router();

router.use(require('./middleware-categories').routes())
      .use(require('./category-paths').routes());

let onRoot = async ctx => {
  ctx.body = {
    app    : name,
    version: version
  };
};
router.get('/', onRoot);

module.exports = router;