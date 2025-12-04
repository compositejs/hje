namespace DeepX.MdBlogs {
    export function render(element: any, data: string | Articles, options: {
        title?: string | boolean;
        banner?: Hje.DescriptionContract;
        supplement?: Hje.DescriptionContract;
    }) {
        const q = Hje.getQuery();
        if (!options) options = {};
        const defaultTitle = options.title ? (options.title === true ? document.title : options.title) : undefined;
        const monitor = {
            skip: true
        };
        const lifecycle: IArticlesLifecycle = {
            oninit() {
                monitor.skip = false;
            },
            onselect(instance, article: ArticleInfo) {
                if (monitor.skip) return;
                const path = article.getRoutePath();
                const title = defaultTitle || instance.title || getLocaleString("blogs");
                history.pushState({ select: path }, "", `?${path}`);
                document.title = title ? `${article.name} - ${title}` : article.name;
            },
            onhome(instance) {
                if (monitor.skip) return;
                history.pushState({ select: "" }, "", "");
                document.title = defaultTitle || instance.title;
            }
        };
        const d = {
            articles: data,
            lifecycle,
            banner: options.banner,
            supplement: options.supplement,
        } as any;
        if (q && q.length > 0) {
            if (typeof q[0] === "string") d.select = q[0];
            d.mkt = Hje.getValueFromKeyedArray(q, "mkt");
        }

        const component = Hje.render(element, {
            control: ArticlesPart,
            data: d
        });
        const control = component.control() as ArticlesPart;
        window.addEventListener("popstate", function (ev) {
            lifecycle.disable = true;
            const path = !ev.state ? "" : ev.state.select;
            if (typeof path === "string" || path === null) {
                let title = defaultTitle || control.title;
                if (path) {
                    const article = control.select(path);
                    if (!article) return;
                    document.title = title ? `${article.name} - ${title}` : article.name;
                } else {
                    control.home();
                    document.title = title || getLocaleString("blogs");
                }
            }

            lifecycle.disable = false;
        });
        return component;
    }
}
