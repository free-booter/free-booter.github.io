# 基础知识

## 块级元素

- 独占一行
- 高度、行高、外边距和内边距可以控制
- 元素的宽度如果不设置，默认为父元素的宽度
- 多个块级元素，默认排列方式从上至下
- `div p section h1~h6 ul`

## 行内元素

- 宽度由内容控制
- 设置行高有效，等同于给父级元素设置行高
- 外边距和内边距均可设置，只不过垂直方向（上下）的没有效果
- 多个行内元素，默认排列方式从左至右
- 行内元素不可以放块级元素
- `span a strong i em b`

## 行内块元素

- 宽度、行高、内外边距都可以控制
- 默认宽度为自身内容宽度，不独占一行，但是之间会有空白缝隙，设置它上一级的`font-size:0`可以消除间隙
- `img input`
