namespace Hje {
    /**
     * The relative path info.
     */
    export class RelativePathInfo {
        private _info = {
            abs: false as boolean | string,
            arr: undefined as string[],
            back: undefined as number,
            value: undefined as string,
            part: undefined as string,
        };

        /**
         * Initializes a new instance of the RelativePathInfo class.
         * @param path The current path.
         */
        constructor(path: string) {
            if (!path) return;
            path = removeQuestionAndHash(path);
            let protocal = path.indexOf("://");
            let host: string;
            if (protocal >= 0 && protocal < path.indexOf("/")) {
                protocal += 3;
                host = path.substring(0, protocal);
                path = path.substring(path.indexOf("/", protocal))
            }

            const arr = path.split("/");
            let back = 0;
            const list = [];
            for (let i = 0; i < arr.length; i++) {
                const dir = arr[i];
                if (!dir || dir === ".") continue;
                if (dir === "..") {
                    if (list.length < 1) back++;
                    else list.pop();
                    continue;
                }

                list.push(dir);
            }

            if (path.endsWith("/")) list.push("");
            this._info.arr = list;
            this._info.abs = host || path.startsWith("/");
            this._info.back = this._info.abs ? 0 : back;
            this._info.part = this._info.value = list.join("/");
            this._info.part = "/" + this._info.part;
            if (this._info.abs) return;
            if (this._info.back === 0) {
                if (host) this._info.value = host + "/" + this._info.value;
                else this._info.value = "./" + this._info.value;
            } else {
                for (let i = 0; i < this._info.back; i++) {
                    this._info.value = "../" + this._info.value;
                }
            }
        }

        /**
         * Gets the relative path.
         */
        get value() {
            return this._info.value;
        }

        /**
         * Gets the path started from the directory marked.
         */
        get childPath() {
            return this._info.part;
        }

        /**
         * Gets the post generator of target to describe the path.
         */
        get parentLevel() {
            return this._info.back;
        }

        /**
         * Gets a value indicating whether current path is absolute.
         */
        get isAbsolute() {
            return this._info.abs;
        }

        /**
         * Gets an array about the path.
         * @param onlyChildPathName true if only return the path name without upper information; otherwise, false.
         * @returns An array of each directory name in the path.
         */
        toPathArray(onlyChildPathName = false) {
            if (onlyChildPathName) return this._info.arr;
            let arr = [];
            for (let i = 0; i < this._info.back; i++) {
                arr.push("..");
            }

            for (let i = 0; i < this._info.arr.length; i++) {
                arr.push(this._info.arr[i]);
            }

            return arr;
        }

        /**
         * Creates a specific relative path info.
         * @param path The path relatived with this one.
         * @returns A new relative path info of the specific.
         */
        relative(path: string | RelativePathInfo) {
            if (!path) return this;
            if (typeof path === "string") path = new RelativePathInfo(path);
            if (path.isAbsolute) return path;
            let p = this._info.value;
            const i = p.lastIndexOf("/");
            if (i < 0) return path;
            p = p.substring(0, i + 1) + path.value;
            path = new RelativePathInfo(p);
            return path;
        }

        /**
         * Converts to a string.
         * @returns A string about this path.
         */
        toString() {
            return this._info.value;
        }

        /**
         * Converts to a JSON.
         * @returns A JSON converted.
         */
        toJSON() {
            return this._info.value;
        }
    }

    /**
     * Gets a specific cookie value.
     * @param key The cookie key.
     * @returns The value of cookie; or empty string, if not found.
     */
    export function getCookie(key: string) {
        if (!key) return document.cookie;
        key += "=";
        const ca = document.cookie.split(";");
        for (const i in ca) {
            let c = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1);
            }

            if (c.startsWith(key)) return decodeURIComponent(c.substring(key.length));
        }
        return "";
    }

    /**
     * Gets the location search (query) in an array.
     * @returns The key-value pair of query in an array.
     */
    export function queryArray() {
        if (!location.search || location.search.length < 2) return [];
        const arr = location.search.substring(1).split("&");
        const list = [];
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            const j = item.indexOf("=");
            if (j < 0) list.push(item);
            else list.push({
                key: decodeURIComponent(item.substring(0, j)),
                value: decodeURIComponent(item.substring(j + 1))
            });
        }

        return list;
    }

    /**
     * Gets the specific query value.
     * @param name The query name.
     * @param options Additional options to control resolving.
     * @returns The value of the query.
     */
    export function getQuery(name: string, options?: {
        notToDecode?: boolean;
        fallback?: string | null | undefined;
    }) {
        const url = location.search;
        if (!options) options = { fallback: "" };
        if (name == null)
            return null;
        try {
            if (typeof name === "string") {
                var result = url.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
                if (result == null || result.length < 1) {
                    return options.fallback;
                }

                return options.notToDecode ? result[1] : decodeURIComponent(result[1]);
            }
            else if (typeof name === "number") {
                var result = url.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
                if (result == null) {
                    return options.fallback;
                }

                return options.notToDecode ? result[name].substring(1) : decodeURIComponent(result[name].substring(1));
            }
        }
        catch (ex) { }
            return null;
    }

    /**
     * Gets the value with a specific key from a key-value pairs.
     * @param arr The key-value pairs.
     * @param key The key.
     * @returns The value.
     */
    export function getValueFromKeyedArray(arr: (string | { key: string, value: string; })[], key: string) {
        if (!arr || arr.length === 0) return undefined;
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            if (!item || typeof item === "string" || item.key !== key) continue;
            return item.value;
        }

        return undefined;
    }

    /**
     * Gets the contennt of location search (query).
     * @param path The query string.
     * @returns A query without question mark and hash mark.
     */
    function removeQuestionAndHash(path: string): string {
        let j = path.indexOf("?");
        if (j < 0) j = path.indexOf("#");
        if (j < 0) j = path.indexOf("\n");
        if (j < 0) j = path.indexOf("\r");
        return j < 0 ? path : path.substring(0, j);
    }
}