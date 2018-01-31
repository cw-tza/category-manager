const MockAdapter = require('axios-mock-adapter');
const testRes = require('../test/data/test-resources');

module.exports = async client => {

  const mock = new MockAdapter(client.axios);

  await testRes.onCategoryPages(pages => {

    const pageParams = page => ({params: {page: page, identifier_type: 'external_id'}});

    mock.onGet('/categories', pageParams(1))
        .reply(200, pages[0])
        .onGet('/categories', pageParams(2))
        .reply(200, pages[1])
        .onGet('/categories', pageParams(3))
        .reply(200, pages[2])
      .onAny();
  });

  return mock;
};
