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
  catch = (reason) => this.then(undefined, reason)

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
