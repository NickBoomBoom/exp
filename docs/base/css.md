---
title: CSS
---

## 可c，常用css样式表

1. 常用

```less
/* ------------- 样式重置 start ----------------- */
 * {
  padding: 0;
  margin: 0;
  /* 英文单词自动换行,而不是一行展示*/
  word-break: break-all;
  /* 优先以宽度为盒子总宽,即 border + padding + content = width */
  box-sizing: border-box;
  /* ios 上点击链接和可点击元素时,会出现一个灰色背景,重置它 */
  -webkit-tap-highlight-color: transparent;
  /* ios 开启弹性滑动 */
  -webkit-overflow-scrolling: touch;
  /* 清除滚动条 */
  /* Firefox 64 */
  scrollbar-width: none;
  /* IE 11 */
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

/* 清除滚动条 */
*::-webkit-scrollbar {
  display: none;
}

/* 按钮样式重置 */
button {
  border: none;
  outline: none;
}

/*去掉列表默认排列*/
ul,
ol,
li {
  list-style: none;
}

/* ------------- 样式重置 end ------------------- */

/* 省略号展示,可配置 line 行数 */
.ellipsis(@line: 1) {
  overflow          : hidden;
  /*文字超出用省略号*/
  text-overflow     : ellipsis;
  /*盒子模型*/
  display           : -webkit-box;
  /*子元素的垂直排列方式*/
  -webkit-box-orient: vertical;
  -webkit-line-clamp: @line;
}

/* ------------- flex 布局  start ---------------*/
.center {
  display        : flex;
  align-items    : center;
  justify-content: center;
}

.center-between {
  display        : flex;
  align-items    : center;
  justify-content: space-between;
}
/* -------------- flex 布局  end ----------------*/

/* -------------- 1px线 解决方案 start-----------------*/
.bottom-1px(@color: #edeef2) {
  position: relative;
  border  : none;

  &::before {
    content         : "";
    display         : block;
    width           : 200%;
    height          : 2px;
    position        : absolute;
    bottom          : 0;
    left            : 0;
    right           : 0;
    background-color: @color;
    transform-origin: left top;
    transform       : scale(0.5);
  }
}

.border-1px(@color: #fefefe, @radius: 0px) {
  border       : none;
  position     : relative;
  border-radius: @radius;

  &::after {
    content         : "";
    position        : absolute;
    top             : 0;
    left            : 0;
    border          : 1px solid @color;
    border-radius   : calc(@radius * 2);
    box-sizing      : border-box;
    width           : 200%;
    height          : 200%;
    transform       : scale(0.5);
    transform-origin: left top;
  }
}

.top-1px(@color: #edeef2) {
  position: relative;
  border  : none;

  &::before {
    content         : "";
    display         : block;
    width           : 200%;
    height          : 2px;
    position        : absolute;
    top             : 0;
    left            : 0;
    right           : 0;
    background-color: @color;
    transform-origin: left top;
    transform       : scale(0.5);
  }
}

/* -------------- 1px线 解决方案 end-----------------*/


/* -------------- iPhone 全面屏 底部安全距离兼容 start ------------- */
.bottom(@bottom) when (@bottom > 0) {
  bottom        : calc(@bottom);
  -webkit-bottom: calc(constant(safe-area-inset-bottom)+ @bottom);
  -webkit-bottom: calc(env(safe-area-inset-bottom)+ @bottom);
}

.bottom(@bottom) when (@bottom =0) {
  bottom        : @bottom;
  -webkit-bottom: calc(constant(safe-area-inset-bottom));
  -webkit-bottom: calc(env(safe-area-inset-bottom));
}
/* -------------- iPhone 全面屏 底部安全距离兼容 end ------------- */

/* -------------- 浮动 start ---------------- */
.fl {
  float: left;
}

.fr {
  float: right;
}

.clearfix {
  zoom: 1;

  &::after {
    content   : '';
    display   : block;
    /*让生成的元素以块级元素显示，占满剩余空间*/
    height    : 0;
    /*避免生成的内容破坏原有布局高度*/
    clear     : both;
    /*清除浮动*/
    visibility: hidden;
    /*让生成的内容不可见*/
  }
}

/* -------------- 浮动 end ---------------- */

```



## calc 坑点

  ```css
    bottom: calc(var(--x) + 0px);
    // calc 中计算为 0px 时是不会生效的.
  ```



## fixed 定位失效

>当元素祖先的 transform 属性非 none 时，容器由视口改为该祖先。

即，指定了 `position:fixed` 的元素，如果其祖先元素存在非 none 的 transform 值 ，那么该元素将相对于设定了 `transform` 的祖先元素进行定位。

处理方式：
```css
transform: none;
```



## 1px 和 android文字垂直居中

> [android文字无法垂直居中解析](https://www.zhihu.com/question/39516424/answer/274374076)
>
> 根据实际情况修改，没有绝对的银弹

```less
/* 1px 问题解决 */

/* 盒子边框 */
.border-1px(@color: #fefefe, @radius: 0px) {
  border       : none;
  position     : relative;
  border-radius: @radius;

  &::after {
    content         : "";
    position        : absolute;
    top             : 0;
    left            : 0;
    border          : 1px solid @color;
    border-radius   : calc(@radius * 2);
    box-sizing      : border-box;
    width           : 200%;
    height          : 200%;
    transform       : scale(0.5);
    transform-origin: left top;
  }
}

/* 上边框, 同理可得下 左  右*/
.top-1px(@color: #edeef2) {
  position: relative;
  border  : none;

  &::before {
    content         : "";
    display         : block;
    width           : 200%;
    height          : 2px;
    position        : absolute;
    top             : 0;
    left            : 0;
    right           : 0;
    background-color: @color;
    transform-origin: left top;
    transform       : scale(0.5);
  }
}

/* android 文字无法垂直水平居中
	1. 将width,height,font-size 等属性，放大1倍，再缩小.5，此时容器被撑开，通过margin负距离定位回原来位置
*/
.text {
  width:200%;
  height:200%;
  font-size: calc(16px * 2);
  tranform: scale(.5);
}

```



## rem布局，px布局，我到底要选谁？

>[前置资料](https://www.zhihu.com/question/313971223/answer/611789506)

rem 本质上就是个等比缩放

是否认同： 在更大的屏幕上应该看到更多的信息？？？

上对比：

**左侧 px布局，右侧rem布局；肉眼可见的，在相同大小的屏幕上，px布局能展示更多的信息，rem布局等比缩放，信息量较少**

![rem和px对比.png](https://raw.githubusercontent.com/Nick-QI/pics/master/1597832399547-1597832399543.png)

:::tip

个人觉得，在当前手机，pad 普及度这么高的情况下，应该用px布局，vw，vh，rem等为辅，来处理不同分辨率区段的展示。

当然，如果业务要求只在移动端且不做任何未来的考虑的话，rem直接上就行了。

:::



## 滚动属性，禁止滚动穿透

**overscroll-behavior：**

​	**contain**: 设置这个值后，默认的滚动边界行为不变（“触底”效果或者刷新），但是临近的滚动区域不会被滚动链影响到，比如对话框后方的页面不会滚动。

-  **autto**: 默认效果

- **none**: 临近滚动区域不受到滚动链影响，而且默认的滚动到边界的表现也被阻止。

---

**scroll-behavior:**

- **auto**: 立即滚动

- **smooth**: 缓动动画；滚动框通过一个用户代理预定义的时长、使用预定义的时间函数，来实现平稳的滚动，用户代理应遵循其平台的约定，如果有的话。

---

**-webkit-overflow-scrolling：**

- **auto**: 使用普通滚动, 当手指从触摸屏上移开，滚动会立即停止。

- **touch**: 使用具有回弹效果的滚动, 当手指从触摸屏上移开，内容会继续保持一段时间的滚动效果。继续滚动的速度和持续的时间和滚动手势的强烈程度成正比。同时也会创建一个新的堆栈上下文。

  :::danger

  **使用 touch 可能会引发未知的 bug, 建议定位到这个问题的时候,监听 touch 事件, 在 touchend 的时候释放这个属性**

  :::


## 全局变量编写

```css
// create
:root {
  --statusBarHeight: 10px;
  --footerBarHeight: 44px;
}

// use
body {
	padding-top: var(--statusBarHeight);
}
```

```js
// js 动态生成
const {statusBarHeight} = getSystemInfo()
let globalRootStyle = document.createElement('style')
globalRootStyle.innerHTML = `
	:root {
		--statusBarHeight: ${statusBarHeight || 0}px;
	} 
`
document.documentElement.firstElementChild.appendChild(globalRootStyle)
```

##  css(id,类名等)的优先级
按权重:  
 !import > 内联样式(1000) > id(100) > 类,伪类,属性选择器(10) > 标签,伪元素(10) > 通配符(0)

括号内携带的是 他的权重值,但是不代表, 权重叠加后大于前一级的情况,即

```css
/* 实际上还是id 优先级高 */
.a.d.c.f.g.h.j.k.l.q.w.e.r.y.u.i {  // 20个类名,权重 20*10 = 200 
  color: red;
}
#id{   // 权重 100;
  color: blue;  
}
```