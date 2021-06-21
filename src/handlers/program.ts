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
import { Program } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';
import extractChecksum from '../extractors/checksum';
import extractProbes from '../extractors/probes';
import extractRange from '../extractors/range';
import extractLocation from '../extractors/location';
import { NodeContext } from '../types';

export default function (ctx: NodeContext, options) {
  const location = extractLocation(ctx);
  location.end.column = Infinity;
  const isEmptyProgram = (ctx.node as Program).body.length === 0;
  if (isEmptyProgram || options?.skipGlobals) {
    ctx.flags.skip = true;
  } else {
    ctx.result = {
      name: 'GLOBAL', // TODO define literal name in config/env?
      probes: extractProbes(ctx),
      checksum: extractChecksum(ctx),
      range: extractRange(ctx),
      location,
      isAnonymous: false, // TODO remove, it's added just to fit function's interface
      parentNameChain: '', // TODO remove, it's added just to fit function's interface
      params: [], // TODO remove, it's added just to fit function's interface
    };
  }
  return ctx;
}
