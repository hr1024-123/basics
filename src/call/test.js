import call from './index.js';

function callTest() {
  console.log(this.name);
}

const obj = {
  name: 'test',
};

callTest.call(obj);

call(callTest, obj);
