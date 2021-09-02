export default function debounce(executor, time = 300) {
  if (typeof executor !== 'function') {
    throw new Error('executor must be a function');
  }
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      executor(...args);
      clearTimeout(timer);
      timer = null;
    }, time);
  };
}
