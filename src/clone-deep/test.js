import clone from './index.js';

const map = new Map();

map.set('key', 'value');

map.set('ConardLi', 'code秘密花园');

const set = new Set();

set.add('ConardLi');

set.add('code秘密花园');

const target = {
  field1: 1,
  field2: undefined,
  field3: {
    child: 'child',
  },

  field4: [
    2,
    4,
    8,
  ],

  empty: null,

  map,

  set,

  // eslint-disable-next-line no-new-wrappers
  bool: new Boolean(true),

  // eslint-disable-next-line no-new-wrappers
  num: new Number(2),

  // eslint-disable-next-line no-new-wrappers
  str: new String(2),

  symbol: Object(Symbol(1)),

  date: new Date(),

  reg: /\d+/,

  error: new Error(),

  func1: () => {
    console.log(
      'code秘密花园',
    );
  },

  func2(a, b) {
    return a + b;
  },

};

console.log(clone(target));
