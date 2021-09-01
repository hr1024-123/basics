import _new from './index.js';

function newTest(name) {
  this.name = name;
}

console.log(_new(newTest, 'test'));
