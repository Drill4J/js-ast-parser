import { AstParser } from '../../src/parser';
import { DataExtractor } from '../../src/extractor';

const parser = new AstParser();
const extractor = new DataExtractor();

describe('statements count', () => {
  test('test can find MethodDefinition', () => {
    const source = `class Test {
            newMethod(name: string){
                console.log(name)
            }
        }
        `;

    const ast = parser.parseSource(source);
    const data = extractor.getClassMethods(ast);

    expect(data.methods.length).toBe(1);
    expect(data.className).toEqual('Test');

    const method = data.methods[0];
    expect(method.name).toBe('newMethod');
    expect(method.params).toEqual(['name']);
    expect(method.loc).toEqual({
      start: { line: 2, column: 12 },
      end: { line: 4, column: 13 },
    });
    expect(method.body);
  });

  test('test can find FunctionDeclaration', () => {
    const source = `
    export function newMethod(name: string) {
        console.log(name)
    }
    `;

    const ast = parser.parseSource(source);
    const data = extractor.getClassMethods(ast);

    expect(data.methods.length).toEqual(1);
    expect(data.className).toBe(undefined);

    const method = data.methods[0];
    expect(method.name).toEqual('newMethod');
    expect(method.params).toEqual(['name']);
    expect(method.loc).toEqual({
      start: { line: 2, column: 11 },
      end: { line: 4, column: 5 },
    });
    expect(method.body);
  });

  test('test can find ArrowFunctionExpression', () => {
    const source = `
    const newMethod = (name) => {
        console.log(name)
    }
    `;

    const ast = parser.parseSource(source);
    const data = extractor.getClassMethods(ast);

    expect(data.methods.length).toEqual(1);
    expect(data.className).toBe(undefined);

    const method = data.methods[0];
    expect(method.name).toEqual('newMethod');
    expect(method.params).toEqual(['name']);
    expect(method.loc).toEqual({
      start: { line: 2, column: 10 },
      end: { line: 4, column: 5 },
    });
    expect(method.body);
  });

  test('test can find FunctionExpression', () => {
    const source = `
    const hello = function (name) {
        console.log(name)
    }
    `;

    const ast = parser.parseSource(source);
    const data = extractor.getClassMethods(ast);

    expect(data.methods.length).toEqual(1);
    expect(data.className).toBe(undefined);

    const method = data.methods[0];
    expect(method.name).toEqual('hello');
    expect(method.params).toEqual(['name']);
    expect(method.loc).toEqual({
      start: { line: 2, column: 10 },
      end: { line: 4, column: 5 },
    });
    expect(method.body);
  });

  test('test can find all methods', () => {
    const ast = parser.parse('./__tests__/fixtures/original/episode.ts');
    const data = extractor.getClassMethods(ast);

    expect(data.methods.length).toBe(17);
  });

  test('test can find arrow function', () => {
    const ast = parser.parse(
      './__tests__/fixtures/original/selectable-table.tsx'
    );
    const data = extractor.getClassMethods(ast);

    expect(data.methods.length).toEqual(1);
  });

  test('test can find arrow function with call expression', () => {
    const source = `
    const dashboard = undefined;

    export const hello = dashboard((name, { title, agent }) => {

    })
    `;

    const ast = parser.parseSource(source);
    const data = extractor.getClassMethods(ast);

    expect(data.methods.length).toBe(1);

    expect(data.className).toBe(undefined);

    const method = data.methods[0];
    expect(method.name).toEqual('hello');
    expect(method.params).toEqual(['name', '{ title, agent }']);
    expect(method.loc).toEqual({
      start: { line: 4, column: 25 },
      end: { line: 6, column: 6 },
    });
    expect(method.body);
  });

  test('test can find only functions', () => {
    const ast = parser.parse('./__tests__/fixtures/original/single_bar.tsx');
    const data = extractor.getClassMethods(ast);

    expect(data.methods.length).toBe(5);
  });

  test('test can find functions witf severalCall expr', () => {
    const ast = parser.parse('./__tests__/fixtures/original/side_bar.tsx');
    const data = extractor.getClassMethods(ast);

    expect(data.methods.length).toEqual(4);
  });

  test('test can find 2 function declarations', () => {
    const ast = parser.parse('./__tests__/fixtures/original/private_route.tsx');
    const data = extractor.getClassMethods(ast);

    expect(data.methods.length).toEqual(2);
  });

  test('test can exract vararg pararms', () => {
    const source = `
    export function composeValidators(...validators: FormValidator[]): FormValidator {
        return (values) => Object.assign({}, ...validators.map((validator) => validator(values)));
    }
    `;

    const ast = parser.parseSource(source);
    const data = extractor.getClassMethods(ast);

    expect(data.methods.length).toEqual(1);

    const method = data.methods[0];
    expect(method.params.length).toBeGreaterThan(0);
  });

  test('test can exract from wheels', () => {
    const ast = parser.parse('./__tests__/fixtures/original/wheel.effects.ts');
    const data = extractor.getClassMethods(ast);

    expect(data.methods.length).toBe(11);

    const method = data.methods[0];
    expect(method.params.length).toBe(4);
  });

  test('test can exract from locale', () => {
    const ast = parser.parse('./__tests__/fixtures/original/locale.ts');
    const data = extractor.getClassMethods(ast);

    expect(data.methods.length).toBe(4);
  });

  test('test can exract from environment', () => {
    const ast = parser.parse('./__tests__/fixtures/original/environment.ts');
    const data = extractor.getClassMethods(ast);

    expect(data.methods.length).toBe(1);
  });
});
