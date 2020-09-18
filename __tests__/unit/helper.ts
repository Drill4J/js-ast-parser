import { AST_NODE_TYPES, parse } from '@typescript-eslint/typescript-estree';
import Traverser from 'eslint/lib/shared/traverser';

export function prepareCtx(source, targetNodeType: AST_NODE_TYPES, targetLine?: number) {
  const options = {
    comment: false,
    jsx: true,
    loc: true,
    range: true,
  };

  const ast = parse(source, options);
  const ctx = {
    node: null,
    result: {},
    flags: {},
    traverserContext: {},
  };

  Traverser.traverse(ast, {
    enter(node, parent) {
      if (node.type === targetNodeType) {
        if (targetLine && node.loc?.start?.line !== targetLine) return;
        const parents = this.parents();
        ctx.node = node;
        ctx.traverserContext = {
          break: () => {},
          skip: () => {},
          parents: () => parents.slice(0),
          current: () => node,
        };

        this.break();
      }
    },
  });
  return ctx;
}
