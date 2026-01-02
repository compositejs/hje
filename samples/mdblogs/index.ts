
namespace DeepX.MdBlogs {
    export class Articles {
        private _inner: {
            data: IArticleCollection;
            blogConfig: IArticleBlogsConfig;
            path: Hje.RelativePathInfo;
            fetch?: (url: Hje.RelativePathInfo) => Promise<string>;
            blogs?: ArticleInfo[];
            docs?: (ArticleInfo | string)[];
            hidden?: ArticleInfo[];
            home?: ArticleInfo;
            pageIndex: number;
        };

        constructor(data: IArticleCollection, options: {
            path?: string | Hje.RelativePathInfo,
            fetch?: (url: Hje.RelativePathInfo) => Promise<string>,
        }) {
            let path = options?.path;
            if (!path || typeof path === "boolean") path = "./";
            if (typeof path === "string") path = new Hje.RelativePathInfo(path);
            let blogConfig: IArticleBlogsConfig;
            if (!data.blog) {
                blogConfig = {
                    list: []
                };
            } else if (data.blog instanceof Array) {
                blogConfig = {
                    list: data.blog
                };
            } else {
                blogConfig = data.blog;
                if (!blogConfig.list) blogConfig.list = [];
            }

            this._inner = {
                data: data || {},
                path: path,
                blogConfig, 
                fetch: options?.fetch,
                pageIndex: 0,
            };
        }

        get name() {
            return getLocaleProp(this._inner.data);
        }

        get description() {
            return getLocaleProp(this._inner.data, "description")
        }

        get options() {
            return this._inner.data.options || {};
        }

        defs(key: string) {
            const defs = this._inner.data["$defs"];
            return defs ? defs[key] : undefined;
        }

        blogsInfo(options?: {
            mkt?: string | boolean;
        }) {
            const { count } = this._inner.blogConfig;
            const name = getLocaleProp(this._inner.blogConfig, null, options) || getLocaleProp(this._inner.data, null, options);
            const dir = getLocaleProp(this._inner.blogConfig, "dir");
            const further = getLocaleProp(this._inner.blogConfig, "further");
            return { name, count, dir, further };
        }

        getName(options?: ILocalePropOptions<string>) {
            return getLocaleProp(this._inner.data, null, options);
        }

        getDescription(optional?: ILocalePropOptions<string>) {
            return getLocaleProp(this._inner.data, "description", optional);
        }

        home(options?: IArticleLocaleOptions) {
            const specificMkt = options?.mkt && options.mkt !== true;
            if (this._inner.home && !options?.reload && !specificMkt) return this._inner.home;
            if (this._inner.home === null) return undefined;
            const url = getLocaleProp(this._inner.data, "home", options);
            if (!url || typeof url !== "string") {
                this._inner.home = null;
                return undefined;
            }

            this._inner.home = this.genInfo({
                name: this._inner.data.name,
                file: url,
            });
            return this._inner.home;
        }

        blogs(options?: IArticleLocaleOptions) {
            const specificMkt = options?.mkt && options.mkt !== true;
            if (this._inner.blogs && !options?.reload && !specificMkt) return this._inner.blogs;
            let blogInfo = this._inner.blogConfig;
            const path = this._inner.path;
            const fetchHandler = this._inner.fetch;
            const localeOptions = {
                mkt: options?.mkt
            };
            const dir = getLocaleProp(blogInfo, "dir");
            const rela = dir ? path.relative(dir) : path;
            const defs = this._inner.data["$defs"];
            const list = blogInfo.list.map(function (blog) {
                if (!blog || !blog.name || getLocaleProp(blog, "disable", localeOptions)) return null;
                return new ArticleInfo(blog, {
                    rela,
                    year: blogInfo.year || true,
                    fetch: fetchHandler,
                    definitions: defs,
                });
            }).filter(function (blog) {
                if (!blog || !blog.dateObj || !blog.getPath()) return false;
                blog.children();
                return true;
            });
            if (!blogInfo.reverse) list.reverse();
            if (!specificMkt) this._inner.blogs = list;
            return list;
        }

        docs(options?: IArticleLocaleOptions) {
            const specificMkt = options?.mkt && options.mkt !== true;
            if (this._inner.docs && !options?.reload && !specificMkt) return this._inner.docs;
            const docs: typeof this._inner.data.docs = this._inner.data.docs || this._inner.data.wiki;
            const store: typeof this._inner.docs = [];
            if (!docs) {
                if (!specificMkt) this._inner.docs = store;
                return store;
            }

            const localeOptions = {
                mkt: options?.mkt
            };
            for (let i = 0; i < docs.length; i++) {
                const item = docs[i];
                if (!item) continue;
                if (typeof item === "string") {
                    store.push(item);
                    continue;
                }

                if (!item.name) continue;
                const disable = getLocaleProp(item, "disable", localeOptions);
                if (disable) {
                    if (disable === "label" || disable === "header")
                        store.push(getLocaleProp(item, null, localeOptions));
                    continue;
                }

                this.genInfo(item as IArticleInfo, store);
            }

            if (!specificMkt) this._inner.docs = store;
            return store;
        }

        hiddenArticles(options?: IArticleLocaleOptions) {
            const specificMkt = options?.mkt && options.mkt !== true;
            if (this._inner.hidden && !options?.reload && !specificMkt) return this._inner.hidden;
            const localeOptions = {
                mkt: options?.mkt
            };
            const path = this._inner.path;
            const fetchHandler = this._inner.fetch;
            const defs = this._inner.data["$defs"];
            const col = this._inner.data.hiddenArticles || [];
            const list = col.map(function (blog) {
                if (!blog || !blog.name || getLocaleProp(blog, "disable", localeOptions)) return null;
                return new ArticleInfo(blog, {
                    rela: path,
                    fetch: fetchHandler,
                    definitions: defs,
                });
            }).filter(function (blog) {
                if (!blog || !blog.getPath()) return false;
                blog.children();
                return true;
            });
            if (!specificMkt) this._inner.hidden = list;
            return list;
        }

        links(options?: {
            mkt?: string | boolean;
        }) {
            const arr = this._inner.data.links;
            if (!arr) return [];
            return arr.map(item => {
                let url = getLocaleProp(item, "url", options);
                if (!url || !item) return undefined;
                if (url && typeof url === "string" && url.startsWith(".")) url = this.relative(url);
                return {
                    name: getLocaleProp(item, null, options),
                    url: getLocaleProp(item, "url", options),
                    newWindow: item.newWindow
                };
            }).filter(item => {
                return item.name && item.url && typeof item.name === "string" && typeof item.url === "string";
            });
        }

        addBlog(article: IArticleInfo) {
            if (!article?.name) return undefined;
            const item = new ArticleInfo(article, {
                rela: this._inner.path,
                year: this._inner.blogConfig.year || true,
                fetch: this._inner.fetch,
                definitions: this._inner.data["$defs"],
            });
            const arr = this.blogs();
            let source = this._inner.data.blog;
            if (!source) {
                source = [];
                this._inner.data.blog = source;
            }
            
            if (source instanceof Array) {
                source.push(article);
            } else {
                if (!(source.list instanceof Array)) source.list = []
                if (source.reverse) source.list.splice(0, 0, article);
                else source.list.push(article);
            }

            arr.splice(0, 0, item);
            return item;
        }

        addDocs(article: IArticleInfo | string | IArticleLabelInfo) {
            if (!article) return undefined;
            if (typeof article === "string") {
                this._inner.docs = undefined;
                if (!this._inner.data.docs) this._inner.data.docs = [];
                this._inner.data.docs.push(article);
                return article;
            }

            if (!article.name) return undefined;
            this._inner.docs = undefined;
            if (!this._inner.data.docs) this._inner.data.docs = [];
            if (typeof article.disable === "string") {
                this._inner.data.docs.push(article);
                return getLocaleProp(article);
            }

            const item = new ArticleInfo(article, {
                rela: this._inner.path,
                fetch: this._inner.fetch,
                definitions: this._inner.data["$defs"],
            });
            this._inner.data.docs.push(article);
            return item;
        }

        addHiddenArticle(article: IArticleInfo) {
            if (!article?.name) return undefined;
            const item = new ArticleInfo(article, {
                rela: this._inner.path,
                fetch: this._inner.fetch,
                definitions: this._inner.data["$defs"],
            });
            const arr = this.hiddenArticles();
            arr.push(item);
            if (!this._inner.data.hiddenArticles) this._inner.data.hiddenArticles = [];
            this._inner.data.hiddenArticles.push(article);
            return item;
        }

        clearBlogs() {
            this._inner.blogs = undefined;
            let source = this._inner.data.blog;
            if (!source) {
                source = [];
                this._inner.data.blog = source;
            }
            
            if (source instanceof Array) {
                while (source.length > 0) {
                    source.pop();
                }
            } else if (source.list instanceof Array) {
                while (source.list.length > 0) {
                    source.list.pop();
                }
            }
        }

        clearDocs() {
            this._inner.docs = undefined;
            this._inner.data.docs = undefined;
            if (this._inner.data.wiki) delete this._inner.data.wiki;
        }

        clearHiddenArticles() {
            this._inner.hidden = undefined;
            this._inner.data.hiddenArticles = undefined;
        }

        toJSON() {
            return this._inner.data;
        }

        async loadMoreBlogs() {
            const { further, list } = this._inner.blogConfig;
            if (!further || !(further instanceof Array)) return false;
            let pg = this._inner.pageIndex;
            if (pg >= further.length) return false;
            while (!further[pg]) {
                pg++;
                this._inner.pageIndex = pg;
                if (pg >= further.length) return false;
            }

            const url = this._inner.path.relative(further[pg])?.value;
            if (typeof url !== "string") return false;
            const result = await (hooks.fetchList || fetch)(url);
            this._inner.pageIndex += 1;
            if (!result || !result.ok) return false;
            const json: IArticlePagingModel = await result.json();
            if (!json || !json.blog || !(json.blog instanceof Array)) return false;
            if (json.disable) return true;
            const arr = json.blog;
            const options = json.options || {};
            if (options.reverse) arr.reverse();
            this._inner.blogs = undefined;
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                if (!item) continue;
                let has = false;
                for (let j = 0; j < list.length; j++) {
                    const test = list[j];
                    if (!test) continue;
                    if (test.date !== item.date || test.file !== item.file || test.dir !== item.dir) continue;
                    has = true;
                    break;
                }

                if (has) continue;
                list.splice(0, 0, item);
            }

            return true;
        }

        get(name: string, options?: {
            mkt?: string | boolean
        }) {
            const mkt = options?.mkt;
            if (typeof name === "number") {
                if (isNaN(name) || name < 0) return undefined;
                const blogs = this.blogs(options);
                return blogs[name];
            }

            const redir = this._inner.data.redir;
            if (redir && typeof name === "string") {
                const name2 = redir[name];
                if (name2 && typeof name2 === "string") name = name2;
            }

            let result = getArticle(this.docs({ mkt }) as ArticleInfo[], name, options);
            if (result) return result;
            result = getArticle(this.blogs({ mkt }), name, options);
            if (result) return result;
            return getArticle(this.hiddenArticles({ mkt }), name, options);
        }

        search(q: string, options?: {
            mkt?: string | boolean;
        }) {
            if (!q || typeof q !== "string") return undefined;
            const arr: ArticleInfo[] = [];
            q = q.toLowerCase();
            this.blogs(options).forEach(ele => {
                if (searchItem(ele, q, options)) arr.push(ele);
            });
            this.docs(options).forEach(ele => {
                searchItemDeep(arr, ele, q, options);
            });
            return arr;
        }

        genInfo(article: IArticleInfo, list?: ArticleInfo[] | any[]) {
            if (!article) return undefined;
            var info = new ArticleInfo(article, {
                rela: this._inner.path,
                fetch: this._inner.fetch,
                definitions: this._inner.data["$defs"],
            });
            if (list instanceof Array) list.push(info);
            return info;
        }

        relative(path: string | Hje.RelativePathInfo) {
            return this._inner.path.relative(path);
        }

        some(callback: (item: ArticleInfo, index: number) => boolean, thisArg?: any, options?: {
            mkt?: string | boolean
        }) {
            const context = {
                index: 0,
                thisArg,
                deep: true,
                options
            };
            if (someInternal(this.docs(options) as ArticleInfo[], callback, context) === true) return true;
            context.deep = false;
            if (someInternal(this.blogs(options), callback, context) === true) return true;
            return false;
        }

        nextArticle(current: ArticleInfo, options?: {
            mkt?: string | boolean
        }) {
            let match = false;
            let target: ArticleInfo;
            this.some(article => {
                if (match) {
                    target = article;
                    return true;
                }

                if (article === current) match = true;
                return false;
            }, undefined, options);

            if (target) return target;
            if (match) target = null;
            return target;
        }

        previousArticle(current: ArticleInfo, options?: {
            mkt?: string | boolean
        }) {
            let temp: ArticleInfo = null;
            let target: ArticleInfo;
            this.some(article => {
                if (article === current) {
                    target = temp;
                    return true;
                }

                temp = article;
                return false;
            }, undefined, options);
            return target;
        }

        parentArticle(current: ArticleInfo, options?: {
            mkt?: string | boolean
        }) {
            const blogs = this.blogs(options);
            for (let i = 0; i < blogs.length; i++) {
                const item = blogs[i];
                if (item === current) return null;
                const test = isParent(item, current);
                if (test) return test;
            }

            return undefined;
        }
    }

    /**
     * Loads the collection and config of articles.
     * @param url The URL of article collection and config.
     * @param fetchHandler An additional handler to fetch markdown file of article.
     * @returns A promise object of article collection and config.
     */
    export async function fetchArticles(url: string, fetchHandler?: ((url: Hje.RelativePathInfo) => Promise<string>)) {
        const resp = await (hooks.fetchList || fetch)(url);
        const json = await resp.json();
        return new Articles(json, {
            path: url,
            fetch: fetchHandler
        });
    }

    function getArticle(list: ArticleInfo[], name: string, options?: {
        mkt?: string | boolean;
    }) {
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (!item || !(item instanceof ArticleInfo)) continue
            if (item.is(name, options)) return item;
            const children = item.children(options);
            if (!children) continue;
            const child: ArticleInfo = getArticle(children, name, options);
            if (!child) continue;
            return child;
        }

        return undefined;
    }

    function searchItem(article: ArticleInfo, q: string, options?: {
        mkt?: string | boolean;
    }) {
        if (!article) return false;
        let s = article.getName(options);
        if (s && s.toLowerCase().indexOf(q) >= 0) return true;
        s = article.getName({ mkt: false });
        if (s && s.toLowerCase().indexOf(q) >= 0) return true;
        s = article.getSubtitle(options);
        if (s && s.toLowerCase().indexOf(q) >= 0) return true;
        s = article.getSubtitle({ mkt: false });
        if (s && s.toLowerCase().indexOf(q) >= 0) return true;
        s = article.getIntro(options);
        if (s && s.toLowerCase().indexOf(q) >= 0) return true;
        s = article.getIntro({ mkt: false });
        if (s && s.toLowerCase().indexOf(q) >= 0) return true;
        return article.hasKeyword(q);
    }

    function searchItemDeep(arr: ArticleInfo[], article: ArticleInfo | string, q: string, options?: {
        mkt?: string | boolean;
    }) {
        if (!(article instanceof ArticleInfo)) return;
        if (searchItem(article, q, options)) arr.push(article);
        const children = article.children(options);
        if (!children) return;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (!child) continue;
            searchItemDeep(arr, child, q, options);
        }
    }

    function someInternal(list: ArticleInfo[], callback: (item: ArticleInfo, index: number) => boolean, context?: {
        index: number;
        deep?: boolean;
        thisArg?: any;
        options?: {
            mkt?: string | boolean
        }
    }) {
        if (!context) context = { index: 0 };
        else if (typeof context.index !== "number") context.index = 0;
        for (let i = 0; i < list.length; i++) {
            const w = list[i];
            if (!w || !(w instanceof ArticleInfo)) continue;
            const b = context.thisArg !== undefined
                ? callback.call(context.thisArg, w, context.index)
                : callback(w, context.index);
            context.index++;
            if (b === true) return true;
            if (!context.deep) continue;
            const children = w.children(context.options);
            if (children && someInternal(children, callback, context) === true) return true;
        }

        return false;
    }

    function isParent(parent: ArticleInfo, child: ArticleInfo): ArticleInfo | undefined {
        const children = parent.children();
        for (let i = 0; i < children.length; i++) {
            const item = children[i];
            if (!item) continue;
            if (item === child) return parent;
            const test = isParent(item, child);
            if (test) return test;
        }

        return undefined;
    }
}
