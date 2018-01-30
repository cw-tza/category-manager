const Koa = require('koa');
const logger = require('koa-morgan');
const bodyParser = require('koa-bodyparser');
const router = require('./routes');

const app = new Koa();

app.use(
    bodyParser({
                 enableTypes: ['json'],
                 jsonLimit  : '10mb'
               })
);

app.use(
    logger('dev', {
      skip: () => app.env === 'test'
    })
);

app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404) {
      ctx.throw(404);
    }
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      statusCode: ctx.status,
      message   : err.message
    };
    ctx.app.emit('error', err, ctx);
  }
});

app.use(router.routes());

module.exports = app;
