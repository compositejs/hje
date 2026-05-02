namespace DeepX.MdBlogs {
    export class ArticlesPart extends Hje.DataComponent<IArticlesPartData> {
        readonly __inner: {
            select?: ArticleInfo | null;
            info?: Articles;
            mkt?: string | boolean;
            lifecycle?: IArticlesLifecycle;
            title?: string;
        } = {} as any;

        constructor(args: any) {
            super(args);
            this.__inner.mkt = this.data("mkt");
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
            const lifecycle: IArticlesLifecycle = this.data("lifecycle") || { disable: true };
            this.__inner.lifecycle = lifecycle;
            const { articles, onfetch, store } = this.data();
            if (typeof articles === "string") {
                fetchArticles(articles).then(r => {
                    if (typeof onfetch === "function") onfetch({
                        articles: r,
                        mkt: this.__inner.mkt,
                        store
                    });
                    this.initRender(r, this.data("select"), this.data("q"), lifecycle);
                });
            } else if (articles instanceof Articles) {
                if (typeof onfetch === "function") onfetch({
                    articles,
                    mkt: this.__inner.mkt,
                    store,
                });
                this.initRender(articles, this.data("select"), this.data("q"), lifecycle);
            }
        }

        get title(): string | undefined {
            return this.__inner.title;
        }

        set title(value: string) {
            this.__inner.title = value;
            const self = this;
            const c = super.getChild("title") as Hje.ElementComponent;
            c.setChildren([{
                tagName: "a",
                props: { href: "./" },
                on: {
                    click(ev: Event) {
                        ev.preventDefault();
                        self.home();
                    }
                },
                children: value
            }]);
            c.style(value ? {} : { display: "none" });
        }

        get mkt(): string | boolean | undefined {
            return this.__inner.mkt;
        }

        set mkt(value: string | boolean) {
            this.__inner.mkt = value;
        }

        defs(key: string) {
            return this.__inner.info?.defs(key);
        }
        
        home(q?: string) {
            const already = !this.__inner.select;
            this.__inner.select = null;
            const children: Hje.DescriptionContract[] = [];
            const info = this.__inner.info;
            if (!info) return;
            const config = info.options;
            const options = this.createLocaleOptions();
            if (!config.disableName) {
                children.push({
                    tagName: "h1",
                    children: info.getName(options)
                });
                const desc = info.getDescription(options);
                if (desc) children.push({
                    tagName: "p",
                    children: info.getDescription(options)
                });
            }

            const { banner, supplement, onhome } = this.data("banner", "supplement") as IArticlesPartData;
            if (banner) children.push(banner);
            const part = info.home(options);
            if (part) children.push({
                tagName: "main",
                lifecycle: {
                    init(c) {
                        if (part.contentCache) renderMd(c.element(), part.contentCache, info.string("renderFailed", options));
                        else part.getContent(options).then(r => {
                            renderMd(c.element(), r, info.string("renderFailed", options));
                        });
                    },
                },
                children: part.contentCache
            });
            const self = this;
            const listRef: {
                list?: Hje.ElementComponent;
                search?: number;
            } = {};
            const ul = this.genArticleList(q, options);
            (ul as Hje.DescriptionContract).lifecycle = {
                init(c) {
                    listRef.list = c as Hje.ElementComponent;
                }
            };
            const main: Hje.DescriptionContract[] = !config.disableSearch && (q || ul.children.length > 10) ? [{
                tagName: "div",
                className: "x-part-blog-search",
                children: [{
                    tagName: "input",
                    props: {
                        type: "search",
                        name: "blog-search",
                        value: q || "",
                        maxLength: 60,
                        placeholder: this.string("search", options)
                    },
                    on: {
                        input(ev) {
                            if (listRef.search) {
                                clearTimeout(listRef.search);
                                listRef.search = undefined;
                            }

                            if (!listRef.list) return;
                            listRef.search = setTimeout(() => {
                                if (!listRef.list) return;
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
                    children: info.options?.linksTitle || this.string("otherLinks", options)
                }, {
                    tagName: "section",
                    className: "link-tile-wide",
                    children: links.map(link => generateLink(link))
                });
            }

            if (supplement) children.push(supplement);
            const model = super.getChild("content") as Hje.ElementComponent;
            model.setChildren(children);
            const contentsModel = super.getChild("contents") as Hje.ElementComponent;
            contentsModel.clearChildren();
            contentsModel.style({ display: "none" });
            scrollToTop();
            if (typeof onhome === "function") onhome({
                model,
                mkt: options?.mkt,
                store: this.data("store"),
                defs(key) {
                    return self.defs(key);
                }
            });
            this.refreshMenu();
            if (!already) this.lifecycle()?.onhome?.(this);
            info.loadMoreBlog();
        }

        select(article?: ArticleInfo | string) {
            const info = this.__inner.info;
            if (!info) return;
            const options = this.createLocaleOptions();
            if (typeof article === "number") {
                if (article === -1) {
                    this.home();
                    return undefined;
                }

                if (isNaN(article) || article < 0) return this.__inner.select;
                const blog = this.__inner.info?.blog(options);
                if (!blog) return undefined;
                article = blog[article];
                if (!article) return undefined;
            } else if (typeof article === "string") {
                if (!article) {
                    this.home();
                    return undefined;
                }

                article = this.__inner.info?.get(article, options);
                if (!article) return undefined;
            }

            if (!article || this.__inner.select === article) return this.__inner.select;
            const children: Hje.DescriptionContract[] = [];
            const self = this;
            const title = article.getName(options);
            let banner = article.bannerImage;
            banner = typeof banner === "string" ? { url: banner } : banner;
            if (banner?.url) {
                const bannerStyle: {
                    objectFit?: "cover" | "contain";
                    maxHeight?: string;
                    width?: string;
                } = {};
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
                children: title
            });
            const infoModel = {
                tagName: "section",
                className: "x-part-blog-note",
                children: [] as Hje.DescriptionContract[]
            };
            const subtitle = article.getSubtitle(options);
            if (subtitle) infoModel.children.push({
                tagName: "div",
                className: "x-part-blog-subtitle",
                children: [{
                    tagName: "strong",
                    children: subtitle
                }]
            });
            const disableAuthors = article.disableAuthors || info.options.disableAuthors;
            if (!disableAuthors) {
                let infoChildren = getMembersModel(toMembers(article.authors?.priorityList()), null, options);
                if (infoChildren.length > 0) infoModel.children.push({
                    tagName: "div",
                    className: "x-part-blog-authors",
                    children: infoChildren
                });

                const publishDate = article.dateObj;
                if (publishDate) {
                    const dateArr: Hje.DescriptionContract[] = [{
                        tagName: "time",
                        props: {
                            datetime: `${publishDate.year.toString(10)}-${publishDate.month.toString(10)}-${publishDate.date.toString(10)}`
                        },
                        children: article.dateString || publishDate.year.toString(10)
                    }];
                    if (article.location) dateArr.push({
                        tagName: "span",
                        children: typeof article.location === "string" ? article.location : getLocaleProp(article.location, null, options)
                    });
                    if (infoChildren.length === 1) {
                        infoChildren.push(dateArr[0]);
                        if (dateArr.length > 1) infoChildren.push(dateArr[1]);
                    } else {
                        infoModel.children.push({
                            tagName: "div",
                            className: "x-part-blog-date",
                            children: dateArr
                        })
                    }
                }
            }

            if (infoModel.children.length > 0) children.push(infoModel);
            const mkt = options?.mkt;
            children.push({
                tagName: "main",
                children: [{
                    tagName: "div",
                    className: "x-part-blog-notification",
                    children: [{ tagName: "em", children: self.string("loading", options) }]
                }],
                lifecycle: {
                    init(c: Hje.ElementComponent) {
                        if (!c || c.data("state")) return;
                        c.data("state", "pending");
                        const config = info.options;
                        article.getContent(options).then(md => {
                            c.data("state", "render");
                            const mdEle = c.element;
                            renderMd(mdEle, md, self.string("renderFailed", options));
                            c.data("state", "done");
                            if (article.disableMenu || config.disableMenu) return;
                            getContentsModel(mdEle, self.getChild("contents") as Hje.ElementComponent, self.string("top", options));
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
            const related: Hje.DescriptionContract[] = [];
            fillParagraph(article.getNotes(options), related);
            if (article.series?.length) {
                children.push({
                    tagName: "h2",
                    children: [{
                        tagName: "span",
                        children: getLocaleProp(this.__inner.info?.options, "seriesTitle", options) || this.string("relatedPaintings", options),
                    }]
                }, {
                    tagName: "div",
                    children: article.series.map(series => {
                        return {
                            tagName: "a",
                            className: "link-long-button",
                            props: {
                                href: series.url
                            },
                            children: [{
                                tagName: "img",
                                props: {
                                    src: series.logo,
                                    alt: name
                                }
                            }, {
                                tagName: "span",
                                children: name,
                            }],
                        } as Hje.DescriptionContract;
                    }),
                });
                const seriesTips = getLocaleProp(this.__inner.info?.options, "seriesTips", options);
                if (seriesTips) children.push({
                    tagName: "div",
                    className: "x-part-info",
                    children: [{
                        tagName: "span",
                        children: seriesTips,
                    }]
                });
            }

            fillKeywords(article.keywords!, related, this.string("keywords", options), options);
            if (!disableAuthors) fillContributors(article.authors, related, this.string("contentCreator", options), options);
            fillRelatedLinks(article.related(options), related, this.string("seeAlso", options), options);
            if (related.length > 0) children.push({
                tagName: "section",
                className: "x-part-blog-related",
                children: related
            });
            const previous = this.__inner.info?.previousArticle(article, options);
            const next = this.__inner.info?.nextArticle(article, options);
            const parent = this.__inner.info?.parentArticle(article, options);
            if (previous || next) children.push({
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
                            if (previous) self.select(previous);
                            else self.home();
                        }
                    },
                    children: [
                        { "tagName": "span", children: "<" },
                        { "tagName": "span", children: this.string("previous", options) },
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
                            if (next) self.select(next);
                            else self.home();
                        }
                    },
                    children: [
                        { "tagName": "span", children: this.string("next", options) },
                        { "tagName": "span", children: ">" },
                    ]
                }]
            });
            else children.push({
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
                            if (parent) self.select(parent);
                            else self.home();
                        }
                    },
                    children: [
                        { "tagName": "span", children: "<" },
                        { "tagName": "span", children: this.string("back", options) },
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
                insertChildren(position, ...models) {
                    if (typeof position === "number") {
                        children.splice(position, 0, ...models);
                        return;
                    }

                    if (!position) position = "end";
                    if (position === "last") {
                        children.push(...models);
                        return;
                    }

                    let insertion = 0;
                    for (let i = 0; i < children.length; i++) {
                        insertion++;
                        if (children[i] && children[i].tagName === "main") break;
                    }

                    if (position === "start") {
                        insertion--;
                        if (insertion < 0) insertion = 0;
                    } else if (position !== "end") {
                        return;
                    }

                    children.splice(insertion, 0, ...models);
                }
            } as IArticlesPartDataSelectParams);
            const model = super.getChild("content") as Hje.ElementComponent;
            model.setChildren(children);
            this.__inner.select = article;
            this.refreshMenu();
            scrollToTop();
            this.lifecycle()?.onselect?.(this, article);
            return article;
        }

        next() {
            const options = this.createLocaleOptions();
            const blog = this.__inner.info?.nextArticle(this.__inner.select, options);
            if (blog === undefined) return blog;
            if (blog === null) {
                this.home();
                return blog;
            }

            this.select(blog);
            return blog;
        }

        previous() {
            const options = this.createLocaleOptions();
            const blog = this.__inner.info?.previousArticle(this.__inner.select, options);
            if (blog === undefined) return blog;
            if (blog === null) {
                this.home();
                return blog;
            }

            this.select(blog);
            return blog;
        }

        parent() {
            const options = this.createLocaleOptions();
            const blog = this.__inner.info?.parentArticle(this.__inner.select, options);
            if (blog === undefined) return blog;
            if (blog === null) {
                this.home();
                return blog;
            }

            this.select(blog);
            return blog;
        }

        protected initRender(articles: Articles, select: string | undefined, q: string | undefined, lifecycle: IArticlesLifecycle) {
            if (this.__inner.info === articles || !articles) return;
            this.__inner.info = articles;
            const options = this.createLocaleOptions();
            this.title = articles.getName(options);
            let arr = [] as Hje.DescriptionContract[];
            this.genMenu(arr, articles.docs(options), true);
            this.genMenu(arr, articles.blog(options), false);
            const menu = super.getChild("menu") as Hje.ElementComponent;
            menu.setChildren(arr);
            menu.style(arr.length > 0 ? {} : { display: "none" });
            const linkModels = this.__inner.info.links(options).map(item => {
                return {
                    tagName: "li",
                    children: [generateLink(item)]
                };
            });
            const linksStyle = linkModels.length > 0 ? {} : { display: "none" };
            const linksComponent = super.getChild("links") as Hje.ElementComponent;
            linksComponent.setChildren(linkModels);
            linksComponent.style(linksStyle);
            const linksTitleComponent = super.getChild("linksTitle") as Hje.ElementComponent;
            linksTitleComponent.setChildren(articles.options?.linksTitle || this.string("otherLinks", options));
            linksTitleComponent.style(linksStyle);
            let article: ArticleInfo | null | undefined;
            if (select) article = this.select(select);
            if (!article) this.home(q);
            if (!lifecycle.disable && typeof lifecycle.oninit === "function") lifecycle.oninit(this);
        }

        protected refreshMenu() {
            const menu = super.getChild("menu") as Hje.ElementComponent;
            menu.forEachChild(item => {
                const data = (item as Hje.ElementComponent).data("article") as ArticleInfo | undefined;
                if (!(data instanceof ArticleInfo)) return;
                if (data === this.__inner.select) {
                    if (item.className().indexOf("state-sel") < 0)
                        item.className({ add: "state-sel" });
                } else {
                    if (item.className().indexOf("state-sel") >= 0)
                        item.className({ remove: "state-sel" });
                }
            });
        }

        protected createLocaleOptions() {
            const mkt = this.__inner.mkt;
            return mkt == null || mkt === true ? undefined : { mkt };
        }

        protected lifecycle() {
            const l = this.__inner.lifecycle;
            return !l || l.disable ? undefined : l;
        }

        genArticleList(q: string | undefined, options?: {
            mkt?: string | boolean
        }) {
            const ul = {
                tagName: "ul",
                className: "link-tile-compact",
                children: [] as Hje.DescriptionContract[]
            };
            const info = this.__inner.info;
            if (!info) return ul;
            if (q && typeof q === "string") {
                const searchResult = info.search(q);
                if (!searchResult || searchResult.length < 1) ul.children.push({
                    tagName: "li",
                    className: "grouping-header",
                    children: this.string("empty", options)
                });
                else this.genMenu(ul.children, searchResult, 0);
            } else {
                const docs = info.docs(options);
                if (docs.length > 0) {
                    this.genMenu(ul.children, docs, true);
                    this.genMenu(ul.children, info.blog(options), false);
                } else {
                    this.genMenu(ul.children, info.blog(options), -2);
                    ul.className = "link-item-blog";
                }
            }

            return ul;
        }

        string(key: string, options?: {
            mkt?: string | boolean;
            fallback?: string;
        }) {
            return this.__inner.info?.string(key, options);
        }

        protected genMenu(arr: Hje.DescriptionContract[], params: (ArticleInfo | string)[], deep?: boolean | number) {
            const self = this;
            return generateMenu(params, {
                select: this.__inner.select ? this.__inner.select : undefined,
                mkt: this.createLocaleOptions()?.mkt,
                deep,
                arr,
                click(ev, article) {
                    ev.preventDefault();
                    self.select(article);
                }
            });
        }
    }

    function generateLink(item: {
        name: string;
        url: string;
        newWindow?: boolean;
    }, className?: string | string[]) {
        const m: Hje.DescriptionContract = {
            tagName: "a",
            props: {
                href: item.url,
                title: item.name
            },
            children: item.name
        };
        if (item.newWindow) m.props!.target = "_blank";
        if (className) m.className = className;
        return m;
    }

    function renderMd(element: HTMLElement, md: string, renderFailedString?: string) {
        if (typeof hooks.renderMd === "function") {
            hooks.renderMd(element, md);
            return;
        }

        try {
            if (typeof marked === "object" && typeof marked.parse === "function")
                element.innerHTML = marked.parse(md);
            else
                element.innerText = md;
            if (typeof hljs === "object" && typeof hljs.highlightElement === "function") {
                let codes = codeElements(element);
                if (codes) {
                    for (let i = 0; i < codes.length; i++) {
                        hljs.highlightElement(codes[i]);
                    }
                }
            }
        } catch (ex) {
            if (element) element.innerText = renderFailedString || "";
        }
    }

    function genHeadItem(ele: HTMLElement, level: number): IHeadingLevelInfo {
        return {
            text: ele.innerText,
            level: level,
            scroll() {
                ele.scrollIntoView({ behavior: "smooth" });
            }
        };
    }

    function genHeadModel(item: IHeadingLevelInfo, sub?: boolean): Hje.DescriptionContract {
        let text = item.text;
        if (sub) text = "▹ " + text;
        return {
            tagName: "li",
            children: [{
                tagName: "a",
                props: { href: "javascript:void(0)" },
                on: {
                    click(ev) {
                        if (typeof item.scroll === 'function') item.scroll();
                    }
                },
                children: text
            }]
        }
    }

    function getHeadings(container: HTMLElement) {
        let arr: IHeadingLevelInfo[] = [];
        for (let i = 0; i < container.children.length; i++) {
            const para = container.children[i] as HTMLElement;
            if (!para || !para.tagName) continue;
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

    function getHeadingLevels(arr: IHeadingLevelInfo[]) {
        if (!arr || arr.length < 1) return [];
        let list = [];
        for (let level = 1; level < 7; level++) {
            for (let i = 0; i < arr.length; i++) {
                let item = arr[i];
                if (!item || item.level != level) continue;
                list.push(level);
                break;
            }
        }

        return list;
    }

    function getContentsModel(mdEle: HTMLElement, component: Hje.ElementComponent, topString?: string) {
        let headers = getHeadings(mdEle);
        let levels = getHeadingLevels(headers);
        if (!headers || headers.length < 2 || levels.length < 1) {
            component.clearChildren();
            return;
        }
        const children = [] as Hje.DescriptionContract[];
        children.push({
            tagName: "li",
            children: [{
                tagName: "a",
                props: { href: "javascript:void(0)" },
                on: {
                    click(ev: Event) {
                        scrollToTop();
                    }
                },
                children: "⇮ " + topString,
            }]
        });
        if (levels.length == 1) levels.push(levels[0] + 1);
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

    function getMembersModel(authors: IContributorInfo[], role: NameValueModel | null, options?: {
        mkt?: string | boolean;
    }) {
        let arr: Hje.DescriptionContract[] = [];
        if (!authors) return arr;
        const roleName = role?.getName(options);
        if (roleName) arr.push({
            tagName: "strong",
            children: roleName
        });
        for (let i = 0; i < authors.length; i++) {
            const authorItem = authors[i];
            if (!authorItem) continue;
            let email = authorItem.email;
            const atPos = email && typeof email === "string" ? email.indexOf("@") : -1;
            if (atPos < 1) email = undefined;
            let authorName = getLocaleProp(authorItem, null, options);
            if (!authorName) {
                if (!email) continue;
                authorName = email.substring(0, atPos);
            }

            let link = authorItem.url;
            if (!link && email) link = `mailto:${email}`;
            arr.push(link ? {
                tagName: "a",
                props: { href: link, target: "_blank" },
                children: authorName
            } : {
                tagName: "span",
                children: authorName
            });
        }

        if (roleName && arr.length === 1) arr.pop();
        return arr;
    }

    function fillParagraph(lines: string[], children: Hje.DescriptionContract[]) {
        if (!lines || !children) return;
        for (let i = 0; i < lines.length; i++) {
            const note = lines[i];
            if (!note) continue;
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

    function fillKeywords(keywords: NameValueModel[], children: Hje.DescriptionContract[], keywordsString?: string, options?: {
        mkt?: string | boolean;
    }) {
        const arr: Hje.DescriptionContract[] = [];
        if (keywords instanceof Array) {
            for (let i = 0; i < keywords.length; i++) {
                let keyword = keywords[i];
                if (!keyword) continue;
                arr.push({ tagName: "span", children: keyword.getName(options) });
            }
        }

        if (arr.length > 0) children.push({
            tagName: "h2",
            children: keywordsString,
        }, {
            tagName: "div",
            className: "x-part-blog-keywords",
            children: arr,
        });
        return arr;
    }

    function fillContributors(source: ContributorCollection, children: Hje.DescriptionContract[], contentCreatorString?: string, options?: {
        mkt?: string | boolean;
    }) {
        const contributors = source?.all();
        if (!contributors || contributors.length < 1) return;
        if (contributors.length === 1 && contributors[0].role?.value === "author") return;
        children.push({
            tagName: "h2",
            children: contentCreatorString,
        });
        for (let i = 0; i < contributors.length; i++) {
            const list = contributors[i];
            if (!list?.role?.name) continue;
            const members = getMembersModel(list.members, list.role, options);
            if (members.length < 1) continue;
            children.push({
                tagName: "div",
                className: "x-part-blog-authors",
                children: members
            });
        }
    }

    function fillRelatedLinks(source: (IArticleRelatedLinkItemInfo | string)[], children: Hje.DescriptionContract[], seeAlsoString?: string, options?: {
        mkt?: string | boolean;
    }) {
        if (!source || !children) return;
        source = source.filter(n => {
            if (!n) return false;
            if (typeof n === "string") return true;
            return n.name && n.url;
        });
        if (source.length < 1) return;
        children.push({
            tagName: "h2",
            children: seeAlsoString,
        });
        const relatedItems: Hje.DescriptionContract[] = [];
        children.push({
            tagName: "ul",
            className: "link-tile-compact",
            children: relatedItems
        });
        let label: string | undefined;
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
            if (link.newWindow) (props as any).target = "_blank";
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

    function tipArticleName(key: "previous" | "next" | "back" | "home", article: ArticleInfo | undefined | null, options?: ILocalePropOptions) {
        key = getLocaleString(key, options?.mkt);
        if (!article) return key;
        const name = article.getName(options);
        if (!name) return key;
        return `${key}\n${name}`;
    }
}
