import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { extract } from '../extractors/params';
import extractChecksum from '../extractors/checksum';
import { NodeContext } from '../types';
import { FunctionDeclaration, Identifier } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import extractProbes from '../extractors/probes';

export default function (ctx: NodeContext) {
  const node = ctx.node;
  const name = (node as FunctionDeclaration).id && (node as FunctionDeclaration).id.name;
  const checksum = extractChecksum(ctx);
  ctx.result = {
    name: name ? name : `anonymous${checksum}`,
    anonymous: !name,
    probes: extractProbes(ctx),
    params: extract((node as any).params),
    checksum,
  }
  return ctx;
}
