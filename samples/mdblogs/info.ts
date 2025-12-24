namespace DeepX.MdBlogs {
    function toDate(s: string | Date | number) {
        if (s instanceof Date) return s;
        if (typeof s === "number") return new Date(s);
        let time: Date;
        if (!s) return undefined;
        if (s.length === 8) {
            time = new Date(parseInt(s.substring(0, 4)), parseInt(s.substring(4, 6)) - 1, parseInt(s.substring(6, 8)));
        } else if (s.length === 9) {
            time = new Date(parseInt(s.substring(0, 5)), parseInt(s.substring(5, 7)) - 1, parseInt(s.substring(7, 9)));
        } else if (s.length > 9 && s.includes("-")) {
            time = new Date(s);
        }

        return isNaN(time as any) ? undefined : time;
    }

    function isSamePath(test: string, file: string | boolean, dir: string) {
        if (typeof file === "boolean" || file == null) {
        } else if (typeof file === "string") {
            dir += file.toLowerCase().endsWith(".md") ? file.substring(0, file.length - 3) : file;
        }

        if (dir && test === dir) return true;
        if (dir.endsWith("/") && !test.endsWith("/") && dir.substring(0, dir.length - 1) === test) return true;
        return false;
    }

    export class ArticleInfo {
        private _inner: {
            rela?: Hje.RelativePathInfo;
            data?: IArticleInfo;
            date?: Date;
            definitions?: IArticlesDefinitions;
            y: IArticleYearConfig;
            year?: string;
            children?: ArticleInfo[];
            fetch?: ((url: Hje.RelativePathInfo) => Promise<string>);
            content?: string;
            author?: ContributorCollection;
            keywords?: NameValueModel[];
        } = {
            y: false
        }

        constructor(data: IArticleInfo, options: IArticleInfoOptions) {
            this._inner.fetch = options?.fetch;
            this._inner.rela = options?.rela || new Hje.RelativePathInfo("./");
            const defs = options?.definitions || {};;
            this._inner.definitions = defs;
            if (!data) {
                this._inner.data = {} as any;
                this._inner.keywords = []
                return;
            }

            this._inner.data = data;
            this._inner.date = toDate(data.date);
            this._inner.keywords = nameValueModels(data.keywords, defs.keywords);
            let p = "./";
            const y = options?.year;
            this._inner.y = y;
            if (y && this._inner.date) {
                if (typeof y === "string") {
                    const d = this._inner.date;
                    let group = "";
                    switch (y.toLowerCase()) {
                        case "month":
                        case "m":
                            group += d.getFullYear().toString(10) + "/";
                            if (d.getMonth() < 9) group += "0";
                            group += (d.getMonth() + 1).toString(10);
                            break;
                        case "date":
                        case "day":
                        case "d":
                            group += d.getFullYear().toString(10) + "/";
                            if (d.getMonth() < 9) p += "0";
                            group += (d.getMonth() + 1).toString(10);
                            if (d.getDate() < 10) p += "0";
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
                } else {
                    this._inner.year = this._inner.date.getFullYear().toString(10);
                }
            }
        }

        get id() {
            const s = this._inner.data?.id;
            return typeof s === "string" && s.length > 10 ? s : undefined;
        }

        get name() {
            return getLocaleProp(this._inner.data) as string;
        }

        get subtitle() {
            return getLocaleProp(this._inner.data, "subtitle") as string;
        }

        get keywords() {
            return this._inner.keywords;
        }

        get intro() {
            return getLocaleProp(this._inner.data, "intro") as string;
        }

        get notes() {
            return (getLocaleProp(this._inner.data, "notes") || []) as string[];
        }

        get authors() {
            if (this._inner.author) return this._inner.author;
            let name: IContributorsInfo = this._inner.data.author || this._inner.data.authors || this._inner.data.contributors;
            this._inner.author = new ContributorCollection(name, this._inner.definitions.contributors, this._inner.definitions.roles, ["author", "translator"]);
            return this._inner.author;
        }

        get contentCache() {
            return this._inner.content;
        }

        get dateObj() {
            const date = this._inner.date;
            if (!date) return undefined;
            const y = date.getFullYear();
            if (y < 2000) return undefined;
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
            return this._inner.data?.data;
        }

        get disableMenu() {
            if (!this._inner.data) return true;
            return this._inner.data.options ? this._inner.data.options.disableMenu : false;
        }

        get disableAuthors() {
            if (!this._inner.data) return true;
            return this._inner.data.options ? this._inner.data.options.disableAuthors : false;
        }

        get bannerImage() {
            return this._inner.data?.options ? this._inner.data.options.banner : undefined;
        }

        getRoutePath(options?: {
            mkt?: string | boolean;
        }) {
            const data = this._inner.data;
            let dir = this.getDirPath(options);
            if (!data || !dir) return undefined;
            dir = dir.length < 3 ? "" : dir.substring(2, dir.length - 1);
            const file = getLocaleProp(data, "file", { mkt: options?.mkt })
            if (typeof data.file === "boolean" || data.file == null || typeof file === "boolean" || file == null) {
            } else if (typeof file === "string") {
                dir += (dir ? "/" : "") + (file.toLowerCase().endsWith(".md") ? file.substring(0, file.length - 3) : file);
            }

            if (dir.endsWith("/")) dir = dir.substring(0, dir.length - 1);
            return dir;
        }

        is(name: string, options?: {
            mkt?: string | boolean;
        }) {
            const data = this._inner.data;
            if (!data || !name) return false;
            if (name as any === this || name as any === data) return true;
            if (typeof data.id === "string" && data.id.length > 10 && data.id === name) return true;
            const localeOptions = { mkt: options?.mkt };
            let dirName = getLocaleProp(data, "dir", localeOptions);
            if (dirName && !dirName.endsWith("/")) dirName += "/";
            let dir = name.startsWith("/") ? "/" : "";
            if (this._inner.year) dir += this._inner.year + "/";
            let dir2 = dir;
            if (dirName) dir += dirName;
            if (isSamePath(name, getLocaleProp(data, "file", localeOptions), dir)) return true;
            dirName = data.dir;
            if (dirName && !dirName.endsWith("/")) dirName += "/";
            if (dirName) dir2 += dirName;
            return isSamePath(name, data.file, dir2);
        }

        getPath(options?: ILocalePropOptions<string>) {
            let path = this.getDirPath(options);
            const file = getLocaleProp(this._inner.data, "file", options) as string | boolean;
            if (!path || file == null) return undefined;
            if (file === true || file === undefined) {
                path += "README.md";
            } else if (file === false || file === null) {
            } else {
                path += file;
            }

            return this._inner.rela.relative(path);
        }

        getName(options?: ILocalePropOptions<string>) {
            return getLocaleProp(this._inner.data, null, options) as string;
        }

        getSubtitle(options?: ILocalePropOptions<string>) {
            return getLocaleProp(this._inner.data, "subtitle", options) as string;
        }

        getIntro(options?: ILocalePropOptions<string>) {
            return getLocaleProp(this._inner.data, "intro", options) as string || getLocaleProp(this._inner.data, "description", options) as string;
        }

        getNotes(options?: ILocalePropOptions<string>) {
            return (getLocaleProp(this._inner.data, "notes", options) || []) as string[];
        }

        getThumb(kind?: "square" | "common" | "wide" | "tall") {
            let pic = this._inner.data.thumb;
            if (!pic) return undefined;
            if (typeof pic === "string") return pic;
            let p = pic[kind];
            if (p) return p;
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

        getContent(options: IArticleLocaleOptions) {
            if (this._inner.content !== undefined && !options?.reload) return Promise.resolve(this._inner.content);
            const path = this.getPath({ mkt: options?.mkt });
            if (!path) return Promise.reject("No path.");
            const result = this._inner.fetch
                ? this._inner.fetch.call(this, path) as Promise<string>
                : fetch(path.value).then(function (r) {
                    if (r?.ok) return r.text();
                    return r.text().then(s => {
                        return Promise.reject(new Error("fetch error\n" + s));
                    });
                });
            if (!result) return Promise.reject(new Error("fetch handler error"));
            const name = this.getName(options);
            let end2 = this._inner.data?.end;
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

                    if (endIndex > 1) md = md.substring(endIndex + endTag.length);
                }

                if (end.end) {
                    let endTag = "\n<!-- " + (end.end === true ? "End" : end) + " -->";
                    let endIndex = md.lastIndexOf(endTag);
                    if (endIndex > 1) md = md.substring(0, endIndex);
                }

                let header1 = "# " + name + "\n";
                if (md.startsWith(header1)) md = md.substring(header1.length);
                header1 = "# " + name + "\r\n";
                if (md.startsWith(header1)) md = md.substring(header1.length);
                if (end.urls instanceof Array) {
                    for (let i = 0; i < end.urls.length; i++) {
                        const replaceItem = end.urls[i];
                        if (!replaceItem?.old || typeof replaceItem.old !== "string" || typeof replaceItem.by !== "string") continue;
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

        related(options?: {
            mkt?: string | boolean;
        }): (IArticleRelatedLinkItemInfo | string)[] {
            const arr = this._inner.data?.related;
            if (!arr || arr.length < 1) return [];
            return arr.map(function (link) {
                if (!link) return undefined;
                if (typeof link === "string") return link;
                const name = getLocaleProp(link, null, options);
                if (!name) return undefined;
                const disable = getLocaleProp<any>(link, "disable", options);
                if (disable) {
                    if (disable === "label" || disable === "header") return name;
                    return undefined;
                }

                return {
                    name: getLocaleProp(link, null, options),
                    subtitle: getLocaleProp(link, "subtitle", options),
                    url: getLocaleProp(link, "url", options),
                    data: link.data
                };
            }).filter(function (link) {
                return link != null; 
            });
        }

        children(options?: IArticleLocaleOptions) {
            const specificMkt = options?.mkt && options.mkt !== true;
            const defs = this._inner.definitions;
            if (this._inner.children && !options?.reload && !specificMkt) return this._inner.children;
            const arr = this._inner.data?.children || [];
            const localeOptions = {
                mkt: options?.mkt
            };
            const rela = this._inner.rela;
            const y = this._inner.y;
            const fetchHandler = this._inner.fetch;
            const list = arr.map(function (blog) {
                if (!blog || !blog.name || getLocaleProp(blog, "disable", localeOptions)) return null;
                return new ArticleInfo(blog, {
                    rela,
                    year: y,
                    fetch: fetchHandler,
                    definitions: defs,
                });
            }).filter(function (blog) {
                return blog != null && blog.getPath() != null;
            });
            if (!specificMkt) this._inner.children = list;
            return list;
        }

        hasKeyword(test: string) {
            return isStringInArray(this._inner.data.keywords, test);
        }

        isKind(test: string) {
            return isStringInArray(this._inner.data.options?.kind, test);
        }

        toJSON() {
            return this._inner.data;
        }

        protected getDirPath(options?: ILocalePropOptions<string>) {
            let path = "./";
            if (this._inner.year) path += this._inner.year + "/";
            const dir = getLocaleProp(this._inner.data, "dir", options);
            if (dir) {
                path += dir;
                if (!dir.endsWith("/")) path += "/";
            }

            return path;
        }
    }

    function isStringInArray(arr: string[] | INameValueModelValue | string, test: string) {
        if (!test) return false;
        if (!arr) return false;
        if (typeof arr === "string") arr = [arr];
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            if (!item) continue;
            if (typeof item !== "string") {
                item = item.value;
                if (!item || typeof item !== "string") continue;
            }

            if (item === test) return true;
        }

        return false;
    }
}