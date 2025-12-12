namespace DeepX.MdBlogs {
    export type IArticleYearConfig = boolean | "y" | "year" | "m" | "month" | "d" | "date" | "day" | undefined;
    export type INameValueModelValue = (INameValueModel | string)[];
    export type INameValueModelDefinitions = INameValueModel[] | Record<string, INameValueModel | string | boolean>;
    export type IContributorsInfo = string | (string | IContributorInfo)[] | Record<string, string | (string | IContributorInfo)[]>;

    export interface IContributorInfo {
        name: string;
        url?: string;
        email?: string;
        avatar?: string;
    }

    export interface IRoleContributorInfo {
        role: NameValueModel;
        members: IContributorInfo[];
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

    export interface IArticleLabelInfo {
        name: string;
        disable: "label" | "header";
        [property: string]: unknown;
    }

    export interface IArticleMenuOptions {
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
            }
        };
        [property: string]: any;
    }

    export interface IArticleBlogsConfig {
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

    export interface IArticlesPartData {
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

    export interface IArticleInfoOptions {
        rela: Hje.RelativePathInfo;
        year?: IArticleYearConfig;
        fetch?: ((url: Hje.RelativePathInfo) => Promise<string>);
        definitions?: IArticlesDefinitions;
    }

    export interface IArticlesDefinitions {
        keywords?: INameValueModelDefinitions;
        roles?: INameValueModelDefinitions;
        contributors?: IContributorInfo[];
        [property: string]: any;
    }

    export interface IArticleCollection {
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

    export interface INameValueModel {
        name?: string;
        value: string;
        [property: string]: any;
    }

    export interface ILocalePropOptions<T = any> {
        mkt?: string | boolean;
        fallback?: T;
    }
}