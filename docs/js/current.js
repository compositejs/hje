// Homepage
var curSite = {};
(function (curSite) {

    curSite.listModel = function (list, element) {
        if (!list) return undefined;
        let m = {
            tagName: "section",
            children: list.map(function (item) {
                if (!item || !item.name || !item.url) return undefined;
                let text = [{ tagName: "span", children: item.name }];
                if (item.desc) {
                    text.push({ tagName: "br" });
                    text.push({
                        tagName: "span",
                        children: [{ tagName: "span", children: item.desc }]
                    });
                } else if (item.subtitle) {
                    text.push({ tagName: "span", children: item.subtitle });
                }
                return {
                    tagName: "a",
                    props: { href: item.url },
                    styleRefs: "link-long-button",
                    children: text
                };
            }).filter(function (item) {
                return item;
            })
        };
        if (element) {
            if (typeof element === "string") element = document.getElementById(element);
            if (element.tagName) Hje.render(element, m);
        }

        return m;
    };

    curSite.initHome = function (config) {
        let installStr = site.getString("installation", "title-install");
        site.getString("features", "title-features");
        site.getString("sourceCode", "title-source");
        site.getString("getDetails", "link-install");
        if (!config || !config.name) return;

        let zh = installStr === "安装";
        let installModel = [{
            tagName: "div",
            children: [{
                tagName: "span",
                children: [
                    { tagName: "span", children: zh ? "或者也可以将下方打包后的 JS 文件" : "Or you can insert " },
                    { tagName: "strong", children: zh ? "之一" : "one of" },
                    { tagName: "span", children: zh ? "，以 " : " following JavaScript bundled file by " },
                    { tagName: "code", children: "script" },
                    { tagName: "span", children: zh ? " 标签的形式插入到你的网页中。" : " tag into your web page." },
                ]
            }]
        }];
        if (!config.cdn) config.cdn = ["https://cdn.jsdelivr.net/npm/", "https://unpkg.com/"];
        for (let i = 0; i < config.cdn.length; i++) {
            let url = config.cdn[i];
            if (!url) continue;
            let cdnM = site.cdnModel(config.name, config.version, url, config.path);
            if (cdnM) installModel.push(cdnM);
        }

        let m = {
            tagName: "section",
            styleRefs: ["x-part-installation", "x-part-intro"],
            children: [{
                tagName: "div",
                styleRefs: "x-bg-stars",
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
                        styleRefs: "x-part-code",
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
                styleRefs: "x-bg-stars",
                children: installModel
            }, {
                tagName: "div",
                styleRefs: "x-bg-stars",
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
        Hje.render("part-install", m);
    };

    curSite.initWiki = function (config) {
        if (!config) config = {};
        if (!config.rootPath) config.rootPath = "articles";
        if (!config.menuPath) config.menuPath = site.getString("name") === "名称" ? "zh-Hans.json" : "en.json";
        site.blogs(config);
    }

})(curSite || (curSite = {}));
