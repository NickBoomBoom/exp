---
title: 日常记录
---

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



## 禁止字体跟随系统字体大小

### 即，固定字体大小

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



## 1px 和 android文字垂直居中

> [android文字无法垂直居中解析](https://www.zhihu.com/question/39516424/answer/274374076)
>
> 根据实际情况修改，没有绝对的银弹

```css
/* 1px 问题解决 */

/* 盒子边框 */
.borderRadius-1px {
    border: none;
    position: relative;
}

.borderRadius-1px:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid #e8e8e8;
    box-sizing: border-box;
    width: 200%;
    height: 200%;
    transform: scale(0.5);
    transform-origin: left top;
}

/* 上边框, 同理可得下 左  右*/
.scale-1px-top {
    border: none;
    position: relative;
}

.scale-1px-top:after {
    content: "";
    position: absolute;
    display: block;
    top: -1px;
    left: 0;
    width: 200%;
    height: 1px;
    border-bottom: 1px solid #e8e8e8;
    transform: scale(0.5, 0.5);
    transform-origin: 0 0;
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

![rem和px对比.png](https://ftp.bmp.ovh/imgs/2020/08/fd2d3f6a88d37567.png)

:::tip

个人觉得，在当前手机，pad 普及度这么高的情况下，应该用px布局，vw，vh，rem等为辅，来处理不同分辨率区段的展示。

当然，如果业务要求只在移动端且不做任何未来的考虑的话，rem直接上就行了。

:::



## 微信ios端底部导航栏

> <img src="https://ftp.bmp.ovh/imgs/2020/08/3f0c9fdddb93de8e.png" alt="图" style="zoom:20%;" />

**出现原因：** 当存在历史记录栈的时候, ios 底部会出现导航bar

**导航栏隐藏条件：** 微信端会监听整个 scrollview (**整个 html**)的滚动,当导航 bar 存在的时候,用户上滑 scrollview 的时候, 导航 bar 会隐藏, 下滑的时候, 显示导航 bar

**解决方案：**

1. 既然是存在历史记录的时候存在,那么我们每次跳转直接 replace 即可解决
2. 所有的页面高度由dom 将 html 撑高, 不要将页面设置为固定宽高, 这样在导航bar存在的时候, 上滑下滑会触发导航 bar 的自动显隐



## overscroll-behavior,scroll-behavior,-webkit-overflow-scrolling

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

​	

## 微信js-sdk，慢慢啃出来的经验

> [自己写的工具类，里面整合了微信js配置，打开即食](https://www.npmjs.com/package/utils94)
>
> [微信js-sdk文档](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html)

![重点](https://ftp.bmp.ovh/imgs/2020/08/3efb84b0255fe5b7.png)

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

![safari表现](https://ftp.bmp.ovh/imgs/2020/08/4d4347c5976e4b30.png)

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

   ![流程图](https://ftp.bmp.ovh/imgs/2020/08/51285e223fac2751.png)



## 老生常谈，事件循环 EventLoop

![](https://ftp.bmp.ovh/imgs/2020/08/548c50db2d9ab663.png)