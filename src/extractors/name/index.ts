import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { Identifier, Node } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';
import extractNameFromAssignmentExpression from './name-from-assignment-expression';

export default function (node: Node) {
  switch (node.type) {
    case AST_NODE_TYPES.FunctionDeclaration:
    case AST_NODE_TYPES.FunctionExpression:
    case AST_NODE_TYPES.VariableDeclarator:
    case AST_NODE_TYPES.ClassDeclaration:
    case AST_NODE_TYPES.ClassExpression:
      return node.id && (node.id as Identifier).name;

    case AST_NODE_TYPES.MethodDefinition:
    case AST_NODE_TYPES.Property:
      return (node.key as Identifier).name;

    case AST_NODE_TYPES.AssignmentExpression:
      return extractNameFromAssignmentExpression(node);

    default:
      return null;
  }
}
