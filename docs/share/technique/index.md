# 怎么将一个网页生成为一张图片？

> 使用的框架：html2canvas

### 安装插件

使用 pnpm

```js
pnpm add html2canvas
```

使用 npm

```js
npm install html2canvas
```

### html2canvas 使用介绍

```js
html2canvas(element,options) 异步操作
```

#### 参数介绍

- element：需要生成图片的 DOM 节点
- options：配置信息
  - scale：缩放比例,默认为 1
  - allowTaint：是否允许跨域图像污染画布，默认为 false
  - useCORS：是否尝试使用 CORS 从服务器加载图像，默认为 false
  - width：canvas 画布的宽度,默认为 jQuery 对象的宽度
  - height：canvas 画布的高度,默认为 jQuery 对象的高度
  - backgroundColor：画布的背景色，默认为透明(#fff),参数可以为#表示的颜色，也可以使用 rgba


#### 将canvas画图转化为base64格式图片
```js
const canvas = await html2canvas(chatListRef.value!, {
  useCORS: true, // 处理：图片可能会出现跨域的问题，导致截图后，DOM中的图片没有出现在截图中
})
const url = canvas.toDataURL('image/png')
```
#### 指定内容不写入canvas中
```js
data-html2canvas-ignore="true"
```
