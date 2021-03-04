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
import { FunctionExpression } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';
import extractChecksum from '../extractors/checksum';
import extractParams from '../extractors/params';
import extractProbes from '../extractors/probes';
import extractRange from '../extractors/range';
import extractLocation from '../extractors/location';
import extractParentNameChain from '../extractors/parent-name-chain';
import { NodeContext } from '../types';

export default function (ctx: NodeContext) {
  const { node } = ctx;
  const checksum = extractChecksum(ctx);
  const parentNameChain = extractParentNameChain(ctx);
  const name = ((ctx.node as FunctionExpression).id && (ctx.node as FunctionExpression).id.name) || parentNameChain.pop();

  ctx.result = {
    name,
    isAnonymous: !name,
    range: extractRange(ctx),
    location: extractLocation(ctx),
    parentNameChain: parentNameChain.join('.'),
    probes: extractProbes(ctx),
    params: extractParams((node as any).params),
    checksum,
  };
  return ctx;
}
