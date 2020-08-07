import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { prepareCtx } from '../helper';
import specimen from '../../../../src/handlers/class-expression';

describe('Anonymous class expression', function () {
  test('assigned to member expression - name must match properties names chain', () => {
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
        name: 'some.deep.nested'
      }
    }
    expect(data).toMatchObject(expected);
  });

  test('assigned to variable - name must match variable name', () => {
    const fixture: any = prepareCtx(`
      let something;
      something = class {
        constructor() {}
        doStuff() {}
      };
    `, AST_NODE_TYPES.ClassExpression);

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
          nested: class {
            constructor() { }
            doStuff() { }
          }
        }
      }
    `, AST_NODE_TYPES.ClassExpression);

    const data = specimen(fixture);

    const expected = {
      result: {
        name: 'some.deep.nested'
      }
    }
    expect(data).toMatchObject(expected);
  });

  test('within variable declaration - name must match const name', () => {
    const fixture: any = prepareCtx(`
      const SomeConst = class {
        constructor() { }
        doStuff() { }
      }
    `, AST_NODE_TYPES.ClassExpression);

    const data = specimen(fixture);

    const expected = {
      result: {
        name: 'SomeConst'
      }
    }
    expect(data).toMatchObject(expected);
  });

})

describe('Class expression', function () {
  test('assigned to member expression - name must be prefixed with properties names chain', () => {
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
        name: 'some.deep.nested.User'
      }
    }
    expect(data).toMatchObject(expected);
  });

  test('assigned to variable - name must be prefixed with variable name', () => {
    const fixture: any = prepareCtx(`
      let something;
      something = class User {
        constructor() {}
        doStuff() {}
      };
    `, AST_NODE_TYPES.ClassExpression);

    const data = specimen(fixture);

    const expected = {
      result: {
        name: 'something.User'
      }
    }
    expect(data).toMatchObject(expected);
  });

  test('within object property declaration - name must be prefixed with properties names chain', () => {
    const fixture: any = prepareCtx(`
      const some = {
        deep: {
          nested: class User {
            constructor() { }
            doStuff() { }
          }
        }
      }
    `, AST_NODE_TYPES.ClassExpression);

    const data = specimen(fixture);

    const expected = {
      result: {
        name: 'some.deep.nested.User'
      }
    }
    expect(data).toMatchObject(expected);
  });

  test('within variable declaration - name must match class name', () => {
    const fixture: any = prepareCtx(`
      const SomeConst = class User {
        constructor() { }
        doStuff() { }
      }
    `, AST_NODE_TYPES.ClassExpression);

    const data = specimen(fixture);

    const expected = {
      result: {
        name: 'User'
      }
    }
    expect(data).toMatchObject(expected);
  });

})
