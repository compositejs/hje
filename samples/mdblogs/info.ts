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
        private _inner = {
            rela: undefined as Hje.RelativePathInfo,
            data: undefined as IArticleInfo,
            date: undefined as Date,
            year: undefined as string,
            children: undefined as ArticleInfo[],
            fetch: undefined as ((url: Hje.RelativePathInfo) => Promise<string>),
            content: undefined as string,
            authors: undefined as IAuthorInfo[],
            author: undefined as IAuthorInfo[],
        }

        constructor(data: IArticleInfo, options: IArticleInfoOptions) {
            this._inner.fetch = options?.fetch;
            this._inner.rela = options?.rela || new Hje.RelativePathInfo("./");
            this._inner.authors = options?.authors || [];
            if (!data) {
                this._inner.data = {} as any;
                return;
            }

            this._inner.data = data;
            this._inner.date = toDate(data.date);
            let p = "./";
            const y = options?.year;
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
            return this._inner.data?.keywords || [] as string[];
        }

        get intro() {
            return getLocaleProp(this._inner.data, "intro") as string;
        }

        get notes() {
            return (getLocaleProp(this._inner.data, "notes") || []) as string[];
        }

        get author() {
            if (this._inner.author) return this._inner.author;
            let name = this._inner.data.author;
            if (!name) {
                this._inner.author = [];
                return this._inner.author;
            }

            if (!(name instanceof Array)) name = [name];
            const arr = [];
            for (let i = 0; i < name.length; i++) {
                const n = name[i];
                if (!n) continue;
                if (typeof n === "string") {
                    const authorInfo = this._inner.authors.find(a => a.name === n || a.email === n);
                    if (authorInfo) arr.push(authorInfo);
                    else arr.push({ name: n });
                } else if (n.name) {
                    arr.push(n);
                }
            }

            this._inner.author = arr;
            return arr;
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

        get end() {
            return this._inner.data?.end;
        }

        get data() {
            return this._inner.data?.data;
        }

        get disableMenu() {
            return this._inner.data ? this._inner.data.disableMenu : true;
        }

        getRoutePath(options?: {
            mkt?: string | boolean;
        }) {
            const data = this._inner.data;
            let dir = this.getDirPath(options);
            if (!data || !dir || dir.length < 4) return undefined;
            dir = dir.substring(2, dir.length - 1);
            const file = getLocaleProp(data, "file", { mkt: options?.mkt })
            if (typeof file === "boolean") {
            } else if (typeof file === "string") {
                dir += "/" + (file.toLowerCase().endsWith(".md") ? file.substring(0, file.length - 3) : file);
            }

            if (dir.endsWith("/")) dir = dir.substring(0, dir.length - 1);
            return dir;
        }

        is(name: string, options?: {
            kind?: "id" | "full" | "simple" | "auto" | null | {},
            mkt?: string | boolean;
        }) {
            const data = this._inner.data;
            if (!data || !name) return false;
            if (name as any === this || name as any === data) return true;
            let kind = options?.kind;
            const bind = (typeof kind === "object" ? kind : {}) as { kind: string };
            if (!kind) kind = "auto";
            else if (kind === bind) kind = "auto";
            if (kind === "auto" || kind === "id") {
                if (typeof data.id === "string" && data.id.length > 10 && data.id === name) {
                    bind.kind = "id";
                    return true;
                }
            }

            const localeOptions = { mkt: options?.mkt };
            let dirName = getLocaleProp(data, "dir");
            if (dirName && !dirName.endsWith("/")) dirName += "/";
            if (kind === "auto" || kind === "full") {
                let dir = name.startsWith("/") ? "/" : "";
                if (this._inner.year) dir += this._inner.year + "/";
                if (dirName) dir += dirName;
                if (isSamePath(name, data.file, dir)
                    || isSamePath(name, getLocaleProp(data, "file", localeOptions), dir)) {
                    bind.kind = "full";
                    return true;
                }
            }

            if (kind === "auto" || kind === "simple") {
                let dir = name.startsWith("/") ? "/" : "";
                if (dirName) dir += dirName;
                if (isSamePath(name, data.file, dir)
                    || isSamePath(name, getLocaleProp(data, "file", localeOptions), dir)) {
                    bind.kind = "simple";
                    return true;
                }
            }

            return false;
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
                        return Promise.resolve(s);
                    });
                });
            if (!result) return Promise.reject();
            return result.then(r => {
                if (r) r = r
                    .replace(/\(..\/..\/..\/..\//g, "(..4./")
                    .replace(/\(..\/..\/..\//g, "(..3./")
                    .replace(/\(..\/..\//g, "(..2./")
                    .replace(/\(..\//g, "(" + path.relative("../").value)
                    .replace(/\(..4.\//g, "(" + path.relative("../../../../").value)
                    .replace(/\(..3.\//g, "(" + path.relative("../../../").value)
                    .replace(/\(..2.\//g, "(" + path.relative("../../").value)
                    .replace(/\(.\//g, "(" + path.relative("./").value);
                this._inner.content = r;
                return r;
            });
        }

        related(options?: {
            mkt?: string | boolean;
        }): IArticleRelatedLinkItemInfo[] {
            const arr = this._inner.data?.related;
            if (!arr || arr.length < 1) return [];
            return arr.filter(function (link) {
                return link?.name != null && !getLocaleProp<any>(link, "disable", options);
            }).map(function (link) {
                return {
                    name: getLocaleProp(link, null, options),
                    subtitle: getLocaleProp(link, "subtitle", options),
                    url: getLocaleProp(link, "url", options),
                    data: link.data
                };
            });
        }

        children(options?: IArticleLocaleOptions) {
            const specificMkt = options?.mkt && options.mkt !== true;
            const authors = this._inner.authors;
            if (this._inner.children && !options?.reload && !specificMkt) return this._inner.children;
            const arr = this._inner.data?.children || [];
            const localeOptions = {
                mkt: options?.mkt
            };
            const rela = this._inner.rela;
            const fetchHandler = this._inner.fetch;
            const list = arr.map(function (blog) {
                if (!blog || !blog.name || getLocaleProp(blog, "disable", localeOptions)) return null;
                return new ArticleInfo(blog, {
                    rela,
                    year: false,
                    fetch: fetchHandler,
                    authors: authors,
                });
            }).filter(function (blog) {
                return blog != null && blog.getPath() != null;
            });
            if (!specificMkt) this._inner.children = list;
            return list;
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

}