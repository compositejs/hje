// Homepage
var curSite = {};
(function (curSite) {

    function genCdnScript(name, ver, url, path) {
        if (!name || !url) return undefined;
        let s = name;
        if (ver) s += "@" + ver;
        if (!path) path = "";
        else if (!path.startsWith("/")) path = "/" + path
        url += s + path;
        return {
            tagName: "div",
            styleRefs: "x-part-code",
            children: [{
                tagName: "code",
                children: [{
                    tagName: "span",
                    styleRefs: "x-code-pack",
                    children: "<"
                }, {
                    tagName: "span",
                    styleRefs: "x-code-tag",
                    children: "script"
                }, {
                    tagName: "span",
                    children: " "
                }, {
                    tagName: "span",
                    styleRefs: "x-code-attr",
                    children: "src"
                }, {
                    tagName: "span",
                    children: "="
                }, {
                    tagName: "span",
                    styleRefs: "x-code-quote",
                    children: "\""
                }, {
                    tagName: "span",
                    styleRefs: "x-code-string",
                    children: url
                }, {
                    tagName: "span",
                    styleRefs: "x-code-quote",
                    children: "\""
                }, {
                    tagName: "span",
                    styleRefs: "x-code-pack",
                    children: "/>"
                }]
            }]
        }
    }

    curSite.initHome = function (config) {
        let installStr = site.getString("installation", "title-install");
        site.getString("features", "title-features");
        site.getString("sourceCode", "title-source");
        site.getString("getDetails", "link-install");
        if (!config || !config.name) return;

        let installPart = document.getElementById("part-install");
        if (!installPart) return;
        let zh = installStr === "安装";
        let m = {
            tagName: "section",
            styleRefs: ["x-part-installation", "x-part-intro"],
            children: [{
                tagName: "div",
                children: [{
                    tagName: "img",
                    props: { alt: "npm", src: "https://static-production.npmjs.com/f1786e9b7cba9753ca7b9c40e8b98f67.png" }
                }, {
                    tagName: "div",
                    children: [{
                        tagName: "span",
                        children: [
                            { tagName: "span", children: zh ? "在你的项目中通过 " : "Install package to your project by " },
                            { tagName: "a", children: "npm", props: { href: "https://www.npmjs.com/package/" + config.name } },
                            { tagName: "span", children: zh ? " 安装本包。" : "." }
                        ]
                    }]
                }, {
                    tagName: "div",
                    styleRefs: "x-part-code",
                    children: [{
                        tagName: "span",
                        children: ">"
                    }, {
                        tagName: "code",
                        children: [
                            { tagName: "span", styleRefs: "x-code-command", children: "npm" },
                            { tagName: "span", styleRefs: "x-code-args", children: " i " + config.name }
                        ]
                    }]
                }]
            }, {
                tagName: "div",
                children: [{
                    tagName: "div",
                    children: [{
                        tagName: "span",
                        children: [
                            { tagName: "span", children: zh ? "或者也可以将下方打包后的 JS 文件" : "Or you can insert " },
                            { tagName: "strong", children: zh ? "之一" : "one of" },
                            { tagName: "span", children: zh ? "以 " : " following JavaScript bundled file by " },
                            { tagName: "code", children: "script" },
                            { tagName: "span", children: zh ? " 标签的形式插入到你的网页中。" : " tag into your web page." },
                        ]
                    }]
                }, genCdnScript(config.name, config.version, "https://cdn.jsdelivr.net/npm/", config.path), genCdnScript(config.name, config.version, "https://unpkg.com/", config.path)]
            }, {
                tagName: "div",
                children: [{
                    tagName: "div",
                    children: [{
                        tagName: "a",
                        props: { href: "./articles/?installation" },
                        children: [{ tagName: "span", children: site.getString("getDetails") }]
                    }]
                }]
            }]
        };
        Hje.render(installPart, m);
    };

})(curSite || (curSite = {}));
