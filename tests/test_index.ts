import test from 'ava';
import { parseFiles } from 'src/utils';
import { AstParser } from 'src/parser';
import { DataExtractor } from 'src/extractor';

test('test can find all methods', t => {
	const parser = new AstParser()
    const extractor = new DataExtractor();

    const ast = parser.parse("./fixtures/original/episode.ts")
    const data = extractor.getClassMethods(ast)
    
    t.assert(data.methods.length === 16)
});

test('test can find arrow function', t => {
	const parser = new AstParser()
    const extractor = new DataExtractor();

    const ast = parser.parse("./fixtures/original/selectable-table.tsx")
    const data = extractor.getClassMethods(ast)
    
    t.assert(data.methods.length === 1)
});
