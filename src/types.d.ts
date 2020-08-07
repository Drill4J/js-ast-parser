import { Node } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree"

export interface FunctionNode {
  ctx: NodeContext,
  parent: FunctionNode,
}

export interface NodeContext {
  node: Node,
  result: Record<string, unknown>,
  flags: {
    [key: string]: boolean
  },
  traverserContext: {
    current: () => Node,
    parents: () => Node[],
    break: () => void,
    skip: () => void,
  }
}

export interface UnprocessedTree {
  ast: Node,
  name?: string,
}

export type Queue = UnprocessedTree[]
