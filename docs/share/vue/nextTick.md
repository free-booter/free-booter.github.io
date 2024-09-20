# nextTick源码分析
## nextTick介绍
> 当你在Vue中更改响应式状态时，最终的DOM更新并不时同步生效的，而是由Vue将他们缓存在一个队列中，直到下一个“tick”才一起执行。这样是为了确保每个组件无论发生多少状态改变，都仅执行一次更新。
>
> "下一个tick"：当前事件循环的下一个周期执行某些操作。Vue在内部使用了一个队列，用来缓存需要执行的DOM更新操作，而不是直接更新DOM
## nextTick源码
```javascript
// 预解析Promise，用于调度微任务
const resolvedPromise = /*#__PURE__*/ Promise.resolve() as Promise<any> 
 // 正在进行的调度Promise
let currentFlushPromise: Promise<void> | null = null 
export function nextTick<T = void, R = void>(
  this: T,
  fn?: (this: T) => R,
): Promise<Awaited<R>> {
  const p = currentFlushPromise || resolvedPromise
  return fn ? p.then(this ? fn.bind(this) : fn) : p
}
```
- 接受一个可选的回调参数fn，返回一个Promise对象