export default class _Promise {
  // 接收一个构造器函数
  constructor(executor) {
    // 初始化状态
    // 执行executor,传递resolve和reject函数
    try {
      executor(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }

  // 初始化状态
  status = 'pending';

  value;

  reason;

  // 初始化成功队列
  onFulfilledQueue = [];

  // 初始化错误队列
  onRejectedQueue = [];

  // resolve回调
  resolve = (data) => {
    // 由于Promise的状态不可逆，判断是否处于pending状态
    if (this.status !== 'pending') return;
    // 修改值、状态
    this.value = data;
    this.status = 'fulfilled';
    // 当成功队列中有待执行任务时将其执行
    while (this.onFulfilledQueue.length) {
      this.onFulfilledQueue.shift()(data);
    }
  }

  // reject回调
  reject = (reason) => {
    // 由于Promise的状态不可逆，判断是否处于pending状态
    if (this.status !== 'pending') return;
    // 抛出错误原因、状态
    this.reason = reason;
    this.status = 'rejected';
    // 当失败队列中有待执行任务时将其执行
    while (this.onRejectedQueue.length) {
      this.onRejectedQueue.shift()(reason);
    }
  }

  // 由于then最终返回一个新的promise对象
  then(onFulfilled = (value) => value, onRejected = (reason) => { throw reason; }) {
    // 创建then执行后的新promise对象
    const nextPromise = new _Promise((resolve, reject) => {
      // 定义fulfilled任务
      const fulfilledTask = () => {
        queueMicrotask(() => {
          try {
            // 获取传入成功回调返回值
            const nextValue = onFulfilled(this.value);
            resolvePromise(nextPromise, nextValue, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      // 定义rejected任务
      const rejectedTask = () => {
        queueMicrotask(() => {
          try {
            // 获取传入错误回调返回值
            const nextValue = onRejected(this.reason);
            resolvePromise(nextPromise, nextValue, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      // 根据当前不同promise状态选择执行方法
      if (this.status === 'fulfilled') { // 为fulfilled直接将回调推入微任务队列
        fulfilledTask();
      } else if (this.status === 'rejected') { // 为rejected直接推入微任务队列
        rejectedTask();
      } else {
        this.onFulfilledQueue.push(fulfilledTask); // 推入待执行的成功队列
        this.onRejectedQueue.push(rejectedTask); // 推入待执行的失败队列
      }
    });
    return nextPromise;
  }

  // catch实现就是返回了一个Promise.prototype.then(undefined, errCallback)
  catch(reason) {
    return this.then(undefined, reason);
  }

  // finally实现
  finally(onFinally) {
    return this.then(onFinally, onFinally);
  }

  // 实现resolve的静态调用
  static resolve(params) {
    // 如果传入的是一个Promise对象就直接返回这个Promise
    if (params instanceof _Promise) {
      return params;
    }

    // 其他的通过新建Promise执行
    return new _Promise((resolve) => {
      resolve(params);
    });
  }

  // 实现reject的静态调用
  static reject(reason) {
    return new _Promise((resolve, reject) => {
      reject(reason);
    });
  }

  // 实现all的静态调用， 传入一个可迭代的参数
  static all(iterable) {
    // 合并传入的Promise
    return new _Promise((resolve, reject) => {
      // 传入为空时直接resolve
      if (!iterable.length) resolve([]);
      // 定义返回的结果数组
      const res = [];
      // 定义返回数组填值指针
      let count = 0;

      // 循环传入的Promise数组
      iterable.forEach((item, index) => {
        // 通过Promise的静态resolve调用，在then中做错误和填值
        _Promise.resolve(item).then((data) => {
          // 在填值后填值指针加1
          count += 1;
          // 在缓存的index中设置对应位置的数据
          res[index] = data;
          // 当填值指针与远Promise长度相等时，所有Promise返回值完成，resolve最终的值
          if (count === iterable.length) {
            resolve(res);
          }
        }, (err) => {
          // 在整个过程中一旦出现异常，直接reject返回Promise状态
          reject(err);
        });
      });
    });
  }

  // 实现allSettled静态调用， 传入一个可迭代的参数
  static allSettled(iterable) {
    // 与all思路一致，但是在创建时无reject状态
    return new _Promise((resolve) => {
      if (!iterable.length) resolve([]);
      const res = [];
      let count = 0;

      iterable.forEach((item, index) => {
        _Promise.resolve(item).then((data) => {
          count += 1;
          // 按类型在返回结果中填入值
          res[index] = {
            status: 'fulfilled',
            value: data,
          };
          if (count === iterable.length) {
            resolve(res);
          }
        }, (err) => {
          count += 1;
          // 按类型在返回结果中填入值
          res[index] = {
            status: 'rejected',
            value: err,
          };
          if (count === iterable.length) {
            resolve(res);
          }
        });
      });
    });
  }

  // 实现race的静态调用， 传入一个可迭代的参数
  static race(iterable) {
    // 合并传入的Promise为单个
    return new _Promise((resolve, reject) => {
      iterable.forEach((item) => {
        // 在任意优先一个执行完成的Promise直接执行比起修改当前Promise状态
        _Promise.resolve(item).then((data) => resolve(data), (error) => reject(error));
      });
    });
  }
}

function resolvePromise(promise, value, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise === value) {
    reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
    return;
  }

  // 如果value既不为对象也不为函数，直接以value为结果执行resolve
  if ((typeof value !== 'object' && typeof value !== 'function') || value === null) {
    resolve(value);
    return;
  }

  // 定义then方法
  let then;
  // 尝试将value的then方法赋值给then
  try {
    then = value.then;
  } catch (e) {
    reject(e);
  }

  // 如果赋值的then不是一个函数，就以value为参数执行resolve
  if (typeof then !== 'function') {
    resolve(value);
    return;
  }

  // 定义一个执行状态flag
  let called = false;

  // 执行then方法
  try {
    // 将this绑定到then的父级即value上，在执行resolve或reject回调时正确获取状态
    then.call(
      value,
      (nextValue) => {
        if (called) return;
        called = true;
        resolvePromise(promise, nextValue, resolve, reject);
      },
      (nextReason) => {
        if (called) return;
        called = true;
        reject(nextReason);
      },
    );
  } catch (e) {
    // 如果执行异常抛出错误
    if (called) return;
    reject(e);
  }
}
