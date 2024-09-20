# this 的绑定

- 函数在调用时，`js`会默认给`this`绑定一个值
- `this`的绑定和定义的位置(编写的位置)没有关系
- `this`的绑定和调用方式以及调用的位置有关系
- `this`是在运行时绑定的

## 默认绑定

- 函数独立调用（在严格模式下，独立函数调用中的`this`为`undefined`）

```js
function foo(fn) {
  console.log(this); // window
  fn();
}
let obj = {
  name: "why",
  bar: function () {
    console.log(this); // window
  },
};

foo(obj.bar);
```

## 隐式绑定

- 调用的位置中，是通过某个对象发起的函数回调

```js
function foo() {
  console.log(this.a); //1
}
var obj = { a: 1, foo };
var a = 2;
obj.foo();
```

## 显示绑定

### call、apply、bind

```js
function foo() {
  console.log(this.a, this);
}
var obj = { a: 1 };
var a = 2;

foo(); //2
foo.call(obj); //1
foo.apply(obj); //1
foo.bind(obj)(); // 1
```

#### call

- 第一个参数：绑定`this`
- 后续参数：传入额外的实参
  - ` fn.call(user, 'Tom',18,red)`

#### apply

- 第一个参数：绑定`this`
- 第二个参数：传入额外的实参，以数组的形式
- `fn.call(user, ['Tom',18,red])`

#### bind

- 第一个参数：绑定`this`
- 第二个参数：传入额外的实参
- `fn.bind(user, 'Tom',18,red)()`
- 返回值：返回一个新的绑定对象函数

## new 绑定

- 通过`new`关键词创建出来的实例对象时，在构造函数内部的`this`指向的是实例对象

```js
var name = "window";
function Person(name) {
  this.name = name;
  this.foo = function () {
    console.log(this.name, this); // Tom
    return function () {
      console.log(this.name, this); // window
    };
  };
}

const p1 = new Person("Tom");
p1.foo()()``;
```
