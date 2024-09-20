# reactive

- `reactive()`返回一个对象**响应式代理**

## 例子 🌰

### ref 解包

```js
const counts = ref(0);
const obj = reactive({ counts });
console.log(obj.counts === counts.value); //true
counts.value += 1;
console.log(obj.counts); // 1

// 将ref的值复制给reactive对象
const counts = ref(1);
const obj = reactive({ counts: 6 });
obj.counts = counts;
console.log(obj.counts); // 1
```

### ref 不执行解包

```js
const title = ref("Vue 3 Guide");
const books = reactive([title]);
// 这里需要 .value
console.log(books[0].value);

const map = reactive(new Map([["count", ref(0)]]));
// 这里需要 .value
console.log(map.get("count").value);

const person = ref({ name: "Tome" });
const people = reactive([person]);
console.log(people[0].value);
```

- 当访问到某个响应式数组或 `Map` 这样的原生集合类型中的 `ref` 元素时，不会执行解包

**官网：** https://cn.vuejs.org/api/reactivity-core.html#reactive

## 源码

### reactive

```js
export function reactive<T extends object>(target: T): Reactive<T>
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  if (isReadonly(target)) {
    return target
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap,
  )
}
```

- 当我们执行`reactive();`时，其返回值就是`createReactiveObject`的返回值
- 其内部最主要的就是`createReactiveObject`函数

### createReactiveObject

```js
export enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw',
  IS_REF = '__v_isRef',
}

enum TargetType {
  INVALID = 0,
  COMMON = 1,
  COLLECTION = 2,
}

function targetTypeMap(rawType: string) {
  switch (rawType) {
    case 'Object':
    case 'Array':
      return TargetType.COMMON
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return TargetType.COLLECTION
    default:
      return TargetType.INVALID
  }
}

// isExtensible判断一个对象是否可以在它上面添加新的属性
function getTargetType(value: Target) {
  return value[ReactiveFlags.SKIP] || !Object.isExtensible(value)
    ? TargetType.INVALID
    : targetTypeMap(toRawType(value))
}

/**
 * 创建reactive对象
 * @param target 需要代理的对象
 * @param isReadonly 这个对象是否为只读，默认为false
 * @param baseHandlers 常用的处理器
 * @param collectionHandlers 集合处理器(Set、Map、WeakMap、WeakSet)
 * @param proxyMap 存储代理对象的map
 * @returns
 */
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
) {
  // 判断是否为一个对象，因为reactive返回的是一个对象的响应式代理
  if (!isObject(target)) {
    if (__DEV__) {
      warn(`value cannot be made ${isReadonly ? "readonly" : "reactive"}: ${String(target)}`);
    }
    return target;
  }
  // 对象是否已经被代理
  // 是否为只读，是否为响应式对象
  if (target[ReactiveFlags.RAW] && !(isReadonly && target[ReactiveFlags.IS_REACTIVE])) {
    return target;
  }
  // target是否存在于proxyMap
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  // 判断target是否可以被代理
  const targetType = getTargetType(target);
  if (targetType === TargetType.INVALID) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  );
  // 存储代理对象
  proxyMap.set(target, proxy);
  return proxy;
}
```

- 形参：

  - `target` 需要代理的对象
  - `isReadonly` 这个对象是否为只读，默认为 false
  - `baseHandlers` 常用的处理器
  - `collectionHandlers` 集合处理器(Set、Map、WeakMap、WeakSet)
  - `proxyMap` 存储代理对象的 map

- 返回值：
  - 判断是否为一个对象，如果不是将他返回，在开发环境下会警告
  - 判断对象是否已经被代理
  - 是否已经存在了`proxyMap`
  - 判断 target 是否可以被代理
  - `proxy`代理对象，并将这个代理对象存储在了他的`map`中

### mutableHandlers

```js
// packages/reactivity/src/baseHandlers.ts
class BaseReactiveHandler implements ProxyHandler<Target> {
  constructor(
    protected readonly _isReadonly = false,
    protected readonly _isShallow = false,
  ) {}

  get(target: Target, key: string | symbol, receiver: object): any {
    const isReadonly = this._isReadonly,
      isShallow = this._isShallow
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (key === ReactiveFlags.IS_SHALLOW) {
      return isShallow
    } else if (key === ReactiveFlags.RAW) {
      if (
        receiver ===
          (isReadonly
            ? isShallow
              ? shallowReadonlyMap
              : readonlyMap
            : isShallow
              ? shallowReactiveMap
              : reactiveMap
          ).get(target) ||
        // receiver is not the reactive proxy, but has the same prototype
        // this means the receiver is a user proxy of the reactive proxy
        Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)
      ) {
        return target
      }
      // early return undefined
      return
    }

    const targetIsArray = isArray(target)

    if (!isReadonly) {
      let fn: Function | undefined
      // 判断是否为数组并且存在对应的方法
      if (targetIsArray && (fn = arrayInstrumentations[key])) {
        return fn
      }
      if (key === 'hasOwnProperty') {
        return hasOwnProperty
      }
    }

    const res = Reflect.get(
      target,
      key,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      isRef(target) ? target : receiver,
    )

    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res
    }

    if (!isReadonly) {
      // 依赖收集
      track(target, TrackOpTypes.GET, key)
    }

    if (isShallow) {
      return res
    }

    if (isRef(res)) {
      // ref unwrapping - skip unwrap for Array + integer key.
      return targetIsArray && isIntegerKey(key) ? res : res.value
    }

    // 如果是target[key]为对象，那么需要递归处理
    if (isObject(res)) {
      // Convert returned value into a proxy as well. we do the isObject check
      // here to avoid invalid value warning. Also need to lazy access readonly
      // and reactive here to avoid circular dependency.
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}

class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow = false) {
    super(false, isShallow)
  }

  set(
    target: Record<string | symbol, unknown>,
    key: string | symbol,
    value: unknown,
    receiver: object,
  ): boolean {
    // 获取旧值
    let oldValue = target[key]
    // 如果是深层
    if (!this._isShallow) {
      // 旧值是否为只读
      const isOldValueReadonly = isReadonly(oldValue)
      // 获取原始值(无响应式的)
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue)
        value = toRaw(value)
      }
      // 非数组&&旧值为ref类型&&新值非ref
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        // 如果旧值是只读，修改失败
        if (isOldValueReadonly) {
          return false
        } else {
          // 修改
          oldValue.value = value
          return true
        }
      }
    } else {
      // in shallow mode, objects are set as-is regardless of reactive or not
    }
    const hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key)
    const result = Reflect.set(target, key, value, receiver)
    // 判断target是否为原始对象
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, TriggerOpTypes.ADD, key, value)
      } else if (hasChanged(value, oldValue)) {
        // 如果key存在，并且值变化了，那么触发更新
        trigger(target, TriggerOpTypes.SET, key, value, oldValue)
      }
    }
    return result
  }

  deleteProperty(
    target: Record<string | symbol, unknown>,
    key: string | symbol,
  ): boolean {
    const hadKey = hasOwn(target, key)
    const oldValue = target[key]
    const result = Reflect.deleteProperty(target, key)
    if (result && hadKey) {
      trigger(target, TriggerOpTypes.DELETE, key, undefined, oldValue)
    }
    return result
  }

  has(target: Record<string | symbol, unknown>, key: string | symbol): boolean {
    const result = Reflect.has(target, key)
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, TrackOpTypes.HAS, key)
    }
    return result
  }

  ownKeys(target: Record<string | symbol, unknown>): (string | symbol)[] {
    track(
      target,
      TrackOpTypes.ITERATE,
      isArray(target) ? 'length' : ITERATE_KEY,
    )
    return Reflect.ownKeys(target)
  }
}

export const mutableHandlers: ProxyHandler<object> = /*#__PURE__*/ new MutableReactiveHandler();
```

- `mutableHandlers`就是`MutableReactiveHandler`的实例对象
- `MutableReactiveHandler`继承了`BaseReactiveHandler`

#### BaseReactiveHandler

> 这个类主要是用来处理对象的依赖收集，处理读取的操作

```js
export enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw',
  IS_REF = '__v_isRef',
}

if (key === ReactiveFlags.IS_REACTIVE) {
  return !isReadonly;
} else if (key === ReactiveFlags.IS_READONLY) {
  return isReadonly;
} else if (key === ReactiveFlags.IS_SHALLOW) {
  return isShallow;
} else if (key === ReactiveFlags.RAW) {
  if (
    receiver ===
      (isReadonly
        ? isShallow
          ? shallowReadonlyMap
          : readonlyMap
        : isShallow
        ? shallowReactiveMap
        : reactiveMap
      ).get(target) ||
    // receiver is not the reactive proxy, but has the same prototype
    // this means the receiver is a user proxy of the reactive proxy
    Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)
  ) {
    return target;
  }
  // early return undefined
  return;
}
```

- 根据我们读取的`key`值，来判断是不是读取`reactive`中添加的标识

```js
const targetIsArray = isArray(target);

if (!isReadonly) {
  let fn: Function | undefined;
  // 判断是否为数组并且存在对应的方法
  if (targetIsArray && (fn = arrayInstrumentations[key])) {
    return fn;
  }
  if (key === "hasOwnProperty") {
    return hasOwnProperty;
  }
}

const res = Reflect.get(
  target,
  key,
  // if this is a proxy wrapping a ref, return methods using the raw ref
  // as receiver so that we don't have to call `toRaw` on the ref in all
  // its class methods
  isRef(target) ? target : receiver
);

if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
  return res;
}

if (!isReadonly) {
  // 依赖收集
  track(target, TrackOpTypes.GET, key);
}

if (isShallow) {
  return res;
}

if (isRef(res)) {
  // ref unwrapping - skip unwrap for Array + integer key.
  return targetIsArray && isIntegerKey(key) ? res : res.value;
}

// 如果是target[key]为对象，那么需要递归处理
if (isObject(res)) {
  // Convert returned value into a proxy as well. we do the isObject check
  // here to avoid invalid value warning. Also need to lazy access readonly
  // and reactive here to avoid circular dependency.
  return isReadonly ? readonly(res) : reactive(res);
}

return res;
```

- 收集依赖并返回值
- 获取`target`中的`key`值返回给`res`
- 判断`res`值是否为对象，如果是的话就进行递归处理
