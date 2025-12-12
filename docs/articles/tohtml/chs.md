# 动态生成页面

你可以将描述页面内容的 JSON 模型轻松转化为 HTML 部件。

以下是个示例。

```typescript
import * as Hje from 'hje';

// 获取或创建一个元素，用于后续渲染。
// 本处示例为在 document.body 末尾增加了一个元素。
const ele = Hje.appendElement(null);

// 用描述性语言，在指定元素中执行渲染。
Hje.render(ele, {
  props: {
    type: "circle",
  },
  style: {
    "color": "#808080", "font-size": "14px"
  },
  on: {
    click(ev) { console.log("ul click", ev); }
  },
  children: [
    {
      tagName: "ul",
      children: ["ABCDEFG", "HIJKLMN", "OPQ RST", "UVW XYZ"]
        .map(ele => ({ tag: "li", children: ele }))
    }
  ]
});
```

<!-- End -->
---

[Next](../zujian/)
