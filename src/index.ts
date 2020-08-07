import Traverser from "eslint/lib/shared/traverser"; // TODO test on TS-specific keys
import isEmpty from 'lodash.isempty';
import parser from './parser';
import * as handlers from './handlers';

import { NodeContext, FunctionNode, Queue, UnprocessedTree } from './types';

export default function processSource(source) {
  const ast = parser(source);
  return processTree(ast);
}

function processTree (ast) {
  const results = [];
  const queue: Queue = [{ ast }];

  while (queue.length > 0) {
    const processed = processBranch(queue[0].ast);

    if (processed.functions.length > 0) {
      results.push({
        functions: processed.functions,
        name: queue[0].name,
      });
    }

    queue.shift();

    if (processed.innerTrees.length > 0) {
      queue.unshift(...processed.innerTrees);
    }
  }
  return results;
}

export function processBranch(branch) {
  const functions = [];
  const innerTrees = [];
  
  let functionNode: FunctionNode = null;

  Traverser.traverse(branch, {
    enter(node, parent) {
      const isRoot = !parent;
      if (isRoot) return;

      const ctx: NodeContext = {
        node,
        result: {},
        flags: {},
        traverserContext: this
      }

      //convert PascalCased node type to camelCased handler name
      const handlerName = node.type[0].toLowerCase() + node.type.substring(1, node.type.length);
      const handler = handlers[handlerName];
      if (!handler) return;

      handler(ctx);

      if (ctx.flags.handleAsSeparateTree) {
        const tree: UnprocessedTree = {
          ast: ctx.node,
          name: (ctx.result.name as string),
        };
        innerTrees.push(tree);
        return;
      }

      if (isEmpty(ctx.result)) return; // TODO warning
      
      if (!ctx.result.anonymous) {
        functions.push(ctx.result);
      }

      if (!functionNode) {
        functionNode = {
          ctx,
          parent: null,
        }
      } else {
        const isChildNode = ctx.traverserContext.parents().includes(functionNode.ctx.node);
        if (!isChildNode) return; // TODO warning // TODO never suppose to happen, since functionNode is always created beforehand and the parent pointer is moved when a traverser is leaving the node

        const newFunctionNode = {
          ctx,
          parent: functionNode,
        };
        functionNode = newFunctionNode;
      }
    },
    leave(node) {
      if (!functionNode) return;
      
      const isLeavingFunctionNode = node === functionNode.ctx.node;
      if (isLeavingFunctionNode) {
        if (functionNode.parent) {
          // remove function probes from parent function probes, if function has a name
          if (!functionNode.ctx.result.anonymous) {
            functionNode.parent.ctx.result.probes = (functionNode.parent.ctx.result.probes as Array<number>)
              .filter(x => !(functionNode.ctx.result.probes as Array<number>).includes(x));
          }
        }
        functionNode = functionNode.parent;
      }
    }
  })
  return { functions, innerTrees };
}
