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
import { SourceLocation } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';
import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { NodeContext } from '../types';

export default function (ctx: NodeContext): SourceLocation {
  const parent = ctx.traverserContext.parents().reverse()[0];
  switch (parent?.type) {
    case AST_NODE_TYPES.MethodDefinition:
    case AST_NODE_TYPES.ExportNamedDeclaration:
      return parent.loc;

    default:
      return ctx.node.loc;
  }
}
