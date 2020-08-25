import extractChecksum from '../extractors/checksum';
import extractParams from '../extractors/params';
import extractProbes from '../extractors/probes';
import extractParentNameChain from '../extractors/parent-name-chain';
import { NodeContext } from '../types';

export default function (ctx: NodeContext) {
  const node = ctx.node;
  const checksum = extractChecksum(ctx);
  const parentNameChain = extractParentNameChain(ctx);
  const name = parentNameChain.pop();
  ctx.result = {
    name,
    isAnonymous: !name,
    parentNameChain: parentNameChain.join('.'),
    probes: extractProbes(ctx),
    params: extractParams((node as any).params),
    checksum,
  }
  return ctx;
}
