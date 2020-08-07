import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { extract } from '../extractors/params';
import extractChecksum from '../extractors/checksum';
import { NodeContext } from '../types';
import { Identifier } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import extractNameFromObjectProperty from '../extractors/name-from-object-property';
import extractNameFromAssignmentExpression from '../extractors/name-from-assignment-expression';
import extractProbes from '../extractors/probes';

export default function (ctx: NodeContext) {
  const node = ctx.node;
  const name = getName(ctx);
  const checksum = extractChecksum(ctx);
  ctx.result = {
    name: name ? name : `anonymous${checksum}`,
    anonymous: !name,
    probes: extractProbes(ctx),
    params: extract((node as any).params),
    checksum,
  }
  return ctx;
}

function getName(ctx: NodeContext) {
  const parent = ctx.traverserContext.parents().pop();

  if (parent.type === AST_NODE_TYPES.VariableDeclarator) {
    return (parent.id as Identifier).name
  }

  if (parent.type === AST_NODE_TYPES.Property) {
    return extractNameFromObjectProperty(ctx);
  }

  if (parent.type === AST_NODE_TYPES.AssignmentExpression) {
    return extractNameFromAssignmentExpression(ctx);
  }

}
