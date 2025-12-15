# 动态生成页面

你可以将描述页面内容的 JSON 模型轻松转化为 HTML 部件。

## 基本入门

以下是个示例。

```html
<main id="container-main" ></main>
```

```typescript
import * as Hje from 'hje';

// 用描述性语言，在指定元素中执行渲染。
Hje.render("container-main", {
  children: [
    {
      tagName: "ul",
      styleRefs: "list-alphabet",
      props: {
        type: "circle",
      },
      on: {
        click(ev) { console.log("ul click", ev); }
      },
      children: ["ABCDEFG", "HIJKLMN", "OPQ RST", "UVW XYZ"]
        .map(ele => ({ tag: "li", children: ele }))
    }
  ]
});
```

在这里，我们调用了 `render` 函数，并传入了两个参数，其中，

- 第一个参数为 DOM 元素或其 ID，示例中指示以前面特定 DOM 为渲染元素。如果是希望在 `body` 内的结尾处直接新增一个 `div` 元素，也可以传入 `Hje.appendElement(null)`，这里面的 `null` 也可以替换成任意一个预期放入的父容器 DOM 元素或其 ID。
- 第二个参数是一个描述结构，符合 `DescriptionContract` 接口，用于以类似 JSON 的形式说明其内部元素布局构造，并可绑定相关事件。

本方法返回一个 `ViewGeneratingContextContract<T>` 结构体。

## `DescriptionContract`

本接口定义了对元素布局构造和事件等的描述，主要包含以下字段。

- `tagName` _字符串_：DOM 的标签名，如 `div`。
- `key` _字符串_：索引键名。当使用 `Hje.render` 时，其返回的结构体中，可以调用 `childContext()` 方法并传入此值，获取该值对应的该类型结构体。
- `control` _类型 或 字符串_：Hyper-JSON Engine 支持封装控件，当有现有控件想在本元素中使用时，可在此传入。
- `styleRefs` _字符串 或 字符串数组_：即 DOM 的 `className` 列表。
- `style` _对象_：内联样式，结构与 `ElementCSSInlineStyle` 类似。
- `props` _对象_：适用于 DOM 的属性（attribute），其内各字段大多为字符串。
- `on` _对象_：适用于 DOM 的事件，如 `click`（表示点击事件），其内各字段大多为函数。
- `children` _字符串 或 对象数组_：子元素。如果是字符串，那么里面即会直接渲染文本（`TextNode`）；如果是数组，那么各元素需要时 `DescriptionContract` 接口类型。
- `data` _对象_：绑定的数据，用于编程开发时作为附加信息读取使用。
- `oninit` _函数_：当初始化执行时会被触发。
- `onload` _函数_：当被加载时会被触发。

<!-- End -->
---

[Next](../component/)
