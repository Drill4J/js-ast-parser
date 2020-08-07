import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { NodeContext } from '../types';
import { ClassExpression, Identifier } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import extractNameFromObjectProperty from '../extractors/name-from-object-property';
import extractNameFromAssignmentExpression from "../extractors/name-from-assignment-expression";

export default function (ctx: NodeContext) {
  const name = getName(ctx);
  ctx.result = {
    name,
  }
  ctx.flags.handleAsSeparateTree = true;
  ctx.traverserContext.skip();
  return ctx;
}

function getName(ctx: NodeContext) {
  // prefere class's own name
  // EXAMPLE: const something = class Hello { ...
  const ownName = (ctx.node as ClassExpression).id && (ctx.node as ClassExpression).id.name

  const parent = ctx.traverserContext.parents().pop();
  
  if (parent.type === AST_NODE_TYPES.Property) {
    return extractNameFromObjectProperty(ctx, ownName);
  }

  if (parent.type === AST_NODE_TYPES.AssignmentExpression) {
    return extractNameFromAssignmentExpression(ctx, ownName);
  }

  if (ownName) {
    return ownName;
  }

  // EXAMPLE: const a = function () { console.log(1) }
  if (parent.type === AST_NODE_TYPES.VariableDeclarator) {
    return (parent.id as Identifier).name // (parent as any).id.type === AST_NODE_TYPES.Identifier
  }
}
