import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { prepareCtx } from '../helper';
import specimen from '../../../../src/handlers/class-declaration';

describe('Class declaration', function () {
  test('name must match class name', () => {
    const fixture: any = prepareCtx(`
      class User {}
    `, AST_NODE_TYPES.ClassDeclaration);

    const data = specimen(fixture);

    const expected = {
      result: {
        name: 'User'
      }
    }
    expect(data).toMatchObject(expected);
  });
})

export default {};