// test.js

import _Promise from './index.js';

// const _Promise = Promise;

_Promise.resolve().then(() => {
  console.log(0);
  return _Promise.resolve(4);
}).then((res) => {
  console.log(res);
});

_Promise.resolve().then(() => {
  console.log(1);
}).then(() => {
  console.log(2);
}).then(() => {
  console.log(3);
})
  .then(() => {
    console.log(5);
  })
  .then(() => {
    console.log(6);
  });
