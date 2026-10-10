# Hyper-JSON Engine

This is a javascript library to generate HTML view by JSON.

[简体中文](https://github.com/compositejs/hje/articles/shuoming)

## Installation and Usage

You can install this by [npm](https://www.npmjs.com/package/hje).

```sh
npm i hje
```

And you can also insert one of following JavaScript bundled file by `script` tag into your web page directly and use `Hje` namespace to access.

- `https://cdn.jsdelivr.net/npm/hje/dist/index.js`
- `https://unpkg.com/hje/dist/index.js`

[Click here](https://github.com/compositejs/hje/wiki/installation) to read more.

## Features

Hyper-Json Engine (Hje) provides a way to describe the view by JavaScript with event and binding. It can render to HTML or customized view by the description model.

You can use this to convert a JSON model to HTML view part. Following is a sample.

```typescript
import * as Hje from 'hje';

let ele = document.createElement("div");
document.body.appendChild(ele);

Hje.render(ele, {
  attr: {
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

- [JSON → HTML](https://github.com/compositejs/hje/wiki/tohtml)
- [Component](https://github.com/compositejs/hje/wiki/component)

## Building / Testing

You need install `gulp` and `tsc` to build. Following is the command line to build this project including the source and test cases.

```sh
npm run-script build
```

You can run all test cases after building by following command line.

```sh
npm test
```

## Readme in other languages

- [简体中文](https://github.com/compositejs/hje/wiki/shuoming)

## License

This project is [MIT Licensed](./LICENSE).

Please feel free to import this into your project. And you can also clone or fork the repository as you want.
