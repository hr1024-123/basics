/* eslint-disable max-classes-per-file */
import extend from './index.js';

// class Parent {
//   constructor(val) {
//     this.val = val;
//   }

//   getValue() {
//     console.log(this.val);
//   }
// }

// class Child extends Parent {
//   constructor(val) {
//     super(2);
//     this.val = val;
//   }
// }

function Parent(name, age) {
  this.name = name;
  this.age = age;
}

Parent.prototype.getValue = function getValue() {
  console.log(this.name, this.age);
};

function Child(age) {
  this.age = age;
}

const ExtendsChild = extend(Parent, Child, ['test', 18]);

console.log(ExtendsChild);

const child = new ExtendsChild(28);

child.getValue();
