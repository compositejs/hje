You can install this web front-end library by [npm](https://www.npmjs.com/package/hje) or by downloading the bundled file to insert a `script` tag into your web page directly.

## ES6 / Type Script via npm

```
npm i hje
```

Then you can import the ones you needed by patching. Following is a sample.

```typescript
import * as Hje from 'hje';

let ele = document.createElement("div");
document.body.appendChild(ele);

Hje.render(ele, {
    children: "Hello world!"
});
```

## CommonJS via npm

```
npm i hje
```

And you can require the library and patch what you needed. Following is a sample.

```typescript
const Hje = require('hje');

let ele = document.createElement("div");
document.body.appendChild(ele);

Hje.render(ele, {
    children: "Hello world!"
});
```

## Insert script file

You can download the [bundle file](https://raw.githubusercontent.com/compositejs/hje/master/dist/index.js) and insert it into your web page, then you can use the global namespace `Hje`. Following is a sample.

```typescript
let ele = document.createElement("div");
document.body.appendChild(ele);

Hje.render(ele, {
    children: "Hello world!"
});
```

---

[Next](./tohtml)
