# 对BFC的理解
## 什么是BFC
``BFC``是块级格式上下文，它是页面中的一块渲染区域，并且有一套属于自己的渲染规则；
  - 内部的盒子会在垂直方向上一个接一个放置
  - 处于同一个BFC的两个相邻的盒子的``margin``会被重叠，与方向无关
  - 每个元素的左边距与包含块的左边界相接触，浮动元素也是如此
  - ``BFC``的区域不会与浮动元素重叠
  - 计算 ``BFC``的高度时，浮动子元素也参与计算
  - ``BFC``就是一个独立的容器，里面的子元素不会影响到外面的元素

## 触发条件
- 根元素，``HTML``元素
- 浮动元素：``float``值为``left``、``right``
- ``position``值为``absolute``或``fixed``
- ``overflow``值不为``visible``
- ``display``的值为``inline-block``、``inltable-cell``、``table-caption``、``table``、``inline-table``、``flex``、``inline-flex``、``grid``、``inline-grid``
## 有什么作用
- 解决高度塌陷
- 解决``margin``重叠

## 参考
https://vue3js.cn/interview/css/BFC.html

https://juejin.cn/post/6844903855847637005?searchId=20240724102105C9F80FFDB23F71209F82