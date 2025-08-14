# JavaScript 系列：深入理解 class

> 系统梳理 JavaScript 中 `class` 的使用、继承机制、进阶语法及在实际开发中的应用

## 一、class 基础语法详解

### 1.1 什么是 class？语法简介

- 在`ES6`之前我们生成`实例对象`的传统方法是通过构造函数(大写的函数名)，容易造成困惑并且实现继承的代码非常混乱和冗长
- `ES6`引入了`class`关键词来定义类，写法更清晰、更接近面向对象编程，但实际它背后使用的仍然是原型和构造函数的概念
- 我们可以将它看成一个语法糖，它的绝大部分功能，`ES5`都可以做到
- 类必须使用`new`调用，否则会报错
- 定义类的主要方式
  - 类声明：`class Person{}`
  - 类表达式：
    - `const Animal = class {}`【类表达式也可以具名，但名称只在内部可见】

```js
# 传统写法
function Point(x, y) {
 this.x = x;
 this.y = y;
}

Point.prototype.toString = function () {
 return "(" + this.x + ", " + this.y + ")";
};

var p = new Point(1, 2);

# class写法
class Point {
 constructor(x, y) {
   this.x = x;
   this.y = y;
 }

 toString() {
   return '(' + this.x + ', ' + this.y + ')';
 }
}

// 具名类表达式（name 只在类内部可见）
const Animal = class Dog {
  bark() {
    console.log("woof");
  }
};
console.log(Animal.name); // Dog
```

#### `class`没有变量提升

```js
console.log(Person); // index.html:10 Uncaught ReferenceError: Cannot access 'Person' before initialization

class Person {
  constructor(name) {
    this.name = name;
  }
}
```

- 如果存在变量提生会发生什么？

```js
{
  let Foo = class {};
  class Bar extends Foo {}
}
```

> 在 `Bar` 继承 `Foo` 时，`Foo` 已经被定义了。
> 如果存在 `class` 的提升，上面代码就会报错，因为 `class` 会被提升到代码头部，而定义 `Foo` 的那一行没有提升，导致 `Bar` 继承 `Foo` 的时候，`Foo` 还没有定义。

### 1.2 constructor 构造函数的作用

- `constructor()`是类默认的方法，通过`new`命令生成实例对象时，自动调用该方法。
- 一个类必须有`constructor()`方法，如果没有显示定义，一个空的`constructor()`会被默认添加
- 默认返回实例对象（`this`），也可以指定返回另外一个对象【constructor 中 return 非对象会被忽略；return 对象会覆盖实例】

```js
class Foo {
  constructor() {
    return Object.create(null);
  }
}

new Foo() instanceof Foo;
// false
```

### 1.3 实例属性与实例方法

- 在 `constructor()` 内给`this`添加属性相当于添加在实例对象上
- 类的属性和方法，除非显式定义在其本身（即定义在`this`对象上），否则都是定义在原型上（即定义在`class`上）。
- 与`ES5`相同，类的所有实例共享一个原型对象

```js
class Person {
  constructor(name) {
    this.name = name;
  }
  getName() {
    console.log(`my name is： ${this.name}`);
  }
}

const p1 = new Person("Tom");
console.log(p1.name); // Tom
p1.getName(); // my name is： Tom
Person.prototype.name = "Jerry";
Person.prototype.getName(); // my name is： Jerry
```

### 1.4 静态属性与静态方法（static）

- `static`用于生成类的属性和方法，不会被实例继承，而是直接通过类来调用并且`this`指向的是类
- 静态方法中无法访问实例属性
- 类的静态属性和方法本质是挂在构造函数对象本身

```js
class Person {
  constructor(name) {
    this.name = name;
  }
  static name = "classPerson";
  static sayHello() {
    console.log("hello", this.name);
  }
  getName() {
    console.log(`my name is： ${this.name}`);
  }
}

const p1 = new Person("Tom");
Person.sayHello(); // hello classPerson
```

```js
class A {
  static x = 1;
  static print() {
    console.log(this.x); // 输出 1
  }
}
A.print();
```

## 二、继承机制与原型链解读

### 2.1 使用 extends 实现类继承

- 继承语法结构
- 父类构造函数的执行逻辑

```js
class Point {
  #color = "green";
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  sayColor() {
    console.log(this.#color);
  }
}
class ColorPoint extends Point {}
// 等同于
class ColorPoint extends Point {
  constructor(x, y) {
    super(x, y); // 调用父类的constructor(x, y)
  }
}
```

- 使用`extends`继承`Point`父类
- 子类需要调用`super`函数，如果不写`constructor`的话，默认会填充

### 2.2 super 的两种使用场景（构造器 / 方法中）

- `super()` 调用父类构造器
- `super.method()` 调用父类方法

```js
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + " " + super.toString(); // 调用父类的toString()
  }
}
```

### 2.3 子类构造函数中的注意事项

- `super()` 必须先调用
  - 因为子类有属于自己的`this`对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其加工,添加子类自己的实例属性和方法。如果不调用 `super()`方法，子类就得不到自己的 `this` 对象
- 使用箭头函数绑定子类方法中的 this
  - 类的方法中如果包含了`this`默认指向类的实例，如果将这个方法提取出来单独使用，`this`会指向该方法运行时所在的环境（由于 `class` 内部是严格模式，所以 `this` 实际指向的是`undefined`）

```js
class Point {
  #color = "green";
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  sayColor() {
    console.log(this.#color);
  }
}
class ColorPoint extends Point {
  constructor(x, y) {
    super(x, y);
    this.point = `x:${x}; y:${y}`;
  }
  sayPoint() {
    console.log(`坐标位置：${this.point}`);
  }
  // 箭头函数
  // sayPoint = () => {
  //     console.log(`坐标位置：${this.point}`);
  // }
}
const cp = new ColorPoint(10, -10);
cp.sayPoint();
const fn = cp.sayPoint;
fn();
```

### 2.4 方法重写与多态初探

- 覆盖父类方法

```js
class Animal {
  speak() {
    console.log("Animal speaks");
  }
}

class Dog extends Animal {
  speak() {
    console.log("Dog barks");
  }
}

const d = new Dog();
d.speak(); // Dog barks
```

- 多态的实现（同名方法不同表现）
  - 同一方法名根据参数数量/类型不同执行不同逻辑

```js
class Animal {
  speak() {
    console.log("Animal speaks");
  }
}

class Dog extends Animal {
  speak() {
    console.log("Dog barks");
  }
}

class Cat extends Animal {
  speak() {
    console.log("Cat meows");
  }
}

function makeItSpeak(animal) {
  animal.speak(); // 多态调用
}

makeItSpeak(new Dog()); // Dog barks
makeItSpeak(new Cat()); // Cat meows
```

### 2.5 class 与原型链的关系解析（附图）

#### `__proto__` vs `prototype` 的区别

##### `__proto__`

> 对象的内部属性，指向创建该对象的构造函数的`prototype`

- 只有对象才有（函数也是对象，所以函数也有`__proto__`
- 用于实例与原型之间的链接
- ES6 推荐使用`Object.getPrototypeOf(obj)`来代替直接访问`__proto__`

```js
function Foo() {}
const obj = new Foo();

console.log(obj.__proto__ === Foo.prototype); // true
console.log(Object.getPrototypeOf(obj) === Foo.prototype); // true
```

##### `prototype`

> 函数（特别是构造函数）特有的属性，指向一个对象，这个对象就是由该函数创建的实例的原型。

- 只有函数对象才有
- 用于定义实例共享的属性和方法
- 所有通过该构造函数创建的实例，其 `__proto__` 都会指向这个 `prototype` 对象。

```js
function Foo() {}
Foo.prototype.sayHello = function () {
  console.log("Hello");
};

const obj = new Foo();
obj.sayHello(); // Hello
console.log(obj.__proto__ === Foo.prototype); // true
```

#### 二者的关系

```js
obj.__proto__ === Foo.prototype;
Foo.__proto__ === Function.prototype;
Function.prototype.__proto__ === Object.prototype;
Object.prototype.__proto__ === null;
```

### class 的本质是函数

```js
class Animal {
  speak() {
    console.log("Animal speaks");
  }
}

class Dog extends Animal {
  speak() {
    console.log("Dog barks");
  }
}

const d = new Dog();
console.log(Dog.__proto__ === Animal); // 构造函数继承关系
console.log(Dog.prototype.__proto__ === Animal.prototype); // 方法继承关系
console.log(d.__proto__ === Dog.prototype);
console.log(d.__proto__.__proto__ === Animal.prototype);
console.log(Animal.__proto__ === Function.prototype);
console.log(Function.prototype.__proto__ === Object.prototype);
```

- 子类的原型（`__proto__`）表示构造函数的继承，总是指向父类
- 子类 `prototype` 属性的**proto**属性，表示方法的继承，总是指向父类的 `prototype` 属性。

#### 总结

- **proto** 是对象的隐藏属性，指向创建它的构造函数的 prototype
- prototype 是构造函数才有的属性，用来定义实例共享的属性和方法
- class 本质是构造函数的语法糖
- 继承分为两条链：
  1. 构造函数的 **proto** 链（构造函数继承）
  2. prototype 的 **proto** 链（方法继承）
- 原型链终点：Object.prototype.**proto** === null
