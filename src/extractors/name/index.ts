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
import extractNameFromJsxElement from './name-from-jsx-element';

export default function extractName(node: Node) {
  switch (node.type) {
    case AST_NODE_TYPES.FunctionDeclaration:
    case AST_NODE_TYPES.FunctionExpression:
    case AST_NODE_TYPES.VariableDeclarator:
    case AST_NODE_TYPES.ClassDeclaration:
    case AST_NODE_TYPES.ClassExpression:
      return node.id && (node.id as Identifier).name;

    case AST_NODE_TYPES.JSXElement:
      return extractNameFromJsxElement(node);

    case AST_NODE_TYPES.JSXAttribute:
      return node.name.name;

    case AST_NODE_TYPES.MethodDefinition:
    case AST_NODE_TYPES.Property:
    case AST_NODE_TYPES.ClassProperty:
      return (node.key as Identifier).name;

    case AST_NODE_TYPES.AssignmentExpression:
      return extractName(node.left);

    /*
      someobject.property = function() { console.log(1) }
      someobject.deep.nested.property = function() { console.log(1) }
    */
    case AST_NODE_TYPES.MemberExpression: {
      let object: any = node;
      const names = [];
      while (object.property) {
        switch (object.property.type) {
          case AST_NODE_TYPES.Identifier:
            names.push(object.property.name);
            break;
          case AST_NODE_TYPES.Literal:
            names.push(object.property.value);
            break;
          case AST_NODE_TYPES.MemberExpression:
            names.push(extractName(object.property));
            break;
          default:
            console.log('MemberExpression: unknown property type', object.property.type);
            break;
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
    case AST_NODE_TYPES.Identifier: {
      return node.name;
    }

    default:
      return null;
  }
}
