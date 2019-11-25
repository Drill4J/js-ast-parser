const test = require('ava');
const  AstParser   = require('../src/parser')

test('foo', t => {
    
	const parser = new AstParser()

    const ast = parser.parse("./tests/test-data/original/episode.ts")
});