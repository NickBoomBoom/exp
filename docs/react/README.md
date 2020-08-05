---
title: React Enjoy
---

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



