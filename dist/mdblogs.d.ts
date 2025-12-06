declare namespace DeepX.MdBlogs {
    export const hooks: {
        renderMd: ((element: HTMLElement, md: string) => void);
    };
    export function showElements(show: string[], hide: string[]): void;
    export function codeElements(element: HTMLElement): HTMLElement[];
    export function generateMenu(params: (ArticleInfo | string)[], options: {
        select?: ArticleInfo;
        deep?: boolean | number;
        mkt?: string | boolean;
        arr?: Hje.DescriptionContract[];
        path?: string | ((original: string, article: ArticleInfo) => string);
        styleRefs?: string | string[];
        click?(ev: Event, article: ArticleInfo): void;
    }): Hje.DescriptionContract;
    export function generateMenuItem(article: ArticleInfo, level: number, path?: string | ((original: string, article: ArticleInfo) => string), click?: (ev: Event, article: ArticleInfo) => void, options?: ILocalePropOptions): Hje.DescriptionContract;
    export function generateCdnScript(name: string, ver: string, url: string, path: string): {
        tagName: string;
        styleRefs: string;
        children: {
            tagName: string;
            children: ({
                tagName: string;
                styleRefs: string;
                children: string;
            } | {
                tagName: string;
                children: string;
                styleRefs?: undefined;
            })[];
        }[];
    };
    interface IButtonListItem {
        styleRefs?: string[] | string | {
            subscribe(h: any): any;
            [property: string]: any;
        };
        style?: any;
        text?: string;
        url?: string;
        title?: string;
        click?(ev: Event): void;
    }
    export function buttonList(config: {
        styleRefs?: string[] | string | {
            subscribe(h: any): any;
            [property: string]: any;
        };
        style?: any;
        groupStyleRefs?: string[] | string | {
            subscribe(h: any): any;
            [property: string]: any;
        };
        data?: any;
        props?: Record<string, unknown>;
        text?: string;
        item?: boolean | IButtonListItem;
        list?: (IButtonListItem | string | number | boolean)[];
        click?(ev: Event): void;
    }): Hje.DescriptionContract;
    export {};
}
declare namespace DeepX.MdBlogs {
    class Articles {
        private _inner;
        constructor(data: IArticleCollection, options: {
            path?: string | Hje.RelativePathInfo;
            fetch?: (url: Hje.RelativePathInfo) => Promise<string>;
        });
        get name(): any;
        get config(): {
            disableName?: boolean;
        };
        blogsInfo(options?: {
            mkt?: string | boolean;
        }): {
            name: any;
            count: number;
            dir: any;
            further: any;
            disableMenu: boolean;
        };
        getName(options?: ILocalePropOptions): any;
        home(options?: IArticleLocaleOptions): ArticleInfo;
        blogs(options?: IArticleLocaleOptions): ArticleInfo[];
        wiki(options?: IArticleLocaleOptions): (string | ArticleInfo)[];
        get(name: string, options?: {
            mkt?: string | boolean;
        }): ArticleInfo;
        genInfo(article: IArticleInfo, list?: ArticleInfo[] | any[]): ArticleInfo;
        some(callback: (item: ArticleInfo, index: number) => boolean, thisArg?: any, options?: {
            mkt?: string | boolean;
        }): boolean;
        nextArticle(current: ArticleInfo, options?: {
            mkt?: string | boolean;
        }): ArticleInfo;
        previousArticle(current: ArticleInfo, options?: {
            mkt?: string | boolean;
        }): ArticleInfo;
    }
    function fetchArticles(url: string, fetchHandler?: ((url: Hje.RelativePathInfo) => Promise<string>)): Promise<Articles>;
}
declare namespace DeepX.MdBlogs {
    class ArticleInfo {
        private _inner;
        constructor(data: IArticleInfo, options: IArticleInfoOptions);
        get id(): string;
        get name(): string;
        get subtitle(): string;
        get keywords(): (string | {
            [property: string]: unknown;
            name?: string;
            value: string;
        })[];
        get intro(): string;
        get notes(): string[];
        get author(): IAuthorInfo[];
        get contentCache(): string;
        get dateObj(): {
            year: number;
            month: number;
            date: number;
        };
        get dateString(): string;
        get location(): string;
        get end(): string | boolean;
        get data(): any;
        get disableMenu(): boolean;
        getRoutePath(options?: {
            mkt?: string | boolean;
        }): string;
        is(name: string, options?: {
            kind?: "id" | "full" | "simple" | "auto" | null | {};
            mkt?: string | boolean;
        }): boolean;
        getPath(options?: ILocalePropOptions<string>): Hje.RelativePathInfo;
        getName(options?: ILocalePropOptions<string>): string;
        getSubtitle(options?: ILocalePropOptions<string>): string;
        getIntro(options?: ILocalePropOptions<string>): string;
        getNotes(options?: ILocalePropOptions<string>): string[];
        getThumb(kind?: "square" | "common" | "wide" | "tall"): string;
        getContent(options: IArticleLocaleOptions): Promise<string>;
        related(options?: {
            mkt?: string | boolean;
        }): IArticleRelatedLinkItemInfo[];
        children(options?: IArticleLocaleOptions): ArticleInfo[];
        toJSON(): IArticleInfo;
        protected getDirPath(options?: ILocalePropOptions<string>): string;
    }
}
declare namespace DeepX.MdBlogs {
    type IYearConfig = boolean | "y" | "year" | "m" | "month" | "d" | "date" | "day";
    export interface IAuthorInfo {
        name: string;
        url?: string;
        email?: string;
        avatar?: string;
    }
    export interface IArticleLocaleOptions {
        reload?: boolean;
        mkt?: string | boolean;
    }
    export interface IArticleRelatedLinkItemInfo {
        name: string;
        subtitle?: string;
        url: string | {
            type: string;
            value: string;
        };
        data?: any;
    }
    export interface IArticleInfo {
        id?: string;
        name: string;
        disable?: boolean;
        subtitle?: string;
        intro?: string;
        thumb?: string | {
            square?: string;
            common?: string;
            wide?: string;
            tall?: string;
        };
        dir?: string;
        file?: string | boolean;
        keywords?: (string | {
            name?: string;
            value: string;
            [property: string]: unknown;
        })[];
        date?: string;
        author?: string | IAuthorInfo | (string | IAuthorInfo)[];
        location?: string;
        related?: (IArticleRelatedLinkItemInfo | {
            disable?: boolean;
            [property: string]: any;
        })[];
        end?: boolean | string;
        notes?: string[];
        children?: IArticleInfo[];
        data?: any;
        disableMenu?: boolean;
        [property: string]: any;
    }
    export interface IArticleBlogsConfig {
        name?: string;
        count?: number;
        list: IArticleInfo[];
        dir?: string;
        futher?: string[];
        disableMenu?: boolean;
        [property: string]: any;
    }
    export interface IArticlesPartData {
        mkt?: string | boolean;
        banner?: Hje.DescriptionContract;
        supplement?: Hje.DescriptionContract;
        lifecycle?: IArticlesLifecycle;
        articles?: string | Articles;
        select?: string;
    }
    export interface IArticleInfoOptions {
        rela: Hje.RelativePathInfo;
        year?: IYearConfig;
        fetch?: ((url: Hje.RelativePathInfo) => Promise<string>);
        authors?: IAuthorInfo[];
    }
    export interface IArticleCollection {
        name?: string;
        home?: string;
        blog?: IArticleInfo[] | IArticleBlogsConfig;
        docs?: (IArticleInfo | string | {
            name: string;
            disable: "label" | "header";
            [property: string]: unknown;
        })[];
        authors?: IAuthorInfo[];
        redir?: {
            [alias: string]: string;
        };
        config?: {
            disableName?: boolean;
        };
        [property: string]: any;
    }
    export interface IArticlesLifecycle {
        disable?: boolean;
        oninit?(instance: ArticlesPart): void;
        onselect?(instance: ArticlesPart, article: ArticleInfo): void;
        onhome?(instance: ArticlesPart): void;
    }
    export interface IHeadingLevelInfo {
        level: number;
        text: string;
        scroll(): void;
    }
    export interface ILocalePropOptions<T = any> {
        mkt?: string | boolean;
        fallback?: T;
    }
    export {};
}
declare namespace DeepX.MdBlogs {
    function render(element: any, data: string | Articles, options: {
        title?: string | boolean;
        banner?: Hje.DescriptionContract;
        supplement?: Hje.DescriptionContract;
    }): Hje.ViewGeneratingContextContract<any>;
}
declare namespace DeepX.MdBlogs {
    const en: {
        name: string;
        refresh: string;
        keywords: string;
        status: string;
        available: string;
        timeout: string;
        invalid: string;
        article: string;
        articles: string;
        articleMenu: string;
        architecture: string;
        website: string;
        officialWebsite: string;
        log: string;
        blog: string;
        blogs: string;
        home: string;
        about: string;
        game: string;
        games: string;
        video: string;
        videos: string;
        screenshot: string;
        screenshots: string;
        photo: string;
        photos: string;
        pic: string;
        pics: string;
        file: string;
        files: string;
        lib: string;
        libs: string;
        package: string;
        packages: string;
        tool: string;
        tools: string;
        book: string;
        books: string;
        comment: string;
        comments: string;
        docs: string;
        search: string;
        settings: string;
        tutorial: string;
        work: string;
        works: string;
        events: string;
        seeMore: string;
        learnMore: string;
        back: string;
        goHome: string;
        recomm: string;
        ok: string;
        cancel: string;
        continue: string;
        open: string;
        close: string;
        new: string;
        add: string;
        modify: string;
        remove: string;
        delete: string;
        on: string;
        off: string;
        enable: string;
        disable: string;
        enabled: string;
        disabled: string;
        unknown: string;
        empty: string;
        notFound: string;
        loading: string;
        seeAlso: string;
        error: string;
        loadFailed: string;
        renderFailed: string;
        today: string;
        thisYear: string;
        top: string;
        next: string;
        previous: string;
        projects: string;
        archiveProjects: string;
        features: string;
        installation: string;
        sourceCode: string;
        community: string;
        link: string;
        otherLinks: string;
        relatedLinks: string;
        xp: string;
        experience: string;
        more: string;
        getDetails: string;
    };
    export function getLocaleString(key: keyof typeof en, mkt?: string | boolean | undefined): any;
    export function setElementText(element: HTMLElement, key: keyof typeof en): any;
    export {};
}
declare namespace DeepX.MdBlogs {
    /**
     * Gets the module name.
     * @returns The name of module.
     */
    function name(): string;
}
declare namespace DeepX.MdBlogs {
    class ArticlesPart extends Hje.BaseComponent {
        readonly __inner: {
            select?: ArticleInfo;
            info?: Articles;
            mkt?: string | boolean;
            lifecycle?: IArticlesLifecycle;
            title?: string;
            banner?: Hje.DescriptionContract;
            supplement?: Hje.DescriptionContract;
        };
        constructor(element: any, options?: Hje.ComponentOptionsContract<IArticlesPartData>);
        get title(): string;
        set title(value: string);
        get mkt(): string | boolean;
        set mkt(value: string | boolean);
        home(): void;
        select(article?: ArticleInfo | string): ArticleInfo;
        next(): ArticleInfo;
        previous(): ArticleInfo;
        protected initRender(articles: Articles, select: string, lifecycle: IArticlesLifecycle): void;
        protected refreshMenu(): void;
        protected createLocaleOptions(): {
            mkt: string | false;
        };
        protected lifecycle(): IArticlesLifecycle;
        protected genMenu(arr: Hje.DescriptionContract[], params: (ArticleInfo | string)[], deep?: boolean | number): Hje.DescriptionContract;
    }
}
declare namespace DeepX.MdBlogs {
    function setElementProp(element: HTMLElement | string, key: string | null, value: any): void;
    function firstQuery(): string;
    function getLocaleProp<T = any>(obj: T, key?: keyof (T) | null, options?: {
        mkt?: string | boolean;
        fallback?: any;
        bind?: any;
    }): any;
}
