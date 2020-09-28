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
import extractName from './name';

export default function (ctx: NodeContext) {
  const parents = ctx.traverserContext.parents();

  return parents
    .map(parent => {
      switch (parent.type) {
        case AST_NODE_TYPES.ArrayExpression: {
          const index = parent.elements.findIndex(element => element === ctx.node); // searching only direct descendants
          if (index === -1) return '';
          return index.toString();
        }

        case AST_NODE_TYPES.ExportDefaultDeclaration:
          return 'default';

        // ignore class in parentNameChain as it's treated as separate file
        case AST_NODE_TYPES.ClassDeclaration:
          return '';

        default:
          return extractName(parent);
      }
    })
    .filter(x => !!x);
}
