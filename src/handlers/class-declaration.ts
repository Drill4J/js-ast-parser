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
import { NodeContext } from '../types';

export default function (ctx: NodeContext) {
  const { node } = ctx;
  const name = (node as any).id.type === AST_NODE_TYPES.Identifier && (node as any).id.name;
  ctx.result = {
    name,
  };
  ctx.flags.handleAsSeparateTree = true;
  ctx.traverserContext.skip();
  return ctx;
}
