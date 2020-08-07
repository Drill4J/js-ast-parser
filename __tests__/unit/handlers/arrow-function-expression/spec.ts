import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import specimen from '../../../../src/handlers/arrow-function-expression';
import { prepareCtx } from '../helper';

describe('Arrow function expression', function () {
  test('assigned to member expression - name must match properties names chain', () => {
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
        name: 'some.deep.nested.fn'
      }
    }
    expect(data).toMatchObject(expected);
  });

  test('assigned to a variable - name must match a variable name', () => {
    const fixture: any = prepareCtx(`
      let something;
      something = () => { };
    `, AST_NODE_TYPES.ArrowFunctionExpression);

    const data = specimen(fixture);

    const expected = {
      result: {
        name: 'something'
      }
    }
    expect(data).toMatchObject(expected);
  });

  test('within object property declaration - name must match properties names chain', () => {
    const fixture: any = prepareCtx(`
      const some = {
        deep: {
          nested: {
            fn: () => { }
          }
        }
      };
    `, AST_NODE_TYPES.ArrowFunctionExpression);

    const data = specimen(fixture);

    const expected = {
      result: {
        name: 'some.deep.nested.fn'
      }
    }
    expect(data).toMatchObject(expected);
  });

  test('within variable declaration - name must match function name', () => {
    const fixture: any = prepareCtx(`
      const someConst = () => { }
    `, AST_NODE_TYPES.ArrowFunctionExpression);

    const data = specimen(fixture);

    const expected = {
      result: {
        name: 'someConst'
      }
    }
    expect(data).toMatchObject(expected);
  });
})

export default {};