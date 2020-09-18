import { ClassExpression } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';
import extractName from '../extractors/name';
import { NodeContext } from '../types';

export default function (ctx: NodeContext) {
  const name =
    ((ctx.node as ClassExpression).id && (ctx.node as ClassExpression).id.name) || extractName(ctx.traverserContext.parents().pop());
  ctx.result = {
    name,
  };
  ctx.flags.handleAsSeparateTree = true;
  ctx.traverserContext.skip();
  return ctx;
}
