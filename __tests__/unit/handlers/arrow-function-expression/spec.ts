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
import specimen from '../../../../src/handlers/arrow-function-expression';
import { prepareCtx } from '../../helper';

describe('Arrow function expression handler', function () {
  test('must return result with non-empty name', () => {
    const fixture: any = prepareCtx(
      `
      const some = {
        deep: {
          nested: {
            fn: null
          }
        }
      };
      some.deep.nested.fn = () => { };
    `,
      AST_NODE_TYPES.ArrowFunctionExpression,
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
