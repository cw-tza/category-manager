const resource = require('../data/resource');
const parser = require('../../src/mw/parser').category;

describe('parse tests', () => {

  test('should parse response payload', async () => {

    let xml1 = await resource('categories-page-1.xml');

    let parsed = await parser.parse(xml1);

    expect(parsed).toBeDefined();
    expect(parsed).toHaveLength(20);
  });

  test('should parse empty response payload', async () => {

    let emptyXml = await resource('categories-page-3.xml');

    let parsed = await parser.parse(emptyXml);

    expect(parsed).toBeDefined();
    expect(parsed).toHaveLength(0);
  });
});