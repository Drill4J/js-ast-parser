import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { NodeContext } from '../types';

export default function (ctx: NodeContext) {
  const { node } = ctx;
  const name = (node as any).id.type === AST_NODE_TYPES.Identifier && (node as any).id.name;
  ctx.result = {
    name,
  };
  ctx.flags.handleAsSeparateTree = true;
  ctx.traverserContext.skip();
  return ctx;
}
