export default function throttle(executor, time = 300) {
  if (typeof executor !== 'function') {
    throw new Error('executor must be a function');
  }
  let timer = null;
  return function (...args) {
    if (timer) return;
    timer = setTimeout(() => {
      executor(...args);
      clearTimeout(timer);
      timer = null;
    }, time);
  };
}
