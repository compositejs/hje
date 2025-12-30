namespace DeepX.MdBlogs {
    export const hooks = {
        renderMd: undefined as ((element: HTMLElement, md: string) => void),
        fetchList: undefined as ((input: RequestInfo | URL, init?: RequestInit) => Promise<Response>),
    };

    export function showElements(show: string[], hide: string[]) {
        if (show) show.forEach(function (ele) {
            const element = document.getElementById(ele);
            if (element) element.style.display = "";
        });
        if (hide) hide.forEach(function (ele) {
            const element = document.getElementById(ele);
            if (element) element.style.display = "none";
        });
    };

    export function codeElements(element: HTMLElement) {
        if (!element) return undefined;
        if (typeof element === "string") {
            element = document.getElementById(element);
            if (!element) return undefined;
        }

        const blocks = element.getElementsByTagName("pre");
        const arr = [];
        if (!blocks) return;
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i].children.length > 0 ? blocks[i].children[0] as HTMLElement : undefined;
            if (block) arr.push(block);
        }

        return arr;
    }

    export function generateMenu(params: (ArticleInfo | string)[], options?: IArticleMenuOptions): Hje.DescriptionContract {
        if (!options) options = {};
        if (!params || params.length < 1) return {
            tagName: "ul",
            styleRefs: options.styleRefs
        };
        const arr = options.arr || [];
        const deep = options.deep;
        const localeOptions = options.mkt != null ? { mkt: options.mkt } : undefined;
        const level = deep === true ? 1 : (typeof deep === "number" && deep >= 0 ? (deep + 1) : 0);
        let group: number | string = undefined;
        let label: string;
        for (let i = 0; i < params.length; i++) {
            const article = params[i];
            if (typeof article === "string") {
                label = article;
                continue;
            }

            if (label) {
                arr.push({
                    tagName: "li",
                    styleRefs: "grouping-header",
                    children: label
                });
                label = undefined;
            }

            if (!article || !article.name || !(article instanceof ArticleInfo)) continue;
            const y = article.dateObj?.year;
            if ((deep === false || deep === -2) && y && y != group) {
                group = y;
                arr.push({
                    tagName: "li",
                    styleRefs: "grouping-header",
                    children: typeof group === "number" ? group.toString(10) : group
                });
            }

            const path = genArticlePath(article, options.path, localeOptions);
            const result = generateMenuItemInternal(article, (deep === -1 || deep === -2) ? deep : level, path, options.click, localeOptions);
            const hasSelected = options.select === article;
            if (hasSelected) result.styleRefs = "state-sel";
            if (typeof options.render === "function") options.render(result, article, {
                level,
                mkt: options.mkt,
                select: hasSelected,
                path,
            });
            arr.push(result);
            if (level < 1) continue;
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
            styleRefs: options.styleRefs,
            children: arr
        };
    }

    /**
     * Generates the description model of the specific articles.
     * @param articles The URL or promise object to fetch articles.
     * @param filter The handler to filter the articles to display.
     * @param options Additional options.
     * @returns A promise object of description model. It is a `ul` element.
     */
    export async function generateMenuPromise(articles: Promise<Articles> | string, filter: "blogs" | "blog" | "docs" | "wiki" | ((articles: Articles) => (ArticleInfo | string)[]), options?: IArticleMenuOptions & {
        onfetch?(ev: IArticlesPartDataFetchParams): void
    }) {
        if (!articles) return undefined;
        if (typeof articles === "string") articles = fetchArticles(articles);
        const result = await articles;
        if (!result) return undefined;
        if (!options) options = {};
        if (typeof options.onfetch === "function") options.onfetch({
            articles: result,
            mkt: options.mkt,
            store: undefined,
        });
        let arr: (string | ArticleInfo)[];
        if (!filter) {
            arr = [
                ...result.docs({ mkt: options.mkt }),
                ...result.blogs({ mkt: options.mkt })
            ];
        } else if (typeof filter === "function") {
            arr = filter(result);
        } else if (filter === "blogs" || filter === "blog") {
            arr = result.blogs({ mkt: options.mkt });
        } else if (filter === "docs" || filter === "wiki") {
            arr = result.docs({ mkt: options.mkt });
        } else {
            return undefined;
        }

        return generateMenu(arr, options);
    }

    export function generateMenuItem(article: ArticleInfo, level: number, path?: string | ((original: string, article: ArticleInfo) => string), click?: (ev: Event, article: ArticleInfo) => void, options?: ILocalePropOptions) {
        path = genArticlePath(article, path, options);
        return generateMenuItemInternal(article, level, path, click, options);
    }

    export function generateCdnScript(name: string, ver: string, url: string, path: string) {
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
                    children: "type"
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
                    children: "text/javascript"
                }, {
                    tagName: "span",
                    styleRefs: "x-code-quote",
                    children: "\""
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
                    children: " ></"
                }, {
                    tagName: "span",
                    styleRefs: "x-code-tag",
                    children: "script"
                }, {
                    tagName: "span",
                    styleRefs: "x-code-pack",
                    children: ">"
                }]
            }]
        };
    }

    interface IButtonListItem {
        styleRefs?: string[] | string | {
            subscribe(h: any): any;
            [property: string]: any;
        };
        style?: any;
        text?: string;
        url?: string;
        title?: string;
        click?(ev: Event): void;
    }

    function generateMenuItemInternal(article: ArticleInfo, level: number, path: string, click?: (ev: Event, article: ArticleInfo) => void, options?: ILocalePropOptions) {
        const mkt = options?.mkt;
        const localeOptions = mkt != null ? { mkt: mkt } : undefined;
        const intro = article.getIntro(localeOptions);
        let tips = intro;
        let title = article.getName(localeOptions);
        const subtitle = article.getSubtitle(localeOptions);
        if (!tips) {
            tips = title;
            if (subtitle) tips += "\n" + subtitle;
        }

        if (level > 1) {
            let prefix = "";
            for (let j = 2; j < level; j++) {
                prefix += "　";
            }

            prefix += "▹ ";
            title = prefix + title;
        }

        const text = {
            tagName: "a",
            props: { href: path, title: tips },
            on: {
                click(ev) {
                    if (typeof click === "function") click(ev, article);
                }
            },
            children: subtitle ? [{
                tagName: "span",
                children: title
            }, {
                tagName: "span",
                children: subtitle
            }] : title
        } as Hje.DescriptionContract;
        const result = {
            tagName: "li",
            props: {},
            children: [text],
            data: article,
        } as Hje.DescriptionContract;
        const dateStr = article.dateString;
        if (!intro && !dateStr) return result;
        if (level === -1) {
            if (typeof text.children === "string") text.children = [{
                tagName: "span",
                children: text.children
            }];
            if (text.children instanceof Array) {
                const publishDate = article.dateObj;
                if (dateStr) text.children.push({ tagName: "br" }, {
                    tagName: "time",
                    styleRefs: "x-font-size-s",
                    props: {
                        datetime: `${publishDate.year.toString(10)}-${publishDate.month.toString(10)}-${publishDate.date.toString(10)}`
                    },
                    children: dateStr
                });
                text.children.push({ tagName: "br" });
                text.children.push({ tagName: "span", children: intro });
            }
        } else if (level === -2) {
            const firstLine = {
                tagName: "div",
                children: [{
                    tagName: "strong",
                    children: title
                }, {
                    tagName: "span",
                    children: subtitle
                }]
            };
            const publishDate = article.dateObj;
            const secondLine = {
                tagName: "div",
                children: [{
                    tagName: "time",
                    props: {
                        datetime: `${publishDate.year.toString(10)}-${publishDate.month.toString(10)}-${publishDate.date.toString(10)}`
                    },
                    children: article.dateString
                }]
            };
            const thumb = article.getThumb("wide");
            if (thumb) (secondLine.children as Hje.DescriptionContract[]).push({
                tagName: "img",
                props: {
                    alt: title,
                    src: thumb
                }
            });
            text.children = [firstLine, secondLine];
            if (intro) text.children.push({
                tagName: "div",
                children: [{
                    tagName: "span",
                    children: intro
                }]
            });
            if (text.props) delete text.props.title;
        }

        return result;
    }

    function genArticlePath(article: ArticleInfo, path: string | ((original: string, article: ArticleInfo) => string), localeOptions: { mkt?: string | boolean }) {
        let path1 = `${typeof path === "string" ? path : ""}?${article.getRoutePath(localeOptions)}`;
        if (typeof path === "function") {
            const path2 = path(path1, article);
            if (path2) path1 = path2;
        }

        return path1;
    }

    export function buttonList(config: {
        styleRefs?: string[] | string | {
            subscribe(h: any): any;
            [property: string]: any;
        };
        style?: any;
        groupStyleRefs?: string[] | string | {
            subscribe(h: any): any;
            [property: string]: any;
        };
        data?: any;
        props?: Record<string, unknown>;
        text?: string;
        item?: boolean | IButtonListItem;
        list?: (IButtonListItem | string | number | boolean)[];
        click?(ev: Event): void;
    }) {
        if (!config) return undefined;
        let m: Hje.DescriptionContract = {};
        if (config.styleRefs) m.styleRefs = config.styleRefs;
        if (config.style) m.style = config.style;
        if (config.props) m.props = config.props;
        if (config.data) m.data = config.data;
        if (config.item === true) {
            if (!config.text) return undefined;
            m.tagName = "a";
            m.children = Hje.toSpan(config.text, true) as Hje.DescriptionContract[];
            if (typeof config.click === "function") m.on = {
                click(ev) {
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
                if (!item) continue;
                if (typeof item === "number") item = item.toString(10);
                if (typeof item === "string") {
                    m.children.push({
                        tagName: "span",
                        styleRefs: config.groupStyleRefs,
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

                let itemProps: any = {};
                if (item.url) itemProps.href = item.url;
                if (item.title) itemProps.title = item.title;
                m.children.push(buttonList({
                    text: item.text,
                    styleRefs: item.styleRefs || itemConfig.styleRefs,
                    style: item.style || itemConfig.style,
                    props: itemProps,
                    click: item.click || itemConfig.click,
                    item: true
                }));
            }
        }

        return m;
    }
}