"use strict";
var DeepX;
(function (DeepX) {
    var MdBlogs;
    (function (MdBlogs) {
        function toDate(s) {
            if (s instanceof Date)
                return s;
            if (typeof s === "number")
                return new Date(s);
            let time;
            if (!s)
                return undefined;
            if (s.length === 8) {
                time = new Date(parseInt(s.substring(0, 4)), parseInt(s.substring(4, 6)) - 1, parseInt(s.substring(6, 8)));
            }
            else if (s.length === 9) {
                time = new Date(parseInt(s.substring(0, 5)), parseInt(s.substring(5, 7)) - 1, parseInt(s.substring(7, 9)));
            }
            else if (s.length > 9 && s.includes("-")) {
                time = new Date(s);
            }
            else {
                return undefined;
            }
            return isNaN(time) ? undefined : time;
        }
        function isSamePath(test, file, dir) {
            if (typeof file === "boolean" || file == null) {
            }
            else if (typeof file === "string") {
                dir += file.toLowerCase().endsWith(".md") ? file.substring(0, file.length - 3) : file;
            }
            if (dir && test === dir)
                return true;
            if (dir.endsWith("/") && !test.endsWith("/") && dir.substring(0, dir.length - 1) === test)
                return true;
            return false;
        }
        class ArticleInfo {
            constructor(data, options) {
                this._inner = {
                    y: false,
                };
                this._inner.fetch = options === null || options === void 0 ? void 0 : options.fetch;
                this._inner.rela = (options === null || options === void 0 ? void 0 : options.rela) || new Hje.RelativePathInfo("./");
                const defs = (options === null || options === void 0 ? void 0 : options.definitions) || {};
                this._inner.definitions = defs;
                this._inner.gallery = (options === null || options === void 0 ? void 0 : options.gallery) || [];
                if (!data) {
                    this._inner.data = {};
                    this._inner.keywords = [];
                    return;
                }
                this._inner.data = data;
                this._inner.date = toDate(data.date);
                this._inner.keywords = MdBlogs.nameValueModels(data.keywords, defs.keywords);
                let p = "./";
                const y = options === null || options === void 0 ? void 0 : options.year;
                this._inner.y = y;
                if (y && this._inner.date) {
                    if (typeof y === "string") {
                        const d = this._inner.date;
                        let group = "";
                        switch (y.toLowerCase()) {
                            case "month":
                            case "m":
                                group += d.getFullYear().toString(10) + "/";
                                if (d.getMonth() < 9)
                                    group += "0";
                                group += (d.getMonth() + 1).toString(10);
                                break;
                            case "date":
                            case "day":
                            case "d":
                                group += d.getFullYear().toString(10) + "/";
                                if (d.getMonth() < 9)
                                    p += "0";
                                group += (d.getMonth() + 1).toString(10);
                                if (d.getDate() < 10)
                                    p += "0";
                                group += d.getDate().toString(10);
                                break;
                            case "none":
                                break;
                            case "year":
                            case "y":
                            default:
                                group = d.getFullYear().toString(10);
                                break;
                        }
                        if (group) {
                            this._inner.year = group;
                        }
                    }
                    else {
                        this._inner.year = this._inner.date.getFullYear().toString(10);
                    }
                }
            }
            get id() {
                var _a;
                const s = (_a = this._inner.data) === null || _a === void 0 ? void 0 : _a.id;
                return typeof s === "string" && s.length > 10 ? s : undefined;
            }
            get name() {
                return MdBlogs.getLocaleProp(this._inner.data);
            }
            get subtitle() {
                return MdBlogs.getLocaleProp(this._inner.data, "subtitle");
            }
            get keywords() {
                return this._inner.keywords;
            }
            get intro() {
                return MdBlogs.getLocaleProp(this._inner.data, "intro");
            }
            get notes() {
                return (MdBlogs.getLocaleProp(this._inner.data, "notes") || []);
            }
            get gallery() {
                var _a;
                const gallery = this._inner.gallery;
                let col = (_a = this._inner.data.options) === null || _a === void 0 ? void 0 : _a.gallery;
                if (!col || !gallery)
                    return [];
                if (typeof col === "string")
                    col = [col];
                if (!(col instanceof Array))
                    return [];
                const arr = [];
                for (const item of col) {
                    if (!item || typeof item !== "string")
                        continue;
                    for (const ele of gallery) {
                        if ((ele === null || ele === void 0 ? void 0 : ele.id) === item)
                            arr.push(ele);
                    }
                }
                return arr;
            }
            get authors() {
                if (this._inner.author)
                    return this._inner.author;
                let name = this._inner.data.author || this._inner.data.authors || this._inner.data.contributors;
                this._inner.author = new MdBlogs.ContributorCollection(name, this._inner.definitions.contributors, this._inner.definitions.roles, ["author", "translator"]);
                return this._inner.author;
            }
            get contentCache() {
                return this._inner.content;
            }
            get dateObj() {
                const date = this._inner.date;
                if (!date)
                    return undefined;
                const y = date.getFullYear();
                if (y < 2000)
                    return undefined;
                return {
                    year: y,
                    month: date.getMonth() + 1,
                    date: date.getDate()
                };
            }
            get dateString() {
                const date = this._inner.date;
                return date && date.getFullYear() >= 2000 ? date.toLocaleDateString() : undefined;
            }
            get location() {
                return this._inner.data.location;
            }
            get data() {
                var _a;
                return (_a = this._inner.data) === null || _a === void 0 ? void 0 : _a.data;
            }
            get disableMenu() {
                if (!this._inner.data)
                    return true;
                return this._inner.data.options ? this._inner.data.options.disableMenu : false;
            }
            get disableAuthors() {
                if (!this._inner.data)
                    return true;
                return this._inner.data.options ? this._inner.data.options.disableAuthors : false;
            }
            get bannerImage() {
                var _a;
                return ((_a = this._inner.data) === null || _a === void 0 ? void 0 : _a.options) ? this._inner.data.options.banner : undefined;
            }
            getOptions(key) {
                var _a;
                const inner = (_a = this._inner.data) === null || _a === void 0 ? void 0 : _a.options;
                return inner ? inner[key] : undefined;
            }
            defs(key) {
                return this._inner.definitions[key];
            }
            hasGallery(value) {
                var _a;
                if (!value)
                    return false;
                const gallery = (_a = this._inner.data.options) === null || _a === void 0 ? void 0 : _a.gallery;
                if (!gallery)
                    return false;
                if (typeof gallery === "string")
                    return value === gallery;
                if (gallery instanceof Array)
                    return gallery.indexOf(value) >= 0;
                return false;
            }
            getRoutePath(options) {
                const data = this._inner.data;
                let dir = this.getDirPath(options);
                if (!data || !dir)
                    return undefined;
                dir = dir.length < 3 ? "" : dir.substring(2, dir.length - 1);
                const file = MdBlogs.getLocaleProp(data, "file", { mkt: options === null || options === void 0 ? void 0 : options.mkt });
                if (typeof data.file === "boolean" || data.file == null || typeof file === "boolean" || file == null) {
                }
                else if (typeof file === "string") {
                    dir += (dir ? "/" : "") + (file.toLowerCase().endsWith(".md") ? file.substring(0, file.length - 3) : file);
                }
                if (dir.endsWith("/"))
                    dir = dir.substring(0, dir.length - 1);
                return dir;
            }
            is(name, options) {
                const data = this._inner.data;
                if (!data || !name)
                    return false;
                if (name === this || name === data)
                    return true;
                if (typeof data.id === "string" && data.id.length > 10 && data.id === name)
                    return true;
                const localeOptions = { mkt: options === null || options === void 0 ? void 0 : options.mkt };
                let dirName = MdBlogs.getLocaleProp(data, "dir", localeOptions);
                if (dirName && !dirName.endsWith("/"))
                    dirName += "/";
                let dir = name.startsWith("/") ? "/" : "";
                if (this._inner.year)
                    dir += this._inner.year + "/";
                let dir2 = dir;
                if (dirName)
                    dir += dirName;
                if (isSamePath(name, MdBlogs.getLocaleProp(data, "file", localeOptions), dir))
                    return true;
                dirName = data.dir;
                if (dirName && !dirName.endsWith("/"))
                    dirName += "/";
                if (dirName)
                    dir2 += dirName;
                return isSamePath(name, data.file, dir2);
            }
            getPath(options) {
                let path = this.getDirPath(options);
                const file = MdBlogs.getLocaleProp(this._inner.data, "file", options);
                if (!path || file == null)
                    return undefined;
                if (file === true || file === undefined) {
                    path += "README.md";
                }
                else if (file === false || file === null) {
                }
                else {
                    path += file;
                }
                return this._inner.rela.relative(path);
            }
            getName(options) {
                return MdBlogs.getLocaleProp(this._inner.data, null, options);
            }
            getSubtitle(options) {
                return MdBlogs.getLocaleProp(this._inner.data, "subtitle", options);
            }
            getIntro(options) {
                return MdBlogs.getLocaleProp(this._inner.data, "intro", options) || MdBlogs.getLocaleProp(this._inner.data, "description", options);
            }
            getNotes(options) {
                return (MdBlogs.getLocaleProp(this._inner.data, "notes", options) || []);
            }
            getThumb(kind) {
                const pic = getThumbInternal(this._inner.data.thumb, kind);
                return pic && typeof pic === "string" && pic.startsWith(".") ? this.relative(pic) : pic;
            }
            getContent(options) {
                var _a;
                if (this._inner.content !== undefined && !(options === null || options === void 0 ? void 0 : options.reload))
                    return Promise.resolve(this._inner.content);
                const path = this.getPath({ mkt: options === null || options === void 0 ? void 0 : options.mkt });
                if (!path)
                    return Promise.reject("No path.");
                const result = this._inner.fetch
                    ? this._inner.fetch.call(this, path)
                    : fetch(path.value).then(function (r) {
                        if (r === null || r === void 0 ? void 0 : r.ok)
                            return r.text();
                        return r.text().then(s => {
                            return Promise.reject(new Error("fetch error\n" + s));
                        });
                    });
                if (!result)
                    return Promise.reject(new Error("fetch handler error"));
                const name = this.getName(options);
                let end2 = (_a = this._inner.data) === null || _a === void 0 ? void 0 : _a.end;
                const end = typeof end2 === "boolean" || typeof end2 === "string"
                    ? { end: end2 }
                    : (!end2 ? {} : end2);
                return result.then(md => {
                    if (!md) {
                        this._inner.content = "";
                        return Promise.reject(new Error("empty"));
                    }
                    if (end.start) {
                        let endTag = "<!-- " + (end.start === true ? "Start" : end) + " -->\n";
                        let endIndex = md.indexOf(endTag);
                        if (endIndex < 0) {
                            endTag = "<!-- " + (end.start === true ? "Start" : end) + " -->\r\n";
                            endIndex = md.indexOf(endTag);
                        }
                        if (endIndex > 1)
                            md = md.substring(endIndex + endTag.length);
                    }
                    if (end.end) {
                        let endTag = "\n<!-- " + (end.end === true ? "End" : end) + " -->";
                        let endIndex = md.lastIndexOf(endTag);
                        if (endIndex > 1)
                            md = md.substring(0, endIndex);
                    }
                    let header1 = "# " + name + "\n";
                    if (md.startsWith(header1))
                        md = md.substring(header1.length);
                    header1 = "# " + name + "\r\n";
                    if (md.startsWith(header1))
                        md = md.substring(header1.length);
                    if (end.urls instanceof Array) {
                        for (let i = 0; i < end.urls.length; i++) {
                            const replaceItem = end.urls[i];
                            if (!(replaceItem === null || replaceItem === void 0 ? void 0 : replaceItem.old) || typeof replaceItem.old !== "string" || typeof replaceItem.by !== "string")
                                continue;
                            md = md.replace(`(${replaceItem.old})`, `(${replaceItem.by})`);
                        }
                    }
                    md = md
                        .replace(/\]\(..\/..\/..\/..\//g, "](..4./")
                        .replace(/\]\(..\/..\/..\//g, "](..3./")
                        .replace(/\]\(..\/..\//g, "](..2./")
                        .replace(/\]\(..\//g, "](" + path.relative("../").value)
                        .replace(/\]\(..4.\//g, "](" + path.relative("../../../../").value)
                        .replace(/\]\(..3.\//g, "](" + path.relative("../../../").value)
                        .replace(/\]\(..2.\//g, "](" + path.relative("../../").value)
                        .replace(/\]\(.\//g, "](" + path.relative("./").value);
                    this._inner.content = md;
                    return md;
                });
            }
            relative(path) {
                return this._inner.rela.relative(path);
            }
            related(options) {
                var _a;
                const arr = (_a = this._inner.data) === null || _a === void 0 ? void 0 : _a.related;
                if (!arr || arr.length < 1)
                    return [];
                return arr.map(link => {
                    if (!link)
                        return undefined;
                    if (typeof link === "string")
                        return link;
                    const name = MdBlogs.getLocaleProp(link, null, options);
                    if (!name)
                        return undefined;
                    const disable = MdBlogs.getLocaleProp(link, "disable", options);
                    if (disable) {
                        if (disable === "label" || disable === "header") {
                            const lableRefKey = MdBlogs.getLocaleProp(link, "ref", options);
                            if (!lableRefKey)
                                return name;
                            return this.string(lableRefKey === true ? name : lableRefKey, options) || name;
                        }
                        return undefined;
                    }
                    let url = MdBlogs.getLocaleProp(link, "url", options);
                    if (url && typeof url === "string" && url.startsWith("."))
                        url = this.relative(url);
                    return {
                        name: MdBlogs.getLocaleProp(link, null, options),
                        subtitle: MdBlogs.getLocaleProp(link, "subtitle", options),
                        url,
                        data: link.data,
                        newWindow: link.newWindow
                    };
                }).filter(function (link) {
                    return link != null;
                });
            }
            children(options) {
                var _a;
                const specificMkt = (options === null || options === void 0 ? void 0 : options.mkt) && options.mkt !== true;
                const defs = this._inner.definitions;
                if (this._inner.children && !(options === null || options === void 0 ? void 0 : options.reload) && !specificMkt)
                    return this._inner.children;
                const arr = ((_a = this._inner.data) === null || _a === void 0 ? void 0 : _a.children) || [];
                const localeOptions = {
                    mkt: options === null || options === void 0 ? void 0 : options.mkt
                };
                const rela = this._inner.rela;
                const y = this._inner.y;
                const fetchHandler = this._inner.fetch;
                const gallery = this._inner.gallery;
                const list = arr.map(function (blog) {
                    if (!blog || !blog.name || MdBlogs.getLocaleProp(blog, "disable", localeOptions))
                        return null;
                    return new ArticleInfo(blog, {
                        rela,
                        year: y,
                        fetch: fetchHandler,
                        definitions: defs,
                        gallery,
                    });
                }).filter(function (blog) {
                    return blog && blog.getPath() != null;
                });
                if (!specificMkt)
                    this._inner.children = list;
                return list;
            }
            hasKeyword(test) {
                return isStringInArray(this._inner.data.keywords, test);
            }
            isKind(test) {
                var _a;
                return isStringInArray((_a = this._inner.data.options) === null || _a === void 0 ? void 0 : _a.kind, test);
            }
            string(key, options) {
                var _a;
                if (!key || typeof key !== "string")
                    return undefined;
                if (!options)
                    options = {};
                return MdBlogs.getLocaleProp((_a = this._inner.definitions) === null || _a === void 0 ? void 0 : _a.strings, key, {
                    mkt: options.mkt
                }) || MdBlogs.getLocaleString(key, options.mkt) || options.fallback;
            }
            toJSON() {
                return this._inner.data;
            }
            getDirPath(options) {
                let path = "./";
                if (this._inner.year)
                    path += this._inner.year + "/";
                const dir = MdBlogs.getLocaleProp(this._inner.data, "dir", options);
                if (dir) {
                    path += dir;
                    if (!dir.endsWith("/"))
                        path += "/";
                }
                return path;
            }
        }
        MdBlogs.ArticleInfo = ArticleInfo;
        function getThumbInternal(pic, kind) {
            if (!pic)
                return undefined;
            if (typeof pic === "string")
                return pic;
            const p = kind ? pic[kind] : undefined;
            if (p)
                return p;
            switch (kind) {
                case "square":
                    return pic.common || pic.tall || pic.wide;
                case "common":
                    return pic.wide || pic.square || pic.tall;
                case "wide":
                    return pic.common || pic.square || pic.tall;
                case "tall":
                    return pic.square || pic.common || pic.wide;
                default:
                    return pic.square || pic.common || pic.tall || pic.wide;
            }
        }
        function isStringInArray(arr, test) {
            if (!test || typeof test !== "string")
                return false;
            if (!arr)
                return false;
            if (typeof arr === "string")
                arr = [arr];
            test = test.toLowerCase();
            for (let i = 0; i < arr.length; i++) {
                let item = arr[i];
                if (!item)
                    continue;
                if (typeof item !== "string") {
                    item = item.value;
                    if (!item || typeof item !== "string")
                        continue;
                }
                if (item.toLowerCase() === test)
                    return true;
            }
            return false;
        }
    })(MdBlogs = DeepX.MdBlogs || (DeepX.MdBlogs = {}));
})(DeepX || (DeepX = {}));
//# sourceMappingURL=info.js.map