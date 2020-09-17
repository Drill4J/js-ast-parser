import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { prepareCtx } from '../../helper';
import specimen from '../../../../src/extractors/name';

describe('Name extractor', function () {

  test('from function declaration must return value matching function identifier', () => {
    const fixture = prepareCtx(
      `function doStuff(){}`,
      AST_NODE_TYPES.FunctionDeclaration);
    const data = specimen(fixture.node);
    expect(data).toEqual('doStuff');
  })

  test('from named function expression must return value matching function identifier', () => {
    const fixture = prepareCtx(
      `const fn = function doStuff(){}`,
      AST_NODE_TYPES.FunctionExpression);
    const data = specimen(fixture.node);
    expect(data).toEqual('doStuff');
  })

  test('from anonymous function expression must return null', () => {
    const fixture = prepareCtx(
      `const fn = function (){}`,
      AST_NODE_TYPES.FunctionExpression);
    const data = specimen(fixture.node);
    expect(data).toEqual(null);
  })

  test('from variable declarator must return value matching declarator identifier', () => {
    const fixture = prepareCtx(
      `const fn = function (){}`,
      AST_NODE_TYPES.VariableDeclarator);
    const data = specimen(fixture.node);
    expect(data).toEqual('fn');
  })

  test('from method definition must return value matching method identifier', () => {
    const fixture = prepareCtx(
      `class User {
        
        name: string;
        
        constructor(name) {
          this.name = name;
        }
        
        getName() {           // line 9
          return this.name
        }
      }
      `,
      AST_NODE_TYPES.MethodDefinition, 9);
    const data = specimen(fixture.node);
    expect(data).toEqual('getName');
  })

  test('from class declaration must return value matching class identifier', () => {
    const fixture = prepareCtx(
      `class User {
        constructor() {
        }
      }
      `,
      AST_NODE_TYPES.ClassDeclaration);
    const data = specimen(fixture.node);
    expect(data).toEqual('User');
  })

  test('from property must return value matching property key', () => {
    const fixture = prepareCtx(
      `const user = {
        age: 30
      }
      `,
      AST_NODE_TYPES.Property, 2);
    const data = specimen(fixture.node);
    expect(data).toEqual('age');
  })

  describe('from assignment expression', () => {
    test('with member expression on a left side must return value matching member names joined with dot', () => {
      const fixture = prepareCtx(
        `someobject.deep.nested.property = function() {}`,
        AST_NODE_TYPES.AssignmentExpression);
      const data = specimen(fixture.node);
      expect(data).toEqual('someobject.deep.nested.property');
    })

    test('with identifier on a left side must return value matching identifier', () => {
      const fixture = prepareCtx(
        `let someVariable
        someVariable = function doStuff() {}`,
        AST_NODE_TYPES.AssignmentExpression);
      const data = specimen(fixture.node);
      expect(data).toEqual('someVariable');
    })
  })

})
