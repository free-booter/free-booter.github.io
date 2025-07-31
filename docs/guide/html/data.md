# HTML 中的 data-\* 自定义属性

## 有什么作用？

- HTML5 定义的全局自定义属性，允许开发者在元素上存储私有的非视觉数据
- 这些数据不会影响页面表现，也不会被浏览器自动处理
- 可以通过 JS 的 `element.dataset` 方便地访问和修改

## 有什么限制？

`*`部分必须遵循`XML名称生成规则`

- 不以`xml`开头
- 不包含任何冒号字符
- 不包含任何大写字母（应使用小写和连字符）

## 在开发中你会如何使用它？

- 绑定数据到 `DOM` 元素，便于事件处理时获取上下文信息
- 方便与 CSS 或 JS 交互，实现灵活效果
- 在组件中存储状态信息或标识符，避免使用额外 JS 变量

## 访问方式

```js
const el = document.querySelector("#myElement");
console.log(el.dataset.userId); // 访问 data-user-id
el.dataset.status = "active"; // 修改 data-status
```
