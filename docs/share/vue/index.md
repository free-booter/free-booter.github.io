# Vue
## 编译时
- 编译器的作用：把`template`中的`html`编译成`render`函数，然后再利用`运行时`通过`render`挂在对应的`DOM`

## 为什么vue要设计成一个运行时+编译时
- 纯运行时：因为不存在编译器，所以我们只能够提供一个复杂的`JS`对象
- 纯编译时：因为缺少运行时，所以它只能把分析差异的操作，放在`编译时`进行，同时因为省略了运行时，所以速度可能会更快。但是这种方式将损失灵活性
- 运行时+编译时：在保持灵活性的基础上，尽量的进行性能的优化，从而达到一种平衡