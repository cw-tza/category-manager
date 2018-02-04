const testData = require('../../data/test-data')
const parse = require('mw/xml/category-xml-reader')

describe('parse tests', () => {
  // beforeAll(async () => await testResources.onCategoryPages(data => pages = data))
  beforeAll(() => testData.init())

  test('should parse response payload', async () => {
    let parsed = await parse(testData.categories(0))

    expect(parsed).toBeDefined()
    expect(parsed).toHaveLength(20)
  })

  test('should parse empty response payload', async () => {
    let parsed = await parse(testData.categories(2))

    expect(parsed).toBeDefined()
    expect(parsed).toHaveLength(0)
  })
})
