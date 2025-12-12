declare namespace DeepX.MdBlogs {
    export const hooks: {
        renderMd: ((element: HTMLElement, md: string) => void);
    };
    export function showElements(show: string[], hide: string[]): void;
    export function codeElements(element: HTMLElement): HTMLElement[];
    export function generateMenu(params: (ArticleInfo | string)[], options?: IArticleMenuOptions): Hje.DescriptionContract;
    export function generateMenuPromise(articles: Promise<Articles> | string, filter: "blogs" | "blog" | "docs" | "wiki" | ((articles: Articles) => (ArticleInfo | string)[]), options?: IArticleMenuOptions): Promise<Hje.DescriptionContract>;
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
            disableAuthors: boolean;
        };
        getName(options?: ILocalePropOptions): any;
        home(options?: IArticleLocaleOptions): ArticleInfo;
        blogs(options?: IArticleLocaleOptions): ArticleInfo[];
        wiki(options?: IArticleLocaleOptions): (string | ArticleInfo)[];
        hiddenArticles(options?: IArticleLocaleOptions): ArticleInfo[];
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
        parentArticle(current: ArticleInfo, options?: {
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
        get keywords(): NameValueModel[];
        get intro(): string;
        get notes(): string[];
        get authors(): ContributorCollection;
        get contentCache(): string;
        get dateObj(): {
            year: number;
            month: number;
            date: number;
        };
        get dateString(): string;
        get location(): string;
        get data(): any;
        get disableMenu(): boolean;
        get disableAuthors(): boolean;
        get bannerImage(): string | {
            name?: string;
            url: string;
            maxHeight?: number;
            cover?: boolean;
        };
        getRoutePath(options?: {
            mkt?: string | boolean;
        }): string;
        is(name: string, options?: {
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
        }): (IArticleRelatedLinkItemInfo | string)[];
        children(options?: IArticleLocaleOptions): ArticleInfo[];
        toJSON(): IArticleInfo;
        protected getDirPath(options?: ILocalePropOptions<string>): string;
    }
}
declare namespace DeepX.MdBlogs {
    type IArticleYearConfig = boolean | "y" | "year" | "m" | "month" | "d" | "date" | "day" | undefined;
    type INameValueModelValue = (INameValueModel | string)[];
    type INameValueModelDefinitions = INameValueModel[] | Record<string, INameValueModel | string | boolean>;
    type IContributorsInfo = string | (string | IContributorInfo)[] | Record<string, string | (string | IContributorInfo)[]>;
    interface IContributorInfo {
        name: string;
        url?: string;
        email?: string;
        avatar?: string;
    }
    interface IRoleContributorInfo {
        role: NameValueModel;
        members: IContributorInfo[];
    }
    interface IArticleLocaleOptions {
        reload?: boolean;
        mkt?: string | boolean;
    }
    interface IArticleRelatedLinkItemInfo {
        name: string;
        subtitle?: string;
        url: string | {
            type: string;
            value: string;
        };
        data?: any;
    }
    interface IArticleLabelInfo {
        name: string;
        disable: "label" | "header";
        [property: string]: unknown;
    }
    interface IArticleMenuOptions {
        select?: ArticleInfo;
        deep?: boolean | number;
        mkt?: string | boolean;
        arr?: Hje.DescriptionContract[];
        path?: string | ((original: string, article: ArticleInfo) => string);
        styleRefs?: string | string[];
        click?(ev: Event, article: ArticleInfo): void;
        render?(model: Hje.DescriptionContract, article: ArticleInfo, options: {
            level: number;
            mkt: string | boolean;
        }): void;
    }
    interface IArticleInfo {
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
        keywords?: INameValueModelValue;
        date?: string;
        author?: IContributorsInfo;
        location?: string;
        related?: (IArticleRelatedLinkItemInfo | {
            disable?: boolean;
            [property: string]: any;
        } | IArticleLabelInfo | string)[];
        end?: boolean | string | {
            start?: boolean | string;
            end?: boolean | string;
            urls?: {
                old: string;
                by: string;
            }[];
        };
        notes?: string[];
        children?: IArticleInfo[];
        data?: any;
        options?: {
            disableMenu?: boolean;
            disableAuthors?: boolean;
            banner: string | {
                name?: string;
                url: string;
                maxHeight?: number;
                cover?: boolean;
            };
        };
        [property: string]: any;
    }
    interface IArticleBlogsConfig {
        name?: string;
        count?: number;
        list: IArticleInfo[];
        dir?: string;
        futher?: string[];
        disableMenu?: boolean;
        disableAuthors?: boolean;
        year?: IArticleYearConfig & string;
        [property: string]: any;
    }
    interface IArticlesPartData {
        mkt?: string | boolean;
        banner?: Hje.DescriptionContract;
        supplement?: Hje.DescriptionContract;
        lifecycle?: IArticlesLifecycle;
        articles?: string | Articles;
        select?: string;
        store?: any;
        onselect(ev: {
            model: Hje.DescriptionContract;
            article: ArticleInfo;
            mkt: string | boolean | undefined;
            store: any;
        }): void;
        onhome(ev: {
            model: Hje.DescriptionContract;
            mkt: string | boolean | undefined;
            store: any;
        }): void;
    }
    interface IArticleInfoOptions {
        rela: Hje.RelativePathInfo;
        year?: IArticleYearConfig;
        fetch?: ((url: Hje.RelativePathInfo) => Promise<string>);
        definitions?: IArticlesDefinitions;
    }
    interface IArticlesDefinitions {
        keywords?: INameValueModelDefinitions;
        roles?: INameValueModelDefinitions;
        contributors?: IContributorInfo[];
        [property: string]: any;
    }
    interface IArticleCollection {
        name?: string;
        home?: string;
        blog?: IArticleInfo[] | IArticleBlogsConfig;
        docs?: (IArticleInfo | IArticleLabelInfo | string)[];
        hiddenArticles?: IArticleInfo[];
        redir?: {
            [alias: string]: string;
        };
        config?: {
            disableName?: boolean;
        };
        "$defs"?: IArticlesDefinitions;
        [property: string]: any;
    }
    interface IArticlesLifecycle {
        disable?: boolean;
        oninit?(instance: ArticlesPart): void;
        onselect?(instance: ArticlesPart, article: ArticleInfo): void;
        onhome?(instance: ArticlesPart): void;
    }
    interface IHeadingLevelInfo {
        level: number;
        text: string;
        scroll(): void;
    }
    interface INameValueModel {
        name?: string;
        value: string;
        [property: string]: any;
    }
    interface ILocalePropOptions<T = any> {
        mkt?: string | boolean;
        fallback?: T;
    }
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
        publisher: string;
        author: string;
        dev: string;
        contentCreator: string;
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
        page: string;
        more: string;
        details: string;
        getDetails: string;
    };
    export function getLocaleString(key: keyof typeof en, mkt?: string | boolean | undefined): any;
    export function setElementText(element: HTMLElement, key: keyof typeof en): any;
    export {};
}
declare namespace DeepX.MdBlogs {
    let roles: Record<string, NameValueModel>;
    class NameValueModel {
        private _model;
        constructor(m: INameValueModel | string);
        get name(): string;
        get value(): string;
        getName(options: ILocalePropOptions<string>): any;
    }
    class ContributorCollection {
        private _model;
        private _defaultRole;
        private _keys;
        constructor(list: IContributorsInfo, contributors: IContributorInfo[], roles: INameValueModelDefinitions, defaultRole: string | string[]);
        list(role: string): IRoleContributorInfo;
        filter(role?: string | string[]): IRoleContributorInfo[];
        priorityList(): IRoleContributorInfo[];
        roles(): string[];
        all(): IRoleContributorInfo[];
    }
    function toMembers(list: IRoleContributorInfo[]): IContributorInfo[];
    function nameValueModels(list: INameValueModelValue, defs?: INameValueModelDefinitions): NameValueModel[];
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
        parent(): ArticleInfo;
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
