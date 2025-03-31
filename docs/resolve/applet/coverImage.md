# 真机测试中在canvas上叠加的图片以及文案无法展示
## 需求
- 在``uniapp``中，使用``canvas``绘制二维码，需要给二维码设置一些状态，例如：二维码不可用需要进行遮挡
- 使用``微信开发者工具``查看时，是可以看到二维码被遮挡了，但是在真机预览时，发现无法展示遮挡层？
## 解决方案
- 利用``cover-view``以及``cover-image``标签可以覆盖在原生组件上
### 代码案例
```js
<view class="code_box_code">
    <canvas canvas-id="qrcode" style="width: 200px; height: 200px; margin: 0 auto; z-index: 1;" />
    <cover-view class="mask">
        <cover-image class="mask-img" :src="`${imgHost}/orderqrcode/nousetime.png`" alt="" />
    </cover-view>
</view>
```
## 为什么会发生这个？
- ``canvas``本身只负责图形渲染，不能直接渲染`DOM`元素(如图片和文本)