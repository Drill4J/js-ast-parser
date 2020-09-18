import { parse, TSESTreeOptions } from '@typescript-eslint/typescript-estree';

export default function (
  source,
  options: TSESTreeOptions = {},
  defaultOptions: TSESTreeOptions = {
    comment: false,
    jsx: true,
    loc: true,
    range: true,
  },
) {
  return parse(source, {
    ...defaultOptions,
    ...options,
  });
}
