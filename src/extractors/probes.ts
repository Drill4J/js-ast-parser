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
import { simpleTraverse } from '@typescript-eslint/typescript-estree/dist/simple-traverse';
import deepClone from 'rfdc';

import { NodeContext } from '../types';
import isNodeWithBody from './utils/is-node-with-body';

export default function (ctx: NodeContext) {
  if (!isNodeWithBody(ctx.node)) {
    // TODO warning
    console.log('extractors:probe', ctx.node.type, 'node has no body', ctx.node.loc.start, ctx.node.loc.end);
    return undefined;
  }

  const probeSet = new Set<number>();
  const tree = deepClone()(ctx.node);
  simpleTraverse(tree, {
    enter: node => {
      probeSet.add(node.loc.start.line);
      probeSet.add(node.loc.end.line);
    },
  });
  return Array.from(probeSet).sort((a, b) => a - b);
}
