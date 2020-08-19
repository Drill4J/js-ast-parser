import { NodeContext } from '../../types';
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { AssignmentExpression, Identifier } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";

export default function extractNameFromAssignmentExpression(ctx: NodeContext): string {
  const assignmentExpression = ctx.traverserContext.parents().pop() as AssignmentExpression;
  if (!assignmentExpression) return ''; // TODO add logger.warning and see how it goes

  const target = assignmentExpression.left;

  /*
    EXAMPLE
    someobject.property = function() { console.log(1) }
    someobject.deep.nested.property = function() { console.log(1) }
  */
  if (target.type === AST_NODE_TYPES.MemberExpression) {
    let object: any = target;
    const names = []
    while (object.property) {
      if ((object.property as Identifier).name) { // TODO it's far from perfect, properties with no names will get skipped (think about it)
        names.push((object.property as Identifier).name);
      }
      object = object.object;
    }
    names.push(object.name);
    return names.reverse().join('.');
  }

  /*
    let someVariable
    someVariable = function doStuff() {}
  */
  if (target.type === AST_NODE_TYPES.Identifier) {
    return target.name
  }

}
