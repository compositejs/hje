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
        class Articles {
            constructor(data, options) {
                let path = options === null || options === void 0 ? void 0 : options.path;
                if (!path || typeof path === "boolean")
                    path = "./";
                if (typeof path === "string")
                    path = new Hje.RelativePathInfo(path);
                let blogConfig;
                if (!data.blog) {
                    blogConfig = {
                        list: []
                    };
                }
                else if (data.blog instanceof Array) {
                    blogConfig = {
                        list: data.blog
                    };
                }
                else {
                    blogConfig = data.blog;
                    if (!blogConfig.list)
                        blogConfig.list = [];
                }
                this._inner = {
                    data: data || {},
                    path: path,
                    blogConfig,
                    fetch: options === null || options === void 0 ? void 0 : options.fetch,
                    pageIndex: 0,
                };
            }
            get name() {
                return MdBlogs.getLocaleProp(this._inner.data);
            }
            get description() {
                return MdBlogs.getLocaleProp(this._inner.data, "description");
            }
            get options() {
                return this._inner.data.options || {};
            }
            defs(key) {
                const defs = this._inner.data["$defs"];
                return defs ? defs[key] : undefined;
            }
            blogsInfo(options) {
                const { count } = this._inner.blogConfig;
                const name = MdBlogs.getLocaleProp(this._inner.blogConfig, null, options) || MdBlogs.getLocaleProp(this._inner.data, null, options);
                const dir = MdBlogs.getLocaleProp(this._inner.blogConfig, "dir");
                const further = MdBlogs.getLocaleProp(this._inner.blogConfig, "further");
                return { name, count, dir, further };
            }
            getName(options) {
                return MdBlogs.getLocaleProp(this._inner.data, null, options);
            }
            getDescription(optional) {
                return MdBlogs.getLocaleProp(this._inner.data, "description", optional);
            }
            home(options) {
                const specificMkt = (options === null || options === void 0 ? void 0 : options.mkt) && options.mkt !== true;
                if (this._inner.home && !(options === null || options === void 0 ? void 0 : options.reload) && !specificMkt)
                    return this._inner.home;
                if (this._inner.home === null)
                    return undefined;
                const url = MdBlogs.getLocaleProp(this._inner.data, "home", options);
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
            blog(options) {
                const specificMkt = (options === null || options === void 0 ? void 0 : options.mkt) && options.mkt !== true;
                if (this._inner.blog && !(options === null || options === void 0 ? void 0 : options.reload) && !specificMkt)
                    return this._inner.blog;
                let blogInfo = this._inner.blogConfig;
                const path = this._inner.path;
                const fetchHandler = this._inner.fetch;
                const localeOptions = {
                    mkt: options === null || options === void 0 ? void 0 : options.mkt
                };
                const data = this._inner.data;
                const dir = MdBlogs.getLocaleProp(blogInfo, "dir");
                const rela = dir ? path.relative(dir) : path;
                const list = blogInfo.list.map(function (blog) {
                    if (!blog || !blog.name || MdBlogs.getLocaleProp(blog, "disable", localeOptions))
                        return null;
                    return new MdBlogs.ArticleInfo(blog, {
                        rela,
                        year: blogInfo.year || true,
                        fetch: fetchHandler,
                        definitions: data["$defs"],
                        gallery: data.gallery,
                    });
                }).filter(function (blog) {
                    if (!blog || !blog.dateObj || !blog.getPath())
                        return false;
                    blog.children();
                    return true;
                });
                if (!blogInfo.reverse)
                    list.reverse();
                if (!specificMkt)
                    this._inner.blog = list;
                return list;
            }
            docs(options) {
                const specificMkt = (options === null || options === void 0 ? void 0 : options.mkt) && options.mkt !== true;
                if (this._inner.docs && !(options === null || options === void 0 ? void 0 : options.reload) && !specificMkt)
                    return this._inner.docs;
                const docs = this._inner.data.docs || this._inner.data.wiki;
                const store = [];
                if (!docs) {
                    if (!specificMkt)
                        this._inner.docs = store;
                    return store;
                }
                const localeOptions = {
                    mkt: options === null || options === void 0 ? void 0 : options.mkt
                };
                for (let i = 0; i < docs.length; i++) {
                    const item = docs[i];
                    if (!item)
                        continue;
                    if (typeof item === "string") {
                        store.push(item);
                        continue;
                    }
                    if (!item.name)
                        continue;
                    const disable = MdBlogs.getLocaleProp(item, "disable", localeOptions);
                    if (disable) {
                        if (disable === "label" || disable === "header") {
                            let name = MdBlogs.getLocaleProp(item, null, localeOptions);
                            const lableRefKey = MdBlogs.getLocaleProp(item, "ref", options);
                            if (lableRefKey)
                                name = this.string(lableRefKey === true ? name : lableRefKey, options) || name;
                            store.push(name);
                        }
                        continue;
                    }
                    this.genInfo(item, store);
                }
                if (!specificMkt)
                    this._inner.docs = store;
                return store;
            }
            hiddenArticles(options) {
                const specificMkt = (options === null || options === void 0 ? void 0 : options.mkt) && options.mkt !== true;
                if (this._inner.hidden && !(options === null || options === void 0 ? void 0 : options.reload) && !specificMkt)
                    return this._inner.hidden;
                const localeOptions = {
                    mkt: options === null || options === void 0 ? void 0 : options.mkt
                };
                const path = this._inner.path;
                const fetchHandler = this._inner.fetch;
                const data = this._inner.data;
                const col = data.hiddenArticles || [];
                const list = col.map(function (blog) {
                    if (!blog || !blog.name || MdBlogs.getLocaleProp(blog, "disable", localeOptions))
                        return null;
                    return new MdBlogs.ArticleInfo(blog, {
                        rela: path,
                        fetch: fetchHandler,
                        definitions: data["$defs"],
                        gallery: data.gallery,
                    });
                }).filter(function (blog) {
                    if (!blog || !blog.getPath())
                        return false;
                    blog.children();
                    return true;
                });
                if (!specificMkt)
                    this._inner.hidden = list;
                return list;
            }
            gallery() {
                return this._inner.data.gallery;
            }
            links(options) {
                const arr = this._inner.data.links;
                if (!arr)
                    return [];
                return arr.map(item => {
                    let url = MdBlogs.getLocaleProp(item, "url", options);
                    if (!url || !item)
                        return undefined;
                    if (url && typeof url === "string" && url.startsWith("."))
                        url = this.relative(url);
                    return {
                        name: MdBlogs.getLocaleProp(item, null, options),
                        url: MdBlogs.getLocaleProp(item, "url", options),
                        newWindow: item.newWindow
                    };
                }).filter(item => {
                    return item && item.name && item.url && typeof item.name === "string" && typeof item.url === "string";
                });
            }
            addBlog(article) {
                if (!(article === null || article === void 0 ? void 0 : article.name))
                    return undefined;
                const data = this._inner.data;
                const item = new MdBlogs.ArticleInfo(article, {
                    rela: this._inner.path,
                    year: this._inner.blogConfig.year || true,
                    fetch: this._inner.fetch,
                    definitions: data["$defs"],
                    gallery: data.gallery,
                });
                const arr = this.blog();
                let source = data.blog;
                if (!source) {
                    source = [];
                    data.blog = source;
                }
                if (source instanceof Array) {
                    source.push(article);
                }
                else {
                    if (!(source.list instanceof Array))
                        source.list = [];
                    if (source.reverse)
                        source.list.splice(0, 0, article);
                    else
                        source.list.push(article);
                }
                arr.splice(0, 0, item);
                return item;
            }
            addDocs(article) {
                if (!article)
                    return undefined;
                const data = this._inner.data;
                if (typeof article === "string") {
                    this._inner.docs = undefined;
                    if (!data.docs)
                        data.docs = [];
                    data.docs.push(article);
                    return article;
                }
                if (!article.name)
                    return undefined;
                this._inner.docs = undefined;
                if (!data.docs)
                    data.docs = [];
                if (typeof article.disable === "string") {
                    data.docs.push(article);
                    return MdBlogs.getLocaleProp(article);
                }
                const item = new MdBlogs.ArticleInfo(article, {
                    rela: this._inner.path,
                    fetch: this._inner.fetch,
                    definitions: data["$defs"],
                    gallery: data.gallery,
                });
                data.docs.push(article);
                return item;
            }
            addHiddenArticle(article) {
                if (!(article === null || article === void 0 ? void 0 : article.name))
                    return undefined;
                const data = this._inner.data;
                const item = new MdBlogs.ArticleInfo(article, {
                    rela: this._inner.path,
                    fetch: this._inner.fetch,
                    definitions: data["$defs"],
                    gallery: data.gallery,
                });
                const arr = this.hiddenArticles();
                arr.push(item);
                if (!data.hiddenArticles)
                    data.hiddenArticles = [];
                data.hiddenArticles.push(article);
                return item;
            }
            clearBlog() {
                this._inner.blog = undefined;
                let source = this._inner.data.blog;
                if (!source) {
                    source = [];
                    this._inner.data.blog = source;
                }
                if (source instanceof Array) {
                    while (source.length > 0) {
                        source.pop();
                    }
                }
                else if (source.list instanceof Array) {
                    while (source.list.length > 0) {
                        source.list.pop();
                    }
                }
            }
            clearDocs() {
                this._inner.docs = undefined;
                this._inner.data.docs = undefined;
                if (this._inner.data.wiki)
                    delete this._inner.data.wiki;
            }
            clearHiddenArticles() {
                this._inner.hidden = undefined;
                this._inner.data.hiddenArticles = undefined;
            }
            toJSON() {
                return this._inner.data;
            }
            loadMoreBlog() {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const { further, list } = this._inner.blogConfig;
                    if (!further || !(further instanceof Array))
                        return false;
                    let pg = this._inner.pageIndex;
                    if (pg >= further.length)
                        return false;
                    while (!further[pg]) {
                        pg++;
                        this._inner.pageIndex = pg;
                        if (pg >= further.length)
                            return false;
                    }
                    const url = (_a = this._inner.path.relative(further[pg])) === null || _a === void 0 ? void 0 : _a.value;
                    if (typeof url !== "string")
                        return false;
                    const result = yield (MdBlogs.hooks.fetchList || fetch)(url);
                    this._inner.pageIndex += 1;
                    if (!result || !result.ok)
                        return false;
                    const json = yield result.json();
                    if (!json || !json.blog || !(json.blog instanceof Array))
                        return false;
                    if (json.disable)
                        return true;
                    const arr = json.blog;
                    const options = json.options || {};
                    if (options.reverse)
                        arr.reverse();
                    this._inner.blog = undefined;
                    for (let i = 0; i < arr.length; i++) {
                        const item = arr[i];
                        if (!item)
                            continue;
                        let has = false;
                        for (let j = 0; j < list.length; j++) {
                            const test = list[j];
                            if (!test)
                                continue;
                            if (test.date !== item.date || test.file !== item.file || test.dir !== item.dir)
                                continue;
                            has = true;
                            break;
                        }
                        if (has)
                            continue;
                        list.splice(0, 0, item);
                    }
                    return true;
                });
            }
            get(name, options) {
                const mkt = options === null || options === void 0 ? void 0 : options.mkt;
                if (typeof name === "number") {
                    if (isNaN(name) || name < 0)
                        return undefined;
                    const blog = this.blog(options);
                    return blog[name];
                }
                const redir = this._inner.data.redir;
                if (redir && typeof name === "string") {
                    const name2 = redir[name];
                    if (name2 && typeof name2 === "string")
                        name = name2;
                }
                let result = getArticle(this.docs({ mkt }), name, options);
                if (result)
                    return result;
                result = getArticle(this.blog({ mkt }), name, options);
                if (result)
                    return result;
                return getArticle(this.hiddenArticles({ mkt }), name, options);
            }
            search(q, options) {
                if (!q || typeof q !== "string")
                    return undefined;
                const arr = [];
                q = q.toLowerCase();
                this.docs(options).forEach(ele => {
                    searchItemDeep(arr, ele, q, options);
                });
                this.blog(options).forEach(ele => {
                    if (searchItem(ele, q, options))
                        arr.push(ele);
                });
                return arr;
            }
            genInfo(article, list) {
                if (!article)
                    return undefined;
                const data = this._inner.data;
                var info = new MdBlogs.ArticleInfo(article, {
                    rela: this._inner.path,
                    fetch: this._inner.fetch,
                    definitions: data["$defs"],
                    gallery: data.gallery,
                });
                if (list instanceof Array)
                    list.push(info);
                return info;
            }
            relative(path) {
                return this._inner.path.relative(path);
            }
            some(callback, thisArg, options) {
                const context = {
                    index: 0,
                    thisArg,
                    deep: true,
                    options
                };
                if (someInternal(this.docs(options), callback, context) === true)
                    return true;
                context.deep = false;
                if (someInternal(this.blog(options), callback, context) === true)
                    return true;
                return false;
            }
            nextArticle(current, options) {
                if (!current)
                    return undefined;
                let match = false;
                let target;
                this.some(article => {
                    if (match) {
                        target = article;
                        return true;
                    }
                    if (article === current)
                        match = true;
                    return false;
                }, undefined, options);
                if (target)
                    return target;
                if (match)
                    target = null;
                return target;
            }
            previousArticle(current, options) {
                if (!current)
                    return undefined;
                let temp = null;
                let target;
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
            parentArticle(current, options) {
                if (!current)
                    return undefined;
                const blog = this.blog(options);
                for (let i = 0; i < blog.length; i++) {
                    const item = blog[i];
                    if (item === current)
                        return null;
                    const test = isParent(item, current);
                    if (test)
                        return test;
                }
                return undefined;
            }
            /**
             * Gets the string registered by given key.
             * @param key The key to get string.
             * @param options The options.
             * @returns A string; or undefined, if does not exist nor has no fallback value.
             */
            string(key, options) {
                var _a;
                if (!key || typeof key !== "string")
                    return undefined;
                if (!options)
                    options = {};
                return MdBlogs.getLocaleProp((_a = this._inner.data["$defs"]) === null || _a === void 0 ? void 0 : _a.strings, key, {
                    mkt: options.mkt
                }) || MdBlogs.getLocaleString(key, options.mkt) || options.fallback;
            }
        }
        MdBlogs.Articles = Articles;
        /**
         * Loads the collection and config of articles.
         * @param url The URL of article collection and config.
         * @param fetchHandler An additional handler to fetch markdown file of article.
         * @returns A promise object of article collection and config.
         */
        function fetchArticles(url, fetchHandler) {
            return __awaiter(this, void 0, void 0, function* () {
                const resp = yield (MdBlogs.hooks.fetchList || fetch)(url);
                const json = yield resp.json();
                return new Articles(json, {
                    path: url,
                    fetch: fetchHandler
                });
            });
        }
        MdBlogs.fetchArticles = fetchArticles;
        function getArticle(list, name, options) {
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (!item || !(item instanceof MdBlogs.ArticleInfo))
                    continue;
                if (item.is(name, options))
                    return item;
                const children = item.children(options);
                if (!children)
                    continue;
                const child = getArticle(children, name, options);
                if (!child)
                    continue;
                return child;
            }
            return undefined;
        }
        function searchItem(article, q, options) {
            if (!article)
                return false;
            let s = article.getName(options);
            if (s && s.toLowerCase().indexOf(q) >= 0)
                return true;
            s = article.getName({ mkt: false });
            if (s && s.toLowerCase().indexOf(q) >= 0)
                return true;
            s = article.getSubtitle(options);
            if (s && s.toLowerCase().indexOf(q) >= 0)
                return true;
            s = article.getSubtitle({ mkt: false });
            if (s && s.toLowerCase().indexOf(q) >= 0)
                return true;
            s = article.getIntro(options);
            if (s && s.toLowerCase().indexOf(q) >= 0)
                return true;
            s = article.getIntro({ mkt: false });
            if (s && s.toLowerCase().indexOf(q) >= 0)
                return true;
            return article.hasKeyword(q);
        }
        function searchItemDeep(arr, article, q, options) {
            if (!(article instanceof MdBlogs.ArticleInfo))
                return;
            if (searchItem(article, q, options))
                arr.push(article);
            const children = article.children(options);
            if (!children)
                return;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (!child)
                    continue;
                searchItemDeep(arr, child, q, options);
            }
        }
        function someInternal(list, callback, context) {
            if (!context)
                context = { index: 0 };
            else if (typeof context.index !== "number")
                context.index = 0;
            for (let i = 0; i < list.length; i++) {
                const w = list[i];
                if (!w || !(w instanceof MdBlogs.ArticleInfo))
                    continue;
                const b = context.thisArg !== undefined
                    ? callback.call(context.thisArg, w, context.index)
                    : callback(w, context.index);
                context.index++;
                if (b === true)
                    return true;
                if (!context.deep)
                    continue;
                const children = w.children(context.options);
                if (children && someInternal(children, callback, context) === true)
                    return true;
            }
            return false;
        }
        function isParent(parent, child) {
            const children = parent.children();
            for (let i = 0; i < children.length; i++) {
                const item = children[i];
                if (!item)
                    continue;
                if (item === child)
                    return parent;
                const test = isParent(item, child);
                if (test)
                    return test;
            }
            return undefined;
        }
    })(MdBlogs = DeepX.MdBlogs || (DeepX.MdBlogs = {}));
})(DeepX || (DeepX = {}));
//# sourceMappingURL=index.js.map