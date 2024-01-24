// https://github.com/TypeStrong/ts-node/discussions/1450#discussioncomment-1806115
import { resolve as resolveTs } from 'ts-node/esm';

export function resolve(specifier, ctx, defaultResolve) {
  return resolveTs(specifier, ctx, defaultResolve);
}

export { load, transformSource } from 'ts-node/esm';
