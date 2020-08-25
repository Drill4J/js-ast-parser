import Traverser from "eslint/lib/shared/traverser"; // TODO test on TS-specific keys
import isEmpty from 'lodash.isempty';
import parser from './parser';
import * as handlers from './handlers';

import { NodeContext, FunctionNode, Queue, Subtree } from './types';

export default function processSource(source) {
  const ast = parser(source);
  return processTree(ast);
}

function processTree (ast) {
  const results = [];
  
  const subtree: Subtree = { ast, name: null };
  const queue: Queue = [ subtree ];

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
  let functionNode: FunctionNode = null;
  
  Traverser.traverse(subtree, {
    enter(node, parent) {
      const isRoot = !parent;
      if (isRoot) return;

      //convert PascalCased node type to camelCased handler name
      const handlerName = node.type[0].toLowerCase() + node.type.substring(1, node.type.length);
      const handler = handlers[handlerName];
      if (!handler) return;

      const ctx: NodeContext = {
        node,
        result: {},
        flags: {},
        traverserContext: this
      };
      handler(ctx);

      if (ctx.flags.handleAsSeparateTree) {
        subtrees.push({
          ast: ctx.node,
          name: ctx.result.name,
        });
        return;
      }

      if (isEmpty(ctx.result)) return; // TODO warning

      if (!ctx.result.isAnonymous) {
        functions.push(ctx.result);
      }

      const isFirst = !functionNode;
      if (isFirst) {
        functionNode = {
          ctx,
          parent: null,
        };
        return;
      }
      
      const isChildNode = ctx.traverserContext.parents().includes(functionNode.ctx.node);
      if (!isChildNode) return; // TODO warning // TODO never suppose to happen, since functionNode is always created beforehand and the parent pointer is moved when a traverser is leaving the node

      functionNode = {
        ctx,
        parent: functionNode,
      };
    },
    leave(node) {
      if (!functionNode) return;
      
      //  TODO abstract leave hooks ?
      //  TODO is it shared state mutation?
      const isLeavingTrackedNode = node === functionNode.ctx.node;
      if (isLeavingTrackedNode) {
        if (functionNode.parent) {
          const parent = functionNode.parent.ctx.result;
          const child = functionNode.ctx.result;
          
          const probesToRemove = parent.probes.filter(probe =>
            !child.isAnonymous && child.probes.includes(probe) ||
            child.removedProbes && child.removedProbes.includes(probe));

          if (probesToRemove && !Array.isArray(parent.removedProbes)) {
            parent.removedProbes = [];
          }

          parent.probes = parent.probes.filter(probe => !probesToRemove.includes(probe))
          parent.removedProbes = parent.removedProbes.concat(probesToRemove);
        }
        functionNode = functionNode.parent;
      }
    }
  })

  return { functions, subtrees };
}
