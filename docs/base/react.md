---
title: react
---

## 为什么大厂都在走React方向？

1. 历史遗留均为react技术栈，无法切换过来新的技术栈
2. react真香？html in js 我不是觉得很香
3. react hooks 香
4. 函数式编程导致？



## 为什么需要this绑定？

**16版本之前使用bind**

**16版本之后使用箭头函数绑定**

```html
onClick是中间变量，所以处理函数中的this指向会丢失，
<button onClick={this.fn}/>
```

```js
// 示例
const a = {
  test: function () {
    console.log(this)
  }
}
a.test() // 输出 a
const t = a.test
t() // 输出 window, t 是一个中间变量
```



```js
// 绑定方式
this.fn = this.fn.bind(this)
this.fn = () => {}
<button @click={()=>this.fn()}/>

```



