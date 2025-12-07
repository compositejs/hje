
namespace DeepX.MdBlogs {
    export class Articles {
        private _inner: {
            data: IArticleCollection;
            blogConfig: IArticleBlogsConfig;
            path: Hje.RelativePathInfo;
            fetch?: (url: Hje.RelativePathInfo) => Promise<string>;
            blogs?: ArticleInfo[];
            docs?: (ArticleInfo | string)[];
            home?: ArticleInfo;
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
            };
        }

        get name() {
            return getLocaleProp(this._inner.data);
        }

        get config() {
            return this._inner.data.config || {};
        }

        blogsInfo(options?: {
            mkt?: string | boolean;
        }) {
            const { count, disableMenu } = this._inner.blogConfig;
            const name = getLocaleProp(this._inner.blogConfig, null, options) || getLocaleProp(this._inner.data, null, options);
            const dir = getLocaleProp(this._inner.blogConfig, "dir");
            const further = getLocaleProp(this._inner.blogConfig, "further");
            return { name, count, dir, further, disableMenu };
        }

        getName(options?: ILocalePropOptions) {
            return getLocaleProp(this._inner.data, null, options);
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
            const authors = this._inner.data.authors || [];
            const list = blogInfo.list.map(function (blog) {
                if (!blog || !blog.name || getLocaleProp(blog, "disable", localeOptions)) return null;
                return new ArticleInfo(blog, {
                    rela,
                    year: blogInfo.year || true,
                    fetch: fetchHandler,
                    authors: authors,
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

        wiki(options?: IArticleLocaleOptions) {
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
                const disable = getLocaleProp(item, "disable", localeOptions)
                if (disable) {
                    if (disable === "label" || disable === "header")
                        store.push(item as any);
                    continue;
                }
                this.genInfo(item as IArticleInfo, store);
            }

            if (!specificMkt) this._inner.docs = store;
            return store;
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

            let result = getArticle(this.wiki({ mkt }) as ArticleInfo[], name, options);
            if (result) return result;
            return getArticle(this.blogs({ mkt }), name, options);
        }

        genInfo(article: IArticleInfo, list?: ArticleInfo[] | any[]) {
            if (!article) return undefined;
            var info = new ArticleInfo(article, {
                rela: this._inner.path,
                fetch: this._inner.fetch,
                authors: this._inner.data.authors,
            });
            if (list instanceof Array) list.push(info);
            return info;
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
            if (someInternal(this.wiki(options) as ArticleInfo[], callback, context) === true) return true;
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

    export async function fetchArticles(url: string, fetchHandler?: ((url: Hje.RelativePathInfo) => Promise<string>)) {
        const resp = await fetch(url);
        const json = await resp.json();
        return new Articles(json, {
            path: url,
            fetch: fetchHandler
        });
    }

    function getArticle(list: ArticleInfo[], name: string, options?: {
        kind?: { kind: string };
        mkt?: string | boolean;
    }) {
        const mkt = options?.mkt;
        let result: ArticleInfo;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (!item || !(item instanceof ArticleInfo)) continue
            const bind = {} as { kind: string };
            const options2 = { kind: bind, mkt };
            if (item.is(name, options2)) {
                if (bind.kind === "id" || bind.kind === "full") return item;
                if (result) continue;
                result = item;
            }

            const children = item.children({ mkt });
            if (!children) continue;
            const child: ArticleInfo = getArticle(children, name, options2);
            if (!child) continue;
            if (bind.kind === "id" || bind.kind === "full") return child;
            if (result) continue;
            result = child;
        }

        return result;
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
