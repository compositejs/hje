namespace DeepX.MdBlogs {
    export const hooks = {
        renderMd: undefined as ((element: HTMLElement, md: string) => void),
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

    export function generateMenu(arr: Hje.DescriptionContract[], params: (ArticleInfo | string)[], options: {
        select?: ArticleInfo;
        deep?: boolean | number;
        mkt?: string | boolean;
        click?(ev: Event, article: ArticleInfo): void;
    }) {
        if (!params || params.length < 1) return;
        const deep = options?.deep;
        const select = options?.select;
        const mkt = options?.mkt;
        const click = options?.click;
        const localeOptions = mkt != null ? { mkt: mkt } : undefined;
        const level = deep === true ? 1 : (typeof deep === "number" && deep >= 0 ? (deep + 1) : 0);
        let group = undefined;
        for (let i = 0; i < params.length; i++) {
            const article = params[i];
            if (typeof article === "string") {
                arr.push({
                    tagName: "li",
                    styleRefs: "grouping-header",
                    children: article
                });
                continue;
            }

            if (!article || !article.name || !(article instanceof ArticleInfo)) continue;
            const y = article.dateObj?.year;
            if (deep === false && y && y != group) {
                group = y;
                arr.push({
                    tagName: "li",
                    styleRefs: "grouping-header",
                    children: typeof group === "number" ? group.toString(10) : group
                });
            }

            const result = generateMenuItem(article, deep === -1 ? -1 : level, click, localeOptions);
            if (select === article) result.styleRefs = "state-sel";
            arr.push(result);
            if (level < 1) continue;
            const children = article.children(localeOptions);
            generateMenu(arr, children, {
                select,
                mkt,
                deep: level
            });
        }
    }

    export function generateMenuItem(article: ArticleInfo, level: number, click?: (ev: Event, article: ArticleInfo) => void, options?: ILocalePropOptions) {
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
            props: {
                href: `?${article.getRoutePath(localeOptions)}`,
                title: tips,
            },
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
        if (level === -1 && intro) {
            if (typeof text.children === "string") text.children = [{
                tagName: "span",
                children: text.children
            }];
            if (text.children instanceof Array) {
                text.children.push({ tagName: "br" });
                text.children.push({ tagName: "span", children: intro });
                const publishDate = article.dateObj;
                const dateStr = article.dateString;
                if (dateStr) text.children.push({
                    tagName: "time",
                    props: {
                        datetime: `${publishDate.year.toString(10)}-${publishDate.month.toString(10)}-${publishDate.date.toString(10)}`
                    },
                    children: dateStr
                });
            }
        }

        return result;
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
}