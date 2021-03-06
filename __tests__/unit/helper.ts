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
import { AST_NODE_TYPES, parse } from '@typescript-eslint/typescript-estree';
import Traverser from 'eslint/lib/shared/traverser';

export function prepareCtx(source, targetNodeType: AST_NODE_TYPES, targetLine?: number) {
  const options = {
    comment: false,
    jsx: true,
    loc: true,
    range: true,
  };

  const ast = parse(source, options);
  const ctx = {
    node: null,
    result: {},
    flags: {},
    traverserContext: {},
  };

  Traverser.traverse(ast, {
    enter(node, parent) {
      if (node.type === targetNodeType) {
        if (targetLine && node.loc?.start?.line !== targetLine) return;
        const parents = this.parents();
        ctx.node = node;
        ctx.traverserContext = {
          break: () => {},
          skip: () => {},
          parents: () => parents.slice(0),
          current: () => node,
        };

        this.break();
      }
    },
  });
  return ctx;
}
