const testResources = require('../../data/test-resources');
const parse = require('mw/xml/xml-parser');

describe('parse tests', () => {

  let pages;

  beforeAll(async () => await testResources.onCategoryPages(data=>pages=data));

  test('should parse response payload', async () => {

    let parsed = await parse(pages[0]);

    expect(parsed).toBeDefined();
    expect(parsed).toHaveLength(20);
  });

  test('should parse empty response payload', async () => {

    let parsed = await parse(pages[2]);

    expect(parsed).toBeDefined();
    expect(parsed).toHaveLength(0);
  });
});