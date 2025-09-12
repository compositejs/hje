# 动态生成页面

你可以将描述页面内容的 JSON 模型轻松转化为 HTML 部件。

以下是个示例。

```typescript
import * as Hje from 'hje';

let ele = document.createElement("div");
document.body.appendChild(ele);

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
