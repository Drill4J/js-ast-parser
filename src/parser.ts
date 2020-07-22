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

  public parse(sourcePath: string, includeLocationData: boolean = true) {
    const source = fs.readFileSync(sourcePath, 'utf8');
    return { source: source, ast: this.parseSource(source, includeLocationData) };
  }

  public parseSource(source: string, includeLocationData) {
    this.options.loc = includeLocationData;
    this.options.range = includeLocationData;
    return parse(source, this.options);
  }
}
