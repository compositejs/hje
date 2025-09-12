你可以通过 npm 来安装本库；也可以直接下载打包后的脚本文件，并将其引入你的网页中。

## 通过 npm 并使用 ES6 或 Type Script

请在控制台/命令提示符中，转入你所在的项目目录，并执行以下命令。

```
npm i hje
```

然后引入需要使用的功能。如下示例。

```typescript
import * as Hje from 'hje';

let ele = document.createElement("div");
document.body.appendChild(ele);

Hje.render(ele, {
    children: "Hello world!"
});
```

当然，你也可以将整个模块引入。


```typescript
import * as Hje from 'hje';
```

## CommonJS

请先在控制台/命令提示符中，转入你所在的项目目录，并执行以下命令。

```
npm i datasense
```

然后引入模块。如下示例。

```typescript
const Hje = require('hje');

let ele = document.createElement("div");
document.body.appendChild(ele);

Hje.render(ele, {
    children: "Hello world!"
});
```

## 直接引入JS文件

你可以将下方其中一个打包 JS 脚本文件下载到本地（也可以直接引用），并通过 `script` 标签插入到你的页面中。

- `https://cdn.jsdelivr.net/npm/hje/dist/index.js`
- `https://unpkg.com/hje/dist/index.js`

然后，可以通过`Hje`命名空间来进行访问。如下示例。

```typescript
let ele = document.createElement("div");
document.body.appendChild(ele);

Hje.render(ele, {
    children: "Hello world!"
});
```

<!-- End -->
---

[下一页](../tohtml/)
