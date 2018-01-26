const parser = require('../src/mw-parser');
const resource = require('./resource');

describe('parser for middleware category payloads', () => {

  let xml1, xml2, xml3;

  beforeAll(async () => {

    xml1 = await resource('categories-page-1.xml');
    xml2 = await resource('categories-page-2.xml');
    xml3 = await resource('categories-page-3.xml');

    return xml3;
  });

  describe('parse tests', () => {

    test('should parse response payload', async ()=> {

      let parsed = await parser.parse(xml1);

      expect(parsed).toBeDefined();
    });
  });

  describe('flatten tests', () => {

    let payload1, payload2, emptyPayload;

    beforeAll(async () => {

      payload1 = await parser.parse(xml1);
      payload2 = await parser.parse(xml2);
      emptyPayload = await parser.parse(xml3);

      return emptyPayload;
    });

    test('flatten should flatten empty payload', async () => {

      let categories = parser.flatten(emptyPayload);

      expect(categories).toHaveLength(0);
    });

    test('flatten should flatten single payload', async () => {

      let categories = parser.flatten(payload1);

      expect(categories).toHaveLength(20);
    });

    test('flatten should flatten multiple payloads', async () => {

      let categories = parser.flatten(payload1, payload2, emptyPayload);

      expect(categories).toHaveLength(30)
    });
  });
});

