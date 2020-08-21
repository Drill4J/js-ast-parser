import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import specimen from '../../../../src/handlers/arrow-function-expression';
import { prepareCtx } from '../../helper';

describe('Arrow function expression handler', function () {
  
  test('must return result with non-empty name', () => {
    const fixture: any = prepareCtx(`
      const some = {
        deep: {
          nested: {
            fn: null
          }
        }
      };
      some.deep.nested.fn = () => { };
    `, AST_NODE_TYPES.ArrowFunctionExpression);

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
