import { AstParser } from '../../src/parser';
import { DataExtractor } from '../../src/extractor';

const parser = new AstParser();
const extractor = new DataExtractor();

test('test can extract Identifier parameters for MethodDefinition', () => {
  const source = `
    class Test {
        newMethod(name: string){
            console.log(name)
        }
    }
    `;

  const ast = parser.parseSource(source);
  const data = extractor.getClassMethods(ast);

  expect(data.methods.length).toBe(1);

  const method = data.methods[0];
  expect(method.params).toEqual(['name']);
});

test('test can extract AssignmentPattern parameters', () => {
  const source = `
    export function declareIcon(path: string, settings: Settings = {}) {}
    `;

  const ast = parser.parseSource(source);
  const data = extractor.getClassMethods(ast);

  expect(data.methods.length).toBe(1);

  const method = data.methods[0];
  expect(method.params).toEqual(['path', 'settings']);
});

test('test can extract parameters with as keyword', () => {
  const source = `
    const Link = footer.link(
        tag('a')({ href: '', rel: '', target: '' } as { href: string; rel: string; target: string }),
    );
    `;

  const ast = parser.parseSource(source);
  const data = extractor.getClassMethods(ast);

  expect(data.methods.length).toEqual(1);

  const method = data.methods[0];
  expect(method.params).toEqual([]);
});

test('test can extract static methods', () => {
  const source = `
    class Foo {
        static first = (a,b) => {}
        static second = function() {}
        static third = function name(text) {}
    }
    `;

  const ast = parser.parseSource(source);
  const data = extractor.getClassMethods(ast);

  expect(data.methods.length).toBe(3);

  let method = data.methods[0];
  expect(method.params).toEqual(['a', 'b']);

  method = data.methods[1];
  expect(method.params).toEqual([]);

  method = data.methods[2];
  expect(method.params).toEqual(['text']);
});

test('test can exract ObjectExpression properties', () => {
  const source = `
    export default {
      hello = "",
      name: (text) => {}
    }
    `;

  const ast = parser.parseSource(source);
  const data = extractor.getClassMethods(ast);

  expect(data.methods.length).toBe(1);

  const method = data.methods[0];
  expect(method.params).toEqual(['text']);
});
