import { NodeContext } from '../types';
import { FunctionExpression } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import extractChecksum from '../extractors/checksum';
import extractParams from '../extractors/params';
import extractParentNameChain from '../extractors/parent-name-chain';
import extractProbes from '../extractors/probes';

export default function (ctx: NodeContext) {
  const node = ctx.node;
  const name = getName(ctx);
  const checksum = extractChecksum(ctx);
  ctx.result = {
    name: name ? name : `anonymous${checksum}`,
    isAnonymous: !name,
    probes: extractProbes(ctx),
    params: extractParams((node as any).params),
    checksum,
  }
  return ctx;
}

function getName(ctx: NodeContext) {
  let result = '';
  const name = (ctx.node as FunctionExpression).id && (ctx.node as FunctionExpression).id.name;
  const parentName = extractParentNameChain(ctx);
  if (parentName) {
    result += parentName;
  }
  if (name) {
    result += '.' + name
  }
  return result;
}
