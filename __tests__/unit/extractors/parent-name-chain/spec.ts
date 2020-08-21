import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { prepareCtx } from '../../helper';
import specimen from '../../../../src/extractors/parent-name-chain';

describe('Parent name chain extractor', function () {

  describe('from method', () => {
    test('must return name matching method name', () => {
      const fixture: any = prepareCtx(`
        class User {
          doStuff() {}
        }
      `, AST_NODE_TYPES.FunctionExpression);
  
      const data = specimen(fixture);
  
      const expected = 'doStuff';
      expect(data).toEqual(expected);
    });
  })

  describe('from variable declaration', () => {
    test('must return name matching variable name', () => {
      const fixture: any = prepareCtx(`
        const doStuff = () => { };
      `, AST_NODE_TYPES.ArrowFunctionExpression);
  
      const data = specimen(fixture);
  
      const expected = 'doStuff';
      expect(data).toEqual(expected);
    });
  })

  describe('from object expression', () => {
    test('must return name concatenated from nested properties names', () => {
      const fixture: any = prepareCtx(`
        const some = {
          deep: {
            nested: {
              fn: () => { }
            }
          }
        };
      `, AST_NODE_TYPES.ArrowFunctionExpression);
  
      const data = specimen(fixture);
  
      const expected = 'some.deep.nested.fn';
      expect(data).toEqual(expected);
    });
  })
  describe('from assignment', () => {
    test('to a variable must return name matching variable name', () => {
      const fixture: any = prepareCtx(`
        let doStuff;
        doStuff = () => {};
      `, AST_NODE_TYPES.ArrowFunctionExpression);
  
      const data = specimen(fixture);
  
      const expected = 'doStuff';
      expect(data).toEqual(expected);
    });

    test('to member expression must return name concatenated from nested members names', () => {
      const fixture: any = prepareCtx(`
        const some = {
          deep: {
            nested: {
              fn: null
            }
          }
        };
        some.deep.nested.fn = () => { };
      `, AST_NODE_TYPES.ArrowFunctionExpression);
  
      const data = specimen(fixture);
  
      const expected = 'some.deep.nested.fn';
      expect(data).toEqual(expected);
    });
  })

})

export default {};