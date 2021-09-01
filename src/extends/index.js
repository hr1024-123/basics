/* eslint-disable no-new-func */
export default function extendWrapper(
  Sup = function () {},
  Sub = function () {},
  params = [],
) {
  function extend(...rest) {
    if (!Sub.constructor || !Sup.constructor) {
      throw new Error('can not extends function without constructor');
    }
    Sup.call(this, ...params);
    Sub.call(this, ...rest);
  }

  extend.prototype = new Sup();
  extend.prototype.constructor = Sub;
  return extend;
}
