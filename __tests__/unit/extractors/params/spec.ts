/*
 * Copyright 2020 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
