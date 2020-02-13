import { App } from '../../src/app';

test('test main app', () => {
  const conf = {
    projectName: 'todomvc',
    source_dir: './__tests__/data',
    url: '',
    ignoreFiles: ['*.js.map'],
    ignoreFolders: ['data/example'],
    sourceMaps: [],
  };

  const app = new App();

  const files = app.findSourceFiles(conf);

  expect(files).toEqual(['__tests__/data/_example.ts']);
});
