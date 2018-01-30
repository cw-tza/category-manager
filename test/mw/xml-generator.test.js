const generator = require('../../src/mw/xml-generator').category;

describe('generate tests', () => {

  test('should generate proper payload', async () => {

    const data = {
      $: {
        id              : 2,
        isAdult         : true,
        name            : 'BAR',
        parentId        : 1,
        externalId      : 'bar',
        parentExternalId: 'foo'
      }
    };

    let generated = await generator.generate(data);

    expect(generated).toContain(`<id type="integer">${data.$.id}</id>`);
    expect(generated).toContain(`<parent-id type="integer">${data.$.parentId}</parent-id>`);
    expect(generated).toContain(`<is-adult type="boolean">${data.$.isAdult}</is-adult>`);
    expect(generated).toContain(`<name>${data.$.name}</name>`);
    expect(generated).toContain(`<external-id>${data.$.externalId}</external-id>`);
    expect(generated).toContain(`<parent-external-id>${data.$.parentExternalId}</parent-external-id>`);
  });
});