export default class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventName, handler) {
    if (this.events[eventName]) {
      this.events[eventName].push(handler);
    } else {
      this.events[eventName] = [handler];
    }
  }

  off(eventName, handler) {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter((v) => v !== handler);
  }

  once(eventName, handler) {
    function wrapper() {
      handler();
      this.off(eventName, wrapper);
    }

    this.on(eventName, wrapper);
  }

  emit(eventName, ...rest) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach((fn) => {
      fn.apply(this, rest);
    });
  }
}
