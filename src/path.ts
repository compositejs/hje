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
         * Gets the current relative path.
         */
        get value() {
            return this._info.value;
        }

        get childPath() {
            return this._info.part;
        }

        get parentLevel() {
            return this._info.back;
        }

        get isAbsolute() {
            return this._info.abs;
        }

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

        toString() {
            return this._info.value;
        }

        toJSON() {
            return this._info.value;
        }
    }

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

    export function getQuery() {
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

    export function getValueFromKeyedArray(arr: (string | { key: string, value: string; })[], key: string) {
        if (!arr || arr.length === 0) return undefined;
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            if (!item || typeof item === "string" || item.key !== key) continue;
            return item.value;
        }

        return undefined;
    }

    function removeQuestionAndHash(path: string): string {
        let j = path.indexOf("?");
        if (j < 0) j = path.indexOf("#");
        if (j < 0) j = path.indexOf("\n");
        if (j < 0) j = path.indexOf("\r");
        return j < 0 ? path : path.substring(0, j);
    }
}