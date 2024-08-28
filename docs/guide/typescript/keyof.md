# keyof
## 作用
用于获取某个类型的所有键的联合类型。它可以用于创建更灵活和动态的类型
## 场景
### 基本使用
```typescript
interface User {
  id: number;
  name: string;
  age: number;
}

type UserKeys = keyof User; // "id" | "name" | "age"
```
### 与泛型结合使用
```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { id: 1, name: 'Alice', age: 30 };
const userName = getProperty(user, 'name'); // string
```
### 动态键和值
```typescript
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}

setProperty(user, 'age', 31); // user.age 现在是 31
```
### 使用``keyof``或``typeof``
```typescript
const person = {
  name: 'Bob',
  age: 25,
  location: 'New York'
};

type PersonKeys = keyof typeof person; // "name" | "age" | "location"
```