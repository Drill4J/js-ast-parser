import { Identifier } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { NodeContext } from '../../types';
import extractNameFromAssignmentExpression from './name-from-assignment-expression';

export default function (ctx: NodeContext) {
  const parents = ctx.traverserContext.parents();
  const names = [];

  for (const parent of parents) {
    switch (parent.type) {
      case AST_NODE_TYPES.MethodDefinition:
        names.push((parent.key as Identifier).name);
        break;

      case AST_NODE_TYPES.ExportDefaultDeclaration:
        names.push('default');
        break;

      case AST_NODE_TYPES.Property:
        names.push((parent.key as Identifier).name);
        break;

      case AST_NODE_TYPES.AssignmentExpression:
        names.push(extractNameFromAssignmentExpression(parent));
        break;

      case AST_NODE_TYPES.VariableDeclarator:
        names.push((parent as any).id.name);
        break;
    }
  }

  return names.join('.')
}
