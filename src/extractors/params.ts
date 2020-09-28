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
import Traverser from 'eslint/lib/shared/traverser'; // TODO test on TS-specific keys

export default function (paramsArray) {
  const result = [];
  paramsArray.forEach(p => {
    Traverser.traverse(p, {
      enter(node, parent) {
        // identifier
        //    with no parent is an ordinary param // e.g. function doStuff(a,b,c) { }
        //    with parent-rest element is a rest param // e.g. function doStuff(a,b, ...c)
        //    with parent-array pattern is a param from array element // e.g. function doStuff(a, [ b, c ])
        //    with parent - ts parameter property is a typed param from constructor with accessibility modifier
        //      e.g. class User { constructor(private name: string) }
        if (
          node.type === AST_NODE_TYPES.Identifier &&
          (!parent ||
            parent.type === AST_NODE_TYPES.RestElement ||
            parent.type === AST_NODE_TYPES.ArrayPattern ||
            parent.type === AST_NODE_TYPES.TSParameterProperty)
        ) {
          result.push(node.name);
          return;
        }

        // params from object expression // e.g. function doStuff({ a, b: { c, d } }) {}
        // expected params are ["a", "c", "d"]
        // note that "b" is destructured and has descendants (thus property value !== key )
        const isLeafProperty =
          node.type === AST_NODE_TYPES.Property &&
          node.value.type === AST_NODE_TYPES.Identifier &&
          node.key.type === AST_NODE_TYPES.Identifier &&
          node.value.type.name === node.key.type.name;
        if (isLeafProperty) {
          result.push(node.value.name);
        }
      },
    });
  });
  return result;
}
