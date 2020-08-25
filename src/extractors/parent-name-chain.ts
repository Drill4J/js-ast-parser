import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { NodeContext } from '../types';
import extractName from './name';

export default function (ctx: NodeContext) {
  const parents = ctx.traverserContext.parents();
  
  return parents
    .map(parent => {
      switch (parent.type) {
        case AST_NODE_TYPES.ArrayExpression:
          const index = parent.elements.findIndex(element => element === ctx.node); // searching only direct descendants
          if (index === -1) return ''; 
          return index.toString();

        case AST_NODE_TYPES.ExportDefaultDeclaration:
          return 'default';

        // ignore class in parentNameChain as it's treated as separate file
        case AST_NODE_TYPES.ClassDeclaration:
          return '';

        default:
          return extractName(parent);
      }
    })
    .filter(x => !!x)
}
