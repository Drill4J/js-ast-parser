import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import specimen from '../../../../src/handlers/function-expression';
import { prepareCtx } from '../../helper';

describe('Function expression handler', function () {
  test('for named function must return result with name with name ending with function name', () => {
    const fixture: any = prepareCtx(`
      const some = {
        deep: {
          nested: {
            fn: null
          }
        }
      };
      some.deep.nested.fn = function doStuff() { };
    `, AST_NODE_TYPES.FunctionExpression);

    const data = specimen(fixture);

    const expected = {
      result: {
        name: expect.stringMatching('\.doStuff$')
      }
    }
    expect(data).toMatchObject(expected);
  });

  test('for anonymous function having must return result with non-empty name', () => {
    const fixture: any = prepareCtx(`
      const some = {
        deep: {
          nested: {
            fn: null
          }
        }
      };
      some.deep.nested.fn = function () { };
    `, AST_NODE_TYPES.FunctionExpression);

    const data = specimen(fixture);

    const expected = {
      result: {
        name: expect.stringMatching('.+')
      }
    }
    expect(data).toMatchObject(expected);
  });

})

export default {};
