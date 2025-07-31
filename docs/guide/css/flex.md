# flex 布局

## flex 布局的三个核心属性：flex-grow、flex-shrink 和 flex-basis。它们分别控制什么？如何协同工作？

> flex: flex-grow flex-shrink flex-basis;

### flex-grow

- 定义元素如何分配容器中剩余的可用空间
- 默认为 0，表示不放大
- 数值越大，元素增长越多
- <span style="color:red">分配空间 = 剩余空间 × (元素的 flex-grow / 所有元素的 flex-grow 总和)</span>

### flex-shrink

- 定义元素在空间不足时如何缩小
- 默认为 1，表示会缩小
- 数值越大，元素缩小越多
- 设置为 0，表示不缩小
- <span style="color:red">缩小空间 = 超出空间 × (元素的 flex-shrink / 所有元素的 flex-shrink 总和)</span>

### flex-basis

- 定义元素在初始主轴大小，优先于`width`/`height`
- 默认为`auto`，表示根据内容大小
- 可以设置为具体长度值

### 示例

```html
<div style="display: flex; width: 500px;">
  <div style="flex: 1 1 100px; background: lightblue;">A</div>
  <div style="flex: 2 1 100px; background: lightgreen;">B</div>
</div>
```

- 容器宽度为 500px，两个子元素初始宽度为 100px。
- 剩余空间为 500 - (100 + 100) = 300px。
- A 和 B 的 flex-grow 分别为 1 和 2，因此：

  - A 分得 300 × (1 / (1 + 2)) = 100px。
  - B 分得 300 × (2 / (1 + 2)) = 200px。

- 最终宽度：
  - A：100px（初始） + 100px（分配） = 200px。
  - B：100px（初始） + 200px（分配） = 300px。
