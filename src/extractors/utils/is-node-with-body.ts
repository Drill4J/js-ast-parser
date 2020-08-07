import {
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
} from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";

import { Node } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";

type NodeWithBody = ClassBody | ClassDeclaration | ArrowFunctionExpression | FunctionDeclaration | LabeledStatement | Program | TSModuleBlock | TSEmptyBodyFunctionExpression | TSInterfaceDeclaration | TSInterfaceBody | WhileStatement | WithStatement | ForInStatement | ForOfStatement | ForStatement | BlockStatement | CatchClause | DoWhileStatement;

export default function isNodeWithBody(node: Node): node is NodeWithBody {
  return (node as any).body !== undefined
}