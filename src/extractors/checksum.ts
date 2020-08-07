import crypto from 'crypto';
import deepClone from 'rfdc';
import { simpleTraverse } from "@typescript-eslint/typescript-estree/dist/simple-traverse";

import { NodeContext } from '../types';
import isNodeWithBody from './utils/is-node-with-body';

export default function (ctx: NodeContext) {
  if (!isNodeWithBody(ctx.node)) {
    // TODO warning
    console.log('extractors:checksum-from-body', ctx.node.type, 'node has no body', ctx.node.loc.start, ctx.node.loc.end);
    return undefined;
  }
  return stringifyAndHash(removeLocationInfo(ctx.node));
}

function removeLocationInfo(ast): any {
  const result = deepClone()(ast);
  simpleTraverse(result, {
    enter: node => {
      delete node.range;
      delete node.loc;
    },
  });
  return result
}

function stringifyAndHash(object: any): string {
  const fingerprint =
    JSON.stringify(object)

  const hash = crypto
    .createHash("sha256")
    .update(fingerprint)
    .digest("hex");
  return hash;
}