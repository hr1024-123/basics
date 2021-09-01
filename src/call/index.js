export default function call(ctx, obj, ...args) {
  const fn = Symbol('fn');
  obj[fn] = ctx;
  const result = obj[fn](...args);
  delete obj[fn];
  return result;
}
