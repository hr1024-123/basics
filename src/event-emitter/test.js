import EventEmitter from './index.js';

const event = new EventEmitter();

const handle = (...rest) => {
  console.log(rest);
};

event.on('click', handle);

event.emit('click', 1, 2, 3, 4);

event.off('click', handle);

event.emit('click', 1, 2);

event.once('dbClick', () => {
  console.log(123456);
});
event.emit('dbClick');
event.emit('dbClick');
