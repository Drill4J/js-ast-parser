import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { prepareCtx } from '../helper';
import specimen from '../../../../src/handlers/class-expression';

describe('Class expression handler', function () {

  test('for named expression must return result with name ending with class name', () => {
    const fixture: any = prepareCtx(`
      const some = {
        deep: {
          nested: {
          }
        }
      }
      
      some.deep.nested = class User {
        constructor() { }
        doStuff() { }
      }
    `, AST_NODE_TYPES.ClassExpression);

    const data = specimen(fixture);

    const expected = {
      result: {
        name: expect.stringMatching('\.User$')
      }
    }
    expect(data).toMatchObject(expected);
  });

  test('for anonymous expression must return result with non-empty name', () => {
    const fixture: any = prepareCtx(`
      const some = {
        deep: {
          nested: {
          }
        }
      }
      
      some.deep.nested = class {
        constructor() { }
        doStuff() { }
      }
    `, AST_NODE_TYPES.ClassExpression);

    const data = specimen(fixture);

    const expected = {
      result: {
        name: expect.stringMatching('.+')
      }
    }
    expect(data).toMatchObject(expected);
  })

})
