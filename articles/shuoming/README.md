Hyper-JSON Engine 是一个将 JSON 描述模型转换为 HTML 视图的前端库。

## 安装和引用

通过执行以下命令，可以从 [npm](https://www.npmjs.com/package/hje) 来安装。

```sh
npm i datasense
```

另外，你还可以将以下其中一个打包 JS 脚本文件下载到本地（也可以直接引用），并通过 `script` 标签插入到你的页面中。

- `https://cdn.jsdelivr.net/npm/hje/dist/index.js`
- `https://unpkg.com/hje/dist/index.js`

具体安装和引用方法，请[点击此处](../install/zh.md)来进行了解。

## 功能

Hyper-JSON Engine (`Hje`) 提供一种通过 JS 描述视图的方案，并可扩展创建事件与绑定，最终生成 HTML 模块或其它自定义视图。

- [JSON → HTML](../tohtml/chs.md) - 从 JSON 生成 HTML。
- [Component](../component/chs.md) - 组件。

## 编译和测试

编译之前，需要先确保安装有 `terser` 和 `tsc`。然后执行以下命令即可编译。

```sh
npm run build
```

编译之后，还可以通过执行以下命令来运行所有的单元测试。

```sh
npm test
```

## 许可

本项目基于 [MIT 许可](https://github.com/compositejs/hje/blob/master/LICENSE)授权，欢迎使用。你也可以根据需要 clone 或 folk 本仓库。
