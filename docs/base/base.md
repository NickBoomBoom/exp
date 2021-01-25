---
title: 日常记录
---
## 进制初识

::: tip

[前置](https://www.zhihu.com/question/23131605/answer/142989017)

:::

```javascript
// 2进制到36进制之间的转换
function baseConverter(decNumber, base) { 
   const remStack = []
   const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
   let number = decNumber; 
   let rem; 
   if (!(base >= 2 && base <= 36)) { 
   	return ''; 
   } 
   while (number > 0) { 
     rem = Math.floor(number % base); 
     remStack.push(rem); 
     number = Math.floor(number / base); 
   }
   return remStack.reduceRight((acc, cur) => acc += digits[cur], '')
}
```



## 重绘Reflow和回流Repaint

::: tip

[详解](https://juejin.cn/post/6844903569087266823)

[知识集](https://www.zhoulujun.cn/html/webfront/browser/webkit/2016_0506_7820.html)

:::

#### 重绘Reflow

​	当页面中元素样式的改变并不影响它在文档流中的位置时，浏览器会将新样式赋予元素并重绘它

#### 回流Repaint

​	元素的尺寸，结构，或某些属性发生改变的时候，浏览器重新渲染部分或全部文档的过程。

​	会导致回流的操作：

- 页面首次渲染
- 浏览器窗口大小发生改变
- 元素尺寸或位置发生改变
- 元素内容变化
- 元素字体大小变化
- 增删可见元素
- 激活CSS伪类
- 查询某些属性或调用某些方法

#### 影响

**回流比重绘代价高**

#### 浏览器优化

前置：浏览器会维护一个队列，将回流和重绘操作放入队列中，当队列任务数量到达一个阈值时，队列清空，进行一次批处理，这样把多次回流和重绘编程一次。

#### 如何避免

css：

- 避免使用table布局
- dom树最末端改变class
- 避免设置多层内联样式
- 将动画效果应用到absolute或fixed元素上，脱离图层
- 避免使用CSS表达式（calc()）

JavaScript：

- 避免频繁操作样式，一次重写样式
- 避免频繁操作dom，使用 [documentFragment](https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentFragment)
- 设置display:none；操作结束后显示出来，display属性为none的元素上进行DOM操作不会触发重绘和回流
- 频繁读取会引发回流、重绘，如果需要多次使用，用变量缓存起来
- 对具有复杂动画的元素使用绝对定位，脱离文档流。避免影响到父元素和相邻元素



## BFC格式化上下文

::: tip

[BFC详解](https://juejin.cn/post/6844904166477955080)

[BFC简析](https://juejin.cn/post/6898278714312753159#heading-1)

:::

BFC 块级格式化上下文，目前碰到的所有BFC情况原因都是 **内部元素在同一个BFC里面导致的问题**；

### 特性：

1. Box垂直方向的距离由margin决定，属于同一个BFC的两个相邻box的margin会发生重叠
2. BFC的区域不会与float box 发生重叠；
3. 计算BFC的高度时，浮动元素也参与计算
4. BFC内部的Box会在垂直方向上，一个接一个的放置
5. 每个元素的margin box的左边会与包含块border box的左边相接触（对于从左到右的格式化，否则相反），即使存在浮动也是如此
6. BFC独立容器，容器里面的元素不会影响到外部元素

### 问题：同一个BFC中元素的排列出现问题；将出问题的Box 触发BFC，使其关联断开

### 解决（即触发BFC）：

1. 根元素（HTML）

2. float的值不为none

3. overflow的值不为visible

4. diaplay的值为inline-block/flex/inline-flex/table-cell/table-caption/flow-root（[flow-root支持有限](https://caniuse.com/?search=flow-root)）

5. position的值为absolute/fixed

   


## Express和Koa的中间件原理

```javascript
/* 
	Express 中间件原理
*/
class Express {
  constructor() {
    this.routes = {
      all: [],
      get: [],
      post: []
    }
  }
  register(path) {
    const info = {}
    if (typeof path === 'string') {
      info.path = path
      info.stack = slice.call(arguments, 1)
    } else {
      info.path = '/'
      info.stack = slice.call(arguments, 0)
    }
    return info
  }
  use() {
    const info = this.register.apply(this, arguments)
    this.routes.all.push(info)
  }
  get() {
    const info = this.register.apply(this, arguments)
    this.routes.get.push(info)
  }
  post() {
    const info = this.register.apply(this, arguments)
    this.routes.post.push(info)
  }
  handle(req, res, stack) {
    // next 核心代码；
    const next = () => {
      const middleware = stack.shift()
      if (middleware) {
        middleware(req, res, next)
      }
    }
    next()
  }
  match(method, url) {
    let stack = []
    if (url === '/favicon.ico') {
      return stack
    }
    let curRoutes = []
    curRoutes = curRoutes.concat(this.routes.all)
    curRoutes = curRoutes.concat(this.routes[method])

    curRoutes.forEach(item => {
      if (url.indexOf(item.path) === 0) {
        stack = stack.concat(item.stack)
      }
    })
    return stack
  }
  callback() {
    return (req, res) => {
      res.json = data => {
        res.setHeader('Content-type', 'application/json')
        res.end(JSON.stringify(data))
      }
      const url = req.url
      const method = req.method.toLowerCase()
      const resultList = this.match(method, url)
      this.handle(req, res, resultList)
    }
  }
  listen(...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)

  }
}


/* Koa 中间件原理，洋葱模型*/
// 组合中间件 
function compose(middlewareList) {
  return ctx => {
    function dispatch(i) {
      const fn = middlewareList[i]
      try {
        // 返回一个promise,无论传过来的fn是否为promise,包一层,确保每次返回的都是promise
        return Promise.resolve(
          fn(ctx, dispatch.bind(null, i + 1))
        )
      } catch (err) {
        return Promise.reject(err)
      }
    }
    return dispatch(0)
  }
}
class Koa {
  constructor() {
    this.middleware = []
  }
  use(fn) {
    this.middleware.push(fn)
    return this
  }
  createContext(req, res) {
    const ctx = {
      req, res
    }
    ctx.query = req.query
    return ctx
  }
  handleRequest(ctx, fn) {
    return fn(ctx)
  }
  callback() {
    const fn = compose(this.middlewareList)
    return (req, res) => {
      const ctx = createContext(req, res)
      return this.handleRequest(ctx, fn)
    }
  }
  listen(...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }
}

```



## 人人都会深拷贝，但是深拷贝循环引用怎么办

```javascript

/* 
	深拷贝 1 	JSON 转化
	弊端：
			undefined 会被转化为 ‘undefined’
			function 无法转化
*/
JSON.parse(JSON.stringify(obj))

/*
	深拷贝 2  递归判断返回；需要解决内部 循环引用
*/
function clone(target, map = new Map()) {
    if (typeof target === 'object') {
      	// 判断数组和对象
        let cloneTarget = Array.isArray(target) ? [] : {};
      	// 在map中查找是否存有
        if (map.get(target)) {
            return map.get(target);
        }
      	// 存储当前对象和克隆对象的对应关系
        map.set(target, cloneTarget);
        for (const key in target) {
            cloneTarget[key] = clone(target[key], map);
        }
        return cloneTarget;
    } else {
        return target;
    }
};
// ps: 还需要考虑其他情况，RegExp，function，Set，weakSet，Map，weakMap，Symbol等


```



## GC（垃圾回收机制）

[**直接点击学习**](https://zhuanlan.zhihu.com/p/103110917)



## 闭包与GC（垃圾回收机制）

```javascript
/*
	闭包： 函数内部返回一个函数，该函数中引用了父级函数中的值，使其变量常驻内存，不被垃圾回收机制回收；
	使用场景：
		目前我所使用的场景，只有在 每次发出请求，header中需要携带token信息的时候会将获取token的函数写成闭包；
		还有在当前变量数据在 70% 以上页面都会用到的时候，写成闭包；
	弊端：
		变量常驻内存，对内存消耗大。（在退出函数之前，将不使用的变量清除）
		ps: 现在机器性能如此过剩的时代，内存溢出的情况应该会很少见吧
*/
function getToken() {
	let token = 'kkkkkk'
	return () => token
}
let token = getToken()
// 使用
token()
// 清除
token = null
```

**我的理解：**

**第一层：闭包就是能够读取其他函数内部变量的函数，也是将函数内部和函数外部连接起来的桥梁**

**第二层：闭包引用的变量常驻内存，垃圾回收机制不会清除它**

## 自适应布局方案（rem,vw）

::: tip

[前置知识](https://juejin.cn/post/6867874227832225805#heading-11)

:::

### rem是什么

​	rem 是指相对于根元素来做计算的字体大小单位

::: tip rem的实质：

**等比缩放**

```javascript
/* 
	designWidth: 设计稿宽度
	maxWidth： 	最大宽度
*/
function setRem(designWidth, maxWidth) {
  // 获取设备独立像素
	let clientWidth = document.documentElement.getBoundingClientRect().width
  if (clientWidth > maxWidth) {
    clientWidth = maxWidth
  }
  // 100 是px与rem的转换比例。100 比较好算
	const rem = (clientWidth * 100) / designWidth
	document.documentElement.style.fontSize = rem + 'px'
}

// 这样的话，rem * designWidth / 100  = clientWidth；
// 这就是我们每次计算px需要换算的原因了。


```

:::

### vw是什么

​	vw是基于viewport视窗的长度单位。1vw等于window.innerWidth的1%

### dpr是什么

​	设备像素比，即物理像素和设备独立像素的比值。**dpr = 物理像素 / 设备独立像素**

​	在浏览器中通过**window.devicePixelRatio**来获取dpr

​	**iPhone6，7，8**的物理像素是**750*1334**，设备独立像素是**375*667**。dpr就是 750 / 375 = 2。

::: tip 1px问题

​		因为dpr的存在，导致border:1px（1px描述的是设备独立像素），所以border被放大到物理像素1px * 2 = 2px（设备独立像素 * dpr = 实际渲染物理像素）显示

:::

## FLIP

::: tip 前置知识
  [shuffle动画解析](https://juejin.im/post/6855129005167738893#heading-2)

  [nextTick了解一下](https://juejin.im/post/6844903914068787213)
:::

::: danger 划重点,默念十遍

**1. dom的更新是实时的。DOM属性的获取不是从RenderTree上获取，而是从DomTree上获取的**

**2. 宏任务 ---> 微任务 ---> GUI渲染**

:::

**FLIP全程为First-Last-Invert-Play, 下面我们来拆读看下**

- **F: First顾名思义就是开始的位置，我们需要在动画开始前记录下节点的开始位置**
- **L: Last代表结束的位置, 我们同样需要记录下结束的位置，这样我们的运行轨迹就可以通过终始点的位置计算出来**
- **I: Invert表示回归, 我们将当前节点的位置回归到最初的位置，这样看起来就像是从起点开始运动到终点**
- **P: Play表示播放，也就是开始从起点往终点运行**

下面结合代码讲解实际过程

```html {35-38,50-56,60-61,63-66,69,76,78-86}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      * {
        margin: 0;
        height: 0;
      }
      .container {
        margin: 50px auto;
        width: 450px;
        height: 450px;
        display: flex;
        flex-wrap: wrap;
      }
      .c-random__brand {
        width: 50px;
        height: 50px;
        text-align: center;
        box-sizing: border-box;
        line-height: 50px;
        border: 1px solid #000;
      }
      button {
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container"></div>
    <button onclick="shuffle()">shuffle</button>
    <script>
      /* 
        dom 是实时更新的  dom是实时更新的  dom是实时更新的
        DOM属性的获取不是从RenderTree上获取，而是从DomTree上获取的
      */
      const container = document.getElementsByClassName('container')[0]
      // 创建dom数组 不需要关注
      function createBrands() {
        return [...Array(81).keys()].map(brand => {
          const div = document.createElement('div')
          div.innerHTML = brand
          div.className = 'c-random__brand'
          return div
        })
      }
      function calculatePlace() {
        //执行① First 初始赋值
        brands.forEach(brand => {
          const { left, top } = brand.getBoundingClientRect()
          brand.dataset.left = left
          brand.dataset.top = top
          brand.style.transition = 'unset'
        })
        // 乱序
        brands.sort((a, b) => Math.random() > .5 ? -1 : 1)
        // 创建微任务，记住我们的执行顺序，宏任务 ---> 微任务 ---> GUI渲染
        Promise.resolve().then(() => {
          // 执行③ 在GUI渲染之前执行
          brands.forEach(brand => {
            /*  Last 结束赋值，从dom树中拉取最新dom的定位数据
            	你可能会疑惑，为什么在GUI渲染之前能拿到位置已经变化的数据呢？？
            	默念第一条，dom的更新是实时的，dom的更新是实时的，dom的更新是实时的
            */
            const { left, top } = brand.getBoundingClientRect()
            const { left: oldLeft, top: oldTop } = brand.dataset
            // Invert 回归，回归到变化之前的位置。
            brand.style.transform = `translate3d(${oldLeft - left}px, ${oldTop - top}px, 0)`
          })
        })
      }

      function patchBrandDom() {
        // 执行② 塞入dom，因为dom的更新是实时的，所以我们可以在dom树中拿到新的变化位置
        brands.map(container.appendChild.bind(container))
        // 执行④ Play dom在invert中回归到变化之前的位置，现在添加动画，重置translate属性即可展示动画效
        // 不止requestAnimationFrame, setTimeout 也可；开启第二轮渲染
        requestAnimationFrame(() => {
          brands.forEach(brand => {
            const { left, top } = brand.getBoundingClientRect()
            brand.style.transform = `translate3d(0, 0, 0)`
            brand.style.transition = 'all .5s'
          })
        })
      }

      function shuffle() {
        calculatePlace()
        patchBrandDom()
      }
      const brands = createBrands()
      shuffle()
    </script>
  </body>
</html>
```





<div class='box'>
  <style>
    .box {
      width: 100%;
      height:450px;
      display: flex;
      align-items: center;
    }
    .btn {
      width: 140px;
      height: 80px;
      font-size:30px;
    }
    .container {
      margin: 0 auto;
      width: 450px;
      height: 450px;
      display: flex;
      flex-wrap: wrap;
    }
    .c-random__brand {
      width: 50px;
      height: 50px;
      text-align: center;
      box-sizing: border-box;
      line-height: 50px;
      border: 1px solid #000;
    }
  </style>
  <button class='btn' onclick="shuffle()">shuffle</button>
  <div class="container"></div>
  <script>
  /* 
    dom 是实时更新的  dom是实时更新的  dom是实时更新的
    DOM属性的获取不是从RenderTree上获取，而是从DomTree上获取的
    */
  const container = document.getElementsByClassName('container')[0]
  function createBrands() {
    return [...Array(81).keys()].map(brand => {
      const div = document.createElement('div')
      div.innerHTML = brand
      div.className = 'c-random__brand'
      return div
    })
  }
  function calculatePlace() {
    // F 初始赋值
    brands.forEach(brand => {
      const { left, top } = brand.getBoundingClientRect()
      brand.dataset.left = left
      brand.dataset.top = top
      brand.style.transition = 'unset'
    })
    // 乱序
    brands.sort((a, b) => Math.random() > .5 ? -1 : 1)
    // 动画
    Promise.resolve().then(() => {
      brands.forEach(brand => {
        // L 从dom树中拉取最新dom的定位数据
        console.log('L')
        const { left, top } = brand.getBoundingClientRect()
        const { left: oldLeft, top: oldTop } = brand.dataset
        // I 回归到原始位置
        console.log('I', oldLeft, left, oldTop, top)
        brand.style.transform = `translate3d(${oldLeft - left}px, ${oldTop - top}px, 0)`
      })
    })
  }
  function patchBrandDom() {
    // P
    console.log('P before')
    // 塞入dom
    brands.map(container.appendChild.bind(container))
    requestAnimationFrame(() => {
      console.log('P')
      brands.forEach(brand => {
        const { left, top } = brand.getBoundingClientRect()
        brand.style.transform = `translate3d(0, 0, 0)`
        brand.style.transition = 'all .5s'
      })
    })
  }
  function shuffle() {
    calculatePlace()
    patchBrandDom()
  }
  const brands = createBrands()
  shuffle()
  </script>
</div> 


## 禁止字体跟随系统字体大小

#### (即，固定字体大小,不随系统字体大小变化)

1. IOS

   ```css
   body {
     -webkit-text-size-adjust: 100% ;
   }
   ```

   

2. Android 微信端

   ```js
   (function() {
       if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function"){
           handleFontSize();
       } else {
           if (document.addEventListener) {
               document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
           } else if (document.attachEvent) {
               document.attachEvent("WeixinJSBridgeReady", handleFontSize);
               document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
           }
       }
       function handleFontSize() {
           WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });
           WeixinJSBridge.on('menu:setfont', function() {
               WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });
           });
       }
   })();
   ```




## 软键盘处理 

1. ios 下，input onblur后，软键盘收起，但是界面无法回弹至100vh

   ```js
   // 监听onblur事件，塞入400ms定时器.(一般软键盘收起 耗时400ms)
   input.onblur = () => {
     setTimeout(()=> {
       window.scrollTo(0, 0)
   	}, 400)  
   }
   ```

   :::tip 

   通过scrollTo 模拟用户滚动，让页面重归正常

   :::



## app和webview 交互

交互方式主要有**两种**：[点我了解更多](https://mp.weixin.qq.com/s/9YkBGfOMvSHr_alpMJUY2Q)

1. webview通过创建一个iframe，通过修改iframe的src 传递指令和参数；app则通过监听iframe的路由变化来调用原生指令

   [详情了解](https://github.com/lzyzsd/JsBridge)

   [部分坑点](https://github.com/lzyzsd/JsBridge/issues/119)

   

2. android和ios分别通过window中埋入函数来调用

   :::details 实例

   ```js
   function callApp(command,data){
     // 统一传递数据类型为 string，java，oc 强类型语言。让客户端自己序列化
      try {
       data = JSON.stringify(data)
     } catch (e) {}
     /* android 和 ios 调用方法是不一样的
    		android: 在window中写入一个独有变量，将指令存入其中
    		ios：通过window.webkit 来调用
    */
     if (window.webkit) {
       window.webkit.messageHandlers[command].postMessage(data)
     } else {
       window.android[command](data)
     }
   }
   ```

   

   :::

|  方式  |                             弊端                             |                解决                |
| :----: | :----------------------------------------------------------: | :--------------------------------: |
| iframe | 1.监听冲突，app必须通过路由监听来处理，<br />在某些特殊情况下（app内webview需要跳转app页面，window.location.href = '/login' 等app内部页面时）引起冲突<br />2.iframe注册回调有延迟<br />3.小程序中加载该webview前需要将该iframe禁用（非业务域名） | 改window；跳转原生页面用指令来跳转 |
| window |         无法回调，调取app指令，app无法return数据回来         |              改iframe              |



### 思考下来：iframe 的方式有很大局限性。决定依据window 重新写一套

暂时的思路： 

​		window目前发现的局限性就是无法回调。那么我主动注册一个回调函数不就行了，在每次app收到指令后，指令执行完成，在执行window上我注册的回调。

::: details 简单理想实现

```js
// 简单实现
import uuid from 'uuid'
const APP = 'app'  // window中存app指令的key
const RECEIVE_APP_DATA = 'h5_callback'  // 注册的回调函数 key

function callApp({command, data, cbKey, cb}) {
  regsiterCommand(cbKey, cb) // 注册回调函数
 
  // 固定格式传参格式，data为数据，cbKey为执行回调函数name
	let body = {
		data,
    cbKey
  }
  try {
    body = JSON.stringify(body)
  }catch(e) {}
  
   if (window.webkit) {
    window.webkit.messageHandlers[command].postMessage(body)
  } else {
    window.android[command](body)
  }
}

// 保持注册指令唯一性，防止指令注册重复
function regsiterCommand(command, cb) {
  const _uuid = uuid()
  command = command ? command + _uuid : _uuid
  window[RECEIVE_APP_DATA][command] = cb
}

/*-----------  预想中的执行 --------------*/

const receiveUserInfo = data => {
  console.log('接收到的用户信息'， data)
}

const info = {
  command: 'getUserInfo',
  data: '',
  cbKey: '',
  cb: receiveUserInfo
}

callApp(info)

```
:::


## 微信ios端底部导航栏

> <img src="https://raw.githubusercontent.com/Nick-QI/pics/master/1597832370146-1597832370128.png" alt="图" style="zoom:20%;" />

**出现原因：** 当存在历史记录栈的时候, ios 底部会出现导航bar

**导航栏隐藏条件：** 微信端会监听整个 scrollview (**整个 html**)的滚动,当导航 bar 存在的时候,用户上滑 scrollview 的时候, 导航 bar 会隐藏, 下滑的时候, 显示导航 bar

**解决方案：**

1. 既然是存在历史记录的时候存在,那么我们每次跳转直接 replace 即可解决
2. 所有的页面高度由dom 将 html 撑高, 不要将页面设置为固定宽高, 这样在导航bar存在的时候, 上滑下滑会触发导航 bar 的自动显隐

​	

## 微信js-sdk，慢慢啃出来的经验

> [自己写的工具类，里面整合了微信js配置，打开即食](https://www.npmjs.com/package/utils94)
>
> [微信js-sdk文档](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html)

![重点](https://raw.githubusercontent.com/Nick-QI/pics/master/1597832346227-1597832346222.png)

**根据上面的信息和踩过的坑，总结出：** 

1. **所有需要使用JS-SDK的页面必须先注入配置信息，否则将无法调用**
2. **同一个url仅需调用一次，对于变化url的SPA的web app可在每次url变化时进行调用,目前Android微信客户端不支持pushState的H5新特性，所以使用pushState来实现web app的页面会导致签名失败，此问题会在Android6.2中修复**
3. **<font color='red'>在ios中,初始配置一次之后即可通用使用(ios 中请求的url需要初次进入的url来获取签名,否则会出错)</font>**
4. **<font color='red'>在安卓中,需要在每次路由变化时重新配置</font>**

:::danger 谨记！！！

ios 在首次进入的时候，要保存初次进入的url，用这个url去请求jsconfig，不然永远都配置不成功；

之前我在写angular的时候，因为初次进入登录会将token附加在url上，然后我用了个守卫将url上的token过滤掉，然后用过滤掉的url去请求jsconfig，永远都成功不了。

:::



## IOS中new Date的坑

![safari表现](https://raw.githubusercontent.com/Nick-QI/pics/master/1597832322393-1597832322384.png)

```js
new Date('2020-12-11 08:09') // 这种带时间的在safari中是无法解析的
new Date('2020-12-11')  // 这样的就可以
```



## 获取url参数的三种方式

1.**qs**

```js
import qs from 'qs'
const search = window.location.href.split('?')[1]
qs.parse(search) // {key:value}
```

---

2.**url**

```js
import url from 'url'
const res = url.parse(window.location.href, true)
/* 
	res = { 
    auth: null
    hash: null
    host: "www.baidu.com"
    hostname: "www.baidu.com"
    href: "https://www.baidu.com/?a=1&a=2&b=2"
    path: "/?a=1&a=2&b=2"
    pathname: "/"
    port: null
    protocol: "https:"
    query: {a: Array(2), b: "2"}
    search: "?a=1&a=2&b=2"
    slashes: true
  }
*/

```

---

3.**URLSearchParams**

```js
 const res = new URLSearchParams(window.location.search)
 const query = {}
 for (let key of res.keys()) {
   query[key] = res.getAll(key)
 }
```



## webview 跳转 app

:::tip

ios android 均支持scheme协议跳转；

微信中禁止了scheme协议和ios universal link，除非加入腾讯白名单，才能直接打开。

最近微信平台开放了网页跳转app功能，[点我知道](https://developers.weixin.qq.com/doc/oplatform/Mobile_App/WeChat_H5_Launch_APP.html)

> 2020-8-5

:::

1. **通过scheme url 协议跳转**

   <font color='red'> ios 最新safari浏览器转入后台后js还会继续执行，所以我们初始方案（先跳scheme协议，2s后跳app store 方案失败），会出现跳转了app后，再次跳转app store。<br>ios 推荐使用universal link跳转，直接跳转，不需要确认框 </font>

   ```js
   window.location.href = 'weixin://'
   ```

   

2. **ios 通过 universal link 跳转（ios 9以上）**

   ![流程图](https://raw.githubusercontent.com/Nick-QI/pics/master/1597832281067-appjump.jpeg)



## 老生常谈，事件循环 EventLoop

[EventLoop详解](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop)

### 浏览器端：

1.执行一个宏任务（栈中没有就从事件队列中获取）；
2.执行过程中如果遇到微任务，就将它添加到微任务队列中；
3.宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）；
4.当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染；
5.渲染完毕后，JS线程继续接管，开始下一个宏任务（就从事件队列中获取）

![event loop](https://raw.githubusercontent.com/Nick-QI/pics/master/1597832224340-eventloop.jpeg)



## 讲完EventLoop，再讲promise就能清楚了

```javascript

 			const PENDING = 'PENDING';
      const RESOLVED = 'RESOLVED';
      const REJECTED = 'REJECTED';

      function resolvePromise(promise2, x, resolve, reject) {
        // 1)不能引用同一个对象 可能会造成死循环
        if (promise2 === x) {
          return reject(new TypeError('[TypeError: Chaining cycle detected for promise #<Promise>]----'));
        }
        let called;// promise的实现可能有多个，但都要遵循promise a+规范，我们自己写的这个promise用不上called,但是为了遵循规范才加上这个控制的，因为别人写的promise可能会有多次调用的情况。
        // 2)判断x的类型，如果x是对象或者函数，说明x有可能是一个promise，否则就不可能是promise
        if ((typeof x === 'object' && x != null) || typeof x === 'function') {
          // 有可能是promise promise要有then方法
          try {
            // 因为then方法有可能是getter来定义的, 取then时有风险，所以要放在try...catch...中
            // 别人写的promise可能是这样的
            // Object.defineProperty(promise, 'then', {
            // 	get() {
            // 		throw new Error();
            // 	}
            // })
            let then = x.then;
            if (typeof then === 'function') { // 只能认为他是promise了
              // x.then(()=>{}, ()=>{}); 不要这么写，以防以下写法造成报错， 而且也可以防止多次取值
              // let obj = {
              // 	a: 1,
              // 	get then() {
              // 		if (this.a++ == 2) {
              // 			throw new Error();
              // 		}
              // 		console.log(1);
              // 	}
              // }
              // obj.then;
              // obj.then

              // 如果x是一个promise那么在new的时候executor就立即执行了，就会执行他的resolve，那么数据就会传递到他的then中
              then.call(x, y => {// 当前promise解析出来的结果可能还是一个promise, 直到解析到他是一个普通值
                if (called) return;
                called = true;
                resolvePromise(promise2, y, resolve, reject);// resolve, reject都是promise2的
              }, r => {
                if (called) return;
                called = true;
                reject(r);
              });
            } else {
              // {a: 1, then: 1} 
              resolve(x);
            }
          } catch (e) {// 取then出错了 有可能在错误中又调用了该promise的成功或则失败
            if (called) return;
            called = true;
            reject(e);
          }
        } else {
          resolve(x);
        }
      }


      class Promise {
        constructor(executor) {
          this.status = PENDING; // 宏变量, 默认是等待态
          this.value = undefined; // then方法要访问到所以放到this上
          this.reason = undefined; // then方法要访问到所以放到this上
          this.onResolvedCallbacks = [];// 专门存放成功的回调函数
          this.onRejectedCallbacks = [];// 专门存放成功的回调函数
          let resolve = (value) => {
            if (value instanceof Promise) {
              value.then(resolve, reject);
              return;
            }
            if (this.status === PENDING) {
              this.value = value;
              this.status = RESOLVED;
              this.onResolvedCallbacks.forEach(fn => fn());// 需要让成功的方法依次执行
            }
          };
          let reject = (reason) => {
            if (this.status === PENDING) {
              this.reason = reason;
              this.status = REJECTED;
              this.onRejectedCallbacks.forEach(fn => fn());// 需要让失败的方法依次执行
            }
          };
          // 执行executor传入我们定义的成功和失败函数:把内部的resolve和reject传入executor中用户写的resolve, reject
          try {
            executor(resolve, reject);
          } catch (e) {
            reject(e);//如果内部出错 直接将error手动调用reject向下传递
          }
        }
        then(onfulfilled, onrejected) {
          onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : v => v;
          onrejected = typeof onrejected === 'function' ? onrejected : error => { throw error };
          let promise2 = new Promise((resolve, reject) => {
            if (this.status === RESOLVED) {
              setTimeout(() => {
                try {
                  let x = onfulfilled(this.value);
                  resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                  console.log(e);
                  reject(e);
                }
              }, 0);
            }
            if (this.status === REJECTED) {
              setTimeout(() => {
                try {
                  let x = onrejected(this.reason);
                  resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                  reject(e);
                }
              }, 0);
            }
            if (this.status === PENDING) {
              this.onResolvedCallbacks.push(() => {
                setTimeout(() => {
                  try {
                    let x = onfulfilled(this.value);
                    resolvePromise(promise2, x, resolve, reject);
                  } catch (e) {
                    reject(e);
                  }
                }, 0);
              });
              this.onRejectedCallbacks.push(() => {
                setTimeout(() => {
                  try {
                    let x = onrejected(this.reason);
                    resolvePromise(promise2, x, resolve, reject);
                  } catch (e) {
                    reject(e);
                  }
                }, 0);
              });
            }
          });

          return promise2;
        }
        catch(errCallback) {
          return this.then(null, errCallback);
        }
        resolve(value) {
          return new Promise((resolve, reject) => {
            resolve(value);
          })
        }
        reject(value) {
          return new Promise((resolve, reject) => {
            reject(value);
          })
        }
        all(promises) {
          return new Promise((resolve, reject) => {
            let result = [];
            let len = promises.length;
            if (len === 0) {
              resolve(result);
              return;
            }
            const handleData = (data, index) => {
              result[index] = data;
              // 最后一个 promise 执行完
              if (index == len - 1) resolve(result);
            }
            for (let i = 0; i < len; i++) {
              // 为什么不直接 promise[i].then, 因为promise[i]可能不是一个promise
              Promise.resolve(promise[i]).then(data => {
                handleData(data, i);
              }).catch(err => {
                reject(err);
              })
            }
          })
        }
        race(promises) {
          return new Promise((resolve, reject) => {
            let len = promises.length;
            if (len === 0) return;
            for (let i = 0; i < len; i++) {
              Promise.resolve(promise[i]).then(data => {
                resolve(data);
                return;
              }).catch(err => {
                reject(err);
                return;
              })
            }
          })
        }
      }
      Promise.prototype.finally = function (callback) {
        this.then(value => {
          return Promise.resolve(callback()).then(() => {
            return value;
          });
        }, error => {
          return Promise.resolve(callback()).then(() => {
            throw error;
          });
        });
      }

```



## html2canvas 坑点

1. ios 13 版本中无法生成图片，android 和 pc端均正常，将html2canvas版本降级为 "html2canvas": "1.0.0-rc.4"

## 模块化：AMD，CMD，CommonJs，ES6

[主要区别这篇文章已经很详细了](https://juejin.im/post/6844903576309858318)

[这篇也总结了](https://juejin.cn/post/6920773247948554248)

CommonJs： 服务端使用，同步加载

AMD:：异步加载，依赖前置，提前执行

CMD：异步加载，依赖就近，延迟执行

- CommonJS模块是运行时加载，ES6模块是编译时输出接口
- CommonJS模块输出的是一个值的复制，ES6模块输出的是值的引用
- CommonJS加载的是整个模块，即将所有的方法全部加载进来，ES6可以单独加载其中的某个方法
- CommonJS中`this`指向当前模块`module.exports`，ES6中`this`指向undefined
- CommonJS默认非严格模式，ES6的模块自动采用严格模式



## Sentry 前端报错监控

没啥好讲的，看文档撸

[我是文档](https://docs.sentry.io/)



## SSR 给我们带来了什么

SSR（Server Side Render），服务端渲染

#### 优点：单页面seo优化

#### 缺点：增加服务器成本

#### 原理：

#### 	  服务器接收到请求时，将**对应的资源**填充到HTML模板里转化为字符串形式传递给浏览器, 浏览器**解析js后绑定对应事件**就完成了渲染。

#### 	  同构处理，一套代码在服务端和浏览器端均能跑通



## 函数式编程，是个人都能看懂的函数式编程

<iframe src='https://zh.wikipedia.org/wiki/函数式编程' width='100%' height='1000px'> </iframe>

[（转）详细说明](https://zhuanlan.zhihu.com/p/28712866)

[《函数式编程指北》](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch1.html)

::: tip

很奇怪，上个世纪50年代发明的；近几年左右忽然流行起来，概念兴起，具体实践的话，也没咋在网络和知识平台看到大厂鼓吹。

感觉是个骗kpi的说辞。

个人整体感受下来，这种编程在教学方面应该能省不少力。

实践方面，类似于上述文献所说，函数式编程具有的特点之一： **没有"副作用"(单一职责，只做一件事，避免耦合关联。**

那么，在我处理复杂嵌套对象（即引用类型）的时候，我需要前置深度clone一个新对象出来，然后在继续往下执行，最后将新对象返回回去。

现在大多是vue，react等响应式框架，数据与视图双向绑定。

react： 返回一个新的数据对象的话，对react影响不大，去setState时会去比较的

vue2.0：众所周知，vue2.0对深度嵌套对象是未绑定监听的，需要手动去调用$set来通知视图更新。

vue3.0； proxy 会在修改之前就进行拦截，还行

:::

## App切后台，我的JS还执行么？？？

哇，好问题，太长时间没写和app相关的webview了。之前写的时候安卓还是7点几的版本。

现在已经是8和9了。ios也上到13的版本了。

::: tip

目前测试下来

|    设备     |             结果（切入后台）             |
| :---------: | :--------------------------------------: |
| 安卓.chrome |             15s左右停止执行              |
|  安卓.app   | 一直执行（每个公司都不一样，需要单独测） |
| ios.safari  |              5s左右停止执行              |
|   ios.app   |           立即停止（单独测试）           |

:::

::: danger

之前在app遇到个情况，ios 13版本中， app的webview 中通过audio 标签播放音频，进入后台，再次进入的时候页面会卡死；

后查，是ios13版本的bug，暂未修复。只能等待。

解决方案是通过jsBridge 来调用app的音频播放。

So sad!

:::

## addEventListener passive 优化（划重点）

::: tip 前置知识

[MDN addEventListener](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)

[passive 改善性能，有点晦涩](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#%E4%BD%BF%E7%94%A8_passive_%E6%94%B9%E5%96%84%E7%9A%84%E6%BB%9A%E5%B1%8F%E6%80%A7%E8%83%BD)

:::

​		当你触摸滑动页面时，页面应该跟随手指一起滚动。而此时你绑定了一个 touchstart 事件，你的事件大概执行 200 毫秒。这时浏览器就犯迷糊了：如果你在事件绑定函数中调用了 preventDefault，那么页面就不应该滚动，如果你没有调用 preventDefault，页面就需要滚动。但是你到底调用了还是没有调用，浏览器不知道。只能先执行你的函数，等 200 毫秒后，绑定事件执行完了，浏览器才知道，“哦，原来你没有阻止默认行为，好的，我马上滚”。此时，页面开始滚。

这样下来，在使用者看来，画面会有一定量的阻塞。特别明显。

所以，在日常编写代码的时候，必须加上passive 来处理。

```javascript
div.addEventListener(
  'scroll', 
  function(e){
		// dosomething
	},
  {
    capture: false,
    once: false, // 表示listener在添加之后最多只调用一次。true 表示在其
    passive: true // 设置为true时，表示 `listener` 永远不会调用 `preventDefault()`
  }
)
```

当然，以上是理想状况，大部分时候，还是要预先检测是否支持。

:::danger 注意

那些不支持参数`options`的浏览器，会把第三个参数默认为`useCapture`，即设置`useCapture`为true

:::

上polyfill（就很机智）

`**Object.defineProperty()**` 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。

```javascript
/* Feature detection */
/*特诊检测*/
var passiveIfSupported = false;

try {
  window.addEventListener(
    "test", 
    null, 
    Object.defineProperty({}, "passive", { get: function() { passiveIfSupported = { passive: true }; } }));
} catch(err) {}

window.addEventListener('scroll', function(event) {
  /* do something */
  // can't use event.preventDefault();
  // 不能使用event.prevebt.
}, passiveIfSupported );
```



## 啊哈，微前端，微服务，我究竟是个啥？



## GRAPHQL，前端后端不吵架



## 我是真的懒，单元测试写不写




## PWA香的呀！





