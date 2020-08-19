import { NodeContext } from '../types';
import { ClassExpression } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import extractParentNameChain from '../extractors/parent-name-chain';

export default function (ctx: NodeContext) {
  ctx.result = {
    name: getName(ctx)
  }
  ctx.flags.handleAsSeparateTree = true;
  ctx.traverserContext.skip();
  return ctx;
}

function getName(ctx: NodeContext) {
  let result = '';
  const name = (ctx.node as ClassExpression).id && (ctx.node as ClassExpression).id.name
  const parentName = extractParentNameChain(ctx)
  if (parentName) {
    result += parentName
  }
  if (name) {
    result += '.' + name
  }
  return result;
}
