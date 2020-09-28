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
import specimen from '../../../../src/handlers/class-expression';

describe('Class expression handler', function () {
  test('for named expression must return result with name ending with class name', () => {
    const fixture: any = prepareCtx(
      `
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
    `,
      AST_NODE_TYPES.ClassExpression,
    );

    const data = specimen(fixture);

    const expected = {
      result: {
        name: expect.stringMatching('User'),
      },
    };
    expect(data).toMatchObject(expected);
  });

  test('for anonymous class must return result with name matching variable identifier class is assigned to', () => {
    const fixture: any = prepareCtx(
      `
      let User
      User = class {
        constructor() { }
        doStuff() { }
      }
    `,
      AST_NODE_TYPES.ClassExpression,
    );

    const data = specimen(fixture);

    const expected = {
      result: {
        name: expect.stringMatching('User'),
      },
    };
    expect(data).toMatchObject(expected);
  });
});
