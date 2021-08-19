// test.js

import _Promise from './index.js';

const promise1 = () => new _Promise((res) => res(1));

const promise2 = () => new _Promise((res) => res(2));

const promise3 = () => new _Promise((res) => res(3));

_Promise.all([promise1, promise2, promise3]).then((value) => {
  console.log(value);
});
