"use strict";
var DeepX;
(function (DeepX) {
    var MdBlogs;
    (function (MdBlogs) {
        class ArticlesPart extends Hje.DataComponent {
            constructor(args) {
                super(args);
                this.internal.mkt = this.data("mkt");
                this.childrenAccess.set([{
                        key: "content",
                        tagName: "article",
                        children: []
                    }, {
                        tagName: "aside",
                        children: [{
                                tagName: "nav",
                                children: [{
                                        key: "contents",
                                        tagName: "ul",
                                        className: "link-tile-compact",
                                        children: [],
                                        style: { display: "none" }
                                    }, {
                                        key: "title",
                                        tagName: "h1",
                                        style: { display: "none" }
                                    }, {
                                        key: "menu",
                                        tagName: "ul",
                                        className: "link-tile-compact",
                                        children: []
                                    }, {
                                        key: "linksTitle",
                                        tagName: "h1",
                                        style: { display: "none" }
                                    }, {
                                        key: "links",
                                        tagName: "ul",
                                        className: "link-tile-compact",
                                        children: [],
                                        style: { display: "none" }
                                    }]
                            }]
                    }]);
                const lifecycle = this.data("lifecycle") || { disable: true };
                this.internal.lifecycle = lifecycle;
                const { articles, onfetch, store } = this.data();
                if (typeof articles === "string") {
                    MdBlogs.fetchArticles(articles).then(r => {
                        if (typeof onfetch === "function")
                            onfetch({
                                articles: r,
                                mkt: this.internal.mkt,
                                store
                            });
                        this.initRender(r, this.data("select"), this.data("q"), lifecycle);
                    });
                }
                else if (articles instanceof MdBlogs.Articles) {
                    if (typeof onfetch === "function")
                        onfetch({
                            articles,
                            mkt: this.internal.mkt,
                            store,
                        });
                    this.initRender(articles, this.data("select"), this.data("q"), lifecycle);
                }
            }
            get title() {
                return this.internal.title;
            }
            set title(value) {
                this.internal.title = value;
                const self = this;
                const c = super.getChild("title");
                c.setChildren([{
                        tagName: "a",
                        props: { href: "./" },
                        on: {
                            click(ev) {
                                ev.preventDefault();
                                self.home();
                            }
                        },
                        children: value
                    }]);
                c.style(value ? {} : { display: "none" });
            }
            get mkt() {
                return this.internal.mkt;
            }
            set mkt(value) {
                this.internal.mkt = value;
            }
            defs(key) {
                var _a;
                return (_a = this.internal.info) === null || _a === void 0 ? void 0 : _a.defs(key);
            }
            home(q) {
                var _a, _b;
                const already = !this.internal.select;
                this.internal.select = null;
                const children = [];
                const info = this.internal.info;
                if (!info)
                    return;
                const config = info.options;
                const options = this.createLocaleOptions();
                if (!config.disableName) {
                    children.push({
                        tagName: "h1",
                        children: info.getName(options)
                    });
                    const desc = info.getDescription(options);
                    if (desc)
                        children.push({
                            tagName: "p",
                            children: info.getDescription(options)
                        });
                }
                const { banner, supplement, onhome } = this.data(["banner", "supplement", "onhome"]);
                if (banner)
                    children.push(banner);
                const part = info.home(options);
                if (part)
                    children.push({
                        tagName: "main",
                        lifecycle: {
                            load(c) {
                                if (part.contentCache)
                                    renderMd(c.element, part.contentCache, info.string("renderFailed", options));
                                else
                                    part.getContent(options).then(r => {
                                        renderMd(c.element, r, info.string("renderFailed", options));
                                    });
                            },
                        },
                        children: part.contentCache
                    });
                const self = this;
                const listRef = {};
                const ul = this.genArticleList(q, options);
                ul.lifecycle = {
                    init(c) {
                        listRef.list = c;
                    }
                };
                const main = !config.disableSearch && (q || ul.children.length > 10) ? [{
                        tagName: "div",
                        className: "x-part-blog-search",
                        children: [{
                                tagName: "input",
                                props: {
                                    type: "search",
                                    name: "blog-search",
                                    value: q || "",
                                    maxLength: 60,
                                    placeholder: getLocalOptions(config, "search", "search", options),
                                },
                                on: {
                                    input(ev) {
                                        if (listRef.search) {
                                            clearTimeout(listRef.search);
                                            listRef.search = undefined;
                                        }
                                        if (!listRef.list)
                                            return;
                                        listRef.search = setTimeout(() => {
                                            if (!listRef.list)
                                                return;
                                            const ul = self.genArticleList(ev.target.value, options);
                                            listRef.list.setChildren(ul.children);
                                            listRef.list.className(ul.className);
                                        }, 600);
                                    }
                                }
                            }]
                    }, ul] : [ul];
                children.push({
                    tagName: "main",
                    className: "x-part-blog-menu",
                    children: main
                });
                const links = info.links(options);
                if (links.length > 0) {
                    main.push({
                        tagName: "h2",
                        children: getLocalOptions(config, "linksTitle", "otherLinks", options)
                    }, {
                        tagName: "section",
                        className: "link-tile-wide",
                        children: links.map(link => generateLink(link))
                    });
                }
                if (supplement)
                    children.push(supplement);
                const model = super.getChild("content");
                model.setChildren(children);
                const contentsModel = super.getChild("contents");
                contentsModel.clearChildren();
                contentsModel.style({ display: "none" });
                MdBlogs.scrollToTop();
                if (typeof onhome === "function")
                    onhome({
                        model,
                        mkt: options === null || options === void 0 ? void 0 : options.mkt,
                        store: this.data("store"),
                        defs(key) {
                            return self.defs(key);
                        },
                        relative(path) {
                            return info.relative(path).value;
                        },
                    });
                this.refreshMenu();
                if (!already)
                    (_b = (_a = this.lifecycle()) === null || _a === void 0 ? void 0 : _a.onhome) === null || _b === void 0 ? void 0 : _b.call(_a, this);
                info.loadMoreBlog();
            }
            select(article) {
                var _a, _b, _c, _d;
                const info = this.internal.info;
                if (!info)
                    return;
                const options = this.createLocaleOptions();
                if (typeof article === "number") {
                    if (article === -1) {
                        this.home();
                        return undefined;
                    }
                    if (isNaN(article) || article < 0)
                        return this.internal.select;
                    const blog = info === null || info === void 0 ? void 0 : info.blog(options);
                    if (!blog)
                        return undefined;
                    article = blog[article];
                    if (!article)
                        return undefined;
                }
                else if (typeof article === "string") {
                    if (!article) {
                        this.home();
                        return undefined;
                    }
                    article = info === null || info === void 0 ? void 0 : info.get(article, options);
                    if (!article)
                        return undefined;
                }
                if (!article || this.internal.select === article)
                    return this.internal.select;
                const children = [];
                const self = this;
                const title = article.getName(options);
                let banner = article.bannerImage;
                banner = typeof banner === "string" ? { url: banner } : banner;
                if (banner === null || banner === void 0 ? void 0 : banner.url) {
                    const bannerStyle = {};
                    if (banner.maxHeight && typeof banner.maxHeight === "number")
                        bannerStyle.maxHeight = `${banner.maxHeight.toString(10)}px`;
                    if (banner.cover) {
                        bannerStyle.objectFit = "cover";
                        bannerStyle.width = "100%";
                    }
                    children.push({
                        tagName: "section",
                        className: "x-part-blog-note",
                        children: [{
                                tagName: "div",
                                className: "x-part-blog-banner",
                                children: [{
                                        tagName: "img",
                                        props: {
                                            alt: banner.name || title,
                                            src: banner.url.startsWith(".") ? info.relative(banner.url) : banner.url
                                        },
                                        style: bannerStyle
                                    }]
                            }]
                    });
                }
                children.push({
                    tagName: "h1",
                    children: title,
                    className: MdBlogs.getCaseClassName({ nameCase: article.getOptions("nameCase") }, "nameCase", options),
                });
                const infoModel = {
                    tagName: "section",
                    className: "x-part-blog-note",
                    children: []
                };
                const subtitle = article.getSubtitle(options);
                if (subtitle)
                    infoModel.children.push({
                        tagName: "div",
                        className: "x-part-blog-subtitle",
                        children: [{
                                tagName: "strong",
                                children: subtitle
                            }]
                    });
                const disableAuthors = article.disableAuthors || info.options.disableAuthors;
                if (!disableAuthors) {
                    let infoChildren = getMembersModel(MdBlogs.toMembers((_a = article.authors) === null || _a === void 0 ? void 0 : _a.priorityList()), null, options);
                    if (infoChildren.length > 0)
                        infoModel.children.push({
                            tagName: "div",
                            className: "x-part-blog-authors",
                            children: infoChildren
                        });
                    const publishDate = article.dateObj;
                    if (publishDate) {
                        const dateArr = [{
                                tagName: "time",
                                props: {
                                    datetime: `${publishDate.year.toString(10)}-${publishDate.month.toString(10)}-${publishDate.date.toString(10)}`
                                },
                                children: article.dateString || publishDate.year.toString(10)
                            }];
                        if (article.location)
                            dateArr.push({
                                tagName: "span",
                                children: typeof article.location === "string" ? article.location : MdBlogs.getLocaleProp(article.location, null, options)
                            });
                        if (infoChildren.length === 1) {
                            infoChildren.push(dateArr[0]);
                            if (dateArr.length > 1)
                                infoChildren.push(dateArr[1]);
                        }
                        else {
                            infoModel.children.push({
                                tagName: "div",
                                className: "x-part-blog-date",
                                children: dateArr
                            });
                        }
                    }
                }
                if (infoModel.children.length > 0)
                    children.push(infoModel);
                const mkt = options === null || options === void 0 ? void 0 : options.mkt;
                children.push({
                    tagName: "main",
                    children: [{
                            tagName: "div",
                            className: "x-part-blog-notification",
                            children: [{ tagName: "em", children: self.string("loading", options) }]
                        }],
                    lifecycle: {
                        init(c) {
                            if (!c || c.data("state"))
                                return;
                            c.data("state", "pending");
                            const config = info.options;
                            article.getContent(options).then(md => {
                                c.data("state", "render");
                                const mdEle = c.element;
                                renderMd(mdEle, md, self.string("renderFailed", options));
                                c.data("state", "done");
                                if (article.disableMenu || config.disableMenu)
                                    return;
                                getContentsModel(mdEle, self.getChild("contents"), self.string("top", options));
                            }, err => {
                                c.data("state", "error");
                                c.setChildren([{
                                        tagName: "div",
                                        className: "x-part-blog-notification",
                                        children: [{ tagName: "em", children: self.string("loadFailed", options) }]
                                    }]);
                            });
                        },
                    }
                });
                const related = [];
                fillParagraph(article.getNotes(options), related);
                if ((_b = article.gallery) === null || _b === void 0 ? void 0 : _b.length) {
                    related.push({
                        tagName: "h2",
                        children: [{
                                tagName: "span",
                                children: getLocalOptions(info.options, "galleryTitle", "relatedGallery", options),
                            }]
                    }, {
                        tagName: "div",
                        children: article.gallery.map(gallery => {
                            var _a, _b, _c, _d;
                            const mktOptions = mkt ? { mkt } : undefined;
                            const name = MdBlogs.getLocaleProp(gallery, null, mktOptions);
                            if (!name || MdBlogs.getLocaleProp(gallery, "disable", mktOptions))
                                return undefined;
                            const elementItems = [];
                            if (gallery.icon)
                                elementItems.push({
                                    tagName: "img",
                                    props: {
                                        src: (_a = info.relative(gallery.icon)) === null || _a === void 0 ? void 0 : _a.toString(),
                                        alt: name
                                    }
                                });
                            elementItems.push({
                                tagName: "span",
                                className: MdBlogs.getCaseClassName(gallery.options, "nameCase", mktOptions),
                                children: name,
                            });
                            const subtitle = MdBlogs.getLocaleProp(gallery, "subtitle", mktOptions);
                            if (subtitle)
                                elementItems.push({
                                    tagName: "span",
                                    children: [{
                                            tagName: "span",
                                            className: MdBlogs.getCaseClassName(gallery.options, "subtitleCase", mktOptions),
                                            children: subtitle,
                                        }]
                                });
                            const url = ((_b = gallery.options) === null || _b === void 0 ? void 0 : _b.url) || ((_c = self.callDataHandler("galleryUrl", null, gallery)) === null || _c === void 0 ? void 0 : _c.result);
                            return {
                                tagName: "a",
                                className: "link-long-button",
                                props: {
                                    href: url ? (_d = info.relative(url)) === null || _d === void 0 ? void 0 : _d.toString() : "javascript:void 0;",
                                },
                                children: elementItems,
                            };
                        }).filter(ele => !!ele),
                    });
                    const galleryTips = MdBlogs.getLocaleProp(info.options, "galleryTips", options);
                    if (galleryTips)
                        related.push({
                            tagName: "div",
                            className: "x-part-footnote",
                            children: [{
                                    tagName: "span",
                                    children: galleryTips,
                                }]
                        });
                }
                fillKeywords(article.keywords, related, getLocalOptions(info.options, "keywordsTitle", "keywords", options), options);
                if (!disableAuthors)
                    fillContributors(article.authors, related, getLocalOptions(info.options, "contentCreatorTitle", "contentCreator", options), options);
                fillRelatedLinks(article.related(options), related, getLocalOptions(info.options, "seeAlsoTitle", "seeAlso", options), options);
                if (related.length > 0)
                    children.push({
                        tagName: "section",
                        className: "x-part-blog-related",
                        children: related
                    });
                const previous = info.previousArticle(article, options);
                const next = info.nextArticle(article, options);
                const parent = info.parentArticle(article, options);
                if (previous || next)
                    children.push({
                        tagName: "section",
                        className: "x-part-blog-next",
                        children: [{
                                tagName: "a",
                                props: {
                                    href: "javascript:void(0)",
                                    title: tipArticleName("previous", previous, options)
                                },
                                on: {
                                    click(ev) {
                                        ev.preventDefault();
                                        if (previous)
                                            self.select(previous);
                                        else
                                            self.home();
                                    }
                                },
                                children: [
                                    { "tagName": "span", children: "<" },
                                    { "tagName": "span", children: getLocalOptions(info.options, "previous", "previous", options) },
                                ]
                            }, {
                                tagName: "a",
                                props: {
                                    href: "javascript:void(0)",
                                    title: tipArticleName("next", next, options)
                                },
                                on: {
                                    click(ev) {
                                        ev.preventDefault();
                                        if (next)
                                            self.select(next);
                                        else
                                            self.home();
                                    }
                                },
                                children: [
                                    { "tagName": "span", children: getLocalOptions(info.options, "next", "next", options) },
                                    { "tagName": "span", children: ">" },
                                ]
                            }]
                    });
                else
                    children.push({
                        tagName: "section",
                        className: "x-part-blog-back",
                        children: [{
                                tagName: "a",
                                props: {
                                    href: "javascript:void(0)",
                                    title: tipArticleName("back", parent, options)
                                },
                                on: {
                                    click(ev) {
                                        ev.preventDefault();
                                        if (parent)
                                            self.select(parent);
                                        else
                                            self.home();
                                    }
                                },
                                children: [
                                    { "tagName": "span", children: "<" },
                                    { "tagName": "span", children: getLocalOptions(info.options, "back", "back", options) },
                                ]
                            }]
                    });
                self.callDataHandler("onselect", null, {
                    children,
                    article,
                    mkt,
                    store: self.data("store"),
                    defs(key) {
                        return self.defs(key);
                    },
                    relative(path) {
                        return info.relative(path).value;
                    },
                    insertChildren(position, ...models) {
                        if (typeof position === "number") {
                            children.splice(position, 0, ...models);
                            return;
                        }
                        if (!position)
                            position = "end";
                        if (position === "last") {
                            children.push(...models);
                            return;
                        }
                        let insertion = 0;
                        for (let i = 0; i < children.length; i++) {
                            insertion++;
                            if (children[i] && children[i].tagName === "main")
                                break;
                        }
                        if (position === "start") {
                            insertion--;
                            if (insertion < 0)
                                insertion = 0;
                        }
                        else if (position !== "end") {
                            return;
                        }
                        children.splice(insertion, 0, ...models);
                    }
                });
                const model = super.getChild("content");
                model.setChildren(children);
                this.internal.select = article;
                this.refreshMenu();
                MdBlogs.scrollToTop();
                (_d = (_c = this.lifecycle()) === null || _c === void 0 ? void 0 : _c.onselect) === null || _d === void 0 ? void 0 : _d.call(_c, this, article);
                return article;
            }
            next() {
                var _a;
                const options = this.createLocaleOptions();
                const blog = (_a = this.internal.info) === null || _a === void 0 ? void 0 : _a.nextArticle(this.internal.select, options);
                if (blog === undefined)
                    return blog;
                if (blog === null) {
                    this.home();
                    return blog;
                }
                this.select(blog);
                return blog;
            }
            previous() {
                var _a;
                const options = this.createLocaleOptions();
                const blog = (_a = this.internal.info) === null || _a === void 0 ? void 0 : _a.previousArticle(this.internal.select, options);
                if (blog === undefined)
                    return blog;
                if (blog === null) {
                    this.home();
                    return blog;
                }
                this.select(blog);
                return blog;
            }
            parent() {
                var _a;
                const options = this.createLocaleOptions();
                const blog = (_a = this.internal.info) === null || _a === void 0 ? void 0 : _a.parentArticle(this.internal.select, options);
                if (blog === undefined)
                    return blog;
                if (blog === null) {
                    this.home();
                    return blog;
                }
                this.select(blog);
                return blog;
            }
            initRender(articles, select, q, lifecycle) {
                var _a;
                if (this.internal.info === articles || !articles)
                    return;
                this.internal.info = articles;
                const options = this.createLocaleOptions();
                this.title = articles.getName(options);
                let arr = [];
                this.genMenu(arr, articles.docs(options), true);
                this.genMenu(arr, articles.blog(options), false);
                const menu = super.getChild("menu");
                menu.setChildren(arr);
                menu.style(arr.length > 0 ? {} : { display: "none" });
                const linkModels = this.internal.info.links(options).map(item => {
                    return {
                        tagName: "li",
                        children: [generateLink(item)]
                    };
                });
                const linksStyle = linkModels.length > 0 ? {} : { display: "none" };
                const linksComponent = super.getChild("links");
                linksComponent.setChildren(linkModels);
                linksComponent.style(linksStyle);
                const linksTitleComponent = super.getChild("linksTitle");
                linksTitleComponent.setChildren(((_a = articles.options) === null || _a === void 0 ? void 0 : _a.linksTitle) || getLocalOptions(this.internal.info.options, "otherLinksTitle", "otherLinks", options));
                linksTitleComponent.style(linksStyle);
                let article;
                if (select)
                    article = this.select(select);
                if (!article)
                    this.home(q);
                if (!lifecycle.disable && typeof lifecycle.oninit === "function")
                    lifecycle.oninit(this);
            }
            refreshMenu() {
                const menu = super.getChild("menu");
                menu.forEachChild(item => {
                    const data = item.data("article");
                    if (!(data instanceof MdBlogs.ArticleInfo))
                        return;
                    if (data === this.internal.select) {
                        if (item.className().indexOf("state-sel") < 0)
                            item.className({ add: "state-sel" });
                    }
                    else {
                        if (item.className().indexOf("state-sel") >= 0)
                            item.className({ remove: "state-sel" });
                    }
                });
            }
            createLocaleOptions() {
                const mkt = this.internal.mkt;
                return mkt == null || mkt === true ? undefined : { mkt };
            }
            lifecycle() {
                const l = this.internal.lifecycle;
                return !l || l.disable ? undefined : l;
            }
            genArticleList(q, options) {
                const ul = {
                    tagName: "ul",
                    className: "link-tile-compact",
                    children: []
                };
                const info = this.internal.info;
                if (!info)
                    return ul;
                if (q && typeof q === "string") {
                    const searchResult = info.search(q);
                    if (!searchResult || searchResult.length < 1)
                        ul.children.push({
                            tagName: "li",
                            className: "grouping-header",
                            children: getLocalOptions(info.options, "empty", "empty", options)
                        });
                    else
                        this.genMenu(ul.children, searchResult, 0);
                }
                else {
                    const docs = info.docs(options);
                    if (docs.length > 0) {
                        this.genMenu(ul.children, docs, true);
                        this.genMenu(ul.children, info.blog(options), false);
                    }
                    else {
                        this.genMenu(ul.children, info.blog(options), -2);
                        ul.className = "link-item-blog";
                    }
                }
                return ul;
            }
            string(key, options) {
                var _a;
                return (_a = this.internal.info) === null || _a === void 0 ? void 0 : _a.string(key, options);
            }
            genMenu(arr, params, deep) {
                var _a;
                const self = this;
                return MdBlogs.generateMenu(params, {
                    select: this.internal.select ? this.internal.select : undefined,
                    mkt: (_a = this.createLocaleOptions()) === null || _a === void 0 ? void 0 : _a.mkt,
                    deep,
                    arr,
                    click(ev, article) {
                        ev.preventDefault();
                        self.select(article);
                    }
                });
            }
        }
        MdBlogs.ArticlesPart = ArticlesPart;
        function generateLink(item, className) {
            const m = {
                tagName: "a",
                props: {
                    href: item.url,
                    title: item.name
                },
                children: item.name
            };
            if (item.newWindow)
                m.props.target = "_blank";
            if (className)
                m.className = className;
            return m;
        }
        function renderMd(element, md, renderFailedString) {
            if (typeof MdBlogs.hooks.renderMd === "function") {
                MdBlogs.hooks.renderMd(element, md);
                return;
            }
            try {
                if (typeof marked === "object" && typeof marked.parse === "function")
                    element.innerHTML = marked.parse(md);
                else
                    element.innerText = md;
                if (typeof hljs === "object" && typeof hljs.highlightElement === "function") {
                    let codes = MdBlogs.codeElements(element);
                    if (codes) {
                        for (let i = 0; i < codes.length; i++) {
                            hljs.highlightElement(codes[i]);
                        }
                    }
                }
            }
            catch (ex) {
                if (element)
                    element.innerText = renderFailedString || "";
            }
        }
        function genHeadItem(ele, level) {
            return {
                text: ele.innerText,
                level: level,
                scroll() {
                    ele.scrollIntoView({ behavior: "smooth" });
                }
            };
        }
        function genHeadModel(item, sub) {
            let text = item.text;
            if (sub)
                text = "▹ " + text;
            return {
                tagName: "li",
                children: [{
                        tagName: "a",
                        props: { href: "javascript:void(0)" },
                        on: {
                            click(ev) {
                                if (typeof item.scroll === 'function')
                                    item.scroll();
                            }
                        },
                        children: text
                    }]
            };
        }
        function getHeadings(container) {
            let arr = [];
            for (let i = 0; i < container.children.length; i++) {
                const para = container.children[i];
                if (!para || !para.tagName)
                    continue;
                let tagName = para.tagName.toLowerCase();
                switch (tagName) {
                    case "h1":
                    case "h2":
                    case "h3":
                    case "h4":
                    case "h5":
                    case "h6":
                        arr.push(genHeadItem(para, parseInt(tagName.replace("h", ""))));
                        break;
                }
            }
            return arr;
        }
        function getHeadingLevels(arr) {
            if (!arr || arr.length < 1)
                return [];
            let list = [];
            for (let level = 1; level < 7; level++) {
                for (let i = 0; i < arr.length; i++) {
                    let item = arr[i];
                    if (!item || item.level != level)
                        continue;
                    list.push(level);
                    break;
                }
            }
            return list;
        }
        function getContentsModel(mdEle, component, topString) {
            let headers = getHeadings(mdEle);
            let levels = getHeadingLevels(headers);
            if (!headers || headers.length < 2 || levels.length < 1) {
                component.clearChildren();
                return;
            }
            const children = [];
            children.push({
                tagName: "li",
                children: [{
                        tagName: "a",
                        props: { href: "javascript:void(0)" },
                        on: {
                            click(ev) {
                                MdBlogs.scrollToTop();
                            }
                        },
                        children: "⇮ " + topString,
                    }]
            });
            if (levels.length == 1)
                levels.push(levels[0] + 1);
            for (let i = 0; i < headers.length; i++) {
                let item = headers[i];
                switch (item.level) {
                    case levels[0]:
                        children.push(genHeadModel(item));
                        break;
                    case levels[1]:
                        children.push(genHeadModel(item, true));
                        break;
                }
            }
            component.setChildren(children);
            component.style({});
        }
        function getLocalOptions(config, key, resKey, options) {
            return MdBlogs.getLocaleProp(config, key, options) || MdBlogs.getLocaleString(resKey, options === null || options === void 0 ? void 0 : options.mkt);
        }
        function getMembersModel(authors, role, options) {
            let arr = [];
            if (!authors)
                return arr;
            const roleName = role === null || role === void 0 ? void 0 : role.getName(options);
            if (roleName)
                arr.push({
                    tagName: "strong",
                    children: roleName
                });
            for (let i = 0; i < authors.length; i++) {
                const authorItem = authors[i];
                if (!authorItem)
                    continue;
                let email = authorItem.email;
                const atPos = email && typeof email === "string" ? email.indexOf("@") : -1;
                if (atPos < 1)
                    email = undefined;
                let authorName = MdBlogs.getLocaleProp(authorItem, null, options);
                if (!authorName) {
                    if (!email)
                        continue;
                    authorName = email.substring(0, atPos);
                }
                let link = authorItem.url;
                if (!link && email)
                    link = `mailto:${email}`;
                arr.push(link ? {
                    tagName: "a",
                    props: { href: link, target: "_blank" },
                    children: authorName
                } : {
                    tagName: "span",
                    children: authorName
                });
            }
            if (roleName && arr.length === 1)
                arr.pop();
            return arr;
        }
        function fillParagraph(lines, children) {
            if (!lines || !children)
                return;
            for (let i = 0; i < lines.length; i++) {
                const note = lines[i];
                if (!note)
                    continue;
                if (note.startsWith("![img]\n")) {
                    const records = note.split("\n");
                    children.push({
                        tagName: "p",
                        children: [{
                                tagName: "img",
                                props: {
                                    src: records[1],
                                    alt: records.length > 2 ? records[2] : ""
                                }
                            }]
                    });
                    continue;
                }
                children.push({
                    tagName: "p",
                    children: [{
                            tagName: "span",
                            children: note
                        }]
                });
            }
        }
        function fillKeywords(keywords, children, keywordsString, options) {
            const arr = [];
            if (keywords instanceof Array) {
                for (let i = 0; i < keywords.length; i++) {
                    let keyword = keywords[i];
                    if (!keyword)
                        continue;
                    arr.push({ tagName: "span", children: keyword.getName(options) });
                }
            }
            if (arr.length > 0)
                children.push({
                    tagName: "h2",
                    children: keywordsString,
                }, {
                    tagName: "div",
                    className: "x-part-blog-keywords",
                    children: arr,
                });
            return arr;
        }
        function fillContributors(source, children, contentCreatorString, options) {
            var _a, _b;
            const contributors = source === null || source === void 0 ? void 0 : source.all();
            if (!contributors || contributors.length < 1)
                return;
            if (contributors.length === 1 && ((_a = contributors[0].role) === null || _a === void 0 ? void 0 : _a.value) === "author")
                return;
            children.push({
                tagName: "h2",
                children: contentCreatorString,
            });
            for (let i = 0; i < contributors.length; i++) {
                const list = contributors[i];
                if (!((_b = list === null || list === void 0 ? void 0 : list.role) === null || _b === void 0 ? void 0 : _b.name))
                    continue;
                const members = getMembersModel(list.members, list.role, options);
                if (members.length < 1)
                    continue;
                children.push({
                    tagName: "div",
                    className: "x-part-blog-authors",
                    children: members
                });
            }
        }
        function fillRelatedLinks(source, children, seeAlsoString, options) {
            if (!source || !children)
                return;
            source = source.filter(n => {
                if (!n)
                    return false;
                if (typeof n === "string")
                    return true;
                return n.name && n.url;
            });
            if (source.length < 1)
                return;
            children.push({
                tagName: "h2",
                children: seeAlsoString,
            });
            const relatedItems = [];
            children.push({
                tagName: "ul",
                className: "link-tile-compact",
                children: relatedItems
            });
            let label;
            for (let i = 0; i < source.length; i++) {
                const link = source[i];
                if (typeof link === "string") {
                    label = link;
                    continue;
                }
                if (label) {
                    relatedItems.push({
                        tagName: "li",
                        className: "grouping-header",
                        children: label
                    });
                    label = undefined;
                }
                const props = {
                    href: link.url,
                    title: link.name + (link.subtitle ? ("\n" + link.subtitle) : "")
                };
                if (link.newWindow)
                    props.target = "_blank";
                relatedItems.push({
                    tagName: "li",
                    children: [{
                            tagName: "a",
                            props,
                            children: [{
                                    tagName: "span",
                                    children: link.name
                                }, {
                                    tagName: "span",
                                    children: link.subtitle
                                }]
                        }]
                });
            }
        }
        function tipArticleName(key, article, options) {
            key = MdBlogs.getLocaleString(key, options === null || options === void 0 ? void 0 : options.mkt);
            if (!article)
                return key;
            const name = article.getName(options);
            if (!name)
                return key;
            return `${key}\n${name}`;
        }
    })(MdBlogs = DeepX.MdBlogs || (DeepX.MdBlogs = {}));
})(DeepX || (DeepX = {}));
//# sourceMappingURL=render.js.map