import test from 'ava';
import { App } from 'src/app';
import { getFiles } from 'src/utils';


test('test main app', t => {
    const conf = {
        projectName: "todomvc",
        source_dir: "./tests/data",
        url: "",
        ignoreFiles: [],
        ignoreFolders: [],
        sourceMaps: []
    }

    const app = new App(conf);

    const files = app.findSourceFiles();

    t.deepEqual(files, ['tests/data/_example.ts'])
})

