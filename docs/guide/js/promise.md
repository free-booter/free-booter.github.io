# Promise

- 是一个异步编程解决方案，可以解决回调地狱。
- 是一个构造函数，接受一个函数，这个函数是同步的回调函数，可以接受两个异步的回调函数，分别是 resolve 和 reject。
- 可以通过`resolve`或`reject`更改 Promise 实例的状态为`fulfilled`或`rejected`。

## 状态

- pending: 未完成
- fulfilled: 完成
- rejected: 失败
  **状态一旦改变，将无法更改**，从`pending`转化为`fulfilled`或者`rejected`。

## then、catch、finally

- then: 指定成功的回调函数
- catch: 指定失败的回调函数
- finally: 指定无论成功还是失败都会执行的回调函数

### then

#### 参数

- 两个参数，第一个是成功的回调函数，第二个是失败的回调函数

```js
const p1 = new Promise((resolve, reject) => {
  resolve("ok");
});
p1.then((res) => {
  console.log(res);
  return Promise.reject("error");
}).then(
  (res) => {
    console.log(res, error);
  },
  (err) => {
    console.log(err);
  }
);
```

#### 返回值

- 返回的是一个<span style="color:red">新的`Promise`实例</span>，它的值和状态由`return`决定。
- 如果`return`的值是一个`Promise`，那么这个`Promise`的状态就会被`return`的`Promise`的状态继承。
- 如果是一个非`Promise`值，那么这个<span style="color:red">新的`Promise`实例</span>的状态为：成功(fulfilled)，成功的 value 值为 return 出去的值
- 如果抛出异常(throw)，那么这个<span style="color:red">新的`Promise`实例</span>的状态为：失败(rejected)，reason 为抛出的那个异常

### catch

- 用来捕获`Promise`的错误

#### 返回值

跟`then`一样，返回一个新的`Promise`，它的值和状态由`return`决定，跟`then`一样

```js
const p1 = new Promise((resolve, reject) => {
  resolve("ok");
});
p1.then((res) => {
  console.log(res);
  return Promise.reject("error");
})
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err, "1");
    return Promise.reject("error2");
  })
  .catch((err) => {
    console.log(err, "2");
  });
```

## 链式调用

- `then`和`catch`都是返回一个新的`Promise`，它的值和状态由`return`决定。所以可以有多个`then`和`catch`

### 如何中断链式调用

- 将状态设置为`pending`

```js
let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("ok");
  }, 1000);
});

p.then((value) => {
  console.log(1111);
  return new Promise(() => {}); //将状态设置为pending
})
  .then((value) => {
    console.log(2222);
  })
  .then((value) => {
    console.log(3333);
  })
  .catch((reason) => {
    console.warn(reason);
  });
```

## 案例 🌰

```js
async function async1() {
  console.log("1");
  await async2();
  console.log("AAA");
}

async function async2() {
  console.log("3");
  return new Promise((resolve, reject) => {
    resolve();
    console.log("4");
  });
}

console.log("5");

setTimeout(() => {
  console.log("6");
}, 0);

async1();

new Promise((resolve) => {
  console.log("7");
  resolve();
})
  .then(() => {
    console.log("8");
  })
  .then(() => {
    console.log("9");
  })
  .then(() => {
    console.log("10");
  });
console.log("11");

// 最终结果👉: 5 1 3 4 7 11 8 9 AAA 10 6
```

```js
async function test() {
  console.log(1);
  await Promise.resolve()
    .then(() => console.log(5))
    .then(() => console.log(6))
    .then(() => console.log(7));
  console.log(3);
}

test();
console.log(4);

new Promise((resolve) => {
  console.log("B");
  resolve();
})
  .then(() => {
    console.log("C");
  })
  .then(() => {
    console.log("D");
  });

// 最终结果👉: 1 4    B 5 C 6 D 7 3
```

### 总结

- `async`函数返回值

  - 非`thenable`、非`promise`不等待
  - `thenable` 等待一个`then`的时间
  - `promise` 等待 2 个`then`的时间

- `await`右值类型区别
  - 非`thenable`会立即向微任务队列添加一个微任务 then，但不需等待
  - `thenable` 等待一个`then`的时间
  - `promise` 会立即向微任务队列添加一个微任务 then，但不需等待

### 链接
https://juejin.cn/post/7194744938276323384
