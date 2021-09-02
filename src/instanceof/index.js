export default function _instanceof(left, right) {
  while (true) {
    if (left === null) {
      return false;
    }
    if (Object.getPrototypeOf(left) === right.prototype) {
      return true;
    }
    left = Object.getPrototypeOf(left);
  }
}
