import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { prepareCtx } from '../../handlers/helper';
import { extract as specimen } from '../../../../src/extractors/params';

describe('Param extractor', function () {
  test('must return ordinary params', () => {
    const fixture: any = prepareCtx(`
      function doStuff(a, b, c) {}
    `, AST_NODE_TYPES.FunctionDeclaration);

    const data = specimen(fixture.node.params);

    const expected = [
      "a",
      "b",
      "c",
    ]
    expect(data).toMatchObject(expected);
  });

  test('must return params from destructured object (ObjectPattern)', () => {
    const fixture: any = prepareCtx(`
      function doStuff({ a, b }) {}
    `, AST_NODE_TYPES.FunctionDeclaration);

    const data = specimen(fixture.node.params);

    const expected = [
      "a",
      "b",
    ]
    expect(data).toMatchObject(expected);
  });

  test('must return params from destructured object (ObjectPattern) - deep', () => {
    const fixture: any = prepareCtx(`
      function doStuff({ c: { a, b } }) {}
    `, AST_NODE_TYPES.FunctionDeclaration);

    const data = specimen(fixture.node.params);

    const expected = [
      "a",
      "b",
    ]
    expect(data).toMatchObject(expected);
  });

  test('must return params from destructured array (ArrayPattern)', () => {
    const fixture: any = prepareCtx(`
      function doStuff([a, b]) {}
    `, AST_NODE_TYPES.FunctionDeclaration);

    const data = specimen(fixture.node.params);

    const expected = [
      "a",
      "b",
    ]
    expect(data).toMatchObject(expected);
  });

  test('must return params from destructured array (ArrayPattern) - deep', () => {
    const fixture: any = prepareCtx(`
      function doStuff([ [a, [c, d]], b]) {}
    `, AST_NODE_TYPES.FunctionDeclaration);

    const data = specimen(fixture.node.params);

    const expected = [
      "a",
      "c",
      "d",
      "b",
    ]
    expect(data).toMatchObject(expected);
  });

  test('must return rest params from function params', () => {
    const fixture: any = prepareCtx(`
      function doStuff( a, b, ...theArgs) {}
    `, AST_NODE_TYPES.FunctionDeclaration);

    const data = specimen(fixture.node.params);

    const expected = [
      "a",
      "b",
      "theArgs"
    ]
    expect(data).toMatchObject(expected);
  });

  test('must return rest params from array destructuring (ArrayPattern)', () => {
    const fixture: any = prepareCtx(`
      function doStuff([ a, b, ...theArgs]) {}
    `, AST_NODE_TYPES.FunctionDeclaration);

    const data = specimen(fixture.node.params);

    const expected = [
      "a",
      "b",
      "theArgs"
    ]
    expect(data).toMatchObject(expected);
  });

  test('must return rest params from object destructuring (ObjectPattern)', () => {
    const fixture: any = prepareCtx(`
      function doStuff({ a, b, ...theArgs }) {}
    `, AST_NODE_TYPES.FunctionDeclaration);

    const data = specimen(fixture.node.params);

    const expected = [
      "a",
      "b",
      "theArgs"
    ]
    expect(data).toMatchObject(expected);
  });

  test('must return params from mixed situation (ordinary params, array pattern, object pattern, rest elements)', () => {
    const fixture: any = prepareCtx(`
      function doStuff(
        [
          [
            a,
            {
              c: [
                e,
                f,
                ...nestedArrayArgs
              ],
              d,
              ...theArgs
            }
          ],
          b,
          ...theArrayArgs
        ],
        g,
        ...h) {}
    `, AST_NODE_TYPES.FunctionDeclaration);

    const data = specimen(fixture.node.params);

    const expected = [
      "a",
      "e",
      "f",
      "nestedArrayArgs",
      "d",
      "theArgs",
      "b",
      "theArrayArgs",
      "g",
      "h"
    ]
    expect(data).toMatchObject(expected);
  });

  test('must return typescript parameter properties', () => {
    const fixture: any = prepareCtx(`
      class User {
        constructor(
          public nickname: string,
          private name: string,
          private age: number,
          isActive: boolean,
          isFlagged) {}
      }
    `, AST_NODE_TYPES.FunctionExpression);

    const data = specimen(fixture.node.params);

    const expected = [
      "nickname",
      "name",
      "age",
      "isActive",
      "isFlagged"
    ]
    expect(data).toMatchObject(expected);
  });
})

export default {};