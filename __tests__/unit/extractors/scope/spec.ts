import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { prepareCtx } from '../../helper';
import specimen from '../../../../src/extractors/parent-name-chain';

describe('ParentNameChain extractor for function', function () {

  test('nested in named functions must return array containing parent function identifiers', () => {
    const fixture: any = prepareCtx(
      `function grandparent() {
        function parent() {
          function child() {        // line 3
            console.log('123')
          }
        }
      }`,
      AST_NODE_TYPES.FunctionDeclaration, 3);
    const data = specimen(fixture);
    expect(data).toEqual(['grandparent','parent']);
  })

  test('nested in object expression must return array starting with variable name followed by properties', () => {
    const fixture: any = prepareCtx(
      `const some = {
        deep: {
          nested: {
            fn: function () {
              console.log('123')
            }
          }
        }
      }`,
      AST_NODE_TYPES.FunctionExpression);
    const data = specimen(fixture);
    expect(data).toEqual(['some', 'deep', 'nested', 'fn']);
  })

  test('assigned to export default declaration must return array starting with "default" followed by function identifier', () => {
    const fixture: any = prepareCtx(
      `export default function doStuff() {        
      }`,
      AST_NODE_TYPES.FunctionDeclaration);
    const data = specimen(fixture);
    expect(data).toEqual(['default']);
  })

  test('nested in array expression must return array starting with name of array expression followed by index of function inside array', () => {
    const fixture: any = prepareCtx(
      `const arr = [
        function firstOne() {
        },
        function doStuff() {      // line 4
          console.log('123')
        },
      ]`,
      AST_NODE_TYPES.FunctionExpression, 4);
    const data = specimen(fixture);
    expect(data).toEqual(['arr', '1']);
  })

})

export default {};