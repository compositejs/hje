"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var DeepX;
(function (DeepX) {
    var MdBlogs;
    (function (MdBlogs) {
        MdBlogs.hooks = {
            renderMd: undefined,
            fetchList: undefined,
        };
        function showElements(show, hide) {
            if (show)
                show.forEach(function (ele) {
                    const element = document.getElementById(ele);
                    if (element)
                        element.style.display = "";
                });
            if (hide)
                hide.forEach(function (ele) {
                    const element = document.getElementById(ele);
                    if (element)
                        element.style.display = "none";
                });
        }
        MdBlogs.showElements = showElements;
        ;
        function codeElements(element) {
            if (!element)
                return undefined;
            if (typeof element === "string") {
                element = document.getElementById(element);
                if (!element)
                    return undefined;
            }
            const blocks = element.getElementsByTagName("pre");
            const arr = [];
            if (!blocks)
                return;
            for (let i = 0; i < blocks.length; i++) {
                const block = blocks[i].children.length > 0 ? blocks[i].children[0] : undefined;
                if (block)
                    arr.push(block);
            }
            return arr;
        }
        MdBlogs.codeElements = codeElements;
        function generateMenu(params, options) {
            var _a;
            if (!options)
                options = {};
            if (!params || params.length < 1)
                return {
                    tagName: "ul",
                    className: options.className
                };
            const arr = options.arr || [];
            const deep = options.deep;
            const localeOptions = options.mkt != null ? { mkt: options.mkt } : undefined;
            const level = deep === true ? 1 : (typeof deep === "number" && deep >= 0 ? (deep + 1) : 0);
            let group = undefined;
            let label;
            const now = new Date();
            for (let i = 0; i < params.length; i++) {
                const article = params[i];
                if (typeof article === "string") {
                    label = article;
                    continue;
                }
                if (label) {
                    arr.push({
                        tagName: "li",
                        className: "grouping-header",
                        children: label
                    });
                    label = undefined;
                }
                if (!article || !article.name || !(article instanceof MdBlogs.ArticleInfo))
                    continue;
                const y = (_a = article.dateObj) === null || _a === void 0 ? void 0 : _a.year;
                const isThisYear = now.getFullYear() === y;
                if ((deep === false || deep === -2) && y && y != group) {
                    group = y;
                    const groupName = isThisYear ? MdBlogs.getLocaleString("thisYear") : (typeof group === "number" ? group.toString(10) : group);
                    arr.push({
                        tagName: "li",
                        className: "grouping-header",
                        children: groupName
                    });
                }
                const path = genArticlePath(article, options.path, localeOptions);
                const result = generateMenuItemInternal(article, (deep === -1 || deep === -2) ? deep : level, path, options.click, localeOptions);
                const hasSelected = options.select === article;
                if (hasSelected)
                    result.className = "state-sel";
                if (typeof options.render === "function")
                    options.render(result, article, {
                        level,
                        mkt: options.mkt,
                        select: hasSelected,
                        path,
                    });
                arr.push(result);
                if (level < 1)
                    continue;
                const children = article.children(localeOptions);
                generateMenu(children, {
                    arr,
                    select: options.select,
                    mkt: options.mkt,
                    path: options.path,
                    deep: level,
                    render: options.render,
                });
            }
            return {
                tagName: "ul",
                className: options.className,
                children: arr
            };
        }
        MdBlogs.generateMenu = generateMenu;
        /**
         * Generates the description model of the specific articles.
         * @param articles The URL or promise object to fetch articles.
         * @param filter The handler to filter the articles to display.
         * @param options Additional options.
         * @returns A promise object of description model. It is a `ul` element.
         */
        function generateMenuPromise(articles, filter, options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!articles)
                    return undefined;
                if (typeof articles === "string")
                    articles = MdBlogs.fetchArticles(articles);
                const result = yield articles;
                if (!result)
                    return undefined;
                if (!options)
                    options = {};
                if (typeof options.onfetch === "function")
                    options.onfetch({
                        articles: result,
                        mkt: options.mkt,
                        store: undefined,
                    });
                let arr;
                if (!filter) {
                    arr = [
                        ...result.docs({ mkt: options.mkt }),
                        ...result.blog({ mkt: options.mkt })
                    ];
                }
                else if (typeof filter === "function") {
                    arr = filter(result);
                }
                else if (filter === "blogs" || filter === "blog") {
                    arr = result.blog({ mkt: options.mkt });
                }
                else if (filter === "docs" || filter === "wiki") {
                    arr = result.docs({ mkt: options.mkt });
                }
                else {
                    return undefined;
                }
                return generateMenu(arr, options);
            });
        }
        MdBlogs.generateMenuPromise = generateMenuPromise;
        function generateMenuItem(article, level, path, click, options) {
            path = genArticlePath(article, path, options);
            return generateMenuItemInternal(article, level, path, click, options);
        }
        MdBlogs.generateMenuItem = generateMenuItem;
        function generateCdnScript(name, ver, url, path) {
            if (!name || !url)
                return undefined;
            let s = name;
            if (ver)
                s += "@" + ver;
            if (!path)
                path = "";
            else if (!path.startsWith("/"))
                path = "/" + path;
            url += s + path;
            return {
                tagName: "div",
                className: "x-part-code",
                children: [{
                        tagName: "code",
                        children: [{
                                tagName: "span",
                                className: "x-code-pack",
                                children: "<"
                            }, {
                                tagName: "span",
                                className: "x-code-tag",
                                children: "script"
                            }, {
                                tagName: "span",
                                children: " "
                            }, {
                                tagName: "span",
                                className: "x-code-attr",
                                children: "type"
                            }, {
                                tagName: "span",
                                children: "="
                            }, {
                                tagName: "span",
                                className: "x-code-quote",
                                children: "\""
                            }, {
                                tagName: "span",
                                className: "x-code-string",
                                children: "text/javascript"
                            }, {
                                tagName: "span",
                                className: "x-code-quote",
                                children: "\""
                            }, {
                                tagName: "span",
                                children: " "
                            }, {
                                tagName: "span",
                                className: "x-code-attr",
                                children: "src"
                            }, {
                                tagName: "span",
                                children: "="
                            }, {
                                tagName: "span",
                                className: "x-code-quote",
                                children: "\""
                            }, {
                                tagName: "span",
                                className: "x-code-string",
                                children: url
                            }, {
                                tagName: "span",
                                className: "x-code-quote",
                                children: "\""
                            }, {
                                tagName: "span",
                                className: "x-code-pack",
                                children: " ></"
                            }, {
                                tagName: "span",
                                className: "x-code-tag",
                                children: "script"
                            }, {
                                tagName: "span",
                                className: "x-code-pack",
                                children: ">"
                            }]
                    }]
            };
        }
        MdBlogs.generateCdnScript = generateCdnScript;
        function generateMenuItemInternal(article, level, path, click, options) {
            const mkt = options === null || options === void 0 ? void 0 : options.mkt;
            const localeOptions = mkt != null ? { mkt: mkt } : undefined;
            const intro = article.getIntro(localeOptions);
            let tips = intro;
            let title = article.getName(localeOptions);
            const subtitle = article.getSubtitle(localeOptions);
            if (!tips) {
                tips = title;
                if (subtitle)
                    tips += "\n" + subtitle;
            }
            if (level > 1) {
                let prefix = "";
                for (let j = 2; j < level; j++) {
                    prefix += "　";
                }
                prefix += "▹ ";
                title = prefix + title;
            }
            const nameClassName = MdBlogs.getCaseClassName({ nameCase: article.getOptions("nameCase") }, "nameCase", localeOptions);
            const text = {
                tagName: "a",
                props: { href: path, title: tips },
                on: {
                    click(ev) {
                        if (typeof click === "function")
                            click(ev, article);
                    }
                },
                children: subtitle ? [{
                        tagName: "span",
                        className: nameClassName,
                        children: title
                    }, {
                        tagName: "span",
                        children: subtitle
                    }] : title
            };
            if (!subtitle)
                text.className = nameClassName;
            const result = {
                tagName: "li",
                props: {},
                children: [text],
                data: {
                    article,
                }
            };
            const dateStr = article.dateString;
            if (!intro && !dateStr)
                return result;
            if (level === -1) {
                if (typeof text.children === "string")
                    text.children = [{
                            tagName: "span",
                            children: text.children
                        }];
                if (text.children instanceof Array) {
                    const publishDate = article.dateObj;
                    if (publishDate && dateStr)
                        text.children.push({ tagName: "br" }, {
                            tagName: "time",
                            className: "x-font-size-s",
                            props: {
                                datetime: `${publishDate.year.toString(10)}-${publishDate.month.toString(10)}-${publishDate.date.toString(10)}`
                            },
                            children: dateStr
                        });
                    text.children.push({ tagName: "br" });
                    text.children.push({ tagName: "span", children: intro });
                }
            }
            else if (level === -2) {
                const firstLine = {
                    tagName: "div",
                    children: [{
                            tagName: "strong",
                            className: nameClassName,
                            children: title
                        }, {
                            tagName: "span",
                            children: subtitle
                        }]
                };
                const publishDate = article.dateObj;
                const secondLine = {
                    tagName: "div",
                    children: publishDate ? [{
                            tagName: "time",
                            props: {
                                datetime: `${publishDate.year.toString(10)}-${publishDate.month.toString(10)}-${publishDate.date.toString(10)}`
                            },
                            children: article.dateString
                        }] : []
                };
                const thumb = article.getThumb("wide");
                if (thumb)
                    secondLine.children.push({
                        tagName: "img",
                        props: {
                            alt: title,
                            src: thumb
                        }
                    });
                text.children = [firstLine, secondLine];
                if (intro)
                    text.children.push({
                        tagName: "div",
                        children: [{
                                tagName: "span",
                                children: intro
                            }]
                    });
                if (text.props)
                    delete text.props.title;
            }
            return result;
        }
        function genArticlePath(article, path, localeOptions) {
            let path1 = `${typeof path === "string" ? path : ""}?${article.getRoutePath(localeOptions)}`;
            if (typeof path === "function") {
                const path2 = path(path1, article);
                if (path2)
                    path1 = path2;
            }
            return path1;
        }
        function buttonList(config) {
            if (!config)
                return undefined;
            let m = {};
            if (config.className)
                m.className = config.className;
            if (config.style)
                m.style = config.style;
            if (config.props)
                m.props = config.props;
            if (config.data)
                m.data = config.data;
            if (config.item === true) {
                if (!config.text)
                    return undefined;
                m.tagName = "a";
                m.children = Hje.toSpan(config.text, true);
                if (typeof config.click === "function")
                    m.on = {
                        click(ev) {
                            if (typeof config.click === "function")
                                config.click(ev);
                        }
                    };
                return m;
            }
            let itemConfig = config.item || {};
            m.children = [];
            if (config.list instanceof Array) {
                for (let i = 0; i < config.list.length; i++) {
                    let item = config.list[i];
                    if (!item)
                        continue;
                    if (typeof item === "number")
                        item = item.toString(10);
                    if (typeof item === "string") {
                        m.children.push({
                            tagName: "span",
                            className: config.groupclassName,
                            children: item
                        });
                        continue;
                    }
                    if (item === true) {
                        m.children.push({
                            tagName: "br"
                        });
                        continue;
                    }
                    let itemProps = {};
                    if (item.url)
                        itemProps.href = item.url;
                    if (item.title)
                        itemProps.title = item.title;
                    const button = buttonList({
                        text: item.text,
                        className: item.className || itemConfig.className,
                        style: item.style || itemConfig.style,
                        props: itemProps,
                        click: item.click || itemConfig.click,
                        item: true
                    });
                    if (button)
                        m.children.push(button);
                }
            }
            return m;
        }
        MdBlogs.buttonList = buttonList;
    })(MdBlogs = DeepX.MdBlogs || (DeepX.MdBlogs = {}));
})(DeepX || (DeepX = {}));
//# sourceMappingURL=elements.js.map