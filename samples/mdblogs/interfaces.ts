namespace DeepX.MdBlogs {
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
}