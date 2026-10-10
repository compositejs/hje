declare namespace DeepX.MdBlogs {
    class Articles {
        private _inner;
        constructor(data: IArticleCollection, options: {
            path?: string | Hje.RelativePathInfo;
            fetch?: (url: Hje.RelativePathInfo) => Promise<string>;
        });
        get name(): any;
        get description(): any;
        get options(): {
            disableName?: boolean;
            disableAuthors?: boolean;
            disableMenu?: boolean;
            disableSearch?: boolean;
            linksTitle?: string;
            galleryTitle?: string;
            galleryTips?: string;
            keywordsTitle?: string;
            contentCreatorTitle?: string;
            seeAlsoTitle?: string;
            otherLinksTitle?: string;
            search?: string;
            previous?: string;
            next?: string;
            back?: string;
            empty?: string;
        };
        defs(key: string): any;
        blogsInfo(options?: {
            mkt?: string | boolean;
        }): {
            name: any;
            count: number | undefined;
            dir: any;
            further: any;
        };
        getName(options?: ILocalePropOptions<string>): any;
        getDescription(optional?: ILocalePropOptions<string>): any;
        home(options?: IArticleLocaleOptions): ArticleInfo | undefined;
        blog(options?: IArticleLocaleOptions): ArticleInfo[];
        docs(options?: IArticleLocaleOptions): (string | ArticleInfo)[];
        hiddenArticles(options?: IArticleLocaleOptions): ArticleInfo[];
        gallery(): IImageGalleryInfo[] | undefined;
        links(options?: {
            mkt?: string | boolean;
        }): {
            [property: string]: any;
            name: string;
            url: string;
            newWindow?: boolean;
        }[];
        addBlog(article: IArticleInfo): ArticleInfo | undefined;
        addDocs(article: IArticleInfo | string | IArticleLabelInfo): any;
        addHiddenArticle(article: IArticleInfo): ArticleInfo | undefined;
        clearBlog(): void;
        clearDocs(): void;
        clearHiddenArticles(): void;
        toJSON(): IArticleCollection;
        loadMoreBlog(): Promise<boolean>;
        get(name: string, options?: {
            mkt?: string | boolean;
        }): ArticleInfo | undefined;
        search(q: string, options?: {
            mkt?: string | boolean;
        }): ArticleInfo[] | undefined;
        genInfo(article: IArticleInfo, list?: ArticleInfo[] | any[]): ArticleInfo | undefined;
        relative(path: string | Hje.RelativePathInfo): Hje.RelativePathInfo;
        some(callback: (item: ArticleInfo, index: number) => boolean, thisArg?: any, options?: {
            mkt?: string | boolean;
        }): boolean;
        nextArticle(current: ArticleInfo | undefined | null, options?: {
            mkt?: string | boolean;
        }): ArticleInfo | null | undefined;
        previousArticle(current: ArticleInfo | undefined | null, options?: {
            mkt?: string | boolean;
        }): ArticleInfo | null | undefined;
        parentArticle(current: ArticleInfo | undefined | null, options?: {
            mkt?: string | boolean;
        }): ArticleInfo | null | undefined;
        /**
         * Gets the string registered by given key.
         * @param key The key to get string.
         * @param options The options.
         * @returns A string; or undefined, if does not exist nor has no fallback value.
         */
        string(key: string, options?: {
            mkt?: string | boolean;
            fallback?: string;
        }): any;
    }
    /**
     * Loads the collection and config of articles.
     * @param url The URL of article collection and config.
     * @param fetchHandler An additional handler to fetch markdown file of article.
     * @returns A promise object of article collection and config.
     */
    function fetchArticles(url: string, fetchHandler?: ((url: Hje.RelativePathInfo) => Promise<string>)): Promise<Articles>;
}
