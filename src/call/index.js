export default function call(ctx, obj = {}, ...args) {
  if (typeof ctx !== 'function') {
    throw new Error('ctx must be a function');
  }
  const fn = Symbol('fn');
  obj[fn] = ctx;
  const result = obj[fn](...args);
  delete obj[fn];
  return result;
}
