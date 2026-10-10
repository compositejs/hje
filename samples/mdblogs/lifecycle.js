"use strict";
var DeepX;
(function (DeepX) {
    var MdBlogs;
    (function (MdBlogs) {
        /**
         * Renders a markdown blog UX.
         * @param element The element to render.
         * @param data The URL of articles config or the collection of articles.
         * @param options The options.
         * @returns The view generating context.
         */
        function render(element, data, options) {
            const q = Hje.queryArray();
            if (!options)
                options = {};
            const defaultTitle = options.title ? (options.title === true ? document.title : options.title) : undefined;
            const monitor = {
                skip: true
            };
            const lifecycle = {
                oninit(instance) {
                    var _a;
                    monitor.skip = false;
                    const path = (_a = instance.select()) === null || _a === void 0 ? void 0 : _a.getRoutePath();
                    if (!path)
                        return;
                    history.replaceState({ select: path }, "", `?${path}`);
                },
                onselect(instance, article) {
                    if (monitor.skip)
                        return;
                    const path = article.getRoutePath();
                    const title = defaultTitle || instance.title || MdBlogs.getLocaleString("blog");
                    history.pushState({ select: path }, "", `?${path}`);
                    document.title = title ? `${article.name} - ${title}` : article.name;
                },
                onhome(instance) {
                    if (monitor.skip)
                        return;
                    history.pushState({ select: "" }, "", "./");
                    const title = defaultTitle || instance.title;
                    if (title)
                        document.title = title;
                }
            };
            const d = {
                articles: data,
                lifecycle,
                banner: options.banner,
                supplement: options.supplement,
                galleryUrl: options.galleryUrl,
                onselect: options.onselect,
                onhome: options.onhome,
                onfetch: options.onfetch,
            };
            if (q && q.length > 0) {
                if (typeof q[0] === "string")
                    d.select = q[0];
                d.mkt = Hje.getValueFromKeyedArray(q, "mkt");
                d.q = Hje.getValueFromKeyedArray(q, "q");
            }
            const component = Hje.render(element, {
                component: MdBlogs.ArticlesPart,
                data: d
            });
            window.addEventListener("popstate", function (ev) {
                lifecycle.disable = true;
                const path = !ev.state ? "" : ev.state.select;
                if (typeof path === "string" || path === null) {
                    let title = defaultTitle || component.title;
                    if (path) {
                        const article = component.select(path);
                        if (!article)
                            return;
                        document.title = title ? `${article.name} - ${title}` : article.name;
                    }
                    else {
                        component.home();
                        document.title = title || MdBlogs.getLocaleString("blog");
                    }
                }
                lifecycle.disable = false;
            });
            return component;
        }
        MdBlogs.render = render;
    })(MdBlogs = DeepX.MdBlogs || (DeepX.MdBlogs = {}));
})(DeepX || (DeepX = {}));
//# sourceMappingURL=lifecycle.js.map