# To HTML

You can use this to convert a JSON model to HTML view part.

## Getting started

Following is a sample.

```html
<main id="container-main" ></main>
```

```typescript
import * as Hje from 'hje';

// Render the element with the given description.
Hje.render("container-main", {
  children: [{
    tagName: "h2",
    on: {
      click(ev) { console.log("title clicked", ev); }
    },
    children: "Alphabet"
  }, {
    tagName: "ul",
    styleRefs: "list-alphabet",
    props: {
      type: "circle",
    },
    children: ["ABCDEFG", "HIJKLMN", "OPQ RST", "UVW XYZ"]
      .map(ele => ({ tag: "li", children: ele }))
  }]
});
```

We call `render` function here with 2 arguments:

- The first argument is a DOM or its ID. In the sample above, it render a specific DOM queried by ID. You can also call `Hje.appendElement(null)` to get the result to pass it as the first argument here to append a new `div` at the end of `body` to render; or replace `null` with a specific DOM or its ID as its parent.
- The second argument is a description model which extends `DescriptionContract` interface. It is used to define the inner struct and bind events to the DOM.

The function returns a model which extends `ViewGeneratingContextContract<T>` interface. It renders following HTML.

```html
<main id="container-main">
  <h2>Alphabet</h2>
  <ul>
    <li>ABCDEFG</li>
    <li>HIJKLMN</li>
    <li>OPQ RST</li>
    <li>UVW XYZ</li>
  </ul>
</main>
```

And the `h2` above has added an event listenr of `click`.

## `DescriptionContract`

The interface is used to describe the inner struct and other information. It owns following properties.

- `tagName` _string_: The tag name of DOM, e.g. `div`.
- `key` _string_: The key for indexing. It can be used as the argument of `childContext()` method in the result model returned by `Hje.render`, to get its context.
- `control` _type or string_: Hyper-JSON Engine supports control. Pass the type if you want to enable the control rendering.
- `styleRefs` _string or string array_: The `className` list of DOM.
- `style` _object_: Inline style. See `ElementCSSInlineStyle`.
- `props` _object_: The properties (attributes) of DOM, e.g. `title`. Most of value type of its property are string.
- `on` _object_: The events of DOM, e.g. `click`. Most of value type of its property are function.
- `children` _string or object array_: Child elements. If it is string, it renders the string by `TextNode`. If it is an array, its element should be an object which extends `DescriptionContract` interface.
- `data` _object_: The data bound for accessing by programming.
- `oninit` _function_: Occurs on initializing.
- `onload` _function_: Occurs on loading.

<!-- End -->
---

[Next](../component/)
