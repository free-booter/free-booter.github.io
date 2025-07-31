# Web Worker

## 是什么？

因为 `js` 是单线程的，`Web Worker`就是为`js`创造多线程环境，允许主线程创建`Worker`线程，将一些任务分配给后者运行，两者互不干扰。
将一些计算复杂或高延迟的任务分配给`Worker`线程负担，主线程就会很流畅不会阻塞或拖慢。

## 有什么限制？

- 同源限制

  - 分配给`Worker`线程运行的脚本文件，必须与主线程的脚本文件同源

- DOM 限制

  - `Worker` 线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的 `DOM` 对象，也无法使用`document、window、parent`这些对象。

- 通信联系

  - `Worker`线程和主线程不在同一个上下环境，它们不能直接通信，必须通过消息完成

- 脚本限制

  - `Worker` 线程不能执行`alert()`方法和`confirm()`方法，但可以使用 `XMLHttpRequest` 对象发出 AJAX 请求。

- 文件限制

  - `Worker` 线程无法读取本地文件，即不能打开本机的文件系统（`file://`），它所加载的脚本，必须来自网络

## 怎么使用？

- 检测浏览器对于 web worker 的支持性

```js
if (window.Worker) {
  // …
}
```

- 通过调用`Worker`构造器创建实例对象,并传入`web worker`文件

`const worker = new Worker("worker.js");`

- `postMessage`方法，向`Worker`发消息
- `onmessage`监听子线程发回来的消息
- `terminate`关闭子线程

```
# main.js
const worker = new Worker('./worker.js');

// 向 Worker 线程发送消息
worker.postMessage('Hello World');

// 监听 Worker 线程返回的消息
worker.onmessage = function (event) {
  console.log('Received message: ' + event.data);
};

// 关闭 Worker 线程
worker.terminate();

# Worker线程
// self 代表 Worker 线程自身
self.onmessage = (e) => {
  console.log('Message received from main thread: ' + e.data);
  self.postMessage('Response from Worker: ' + e.data);
};
```

## 补充

- Web Worker 的类型：

  - Dedicated Worker（专用线程）：只能被一个主线程使用。
  - Shared Worker（共享线程）：可以被多个主线程共享。
  - Service Worker：用于拦截网络请求、缓存资源等。

- 适用场景：

  - 复杂计算（如大数据处理、图像处理）。
  - 高延迟任务（如网络请求、文件解析）。
  - 避免主线程阻塞，提升页面流畅度。

https://www.ruanyifeng.com/blog/2018/07/web-worker.html
