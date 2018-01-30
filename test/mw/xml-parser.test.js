const testdata = require('../data/test-data');
const parse = require('../../src/mw/xml-parser');

describe('parse tests', () => {

  test('should parse response payload', async () => {

    let xml1 = await testdata('categories-page-1.xml');

    let parsed = await parse(xml1);

    expect(parsed).toBeDefined();
    expect(parsed).toHaveLength(20);
  });

  test('should parse empty response payload', async () => {

    let emptyXml = await testdata('categories-page-3.xml');

    let parsed = await parse(emptyXml);

    expect(parsed).toBeDefined();
    expect(parsed).toHaveLength(0);
  });
});