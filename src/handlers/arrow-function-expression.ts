import { NodeContext } from '../types';
import extractParentNameChain from '../extractors/parent-name-chain';
import extractChecksum from '../extractors/checksum';
import extractProbes from '../extractors/probes';
import extractParams from '../extractors/params';

export default function (ctx: NodeContext) {
  const node = ctx.node;
  const name = extractParentNameChain(ctx);
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

