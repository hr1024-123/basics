import debounce from './index.js';

function test(num) {
  console.log(num);
}

const debounceTest = debounce(test);

debounceTest(1);
debounceTest(2);
debounceTest(3);

setTimeout(() => {
  debounceTest(4);
}, 100);
