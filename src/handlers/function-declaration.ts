import { NodeContext } from '../types';
import { FunctionDeclaration } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import extractChecksum from '../extractors/checksum';
import extractProbes from '../extractors/probes';
import extractParams from '../extractors/params';

export default function (ctx: NodeContext) {
  const node = ctx.node;
  const name = (node as FunctionDeclaration).id && (node as FunctionDeclaration).id.name;
  const checksum = extractChecksum(ctx);
  ctx.result = {
    name: name ? name : `anonymous${checksum}`,
    isAnonymous: !name,
    probes: extractProbes(ctx),
    params: extractParams((node as any).params),
    checksum,
  }
  return ctx;
}
