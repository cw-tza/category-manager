const resource = require('./data/resource');
const parser = require('../src/mw/parser').category;
const category = require('../src/category-trees');

let payloads;

beforeAll(async () => {
  let xmls = await resource('categories-page-1.xml',
                            'categories-page-2.xml',
                            'categories-page-3.xml');

  let parsed = xmls.map(async (x) => await parser.parse(x));

  return Promise.all(parsed)
                .then(parsedArray => payloads = parsedArray.reduce((a1, a2) => [...a1, ...a2]));
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