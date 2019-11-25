import test from 'ava';
import { AstParser } from 'src/parser';

test('fn() returns foo', t => {
	const parser = new AstParser()

    const ast = parser.parse("test-data/original/episode.ts")

    t.is(JSON.stringify(ast),"")
});