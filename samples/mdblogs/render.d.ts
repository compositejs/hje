declare namespace DeepX.MdBlogs {
    class ArticlesPart extends Hje.DataComponent<IArticlesPartData, {
        select?: ArticleInfo | null;
        info?: Articles;
        mkt?: string | boolean;
        lifecycle?: IArticlesLifecycle;
        title?: string;
    }> {
        constructor(args: any);
        get title(): string | undefined;
        set title(value: string);
        get mkt(): string | boolean | undefined;
        set mkt(value: string | boolean);
        defs(key: string): any;
        home(q?: string): void;
        select(article?: ArticleInfo | string): ArticleInfo | null | undefined;
        next(): ArticleInfo | null | undefined;
        previous(): ArticleInfo | null | undefined;
        parent(): ArticleInfo | null | undefined;
        protected initRender(articles: Articles, select: string | undefined, q: string | undefined, lifecycle: IArticlesLifecycle): void;
        protected refreshMenu(): void;
        protected createLocaleOptions(): {
            mkt: string | false;
        } | undefined;
        protected lifecycle(): IArticlesLifecycle | undefined;
        genArticleList(q: string | undefined, options?: {
            mkt?: string | boolean;
        }): {
            tagName: string;
            className: string;
            children: Hje.DescriptionContract[];
        };
        string(key: string, options?: {
            mkt?: string | boolean;
            fallback?: string;
        }): any;
        protected genMenu(arr: Hje.DescriptionContract[], params: (ArticleInfo | string)[], deep?: boolean | number): Hje.DescriptionContract;
    }
}
