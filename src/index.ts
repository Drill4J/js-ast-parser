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
import * as handlers from './handlers';
import parser from './parser';
import { FunctionNode, NodeContext, Queue, Subtree } from './types';

export default function processSource(source) {
  const ast = parser(source);
  return processTree(ast);
}

function processTree(ast) {
  const results = [];

  const subtree: Subtree = { ast, name: null };
  const queue: Queue = [subtree];

  while (queue.length > 0) {
    const processed = processSubtree(queue[0].ast);

    if (processed.functions.length > 0) {
      results.push({
        functions: processed.functions,
        name: queue[0].name,
      });
    }

    queue.shift();

    if (processed.subtrees.length > 0) {
      queue.unshift(...processed.subtrees);
    }
  }
  return results;
}

export function processSubtree(subtree) {
  const functions = [];
  const subtrees = [];

  Traverser.traverse(subtree, {
    enter(node, parent) {
      // FIXME dirty hack
      if (!parent && (node.type === AST_NODE_TYPES.ClassDeclaration || node.type === AST_NODE_TYPES.ClassExpression)) return;
      // ignore both callbacks and IIFEs
      // if (parent?.type === AST_NODE_TYPES.CallExpression) return;

      // convert PascalCased node type to camelCased handler name
      const handlerName = node.type[0].toLowerCase() + node.type.substring(1, node.type.length);
      const handler = handlers[handlerName];
      if (!handler) return;

      const ctx: NodeContext = {
        node,
        result: {},
        flags: {},
        traverserContext: this,
      };
      handler(ctx);

      if (ctx.flags.skip) {
        return;
      }

      if (parent && ctx.flags.handleAsSeparateTree) {
        subtrees.push({
          ast: ctx.node,
          name: ctx.result.name,
        });
        return;
      }

      functions.push(ctx.result);
    },
    // leave(node) {},
  });

  return { functions, subtrees };
}
