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
import {
  Node,
  // nodes that likely have to be processed
  ClassBody,
  ClassDeclaration,
  ArrowFunctionExpression,
  FunctionDeclaration,
  LabeledStatement,
  TSModuleBlock,
  // less likely to be processed, we don't really "want" those
  Program,
  TSInterfaceDeclaration,
  TSInterfaceBody,
  // very unlikely to be processed, because
  WhileStatement,
  WithStatement,
  ForInStatement,
  ForOfStatement,
  ForStatement,
  BlockStatement,
  CatchClause,
  DoWhileStatement,
  // body === null
  TSEmptyBodyFunctionExpression,
} from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

type NodeWithBody =
  | ClassBody
  | ClassDeclaration
  | ArrowFunctionExpression
  | FunctionDeclaration
  | LabeledStatement
  | Program
  | TSModuleBlock
  | TSEmptyBodyFunctionExpression
  | TSInterfaceDeclaration
  | TSInterfaceBody
  | WhileStatement
  | WithStatement
  | ForInStatement
  | ForOfStatement
  | ForStatement
  | BlockStatement
  | CatchClause
  | DoWhileStatement;

export default function isNodeWithBody(node: Node): node is NodeWithBody {
  return (node as any).body !== undefined;
}
