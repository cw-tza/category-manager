const testdata = require('../data/test-data');
const mwClient = require('../../src/mw/client')
const Client = mwClient.Client;
const MockAdapter = require('axios-mock-adapter');
const axios = require('axios');
const mock = new MockAdapter(axios);

describe('mw category client tests', () => {

  const page = pageNo => ({params: {...mwClient.defaults.params, page: pageNo}});

  let client = new Client(axios), categoryPages;

  beforeAll(async () => categoryPages = await testdata(
      'categories-page-1.xml',
      'categories-page-2.xml',
      'categories-page-3.xml'
  ));

  afterEach(mock.reset);

  test('should load all category pages on client.all', async () => {

    mock.onGet('/categories', page(1))
        .reply(200, categoryPages[0])
        .onGet('/categories', page(2))
        .reply(200, categoryPages[1])
        .onGet('/categories', page(3))
        .reply(200, categoryPages[2]);

    let categories = await client.all();

    expect(categories).toHaveLength(30);
  });

  test('should fetch and parse non empty response payload', async () => {

    mock.onGet('/categories', page(2))
        .reply(200, categoryPages[1]);

    let categories = await client.get({page: 2});

    expect(categories).toHaveLength(10);
  });

  test('should fetch and parse empty response payload', async () => {

    mock.onGet('/categories', page(3))
        .reply(200, categoryPages[1]);

    let categories = await client.get({page: 3});

    expect(categories).toHaveLength(0);
  });
});