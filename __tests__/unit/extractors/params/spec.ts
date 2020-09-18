import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { prepareCtx } from '../../helper';
import specimen from '../../../../src/extractors/params';

describe('Param extractor', function () {
  test('must return ordinary params', () => {
    const fixture: any = prepareCtx(
      `
      function doStuff(a, b, c) {}
    `,
      AST_NODE_TYPES.FunctionDeclaration,
    );

    const data = specimen(fixture.node.params);

    const expected = ['a', 'b', 'c'];
    expect(data).toMatchObject(expected);
  });

  test('must return rest params from functions alongside other params', () => {
    const fixture: any = prepareCtx(
      `
      function doStuff( a, b, ...theArgs) {}
    `,
      AST_NODE_TYPES.FunctionDeclaration,
    );

    const data = specimen(fixture.node.params);

    const expected = ['a', 'b', 'theArgs'];
    expect(data).toMatchObject(expected);
  });

  test('must return params from mixed situation (ordinary params, ArrayPattern, ObjectPattern, rest elements)', () => {
    const fixture: any = prepareCtx(
      `
      function doStuff(
        [
          [
            a,
            {
              c: [
                e,
                f,
                ...restArgFromNestedArray
              ],
              d,
              ...restArgFromNestedObject
            }
          ],
          b,
          ...restArgFromArray
        ],
        g,
        ...restArgFromParams) {}
    `,
      AST_NODE_TYPES.FunctionDeclaration,
    );

    const data = specimen(fixture.node.params);

    const expected = [
      'a',
      'e',
      'f',
      'restArgFromNestedArray',
      'd',
      'restArgFromNestedObject',
      'b',
      'restArgFromArray',
      'g',
      'restArgFromParams',
    ];
    expect(data).toMatchObject(expected);
  });

  test('must return typescript parameter properties', () => {
    const fixture: any = prepareCtx(
      `
      class User {
        constructor(
          public nickname: string,
          private name: string,
          private age: number,
          isActive: boolean,
          isFlagged) {}
      }
    `,
      AST_NODE_TYPES.FunctionExpression,
    );

    const data = specimen(fixture.node.params);

    const expected = ['nickname', 'name', 'age', 'isActive', 'isFlagged'];
    expect(data).toMatchObject(expected);
  });

  describe('from ObjectPattern (object destructuring)', function () {
    test('must return properties', () => {
      const fixture: any = prepareCtx(
        `
        function doStuff({ a, b }) {}
      `,
        AST_NODE_TYPES.FunctionDeclaration,
      );

      const data = specimen(fixture.node.params);

      const expected = ['a', 'b'];
      expect(data).toMatchObject(expected);
    });

    test('must return nested properties alongside others', () => {
      const fixture: any = prepareCtx(
        `
        function doStuff({ c: { a, b } }) {}
      `,
        AST_NODE_TYPES.FunctionDeclaration,
      );

      const data = specimen(fixture.node.params);

      const expected = ['a', 'b'];
      expect(data).toMatchObject(expected);
    });

    test('must return rest params alongside others', () => {
      const fixture: any = prepareCtx(
        `
        function doStuff({ a, b, ...theArgs }) {}
      `,
        AST_NODE_TYPES.FunctionDeclaration,
      );

      const data = specimen(fixture.node.params);

      const expected = ['a', 'b', 'theArgs'];
      expect(data).toMatchObject(expected);
    });

    test('must not return destructured param', () => {
      const fixture: any = prepareCtx(
        `
        function doStuff({ c: { a, b } }) {}
      `,
        AST_NODE_TYPES.FunctionDeclaration,
      );

      const data = specimen(fixture.node.params);

      expect(data).not.toContainEqual('c');
    });
  });

  describe('from ArrayPattern (array destructuring)', function () {
    test('must return elements', () => {
      const fixture: any = prepareCtx(
        `
        function doStuff([a, b]) {}
      `,
        AST_NODE_TYPES.FunctionDeclaration,
      );

      const data = specimen(fixture.node.params);

      const expected = ['a', 'b'];
      expect(data).toMatchObject(expected);
    });

    test('must return elements from nested arrays alongside others', () => {
      const fixture: any = prepareCtx(
        `
        function doStuff([ [a, [c, [d, e]]], b]) {}
      `,
        AST_NODE_TYPES.FunctionDeclaration,
      );

      const data = specimen(fixture.node.params);

      const expected = ['a', 'c', 'd', 'e', 'b'];
      expect(data).toMatchObject(expected);
    });

    test('must return rest params alongside others', () => {
      const fixture: any = prepareCtx(
        `
        function doStuff([ a, b, ...theArgs]) {}
      `,
        AST_NODE_TYPES.FunctionDeclaration,
      );

      const data = specimen(fixture.node.params);

      const expected = ['a', 'b', 'theArgs'];
      expect(data).toMatchObject(expected);
    });
  });
});

export default {};
