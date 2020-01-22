import test from 'ava';
import { App } from 'src/app';


test('test main app', t => {
  const app = new App({
    projectName: "todomvc",
    source_dir: "./tests/data",
    url: "",
    ignoreFiles: [],
    ignoreFolders: [],
    sourceMaps: []
  });

  const files = app.findSourceFiles()

  const result = app.parseFiles(files);

  t.is(result.length,1)
  t.is(result[0].data.className, "Example")
})