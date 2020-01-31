import { App } from '../../src/app';

test('test main app', () => {
  const app = new App({
    projectName: 'todomvc',
    source_dir: './__tests__/data',
    url: '',
    ignoreFiles: ['*.js.map'],
    ignoreFolders: [],
    sourceMaps: [],
  });

  const files = app.findSourceFiles();

  const result = app.parseFiles(files);

  expect(result.length).toBe(1);
  expect(result[0].data.className).toEqual('Example');
});

test('test source maps app', () => {
  const app = new App({
    projectName: 'todomvc',
    source_dir: './__tests__/data',
    url: '',
    ignoreFiles: [],
    ignoreFolders: [],
    sourceMaps: {
      pattern: ['./__tests__/data/*.js.map'],
    },
  });

  const files = app.findSourceMaps();

  expect(files.length).toEqual(1);
});

test('test source maps app without pattern', () => {
  const app = new App({
    projectName: 'todomvc',
    source_dir: './__tests__/data',
    url: '',
  });

  const files = app.findSourceMaps();

  expect(files.length).toBe(0);
});

test('test source maps from file', () => {
  const app = new App({
    projectName: 'todomvc',
    source_dir: './__tests__/data',
    url: '',
  });

  const files = app.findSourceMaps();

  expect(files.length).toBe(0);
});
