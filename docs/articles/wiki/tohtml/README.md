# To HTML

You can use this to convert a JSON model to HTML view part.

Following is a sample.

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

[Next](../component/)
