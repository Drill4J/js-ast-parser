import { NodeContext } from '../types';
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { Identifier } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";

/*
  INPUT:  
  const object = { nested: { prop: function doStuff() { ... } } }
  
  OUTPUT:
  "object.nested.prop.doStuff"
*/
export default function extractNameFromObjectProperty(ctx: NodeContext, ownName?: string): string | undefined {
  const parents = ctx.traverserContext.parents();

  const names = [];
  let parent = parents.pop();
  while (parent.type === AST_NODE_TYPES.Property || parent.type === AST_NODE_TYPES.ObjectExpression) {
    if (parent.type === AST_NODE_TYPES.Property) {
      if ((parent.key as Identifier).name) { // TODO computed properties? brackets?
        names.push((parent.key as Identifier).name);
      }
    };
    parent = parents.pop();
  }

  if ((parent as any).id) {
    names.push((parent as any).id.name)
  }

  if (ownName) { // TODO the whole "ownName" thing is kinda hack-ish, think about it a bit more
    names.unshift(ownName)
  }

  return names.reverse().join('.')
}