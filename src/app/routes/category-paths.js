const Router = require('koa-router')
const catTree = require('../../category-trees')
const _ = require('lodash')
const Client = require('../../mw/client/client-router')

const config = require('../../mw/client/client-factory')
const client = new Client(config.get('portal').url, config.get('portal').token)

// require('../../../mock/axios-mocks').init(client)

const onGet = async (ctx) => {
  let paths = ctx.request.query.paths.split(',')

  let mwTree = catTree.tree(await client.all())
  let searchResult = catTree.search(mwTree, ...paths)

  ctx.body = _.chain(searchResult).map((value, index) => ({
    path: paths[index],
    value: _.defaultTo(value, 'NOT FOUND')
  })).value()
}

const onPost = async (ctx) => {
  let paths = ctx.request.body

  let mwTree = catTree.tree(await client.all())
  let merged = catTree.merge(mwTree, ...paths.map(catTree.pathAsTree))
  let fromAdi = catTree.treeFilter(merged, cat => cat.$.adi)

  ctx.body = await syncRemaining(fromAdi, [])

  async function syncRemaining (remaining, synced) {
    const next = remaining.pop()

    if (!remaining.length) {
      return synced
    }

    await client.sync(next)

    return syncRemaining(remaining, [...synced, next])
  }
}

module.exports = new Router()
  .get('/category-paths', onGet)
  .post('/category-paths', onPost)
