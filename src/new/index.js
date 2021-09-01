export default function _new(ctx, ...args) {
  if (typeof ctx !== 'function') {
    throw new Error('ctx must be a function');
  }
  const obj = Object.create({});
  const result = ctx.call(obj, ...args);
  if (result && (result === 'object' || result === 'function')) return result;
  return obj;
}
