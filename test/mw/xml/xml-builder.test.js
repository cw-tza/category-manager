const build = require('mw/xml/category-xml-writer')

describe('build tests', () => {
  test('should generate proper payload', async () => {
    const data = {
      $: {
        id: 2,
        isAdult: true,
        name: 'BAR',
        parentId: 1,
        externalId: 'bar',
        parentExternalId: 'foo'
      }
    }

    const generated = await build(data)
    const $ = data.$

    expect(generated).toContain(`<id type="integer">${$.id}</id>`)
    expect(generated).toContain(`<parent-id type="integer">${$.parentId}</parent-id>`)
    expect(generated).toContain(`<is-adult type="boolean">${$.isAdult}</is-adult>`)
    expect(generated).toContain(`<name>${$.name}</name>`)
    expect(generated).toContain(`<external-id>${$.externalId}</external-id>`)
    expect(generated).toContain(`<parent-external-id>${$.parentExternalId}</parent-external-id>`)
  })
})
