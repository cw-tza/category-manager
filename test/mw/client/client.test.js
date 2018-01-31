const mocking = require('../../../mock/axios-mocks');
const build = require('../../../src/mw/xml/xml-builder');
const Client = require('mw/client');

describe('mw category client tests', () => {

  let client = new Client('http://mock/', 'token');
  let mock;

  beforeEach(async () => mock = await mocking(client));
  afterEach(async () => mock.reset);

  test('should load all category pages on client.all', async () => {

    let categories = await client.all();
    expect(categories).toHaveLength(30);
  });

  test('should fetch and parse non empty response payload', async () => {

    let categories = await client.get({page: 2});
    expect(categories).toHaveLength(10);
  });

  test('should fetch and parse empty response payload', async () => {

    let categories = await client.get({page: 3});
    expect(categories).toHaveLength(0);
  });

  test('should post when id undefined', async () => {

    let cat1 = {$: {name: 'foo', parentExternalId: 'ext-bar', externalId: 'ext-foo', isAdult: false}};
    let cat2 = {$: {name: 'foo2', externalId: 'ext-foo2', isAdult: false}};

    mock.onPost('/categories', build(cat1))
        .reply(201, '')
        .onPost('/categories', build(cat2))
        .reply(201, '');

    let status = await client.sync(cat1);
    let status2 = await client.sync(cat2);

    expect(status).toBe(201);
    expect(status2).toBe(201);
  });

  test('should put when id is defined', async () => {

    let cat1 = {$: {name: 'foo', externalId: 'ext-foo', isAdult: false, id: 1}};
    let cat2 = {$: {name: 'foo2', externalId: 'ext-foo2', isAdult: false, id: 2, parentExternalId: 'ext-bar'}};

    mock.onPut('/categories/1', build(cat1))
        .reply(204, '')
        .onPut('/categories/2', build(cat2))
        .reply(204, '');

    let status = await client.sync(cat1);
    let status2 = await client.sync(cat2);

    expect(status).toBe(204);
    expect(status2).toBe(204);
  });
});