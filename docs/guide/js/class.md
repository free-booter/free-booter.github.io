# JavaScript 系列：深入理解 class

> 系统梳理 JavaScript 中 `class` 的使用、继承机制、进阶语法及在实际开发中的应用

## 一、class 基础语法详解

### 1.1 什么是 class？语法简介

- 在`ES6`之前我们生成`实例对象`的传统方法是通过构造函数(大写的函数名)，容易造成困惑并且实现继承的代码非常混乱和冗长
- `ES6`引入了`class`关键词来定义类，写法更清晰、更接近面向对象编程，但实际它背后使用的仍然是原型和构造函数的概念
- 我们可以将它看成一个语法糖，它的绝大部分功能，`ES5`都可以做到
- 类必须使用`new`调用，否则会报错
- `class`没有变量提升

```js
console.log(Person); // index.html:10 Uncaught ReferenceError: Cannot access 'Person' before initialization

class Person {
  constructor(name) {
    this.name = name;
  }
}
```

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

### 1.5 类的实例化与 this 指向

- 使用 new 创建实例
- `this` 指向当前实例
- `this` 丢失问题引入（为后面做铺垫）

---

## 二、继承机制与原型链解读

### 2.1 使用 extends 实现类继承

- 继承语法结构
- 父类构造函数的执行逻辑

### 2.2 super 的两种使用场景（构造器 / 方法中）

- `super()` 调用父类构造器
- `super.method()` 调用父类方法

### 2.3 子类构造函数中的注意事项

- `super()` 必须先调用
- 使用箭头函数绑定子类方法中的 this

### 2.4 方法重写与多态初探

- 覆盖父类方法
- 多态的实现（同名方法不同表现）

### 2.5 class 与原型链的关系解析（附图）

- `__proto__` vs `prototype` 的区别
- class 的本质是函数
- 原型链结构图解

---

## 三、进阶特性与语法拓展

### 3.1 类字段（Class Fields）语法：实例属性新写法

- ES2022 支持
- 不依赖 constructor 初始化属性

### 3.2 私有字段与访问控制（#field）

- `#` 私有属性语法
- 私有方法定义方式
- 私有字段访问规则

### 3.3 get/set 访问器属性的使用场景

- 语法结构
- 使用场景（如限制赋值、转换值）

### 3.4 this 的丢失与绑定方法

- 常见 this 丢失场景
- 解决方式：bind / 箭头函数 / class fields 方法

### 3.5 class 中的 Symbol 应用场景（可选）

- 自定义类内部方法名
- Symbol 与私有属性的异同

---

## 四、TypeScript 中的 class 扩展用法

### 4.1 readonly / public / private / protected 修饰符

- 各修饰符作用及访问权限说明

### 4.2 抽象类（abstract）与接口（implements）

- 抽象类定义
- 接口实现与多接口组合

### 4.3 泛型类的定义与使用

- 泛型类语法
- 使用泛型提升类型灵活性

### 4.4 类与类型系统的融合（构造签名、typeof）

- 使用构造函数签名约束类实例
- `typeof` 操作类本身

---

## 五、实际开发中的高级技巧

### 5.1 Mixin 混入模式实现多继承

- JS 不支持多继承的原因
- mixin 工厂函数模式

### 5.2 装饰器（Decorator）初识与应用场景

- 装饰器的定义方式（Babel / TS）
- 常见用法：权限校验、日志埋点、缓存注入

### 5.3 Proxy 与 class 配合实现响应式能力

- 使用 Proxy 包装实例
- 实现数据拦截 / 依赖追踪

### 5.4 用类封装一个业务服务模块（如：HttpService）

- class + fetch 封装请求模块
- 添加缓存、重试、取消请求等能力

---

## 六、常见面试题与易错点汇总

### 6.1 class 与普通构造函数的本质区别

- class 是语法糖
- constructor 与原型的本质差异

### 6.2 super 的作用与执行顺序问题

- 使用不当导致错误
- super 与 this 的调用顺序说明

### 6.3 为什么 class 中的 this 会丢失？

- 原因解析
- 修复方法小结

### 6.4 class 的原型链长什么样？

- 可视化 class 的原型结构（建议配图）

### 6.5 class 是否支持多继承？为什么？

- 不支持多继承
- 采用 mixin 或组合代替

---

## 七、总结与学习建议

### 7.1 class 学习路线推荐

- 从基础到高级的学习路径建议

### 7.2 小项目实战建议：用类封装一个任务调度器

- 任务调度器：添加、延迟执行、优先级队列
- 项目建议与代码框架

### 7.3 推荐阅读与资料链接

- [MDN class 教程](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ECMAScript Proposal - Class Fields](https://github.com/tc39/proposal-class-fields)
