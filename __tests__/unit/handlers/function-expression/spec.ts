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
import specimen from '../../../../src/handlers/function-expression';
import { prepareCtx } from '../../helper';

describe('Function expression handler', function () {
  test('for named function must return result with name with name ending with function name', () => {
    const fixture: any = prepareCtx(
      `
      const some = {
        deep: {
          nested: {
            fn: null
          }
        }
      };
      some.deep.nested.fn = function doStuff() { };
    `,
      AST_NODE_TYPES.FunctionExpression,
    );

    const data = specimen(fixture);

    const expected = {
      result: {
        name: expect.stringMatching('.*doStuff$'),
      },
    };
    expect(data).toMatchObject(expected);
  });

  test('for anonymous function having must return result with non-empty name', () => {
    const fixture: any = prepareCtx(
      `
      const some = {
        deep: {
          nested: {
            fn: null
          }
        }
      };
      some.deep.nested.fn = function () { };
    `,
      AST_NODE_TYPES.FunctionExpression,
    );

    const data = specimen(fixture);

    const expected = {
      result: {
        name: expect.stringMatching('.+'),
      },
    };
    expect(data).toMatchObject(expected);
  });
});

export default {};
