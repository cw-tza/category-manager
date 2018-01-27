const resource = require('./data/resource');
const parser = require('../src/mw-parser');
const category = require('../src/category');

let payloads;

beforeAll(async () => {

  let xml1 = await resource('categories-page-1.xml');
  let xml2 = await resource('categories-page-2.xml');
  let xml3 = await resource('categories-page-3.xml');

  return await Promise.all([parser.parse(xml1), parser.parse(xml2), parser.parse(xml3)])
                      .then(parsed => payloads = parsed.reduce((p1, p2) => p1.concat(p2)));
});

describe('categories tests', () => {

  test('should build tree from flat array', async () => {

    let tree = category.tree(payloads);

    expect(tree).toBeDefined();
    expect(tree.drama).toBeDefined();
    expect(tree.drama.$).toBeDefined()
  });

  test('should index mw tree', async () => {

    let tree = category.tree(payloads);

    expect(tree['adultos']).toBeDefined()
  });

  test('should index path tree', async () => {

    let tree = category.pathAsTree('Adultos/Latinas/BIZARRE');

    expect(tree['adultos']['latinas']['bizarre'].$.name).toBe('BIZARRE');
  });

  test('should merge trees', async () => {

    let mwTree = category.tree(payloads);
    let pathTree = category.pathAsTree('Adultos/Latinas/BIZARRE');

    let mergedTree = category.merge(mwTree, pathTree);

    const isAdult = mergedTree['adultos']['latinas']['bizarre'].$.isAdult;

    expect(isAdult).toBe(true)
  });

  test('should find by path', () => {

    let mwTree = category.tree(payloads);
    let pathTree = category.pathAsTree('Adultos/Latinas/BIZARRE');
    let pathTree2 = category.pathAsTree('Adultos/Nuevo/Superiore');

    let merged = category.merge(mwTree, pathTree, pathTree2);

    let searched = category.search(merged, 'Adultos/Latinas/BIZARRE', 'Adultos/Nuevo', 'x/z/a/s', 'Drama');

    expect(searched).toHaveLength(4);
    expect(searched[0]).toBeDefined();
    expect(searched[1]).toBeDefined();
    expect(searched[2]).not.toBeDefined();
    expect(searched[3]).toBeDefined();
  })
});