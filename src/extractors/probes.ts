import { simpleTraverse } from "@typescript-eslint/typescript-estree/dist/simple-traverse";
import deepClone from 'rfdc';

import { NodeContext } from '../types';
import isNodeWithBody from './utils/is-node-with-body';

export default function (ctx: NodeContext) {
  if (!isNodeWithBody(ctx.node)) {
    // TODO warning
    console.log('extractors:probe', ctx.node.type, 'node has no body', ctx.node.loc.start, ctx.node.loc.end);
    return undefined;
  }
  
  const probeSet = new Set<number>();
  const tree = deepClone()(ctx.node);
  simpleTraverse(tree, {
    enter: node => {
      probeSet.add(node.loc.start.line);
      probeSet.add(node.loc.end.line);
    },
  });
  return Array.from(probeSet).sort((a, b) => a - b);
}
