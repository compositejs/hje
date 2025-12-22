// Homepage
var curSite = {};
(function (curSite) {

    curSite.listModel = function (list, element) {
        if (!list) return undefined;
        const m = {
            tagName: "section"
        };
        if (list === true) {
            m.children = [{
                tagName: "em",
                styleRefs: "x-part-blog-notification",
                children: DeepX.MdBlogs.getLocaleString("loading")
            }];
            const context = element ? Hje.render(element, m) : undefined;
            DeepX.MdBlogs.fetchArticles("./articles/config.json").then(function (articles) {
                list = articles.docs().filter(function (article) {
                    return article instanceof DeepX.MdBlogs.ArticleInfo && article.isKind("featured");
                }).map(function (article) {
                    return {
                        name: article.name,
                        subtitle: article.subtitle,
                        desc: article.intro,
                        url: "./articles/?" + article.getRoutePath()
                    }
                });
                m.children = generateHomeMenuModel(list);
                if (context) context.refresh();
                return m;
            }, function (error) {
                m.children = [{
                    tagName: "em",
                    styleRefs: "x-part-blog-notification",
                    children: DeepX.MdBlogs.getLocaleString("loadFailed")
                }];
                if (context) context.refresh();
            });
            return m;
        }
        m.children = generateHomeMenuModel(list);
        if (element) Hje.render(element, m);
        return m;
    };

    function generateHomeMenuModel(list) {
        return list.map(function (item) {
            if (!item || !item.name || !item.url) return undefined;
            const text = [{ tagName: "span", children: DeepX.MdBlogs.getLocaleProp(item) }];
            if (item.desc) {
                text.push({ tagName: "br" });
                text.push({
                    tagName: "span",
                    children: [{ tagName: "span", children: DeepX.MdBlogs.getLocaleProp(item, "desc") }]
                });
            } else if (item.subtitle) {
                text.push({ tagName: "span", children: DeepX.MdBlogs.getLocaleProp(item, "subtitle") });
            }
            return {
                tagName: "a",
                props: { href: DeepX.MdBlogs.getLocaleProp(item, "url") },
                styleRefs: "link-long-button",
                children: text
            };
        }).filter(function (item) {
            return item;
        });
    }

    curSite.initHome = function (config) {
        const installStr = DeepX.MdBlogs.setElementText("title-install", "installation");
        DeepX.MdBlogs.setElementText("title-features", "features");
        DeepX.MdBlogs.setElementText("title-source", "sourceCode");
        DeepX.MdBlogs.setElementText("link-install", "getDetails");
        if (!config || !config.name) return;

        const zh = installStr === "安装";
        const installModel = [{
            tagName: "div",
            children: [{
                tagName: "span",
                children: [
                    { tagName: "span", children: zh ? "或者从下方打包后的 JS 文件中，" : "Or you can insert " },
                    { tagName: "strong", children: zh ? "挑选其中一个" : "one of" },
                    { tagName: "span", children: zh ? "，以 " : " following JavaScript bundled file by " },
                    { tagName: "code", children: "script" },
                    { tagName: "span", children: zh ? " 标签的形式插入到你的网页中。" : " tag into your web page." },
                ]
            }]
        }];
        if (!config.cdn) config.cdn = ["https://cdn.jsdelivr.net/npm/", "https://unpkg.com/"];
        for (let i = 0; i < config.cdn.length; i++) {
            const url = config.cdn[i];
            if (!url) continue;
            const cdnM = DeepX.MdBlogs.generateCdnScript(config.name, config.version, url, config.path);
            if (cdnM) installModel.push(cdnM);
        }

        const m = {
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
                        styleRefs: "x-link-more",
                        props: { href: "./articles/?installation" },
                        children: [{ tagName: "span", children: DeepX.MdBlogs.getLocaleString("getDetails") }]
                    }]
                }]
            }]
        };
        Hje.render("part-install", m);
        const tutorial = DeepX.MdBlogs.codeElements("part-tutorial");
        if (tutorial && typeof hljs === "object") {
            for (let i = 0; i < tutorial.length; i++) {
                hljs.highlightElement(tutorial[i]);
            }
        }
    };

    curSite.initWiki = function (config) {
        if (!config) config = {};
        return DeepX.MdBlogs.render("blog_content", "../articles/config.json", {
            title: true,
            banner: config.banner,
            supplement: config.supplement
        });
    };

})(curSite || (curSite = {}));
