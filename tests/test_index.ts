import test from 'ava';
import { parseFiles } from 'src/utils';

test('fn() returns foo', t => {
	parseFiles("/home/sergey/Github/todomvc/examples/typescript-angular/js", "", [
        "*.js.map",
        "*.js",
        "_all.ts"
    ],[
        "libs",
        "coverage",
        "interfaces"
    ])
    // t.is(files, [""])
});