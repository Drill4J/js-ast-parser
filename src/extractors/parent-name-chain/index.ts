import { FunctionExpression, Identifier } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { NodeContext } from '../../types';
import extractNameFromObjectProperty from './name-from-object-property';
import extractNameFromAssignmentExpression from './name-from-assignment-expression';

export default function (ctx: NodeContext) {
  const parent = ctx.traverserContext.parents().pop();

  // EXAMPLE: class { someMethod() { ... } }
  if (parent.type === AST_NODE_TYPES.MethodDefinition) {
    return (parent.key as Identifier).name;
  }

  if (parent.type === AST_NODE_TYPES.Property) {
    return extractNameFromObjectProperty(ctx);
  }

  if (parent.type === AST_NODE_TYPES.AssignmentExpression) {
    return extractNameFromAssignmentExpression(ctx);
  }

  // EXAMPLE: const a = function () { console.log(1) }
  if (parent.type === AST_NODE_TYPES.VariableDeclarator) {
    return (parent as any).id.name // (parent as any).id.type === AST_NODE_TYPES.Identifier
  }
}
