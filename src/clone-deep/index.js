/* eslint-disable no-eval */
/* eslint-disable no-new-func */
// 只考虑对象与数组
export function cloneObject(source, map = new WeakMap()) {
  // 判断是否是对象或者数组， 且不为null
  if (typeof source !== 'object' || !source) return source;
  // 判断WeakMap中是否含有当前需要拷贝的引用类型
  if (map.has(source)) return map.get(source);
  // 创建一个新的template
  const cloneTarge = Array.isArray(source) ? [] : {};
  // 将引用类型存入WeakMap中，以防止递归深拷贝
  map.set(source, cloneTarge);
  // 通过Reflect实例遍历source，避免遍历到原型链
  Reflect.ownKeys(source).forEach((key) => {
    // 如果当前为对象则递归深拷贝
    if (source[key] && typeof source[key] === 'object') {
      cloneTarge[key] = cloneObject(source[key], map);
    } else {
      // 直接赋值
      cloneTarge[key] = source[key];
    }
  });
  return cloneTarge;
}

// 考虑所有引用数据类型

// 拷贝Symbol类型
const cloneSymbol = (target) => Object(Symbol.prototype.valueOf.call(target));

// 拷贝正则
function cloneReg(regexp) {
  const reFlags = /\w*$/;
  const { constructor } = regexp;
  const sticky = reFlags.exec(regexp.toString()) || [''];
  const result = new constructor(regexp.source, sticky[0]);
  result.lastIndex = regexp.lastIndex;
  return result;
}

// 拷贝函数
function cloneFunction(func) {
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcStr = func.toString();
  // 如果是普通函数则通过new Function创建
  if (func.prototype) {
    const param = paramReg.exec(funcStr);
    const body = bodyReg.exec(funcStr);
    const paramArr = param?.[0].split(',') || [];
    return new Function(...paramArr, body?.[0] || '');
  }
  // 如果是箭头函数则通过eval创建
  return eval(funcStr);
}

function cloneBase(target) {
  if (typeof target === 'function') return cloneFunction(target);
  if (target instanceof Date) return target.constructor(target);
  if (target instanceof RegExp) return cloneReg(target);
  if (typeof target === 'symbol') return cloneSymbol(target);
  return target;
}

export default function cloneDeep(source, map = new WeakMap()) {
  // 创建一个拷贝容器
  let cloneTarget;

  // 如果类型为object或者其含有可迭代属性
  if ((source && typeof source === 'object') || (source?.[Symbol.iterator] && typeof source === 'object')) {
    // 通过source原型的构造函数赋值到拷贝容器中
    cloneTarget = new source.constructor(source);
    // 如果WeakMap中存在当前source引用类型，直接返回当前source
    if (map.get(source)) {
      return source;
    }
    // 如果不存在，则在WeakMap中加入一个引用的指针
    map.set(source, cloneTarget);

    // 如果当前拷贝项是Set，递归拷贝Set对象
    if (source instanceof Set) {
      source.forEach((value) => {
        cloneTarget.add(cloneDeep(value));
      });
      return cloneTarget;
    }

    // 如果当前拷贝项是Map，递归拷贝Map对象
    if (source instanceof Map) {
      source.forEach((value, key) => {
        cloneTarget.set(key, cloneDeep(value));
      });
      return cloneTarget;
    }

    // 拷贝数组或者对象
    const keys = Array.isArray(source) ? undefined : Object.keys(source);
    forEach(keys || source, (value, key) => {
      if (keys) key = +value;
      cloneTarget[key] = cloneDeep(source[key], map);
    });
    return cloneTarget;
  }

  // 其他属于无需递归类型分开处理即可
  return cloneBase(source);
}

function forEach(array, iteratee) {
  let index = 0;
  const n = array.length;
  while (index < n) {
    iteratee(array[index], index);
    index += 1;
  }
  return array;
}
