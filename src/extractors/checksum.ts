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
import crypto from 'crypto';
import deepClone from 'rfdc';
import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { simpleTraverse } from '@typescript-eslint/typescript-estree/dist/simple-traverse';
import { NodeContext } from '../types';
import isNodeWithBody from './utils/is-node-with-body';
import CustomizedTraverser from './utils/customized-traverser';

export default function (ctx: NodeContext) {
  if (!isNodeWithBody(ctx.node)) {
    // TODO warning
    console.log('extractors:checksum-from-body', ctx.node.type, 'node has no body', ctx.node.loc.start, ctx.node.loc.end);
    return undefined;
  }
  return stringifyAndHash(removeLocationInfo(stripHandledNodes(ctx.node)));
}

// Have to use "typescript-eslint" traverser to remove position info
//  Q: why?
//  A: CustomizedTraverser (based on "eslint" traverser) does not support TypeScript keys
//      skipped type-annotated nodes contribute to checksum
//      one of these are function/method params
//      leading to false change detection
//      (when only position were changed, not the actual contents of function/method)
// TODO is it viable to implement custom TypeScript traverser, with "enter/leave/childrenTransform" hooks?
function removeLocationInfo(ast): any {
  const result = deepClone()(ast);
  simpleTraverse(result, {
    enter: node => {
      // eslint-disable-next-line no-param-reassign
      delete node.range;
      // eslint-disable-next-line no-param-reassign
      delete node.loc;
    },
  });
  return result;
}

function stripHandledNodes(node) {
  const tree = deepClone()(node);
  CustomizedTraverser.traverse(tree, {
    // strip nodes processed by other handlers
    childrenTransformer(children: any, key, parent) {
      if (!children) return;
      if (Array.isArray(children)) {
        // eslint-disable-next-line no-param-reassign
        parent[key] = children.filter(x => !isHandledNodeType(x.type));
        return;
      }
      if (isHandledNodeType(children.type)) {
        // eslint-disable-next-line no-param-reassign
        delete parent[key];
      }
    },
  });
  return tree;
}

// mirrors the contents of src/handlers/index.ts
// except the "Program" node, because it is always the root / never a child
const handledNodeTypes = [
  AST_NODE_TYPES.FunctionExpression,
  AST_NODE_TYPES.FunctionDeclaration,
  AST_NODE_TYPES.ArrowFunctionExpression,
  AST_NODE_TYPES.ClassDeclaration,
  AST_NODE_TYPES.ClassExpression,
];

function isHandledNodeType(type) {
  return handledNodeTypes.includes(type);
}

function stringifyAndHash(object: any): string {
  const fingerprint = JSON.stringify(object);
  const hash = crypto.createHash('sha256').update(fingerprint).digest('hex');
  return hash;
}
