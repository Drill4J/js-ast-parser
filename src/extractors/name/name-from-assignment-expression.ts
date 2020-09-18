import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { AssignmentExpression, Identifier } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

export default function extractNameFromAssignmentExpression(assignmentExpression: AssignmentExpression): string {
  const target = assignmentExpression.left;

  /*
    someobject.property = function() { console.log(1) }
    someobject.deep.nested.property = function() { console.log(1) }
  */
  if (target.type === AST_NODE_TYPES.MemberExpression) {
    let object: any = target;
    const names = [];
    while (object.property) {
      if ((object.property as Identifier).name) {
        // TODO properties with non-identifiers names will get skipped. Is it even possible?
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
    return target.name;
  }

  return null;
}
