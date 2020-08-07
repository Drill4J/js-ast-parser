import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { prepareCtx } from '../helper';
import specimen from '../../../../src/handlers/function-declaration';

describe('Function declaration', function () {

  test('name must match function name', () => {
    const fixture: any = prepareCtx(`
      function doStuff() {}
    `, AST_NODE_TYPES.FunctionDeclaration);

    const data = specimen(fixture);

    const expected = {
      result: {
        name: 'doStuff'
      }
    }
    expect(data).toMatchObject(expected);
  });

});

export default {};