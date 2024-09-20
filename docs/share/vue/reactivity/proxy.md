# proxy

- `Proxy`是一个构造函数，返回一个对象的代理，从而实现基本操作的拦截和自定义(如属性查找、赋值、枚举、函数调用等)
- 之后对该对象的所有操作，都通过<span style="color:red">代理对象来完成</span>，代理对象可以监听我们想要对原对象进行哪些操作

## 使用：

```js
let person = {
  name: "张三",
  age: 18,
  friends: [
    { name: "李四", age: 19 },
    { name: "王五", age: 20 },
  ],
};

const proxy = new Proxy(person, {
  get(target, key) {
    console.log("get", key);
    return Reflect.get(target, key);
  },
  set(target, key, value) {
    console.log("set", key, value);
    Reflect.set(target, key, value);
  },
});

console.log(proxy.age); // 18
console.log(proxy.name); // 张三
proxy.name = "Jerry";
console.log(proxy.name); // Jerry
console.log(proxy.name === person.name); // true
```

- `proxy`的第一个参数是目标对象，第二个参数是拦截器
- 我们通过操作代理对象`proxy`对原对象进行操作

```js
let person = {
  name: "张三",
  age: 18,
  friends: [
    { name: "李四", age: 19 },
    { name: "王五", age: 20 },
  ],
};

const proxy = new Proxy(person, {
  get(target, key) {
    console.log("get", key);
    return Reflect.get(target, key);
  },
  set(target, key, value) {
    console.log("set", key, value);
    Reflect.set(target, key, value);
  },
});
proxy.name = "Tom";
proxy.friends[0].name = "Jerry"; // 拦截不到它的改变
```

- `proxy`拦截不到深层的变化，例如`proxy.friends`中的属性值变化

## 实现拦截深层的变化

```js
let person = {
  name: "张三",
  age: 18,
  friends: [
    { name: "李四", age: 19 },
    { name: "王五", age: 20 },
  ],
  address: "北京",
};

const isObject = (val) => typeof val === "object" && val !== null;

const baseHandler = {
  get(target, key) {
    const res = Reflect.get(target, key);
    if (isObject(res)) {
      return deepProxy(res, baseHandler);
    }
    console.log("get", key);
    return res;
  },
  set(target, key, value) {
    console.log("set", key, value);
    return Reflect.set(target, key, value);
  },
};

const deepProxy = (target, handler) => {
  const proxy = new Proxy(target, handler);
  return proxy;
};
const personProxy = deepProxy(person, baseHandler);
console.log(personProxy.friends[0].name);

personProxy.friends[0].name = "赵六";
console.log(personProxy.friends[0].name);

personProxy.address = "上海";
console.log(personProxy.address);
```

- 使用递归实现深层拦截

## Reflect

### get

```js
const obj = {
  firstName: "张",
  lastName: "三",
  get fullName() {
    return this.firstName + this.lastName;
  },
};

const obj2 = {
  firstName: "李",
  lastName: "四",
};

console.log(obj.fullName); //张三
console.log(Reflect.get(obj, "fullName")); // 张三
console.log(Reflect.get(obj, "fullName", obj2)); // 李四
```

- 参数
  - `target`：需要取值的目标对象
  - `propertyKey`：需要获取的值的键值
  - `receiver`：如果`target`对象中指定了`getter`，`receiver`则为`getter`调用时的`this`值

## 为什么 proxy 需要和 reflect 配合使用？

```js
const obj = {
  firstName: "张",
  lastName: "三",
  get fullName() {
    console.log(this);

    return this.firstName + this.lastName;
  },
};

const proxy = new Proxy(obj, {
  get(target, prop, receiver) {
    console.log("get", prop);
    return target[prop];
    // return Reflect.get(target, prop, receiver)
  },
});
console.log(proxy.fullName);
```
- 当不借助`Reflect`时，只会捕获一次`get`的调用,此时`fullName`中的`this`指向的`obj`
- 当借助`Reflect`时，会捕获到三次`get`的调用(`fullName`、`firstName`、`lastName`),此时`fullName`中的`this`指向的`proxy`

- 当我们期望监听代理对象的`getter`和`setter`时，不应该使用`target[key]`，因为它在某些情况下是不可靠的。一旦我们在`被代理对象`的内部，通过`this`触发`getter`和`setter`时，也需要被监听到。

## 链接

https://vue3js.cn/interview/es6/proxy.html#%E4%B8%80%E3%80%81%E4%BB%8B%E7%BB%8D
