import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { extract } from '../extractors/params';
import { NodeContext } from '../types';
import { FunctionExpression, Identifier } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import extractChecksum from '../extractors/checksum';
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
  const ownName = (ctx.node as FunctionExpression).id && (ctx.node as FunctionExpression).id.name

  const parent = ctx.traverserContext.parents().pop();

  // EXAMPLE: class { someMethod() { ... } }
  if (parent.type === AST_NODE_TYPES.MethodDefinition) {
    return (parent.key as Identifier).name;
  }

  if (parent.type === AST_NODE_TYPES.Property) {
    return extractNameFromObjectProperty(ctx, ownName);
  }

  if (parent.type === AST_NODE_TYPES.AssignmentExpression) {
    return extractNameFromAssignmentExpression(ctx, ownName);
  }

  // EXAMPLE: const a = function helloWorld() { console.log(1) }
  if (ownName) {
    return ownName
  }

  // EXAMPLE: const a = function () { console.log(1) }
  if (parent.type === AST_NODE_TYPES.VariableDeclarator) {
    return (parent as any).id.name // (parent as any).id.type === AST_NODE_TYPES.Identifier
  }
}
