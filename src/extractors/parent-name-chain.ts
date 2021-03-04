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
import { JSXElement, JSXFragment, Literal } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';
import { NodeContext } from '../types';
import extractName from './name';
import extractNameFromJsxElement from './name/name-from-jsx-element';

export default function (ctx: NodeContext) {
  const parents = ctx.traverserContext.parents();

  return parents
    .map((parent, parentIndex) => {
      switch (parent.type) {
        // TODO
        // - nested anonymous arrow functions
        //    const add = (a) => (b) => (c) => a + b + c
        // - IIFEs
        //    (() => {})()
        // case AST_NODE_TYPES.FunctionExpression:
        //   return 'FunctionExpression';

        case AST_NODE_TYPES.CallExpression: {
          const literalValues = parent.arguments
            .filter(x => x.type === AST_NODE_TYPES.Literal)
            .map((literal: Literal) => literal.value)
            .join(',');
          return `${extractName(parent.callee)}(${literalValues})`;
        }

        case AST_NODE_TYPES.ArrayExpression: {
          const index = parent.elements.findIndex(element => element === ctx.node); // searching only direct descendants
          if (index === -1) return '';
          return index.toString();
        }

        case AST_NODE_TYPES.ExportDefaultDeclaration:
          return 'default';

        // ignore a class in a parentNameChain as it's treated as a separate file
        case AST_NODE_TYPES.ClassDeclaration:
          return '';

        // TODO refactor
        case AST_NODE_TYPES.JSXElement: {
          const previousParent = parents[parentIndex - 1];
          if (
            previousParent &&
            (previousParent.type === AST_NODE_TYPES.JSXFragment || previousParent.type === AST_NODE_TYPES.JSXElement) &&
            previousParent.children.length > 1
          ) {
            const siblings = getJsxElementSiblings(previousParent, parent);
            if (siblings.length > 1) {
              const siblingIndex = siblings.findIndex(x => x === parent);
              return `<${extractName(parent)}>-${siblingIndex + 1}`;
            }
          }
          return `<${extractName(parent)}>`;
        }

        // TODO refactor
        case AST_NODE_TYPES.JSXFragment: {
          const previousParent = parents[parentIndex - 1];
          if (
            previousParent &&
            (previousParent.type === AST_NODE_TYPES.JSXFragment || previousParent.type === AST_NODE_TYPES.JSXElement) &&
            previousParent.children.length > 1
          ) {
            const siblings = parent.children.filter(x => x.type === AST_NODE_TYPES.JSXFragment);
            if (siblings.length > 1) {
              const siblingIndex = siblings.findIndex(x => x === parent);
              return `<JSXFragment>-${siblingIndex + 1}`;
            }
          }
          return '';
        }

        default:
          return extractName(parent);
      }
    })
    .filter(x => !!x);
}

function getJsxElementSiblings(parent: JSXFragment | JSXElement, child: JSXElement) {
  const childName = extractNameFromJsxElement(child);
  return parent.children.filter(x => x.type === AST_NODE_TYPES.JSXElement && extractNameFromJsxElement(x) === childName);
}
