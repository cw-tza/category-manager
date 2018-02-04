const Koa = require('koa')
const logger = require('koa-morgan')
const bodyParser = require('koa-bodyparser')
const router = require('./routes')
const errorHandler = require('./middleware/error-handler')

const app = new Koa()

app.use(
  bodyParser({
    enableTypes: ['json'],
    jsonLimit: '10mb'
  })
)

app.use(
  logger('dev', {
    // skip: () => app.env === 'test'
  })
)
app.use(
  logger('qa', {
    // skip: () => app.env === 'test'
  })
)

app.use(errorHandler)

app.use(router.routes())

module.exports = app
