require('axios-debug-log')
const Client = require('../../mw/client/client-router')
const Router = require('koa-router')
const catTree = require('../../category-trees')

const config = require('../../mw/client/client-factory')

const client = new Client(config.get('portal').url, config.get('portal').apiToken)

const onGet = async ctx => {
  let mwCategories = await client.all()
  ctx.body = catTree.tree(mwCategories)
}

module.exports = new Router().get('/middleware-categories', onGet)
