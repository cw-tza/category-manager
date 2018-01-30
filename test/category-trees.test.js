const testdata = require('./data/test-data');
const parser = require('../src/mw/parser').category;
const catTrees = require('../src/category-trees');
const util = require('../src/util');
const _ = require('lodash');

let payloads;

beforeAll(async () => {

  let files = await testdata(
    'categories-page-1.xml',
    'categories-page-2.xml',
    'categories-page-3.xml'
  );

  let parsed = files.map(file => parser.parse(file));
  let categories = await Promise.all(parsed);

  payloads = util.flatten(categories);
});

describe('category-tree tests', () => {

  test('should build tree from flat array', async () => {

    let tree = catTrees.tree(payloads);

    expect(tree).toBeDefined();
    expect(tree['drama']).toBeDefined();
    expect(tree['drama'].$).toBeDefined()
  });

  test('should index mw tree', async () => {

    let tree = catTrees.tree(payloads);

    expect(tree['adultos']).toBeDefined()
  });

  test('should index path tree', async () => {

    let tree = catTrees.pathAsTree('Adultos/Latinas/BIZARRE');

    expect(tree['adultos']['latinas']['bizarre'].$.name).toBe('BIZARRE');
  });

  test('should merge trees', async () => {

    let mwTree = catTrees.tree(payloads);
    let pathTree = catTrees.pathAsTree('Adultos/Latinas/BIZARRE');

    let mergedTree = catTrees.merge(mwTree, pathTree);

    const isAdult = mergedTree['adultos']['latinas']['bizarre'].$.isAdult;

    expect(isAdult).toBe(true)
  });

  test('should find by path', () => {

    let mwTree = catTrees.tree(payloads);
    let pathTree = catTrees.pathAsTree('Adultos/Latinas/BIZARRE');
    let pathTree2 = catTrees.pathAsTree('Adultos/Nuevo/Superiore');

    let merged = catTrees.merge(mwTree, pathTree, pathTree2);

    let searched = catTrees.search(merged, 'Adultos/Latinas/BIZARRE', 'Adultos/Nuevo', 'x/z/a/s', 'Drama');

    expect(searched).toHaveLength(4);
    expect(searched[0]).toBeDefined();
    expect(searched[1]).toBeDefined();
    expect(searched[2]).not.toBeDefined();
    expect(searched[3]).toBeDefined();
  });

  test('should reduce to adi only array', () => {

    const paths = [
      'foo/bar/foobar',
      'foo/bar/barfoo',
      'AAA/BBB/CCC'
    ];

    const mwTree = {
      foo: {
        $  : {name: 'foo', id: 1, externalId: 'ext-foo'},
        bar: {
          $     : {name: 'BAR', id: 2, externalId: 'ext-bar', parentId: 1},
          foobar: {$: {name: 'foobar', id: 3, parentId: 2}}
        }
      },
      aaa: {$: {name: 'AAA', id: 4}},
      zzz: {$: {name: 'ZZZ', id: 5}}
    };

    const pathTrees = paths.map(catTrees.pathAsTree);
    const merged = catTrees.merge(mwTree, ...pathTrees);

    const filtered = catTrees.treeFilter(merged, cat => cat.$.adi);
    const adiChildren = _.flattenDeep(filtered).map(c => c.$);
    expect(adiChildren).toHaveLength(7);

    const aaa = _.find(adiChildren, {name: 'AAA'});
    const bbb = _.find(adiChildren, {name: 'BBB'});
    const ccc = _.find(adiChildren, {name: 'CCC'});
    const foobar = _.find(adiChildren, {name: 'foobar'});
    const barfoo = _.find(adiChildren, {name: 'barfoo'});
    const zzz = _.find(adiChildren, {name: 'ZZZ'});

    expect(aaa.id).toBe(4);
    expect(aaa.externalId).toBeDefined();
    expect(bbb.externalId).toBeDefined();
    expect(bbb.parentExternalId).toBe(aaa.externalId);
    expect(ccc.externalId).toBeDefined();
    expect(ccc.parentExternalId).toBe(bbb.externalId);

    expect(foobar.id).toBeDefined();
    expect(foobar.externalId).toBeDefined();
    expect(foobar.parentExternalId).toBe('ext-bar');

    expect(barfoo.id).not.toBeDefined();
    expect(barfoo.externalId).toBeDefined();
    expect(barfoo.parentExternalId).toBe('ext-bar');

    expect(zzz).not.toBeDefined();
  });
});