import throttle from './index.js';

function test(num) {
  console.log(num);
}

const throttleTest = throttle(test);

throttleTest(1);
throttleTest(2);
throttleTest(3);

setTimeout(() => {
  throttleTest(4);
}, 1000);
