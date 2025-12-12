namespace DeepX.MdBlogs {
    export class ArticlesPart extends Hje.BaseComponent {
        readonly __inner = {} as {
            select?: ArticleInfo;
            info?: Articles;
            mkt?: string | boolean;
            lifecycle?: IArticlesLifecycle;
            title?: string;
        };

        constructor(element: any, options?: Hje.ComponentOptionsContract<IArticlesPartData>) {
            super(element, options);
            if (options?.data?.mkt != null) this.__inner.mkt = options.data.mkt;
            this.currentModel = {
                children: [{
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
                            styleRefs: "link-tile-compact",
                            children: [],
                            style: { display: "none" }
                        }, {
                            key: "title",
                            tagName: "h1",
                            style: { display: "none" }
                        }, {
                            key: "menu",
                            tagName: "ul",
                            styleRefs: "link-tile-compact",
                            children: []
                        }]
                    }]
                }]
            };
            this.refreshChild();
            if (!options?.data) return;
            const lifecycle: IArticlesLifecycle = options.data.lifecycle || { disable: true };
            this.__inner.lifecycle = lifecycle;
            if (typeof options.data.articles === "string") {
                fetchArticles(options.data.articles).then(r => {
                    this.initRender(r, options.data.select, lifecycle);
                });
            } else if (options.data.articles instanceof Articles) {
                this.initRender(options.data.articles, options.data.select, lifecycle);
            }
        }

        get title(): string {
            return this.__inner.title;
        }

        set title(value: string) {
            this.__inner.title = value;
            const self = this;
            super.childModel("title", {
                children: [{
                    tagName: "a",
                    props: { href: "./" },
                    on: {
                        click(ev: Event) {
                            ev.preventDefault();
                            self.home();
                        }
                    },
                    children: value
                }],
                style: value ? {} : { display: "none" }
            })
        }

        get mkt() {
            return this.__inner.mkt;
        }

        set mkt(value: string | boolean) {
            this.__inner.mkt = value;
        }
        
        home() {
            const already = !this.__inner.select;
            this.__inner.select = null;
            const children: Hje.DescriptionContract[] = [];
            const config = this.__inner.info.config;
            const options = this.createLocaleOptions();
            if (!config.disableName) children.push({
                tagName: "h1",
                children: this.__inner.info.getName(options)
            });
            const data: IArticlesPartData = this.data || {};
            if (data.banner) children.push(data.banner);
            const part = this.__inner.info.home(options);
            if (part) children.push({
                tagName: "main",
                onInit(c) {
                    if (part.contentCache) renderMd(c.element(), part.contentCache);
                    else part.getContent(options).then(r => {
                        renderMd(c.element(), r);
                    });
                },
                children: part.contentCache
            });
            const menu: Hje.DescriptionContract[] = [];
            this.genMenu(menu, this.__inner.info.wiki(options), true);
            this.genMenu(menu, this.__inner.info.blogs(options), false);
            children.push({
                tagName: "main",
                styleRefs: "x-part-blog-menu",
                children: [{
                    tagName: "ul",
                    styleRefs: "link-tile-compact",
                    children: menu
                }]
            });
            if (data.supplement) children.push(data.supplement);
            const model = super.childModel("content", { children });
            super.childModel("contents", {
                children: [],
                style: { display: "none" }
            });
            scrollToTop();
            if (typeof data.onselect === "function") data.onhome({
                model,
                mkt: options?.mkt,
                store: data.store
            });
            this.refreshMenu();
            if (!already) this.lifecycle()?.onhome?.(this);
        }

        select(article?: ArticleInfo | string) {
            const options = this.createLocaleOptions();
            if (typeof article === "number") {
                if (article === -1) {
                    this.home();
                    return undefined;
                }

                if (isNaN(article) || article < 0) return this.__inner.select;
                const blogs = this.__inner.info?.blogs(options);
                article = blogs[article];
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
                    styleRefs: "x-part-blog-note",
                    children: [{
                        tagName: "div",
                        styleRefs: "x-part-blog-banner",
                        children: [{
                            tagName: "img",
                            props: {
                                alt: banner.name || title,
                                src: banner.url
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
                styleRefs: "x-part-blog-note",
                children: [] as Hje.DescriptionContract[]
            };
            const subtitle = article.getSubtitle(options);
            if (subtitle) infoModel.children.push({
                tagName: "div",
                styleRefs: "x-part-blog-subtitle",
                children: [{
                    tagName: "strong",
                    children: subtitle
                }]
            });
            const disableAuthors = article.disableAuthors || this.__inner.info.blogsInfo(options).disableAuthors;
            if (!disableAuthors) {
                let infoChildren = getMembersModel(toMembers(article.authors?.priorityList()), null, options);
                if (infoChildren.length > 0) infoModel.children.push({
                    tagName: "div",
                    styleRefs: "x-part-blog-authors",
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
                        children: article.location
                    });
                    if (infoChildren.length === 1) {
                        infoChildren.push(dateArr[0]);
                        if (dateArr.length > 1) infoChildren.push(dateArr[1]);
                    } else {
                        infoModel.children.push({
                            tagName: "div",
                            styleRefs: "x-part-blog-date",
                            children: dateArr
                        })
                    }
                }
            }

            if (infoModel.children.length > 0) children.push(infoModel);
            const mkt = options?.mkt;
            children.push({
                tagName: "main",
                children: [
                    { tagName: "em", children: getLocaleString("loading", mkt) }
                ],
                onInit(c) {
                    const config = self.__inner.info.blogsInfo(options);
                    article.getContent(options).then(md => {
                        const mdEle = c.element();
                        renderMd(mdEle, md);
                        if (article.disableMenu || config.disableMenu) return;
                        const model = self.childModel("contents", getContentsModel(mdEle, mkt));
                        const data: IArticlesPartData = self.data || {};
                        if (typeof data.onselect === "function") data.onselect({
                            model,
                            article,
                            mkt,
                            store: data.store
                        });
                    });
                }
            });
            const related: Hje.DescriptionContract[] = [];
            fillParagraph(article.getNotes(options), related);
            fillKeywords(article.keywords, related, options);
            if (!disableAuthors) fillContributors(article.authors, related, options);
            fillRelatedLinks(article.related(options), related, options);
            if (related.length > 0) children.push({
                tagName: "section",
                styleRefs: "x-part-blog-related",
                children: related
            });
            children.push({
                tagName: "section",
                styleRefs: "x-part-blog-next",
                children: [{
                    tagName: "a",
                    props: {
                        href: "javascript:void(0)",
                        title: getLocaleString("previous", mkt)
                    },
                    on: {
                        click(ev) {
                            ev.preventDefault();
                            if (self.previous() !== undefined) return;
                            if (self.parent() !== undefined) return;
                            self.home();
                        }
                    },
                    children: [
                        { "tagName": "span", children: "<" },
                        { "tagName": "span", children: getLocaleString("previous", mkt) },
                    ]
                }, {
                    tagName: "a",
                    props: {
                        href: "javascript:void(0)",
                        title: getLocaleString("next", mkt)
                    },
                    on: {
                        click(ev) {
                            ev.preventDefault();
                            if (self.next() !== undefined) return;
                            if (self.parent() !== undefined) return;
                            self.home();
                        }
                    },
                    children: [
                        { "tagName": "span", children: getLocaleString("next", mkt) },
                        { "tagName": "span", children: ">" },
                    ]
                }]
            });
            super.childModel("content", { children });
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

        protected initRender(articles: Articles, select: string, lifecycle: IArticlesLifecycle) {
            if (this.__inner.info === articles || !articles) return;
            this.__inner.info = articles;
            const options = this.createLocaleOptions();
            this.title = articles.getName(options);
            const m: Hje.DescriptionContract = {};
            let arr = m.children;
            if (!(arr instanceof Array)) {
                arr = [];
                m.children = arr;
            }

            this.genMenu(arr, articles.wiki(options), true);
            this.genMenu(arr, articles.blogs(options), false);
            m.style = arr.length > 0 ? {} : { display: "none" };
            super.childModel("menu", m);
            let article: ArticleInfo;
            if (select) article = this.select(select);
            if (!article) this.home();
            if (!lifecycle.disable && typeof lifecycle.oninit === "function") lifecycle.oninit(this);
        }

        protected refreshMenu() {
            const list = super.childModel("menu");
            if (!(list.children instanceof Array)) list.children = [];
            for (let i = 0; i < list.children.length; i++) {
                const item = list.children[i];
                if (!(item.data instanceof ArticleInfo)) continue;
                item.styleRefs = this.__inner.select === item.data ? "state-sel" : null;
            }

            super.refreshChild("menu");
        }

        protected createLocaleOptions() {
            const mkt = this.__inner.mkt;
            return mkt == null || mkt === true ? undefined : { mkt };
        }

        protected lifecycle() {
            const l = this.__inner.lifecycle;
            return !l || l.disable ? undefined : l;
        }

        protected genMenu(arr: Hje.DescriptionContract[], params: (ArticleInfo | string)[], deep?: boolean | number) {
            const self = this;
            return generateMenu(params, {
                select: this.__inner.select,
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

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function renderMd(element: HTMLElement, md: string) {
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
            element.innerText = getLocaleString("renderFailed");
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

    function getContentsModel(mdEle: HTMLElement, mkt?: string | boolean) {
        const articleContents: Hje.DescriptionContract = {};
        articleContents.children = [];
        let headers = getHeadings(mdEle);
        let levels = getHeadingLevels(headers);
        if (!headers || headers.length < 2 || levels.length < 1) return articleContents;
        articleContents.children.push({
            tagName: "li",
            children: [{
                tagName: "a",
                props: { href: "javascript:void(0)" },
                on: {
                    click(ev: Event) {
                        scrollToTop();
                    }
                },
                children: "⇮ " + getLocaleString("top", mkt)
            }]
        });
        if (levels.length == 1) levels.push(levels[0] + 1);
        for (let i = 0; i < headers.length; i++) {
            let item = headers[i];
            switch (item.level) {
                case levels[0]:
                    articleContents.children.push(genHeadModel(item));
                    break;
                case levels[1]:
                    articleContents.children.push(genHeadModel(item, true));
                    break;
            }
        }

        articleContents.style = {};
        return articleContents;
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

    function fillKeywords(keywords: NameValueModel[], children: Hje.DescriptionContract[], options?: {
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
            children: getLocaleString("keywords")
        }, {
            tagName: "div",
            styleRefs: "x-part-blog-keywords",
            children: arr
        });
        return arr;
    }

    function fillContributors(source: ContributorCollection, children: Hje.DescriptionContract[], options?: {
        mkt?: string | boolean;
    }) {
        const contributors = source?.all();
        if (!contributors || contributors.length < 1) return;
        if (contributors.length === 1 && contributors[0].role?.value === "author") return;
        children.push({
            tagName: "h2",
            children: getLocaleString("contentCreator")
        });
        for (let i = 0; i < contributors.length; i++) {
            const list = contributors[i];
            if (!list?.role?.name) continue;
            const members = getMembersModel(list.members, list.role, options);
            if (members.length < 1) continue;
            children.push({
                tagName: "div",
                styleRefs: "x-part-blog-authors",
                children: members
            });
        }
    }

    function fillRelatedLinks(source: (IArticleRelatedLinkItemInfo | string)[], children: Hje.DescriptionContract[], options?: {
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
            children: getLocaleString("seeAlso", options?.mkt)
        });
        const relatedItems: Hje.DescriptionContract[] = [];
        children.push({
            tagName: "ul",
            styleRefs: "link-tile-compact",
            children: relatedItems
        });
        let label: string;
        for (let i = 0; i < source.length; i++) {
            const link = source[i];
            if (typeof link === "string") {
                label = link;
                continue;
            }

            if (label) {
                relatedItems.push({
                    tagName: "li",
                    styleRefs: "grouping-header",
                    children: label
                });
                label = undefined;
            }

            relatedItems.push({
                tagName: "li",
                children: [{
                    tagName: "a",
                    props: {
                        href: link.url,
                        title: link.name + (link.subtitle ? ("\n" + link.subtitle) : "")
                    },
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
}
