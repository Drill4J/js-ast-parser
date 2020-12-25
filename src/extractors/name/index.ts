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
import { Identifier, Node } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';
import extractNameFromAssignmentExpression from './name-from-assignment-expression';

export default function (node: Node) {
  switch (node.type) {
    case AST_NODE_TYPES.FunctionDeclaration:
    case AST_NODE_TYPES.FunctionExpression:
    case AST_NODE_TYPES.VariableDeclarator:
    case AST_NODE_TYPES.ClassDeclaration:
    case AST_NODE_TYPES.ClassExpression:
      return node.id && (node.id as Identifier).name;

    case AST_NODE_TYPES.MethodDefinition:
    case AST_NODE_TYPES.Property:
    case AST_NODE_TYPES.ClassProperty:
      return (node.key as Identifier).name;

    case AST_NODE_TYPES.AssignmentExpression:
      return extractNameFromAssignmentExpression(node);

    default:
      return null;
  }
}
