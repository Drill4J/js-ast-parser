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
import { Node, Range, SourceLocation } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

export interface FunctionNode {
  ctx: NodeContext;
  parent: FunctionNode;
}

interface NodePosition {
  start: Position;
  end: Position;
}

interface Position {
  line: number;
  column: number;
}

interface NodeInfo {
  name?: string;
  parentNameChain?: string;
  isAnonymous?: boolean;
  range?: Range;
  location?: SourceLocation;
  probes?: Array<number>;
  params?: Array<string>;
  checksum?: string;
  removedProbes?: Array<number>;
}

export interface NodeContext {
  node: Node;
  result: NodeInfo;
  flags: Record<string, boolean>;
  traverserContext: {
    current: () => Node;
    parents: () => Node[];
    break: () => void;
    skip: () => void;
  };
}

export interface Subtree {
  ast: Node;
  name?: string;
}

export type Queue = Subtree[];
