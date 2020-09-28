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
import { AssignmentExpression, Identifier } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

export default function extractNameFromAssignmentExpression(assignmentExpression: AssignmentExpression): string {
  const target = assignmentExpression.left;

  /*
    someobject.property = function() { console.log(1) }
    someobject.deep.nested.property = function() { console.log(1) }
  */
  if (target.type === AST_NODE_TYPES.MemberExpression) {
    let object: any = target;
    const names = [];
    while (object.property) {
      if ((object.property as Identifier).name) {
        // TODO properties with non-identifiers names will get skipped. Is it even possible?
        names.push((object.property as Identifier).name);
      }
      object = object.object;
    }
    names.push(object.name);
    return names.reverse().join('.');
  }

  /*
    let someVariable
    someVariable = function doStuff() {}
  */
  if (target.type === AST_NODE_TYPES.Identifier) {
    return target.name;
  }

  return null;
}
