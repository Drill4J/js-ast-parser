import { parse, TSESTreeOptions } from '@typescript-eslint/typescript-estree';
import fs from 'fs-extra';

export class AstParser {
  private options: TSESTreeOptions;

  constructor() {
    this.options = {
      comment: false,
      jsx: true,
      loc: true,
    };
  }

  public parse(sourcePath: string) {
    const source = fs.readFileSync(sourcePath, 'utf8');
    return { source: source, ast: this.parseSource(source) };
  }

  public parseSource(source: string) {
    return parse(source, this.options);
  }
}
