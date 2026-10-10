"use strict";
var DeepX;
(function (DeepX) {
    var MdBlogs;
    (function (MdBlogs) {
        function setElementProp(element, key, value) {
            if (!element)
                return;
            if (typeof element === "string")
                element = document.getElementById(element);
            if (!element || !element.tagName)
                return;
            if (key == null)
                key = element.innerText = value;
            else if (key === "display" && typeof value === "boolean")
                key = element.style.display = value ? "" : "none";
            else
                element[key] = value;
        }
        MdBlogs.setElementProp = setElementProp;
        function batchSetElementProp(list) {
            if (!list || !(list instanceof Array))
                return;
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (!item || !item.element)
                    continue;
                DeepX.MdBlogs.setElementProp(item.element, item.key, DeepX.MdBlogs.getLocaleProp(item, "value"));
            }
        }
        MdBlogs.batchSetElementProp = batchSetElementProp;
        function firstQuery() {
            var id = location.search;
            if (!!id && id.length > 1) {
                id = id.substring(1);
                var idEndPos = id.indexOf("?");
                if (idEndPos >= 0)
                    id = id.substring(0, idEndPos);
                idEndPos = id.indexOf("&");
                if (idEndPos >= 0)
                    id = id.substring(0, idEndPos);
            }
            return id;
        }
        MdBlogs.firstQuery = firstQuery;
        function filterFirst(arr, predicate) {
            if (!arr)
                return undefined;
            arr = arr.filter(predicate);
            return arr.length > 0 ? arr[0] : undefined;
        }
        MdBlogs.filterFirst = filterFirst;
        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        MdBlogs.scrollToTop = scrollToTop;
        function getCaseClassName(obj, key, options) {
            if (!obj)
                return undefined;
            const cap = DeepX.MdBlogs.getLocaleProp(obj, key || "nameCase", options);
            if (!cap)
                return undefined;
            switch (cap.toLowerCase()) {
                case "upper":
                    return "x-text-case-upper";
                case "lower":
                    return "x-text-case-lower";
                case "captial":
                    return "x-text-case-capital";
                case "small":
                    return "x-text-case-small";
                default:
                    return undefined;
            }
        }
        MdBlogs.getCaseClassName = getCaseClassName;
        /* Copied from LangPack */
        function getKeyedPropValue(obj, key1, key2, options) {
            let key = key1;
            let v = obj[key];
            if (v === undefined && key2) {
                key = key2;
                v = obj[key2];
            }
            if (v === undefined)
                return options === null || options === void 0 ? void 0 : options.fallback;
            const b = options === null || options === void 0 ? void 0 : options.bind;
            if (b)
                b.key = key;
            return v;
        }
        function getLocaleProp(obj, key, options) {
            if (!obj)
                return (options === null || options === void 0 ? void 0 : options.fallback) || undefined;
            let mkt;
            const b = (options === null || options === void 0 ? void 0 : options.bind) || {};
            if (typeof (options === null || options === void 0 ? void 0 : options.mkt) === "string")
                mkt = options === null || options === void 0 ? void 0 : options.mkt;
            if (!mkt && (options === null || options === void 0 ? void 0 : options.mkt) !== false && typeof navigator === "object")
                mkt = navigator.language;
            if (!key)
                key = "name";
            if (typeof key !== "string")
                return getKeyedPropValue(obj, key, undefined, options);
            if (!mkt || typeof mkt !== "string")
                return getKeyedPropValue(obj, key, undefined, options);
            let k = `${key}#${mkt}`;
            let v = obj[k];
            if (v !== undefined) {
                b.key = k;
                return v;
            }
            const arr = mkt.split("-");
            if (arr.length < 2)
                return getKeyedPropValue(obj, key, undefined, options);
            if (arr.length === 2)
                return getKeyedPropValue(obj, `${key}#${arr[0]}`, key, options);
            const special = `${key}#${arr[0]}-${arr[2]}`;
            while (arr.length > 2) {
                arr.pop();
                k = "";
                for (let j = 0; j < arr.length; j++) {
                    v = arr[j];
                    if (!v)
                        continue;
                    if (k)
                        k += "-";
                    k += v;
                }
                v = obj[`${key}#${k}`];
                if (v !== undefined)
                    return v;
            }
            v = obj[special];
            if (v !== undefined) {
                b.key = special;
                return v;
            }
            return getKeyedPropValue(obj, `${key}#${arr[0]}`, key, options);
        }
        MdBlogs.getLocaleProp = getLocaleProp;
    })(MdBlogs = DeepX.MdBlogs || (DeepX.MdBlogs = {}));
})(DeepX || (DeepX = {}));
//# sourceMappingURL=utils.js.map