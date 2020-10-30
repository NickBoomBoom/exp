---
title: HTML
---

## 那些我们不知道却又无比好用的HTML标签

1.fieldset

:::details 示例

```html
<fieldset> 
	<legend>title</legend>
  <div>
    content
  </div>
</fieldset>
```

<fieldset> 
	<legend>title</legend>

​	<div> content</div>

</fieldset>

:::




## 自定义HTML标签，随心造

[前置知识](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements)

:::tip

和vue的自定义指令含义差不多，触类旁通嘛

[vue自定义指令](https://cn.vuejs.org/v2/guide/custom-directive.html#ad) 

:::

类似像uni-app那些自定义标签就是这么来的

```javascript

class MyDialog extends HTMLElement {
  constructor() {
    super()
  }
  
  connectedCallback() {
    // 首次被插入文档时调用
  }
  
  disconnectedCallback() {
    // dom被删除时调用
  }
  
  adoptedCallback() {
		// dom被移动到新文档时调用
  }
  
  attributeChangeedCallback() {
		// 自身属性被增删改查时调用 
  }
}
window.customElements.define('my-dialog', MyDialog)

// 如果你想指定特定的 dom 类型，可通过下段代码找到所有的衍生
{
  let res = []
  for (let key of Object.getOwnPropertyNames(window)) {
    let item = window[key]
    if (item && item.prototype instanceof HTMLElement) {
      res.push(key)
    }
  }
  console.log(res)
}

```

:::details HTMLElement 附录
"HTMLVideoElement", 
"HTMLUnknownElement", 
"HTMLUListElement", 
"HTMLTrackElement", 
"HTMLTitleElement", 
"HTMLTimeElement", 
"HTMLTextAreaElement", 
"HTMLTemplateElement", 
"HTMLTableSectionElement", 
"HTMLTableRowElement", 
"HTMLTableElement", 
"HTMLTableColElement", 
"HTMLTableCellElement", 
"HTMLTableCaptionElement", 
"HTMLStyleElement", 
"HTMLSpanElement", 
"HTMLSourceElement", 
"HTMLSlotElement", 
"HTMLShadowElement", 
"HTMLSelectElement", 
"HTMLScriptElement", 
"HTMLQuoteElement", 
"HTMLProgressElement", 
"HTMLPreElement", 
"HTMLPictureElement", 
"HTMLParamElement", 
"HTMLParagraphElement", 
"HTMLOutputElement", 
"Option", 
"HTMLOptionElement", 
"HTMLOptGroupElement", 
"HTMLObjectElement", 
"HTMLOListElement", 
"HTMLModElement", 
"HTMLMeterElement", 
"HTMLMetaElement", 
"HTMLMenuElement", 
"HTMLMediaElement", 
"HTMLMarqueeElement", 
"HTMLMapElement", 
"HTMLLinkElement", 
"HTMLLegendElement", 
"HTMLLabelElement", 
"HTMLLIElement", 
"HTMLInputElement", 
"Image", 
"HTMLImageElement", 
"HTMLIFrameElement", 
"HTMLHtmlElement", 
"HTMLHeadingElement", 
"HTMLHeadElement", 
"HTMLHRElement", 
"HTMLFrameSetElement", 
"HTMLFrameElement", 
"HTMLFormElement", 
"HTMLFontElement", 
"HTMLFieldSetElement", 
"HTMLEmbedElement", 
"HTMLDivElement", 
"HTMLDirectoryElement", 
"HTMLDialogElement", 
"HTMLDetailsElement", 
"HTMLDataListElement", 
"HTMLDataElement", 
"HTMLDListElement", 
"HTMLContentElement", 
"HTMLCanvasElement", 
"HTMLButtonElement", 
"HTMLBodyElement", 
"HTMLBaseElement", 
"HTMLBRElement", 
"Audio", 
"HTMLAudioElement", 
"HTMLAreaElement", 
"HTMLAnchorElement"
:::