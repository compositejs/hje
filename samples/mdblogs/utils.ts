namespace DeepX.MdBlogs {
    export function setElementProp(element: HTMLElement | string, key: string | null, value: any) {
        if (!element) return;
        if (typeof element === "string") element = document.getElementById(element);
        if (!element || !element.tagName) return;
        if (key == null) key = element.innerText = value;
        else if (key === "display" && typeof value === "boolean") key = element.style.display = value ? "" : "none";
        else (element as any)[key] = value;
    }

    export function batchSetElementProp(list: {
        element: HTMLElement | string,
        key?: string | null,
        value: any
    }[]) {
        if (!list || !(list instanceof Array)) return;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (!item || !item.element) continue;
            DeepX.MdBlogs.setElementProp(item.element, item.key, DeepX.MdBlogs.getLocaleProp(item, "value"))
        }
    }

    export function firstQuery() {
        var id = location.search;
        if (!!id && id.length > 1) {
            id = id.substring(1);
            var idEndPos = id.indexOf("?");
            if (idEndPos >= 0) id = id.substring(0, idEndPos);
            idEndPos = id.indexOf("&");
            if (idEndPos >= 0) id = id.substring(0, idEndPos);
        }

        return id;
    }

    export function filterFirst<T>(arr: T[], predicate: (item: T, index: number) => boolean) {
        if (!arr) return undefined;
        arr = arr.filter(predicate);
        return arr.length > 0 ? arr[0] : undefined;
    }

    /* Copied from LangPack */

    function getKeyedPropValue(obj: any, key1: string, key2: string, options: {
        bind?: any;
        fallback?: any;
    }) {
        let key = key1;
        let v = obj[key];
        if (v === undefined && key2) {
            key = key2;
            v = obj[key2];
        }

        if (v === undefined) return options?.fallback;
        const b = options?.bind;
        if (b) b.key = key;
        return v;
    }

    export function getLocaleProp<T = any>(obj: T, key?: keyof(T) | null, options?: {
        mkt?: string | boolean;
        fallback?: any;
        bind?: any;
    }) {
        if (!obj) return options?.fallback || undefined;
        let mkt: string;
        const b = options?.bind || {};
        if (typeof options?.mkt === "string") mkt = options?.mkt;
        if (!mkt && options?.mkt !== false && typeof navigator === "object") mkt = navigator.language;
        if (!key) key = "name" as any;
        if (typeof key !== "string") return getKeyedPropValue(obj, key as any, undefined, options);
        if (!mkt || typeof mkt !== "string") return getKeyedPropValue(obj, key, undefined, options);
        let k = `${key}#${mkt}`;
        let v = (obj as any)[k];
        if (v !== undefined) {
            b.key = k;
            return v;
        }

        const arr = mkt.split("-");
        if (arr.length < 2) return getKeyedPropValue(obj, key, undefined, options);
        if (arr.length === 2) return getKeyedPropValue(obj, `${key}#${arr[0]}`, key, options);
        const special = `${key}#${arr[0]}-${arr[2]}`;
        while (arr.length > 2) {
            arr.pop();
            k = "";
            for (let j = 0; j < arr.length; j++) {
                v = arr[j];
                if (!v) continue;
                if (k) k += "-";
                k += v;
            }

            v = (obj as any)[`${key}#${k}`];
            if (v !== undefined) return v;
        }

        v = (obj as any)[special];
        if (v !== undefined) {
            b.key = special;
            return v;
        }

        return getKeyedPropValue(obj, `${key}#${arr[0]}`, key, options);
    }
}