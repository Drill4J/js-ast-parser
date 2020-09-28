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
import { ClassExpression } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';
import extractName from '../extractors/name';
import { NodeContext } from '../types';

export default function (ctx: NodeContext) {
  const name =
    ((ctx.node as ClassExpression).id && (ctx.node as ClassExpression).id.name) || extractName(ctx.traverserContext.parents().pop());
  ctx.result = {
    name,
  };
  ctx.flags.handleAsSeparateTree = true;
  ctx.traverserContext.skip();
  return ctx;
}
