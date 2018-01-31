const {name, version} = require('../../../package.json');
const Router = require('koa-router');
const router = new Router();

const onRoot = async ctx => {
  ctx.body = {
    app    : name,
    version: version
  };
};
router.get('/', onRoot);
router.use(require('./middleware-categories').routes())
      .use(require('./category-paths').routes());


module.exports = router;