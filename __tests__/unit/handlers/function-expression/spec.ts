import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import specimen from '../../../../src/handlers/function-expression';
import { prepareCtx } from '../helper';

describe('Function expression', function () {

  test('assigned to member expression - name must be prefixed with properties names chain', () => {
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
        name: 'some.deep.nested.fn.doStuff'
      }
    }
    expect(data).toMatchObject(expected);
  });

  test('assigned to a variable - name must be prefixed with variable name', () => {
    const fixture: any = prepareCtx(`
      let something;
      something = function doStuff() { };
    `, AST_NODE_TYPES.FunctionExpression);

    const data = specimen(fixture);

    const expected = {
      result: {
        name: 'something.doStuff'
      }
    }
    expect(data).toMatchObject(expected);
  });

  test('as method definition - name must match method name', () => {
    const fixture: any = prepareCtx(`
      class A {
        doStuff() { }
      }
    `, AST_NODE_TYPES.FunctionExpression);

    const data = specimen(fixture);

    const expected = {
      result: {
        name: 'doStuff'
      }
    }
    expect(data).toMatchObject(expected);
  });

  test('within object property declaration - name must be prefixed with properties names chain', () => {
    const fixture: any = prepareCtx(`
      const some = {
        deep: {
          nested: {
            fn: function doStuff() { },
          }
        }
      };
    `, AST_NODE_TYPES.FunctionExpression);

    const data = specimen(fixture);

    const expected = {
      result: {
        name: 'some.deep.nested.fn.doStuff'
      }
    }
    expect(data).toMatchObject(expected);
  });

  test('within variable declaration - name must match function name', () => {
    const fixture: any = prepareCtx(`
      const someConst = function doStuff() { }
    `, AST_NODE_TYPES.FunctionExpression);

    const data = specimen(fixture);

    const expected = {
      result: {
        name: 'doStuff'
      }
    }
    expect(data).toMatchObject(expected);
  });

});

describe('Anonymous function expression', function () {
  test('assigned to member expression - name must match properties names chain', () => {
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
        name: 'some.deep.nested.fn'
      }
    }
    expect(data).toMatchObject(expected);
  });

  test('assigned to a variable - name must match a variable name', () => {
    const fixture: any = prepareCtx(`
      let something;
      something = function () { };
    `, AST_NODE_TYPES.FunctionExpression);

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
            fn: function () { }
          }
        }
      };
    `, AST_NODE_TYPES.FunctionExpression);

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
      const someConst = function () { }
    `, AST_NODE_TYPES.FunctionExpression);

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