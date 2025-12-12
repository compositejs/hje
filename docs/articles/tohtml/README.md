# To HTML

You can use this to convert a JSON model to HTML view part.

Following is a sample.

```typescript
import * as Hje from 'hje';

// Get or create an element to render.
// This sample here is to create an element and append to document body.
const ele = Hje.appendElement(null);

// Render the element with the given description.
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
