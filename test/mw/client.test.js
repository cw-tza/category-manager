const testdata = require('../data/test-data');
const Client = require('../../src/mw/client');
const MockAdapter = require('axios-mock-adapter');
const axios = require('axios');
const mock = new MockAdapter(axios);

describe('mw category client tests', () => {

  const page = pageNo => ({params: {identifier_type: 'external_id', page: pageNo}});

  let client = new Client(axios, 'categories', {baseURL: 'http://mock/', token: 'token'}), categoryPages;

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

  test('should post when id undefined', async () => {

    let data = {name: 'foo', parentExternalId: 'ext-bar', externalId: 'ext-foo', isAdult: false};
    let data2 = {name: 'foo2', externalId: 'ext-foo2', isAdult: false};

    mock.onPost('/categories', Client.payload(data))
        .reply(201, '')
        .onPost('/categories', Client.payload(data2))
        .reply(201, '');

    await client.sync(data);
    let status =  await client.sync(data2);

    expect(status).toBeDefined()
  });

  test('should put when id is defined', async () => {

    let data = {name: 'foo', externalId: 'ext-foo', isAdult: false, id: 1};
    let data2 = {name: 'foo2', externalId: 'ext-foo2', isAdult: false, id: 2, parentExternalId: 'ext-bar'};

    mock.onPut('/categories/1', Client.payload(data))
        .reply(204, '')
        .onPut('/categories/2', Client.payload(data2))
        .reply(204, '');

    await client.sync(data);
    let status = await client.sync(data2);

    expect(status).toBeDefined()
  });
});