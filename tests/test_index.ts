import test from 'ava';
import { AstParser } from 'src/parser';
import { getFiles } from 'src/utils';

test('fn() returns foo', t => {
	const files = getFiles("test-data/original", [])

    console.log(files)
    // t.is(files, [""])
});