namespace DeepX.MdBlogs {
    /**
     * Renders a markdown blogs UX.
     * @param element The element to render.
     * @param data The URL of articles config or the collection of articles.
     * @param options The options.
     * @returns The view generating context.
     */
    export function render(element: any, data: string | Articles, options: {
        title?: string | boolean;
        banner?: Hje.DescriptionContract;
        supplement?: Hje.DescriptionContract;
        onselect?(ev: {
            children: Hje.DescriptionContract[];
            article: ArticleInfo;
            mkt: string | boolean | undefined;
            store: any;
        }): void;
        onhome?(ev: {
            model: Hje.DescriptionContract;
            mkt: string | boolean | undefined;
            store: any;
        }): void;
    }) {
        const q = Hje.queryArray();
        if (!options) options = {};
        const defaultTitle = options.title ? (options.title === true ? document.title : options.title) : undefined;
        const monitor = {
            skip: true
        };
        const lifecycle: IArticlesLifecycle = {
            oninit(instance) {
                monitor.skip = false;
                const path = instance.select()?.getRoutePath();
                if (!path) return;
                history.replaceState({ select: path }, "", `?${path}`);
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
                history.pushState({ select: "" }, "", "./");
                document.title = defaultTitle || instance.title;
            }
        };
        const d = {
            articles: data,
            lifecycle,
            banner: options.banner,
            supplement: options.supplement,
            onselect: options.onselect,
            onhome: options.onhome,
        } as IArticlesPartData;
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
