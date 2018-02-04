const MockAdapter = require('axios-mock-adapter')
const testData = require('../test/data/test-data')
let mock

const init = async (client) => {
  const pageParams = page => ({
    params: {
      page: page,
      identifier_type: 'external_id'
    }
  })

  let data = await testData.init()
  mock = new MockAdapter(client.axios)

  mock
    .onGet('/categories', pageParams(1))
    .reply(200, data[0])
    .onGet('/categories', pageParams(2))
    .reply(200, data[1])
    .onGet('/categories', pageParams(3))
    .reply(200, data[2])
    .onAny()

  return data
}

const get = () => mock

module.exports = {init, get}
