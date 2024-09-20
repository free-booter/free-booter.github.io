# ref

## 是什么？

- `ref()`可以用来返回一个响应式的值。
- `ref()`接受一个参数，并将其包裹在一个带有`.value`熟悉的`ref`对象中返回。
- 接受任意类型的参数，`Ref`的值具有深层响应性，即使改变嵌套对象或数组时，都会被检测到。
- 需要通过`ref.value`来访问或者修改值。

## 使用场景

```js
import { ref } from "vue";
const counts = ref(0);
const changeCounts = () => {
  counts.value++;
};
console.log(counts.value);
```

- `counts`现在是一个响应式的值，我们通过`counts.value`来访问或者修改它。

## 源码分析

### 包裹成响应式？

```js
export function ref(value?: unknown) {
  return createRef(value, false);
}
```

- 可以看出当我们调用`ref()`时，其内部返回的是`createRef`的返回值

#### createRef

```js
export enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw',
  IS_REF = '__v_isRef',
}
export function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
export function isRef(r: any): r is Ref {
  return r ? r[ReactiveFlags.IS_REF] === true : false
}
function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}
```

- 参数：
  - `rawValue`：原始值
  - `shallow`：是否是浅层响应式
- 返回值

  - `RefImpl`的实例对象

- 会先判断`rawValue`是否是`Ref`对象，如果是直接返回，否则返回一个`RefImpl`的实例对象

#### RefImpl

```js
export const toReactive = <T extends unknown>(value: T): T =>
  isObject(value) ? reactive(value) : value

export function toRaw<T>(observed: T): T {
  const raw = observed && (observed as Target)[ReactiveFlags.RAW]
  return raw ? toRaw(raw) : observed
}
class RefImpl<T = any> {
  _value: T
  private _rawValue: T

  dep: Dep = new Dep()

  public readonly [ReactiveFlags.IS_REF] = true
  public readonly [ReactiveFlags.IS_SHALLOW]: boolean = false

  constructor(value: T, isShallow: boolean) {
    this._rawValue = isShallow ? value : toRaw(value)
    this._value = isShallow ? value : toReactive(value)
    this[ReactiveFlags.IS_SHALLOW] = isShallow
  }

  get value() {
    if (__DEV__) {
      this.dep.track({
        target: this,
        type: TrackOpTypes.GET,
        key: 'value',
      })
    } else {
      this.dep.track()
    }
    return this._value
  }

  set value(newValue) {
    const oldValue = this._rawValue
    const useDirectValue =
      this[ReactiveFlags.IS_SHALLOW] ||
      isShallow(newValue) ||
      isReadonly(newValue)
    newValue = useDirectValue ? newValue : toRaw(newValue)
    if (hasChanged(newValue, oldValue)) {
      this._rawValue = newValue
      this._value = useDirectValue ? newValue : toReactive(newValue)
      if (__DEV__) {
        this.dep.trigger({
          target: this,
          type: TriggerOpTypes.SET,
          key: 'value',
          newValue,
          oldValue,
        })
      } else {
        this.dep.trigger()
      }
    }
  }
}
```
- `_rawValue`：原始值(非包装后的值)
- `_value`：包装后的值(如果是浅层响应式对象，则返回原始值，否则返回包装后的值)，如果是对象会包装成`reactive`
- `get`和`set`方法，用于访问和设置值
  - `get`：收集依赖并返回值
  - `set`：判断值是否发生改变，改变了就触发依赖