/*
 * Copyright 2020 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { JSXElement } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';
import extractNameFromJsxMemberExpression from './extract-name-from-jsx-member-expression';

export default function extractNameFromJsxElement(jsxElement: JSXElement): string | null {
  if (jsxElement.openingElement.name.type === AST_NODE_TYPES.JSXIdentifier) {
    return jsxElement.openingElement.name.name;
  }

  if (jsxElement.openingElement.name.type === AST_NODE_TYPES.JSXMemberExpression) {
    return extractNameFromJsxMemberExpression(jsxElement.openingElement.name);
  }

  return null;
}
