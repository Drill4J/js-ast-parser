import { Node } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree"

export interface FunctionNode {
  ctx: NodeContext,
  parent: FunctionNode,
}

interface NodeInfo {
  name?: string,
  isAnonymous?: boolean,
  probes?: Array<number>,
  params?: Array<string>,
  checksum?: string,
  removedProbes?: Array<number>,
}

export interface NodeContext {
  node: Node,
  result: NodeInfo,
  flags: Record<string,boolean>,
  traverserContext: {
    current: () => Node,
    parents: () => Node[],
    break: () => void,
    skip: () => void,
  }
}

export interface Subtree {
  ast: Node,
  name?: string,
}

export type Queue = Subtree[]
