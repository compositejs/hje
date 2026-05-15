namespace DeepX.MdBlogs {
    type IImageRatio = "p" | "page" | "v" | "vertical" | "h" | "horizontal" | "s" | "square" | "w" | "wide";
    type ITitleCaseKind = "upper" | "lower" | "capital" | "small" | "normal" | "none" | null;
    export type IArticleYearConfig = boolean | "y" | "year" | "m" | "month" | "d" | "date" | "day" | undefined;
    export type INameValueModelValue = (INameValueModel | string)[];
    export type INameValueModelDefinitions = INameValueModel[] | Record<string, INameValueModel | string | boolean>;
    export type IContributorsInfo = string | (string | IContributorInfo)[] | Record<string, string | (string | IContributorInfo)[]>;

    export interface IImageUrlResolveOptions {
        kind: "thumb" | "source";
        rela: Hje.RelativePathInfo;
    }

    export interface IArticlesPartDataSelectParams {
        children: Hje.DescriptionContract[];
        article: ArticleInfo;
        mkt: string | boolean | undefined;
        store: any;
        defs(key: string): any;
        insertChildren(position: "last" | "end" | "start" | number | undefined, ...models: Hje.DescriptionContract[]): void;
    }

    export interface IArticlesPartDataHomeParams {
        model: Hje.BaseComponent;
        mkt: string | boolean | undefined;
        store: any;
        defs(key: string): any;
    }

    export interface IArticlesPartDataFetchParams {
        articles: Articles
        mkt: string | boolean | undefined;
        store: any;
    }

    export interface IContributorInfo {
        /**
         * Nickname.
         */
        name: string;
        /**
         * Personal website.
         */
        url?: string;
        /**
         * Email address.
         */
        email?: string;
        /**
         * Avatar URL.
         */
        avatar?: string;

        [property: string]: any
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
        /**
         * The display name.
         */
        name: string;
        /**
         * The subtitle.
         */
        subtitle?: string;
        /**
         * The link URL.
         */
        url: string;
        /**
         * A flag indicating opens in a new window or tab.
         */
        newWindow?: boolean;
        /**
         * Addtional data for reference.
         */
        data?: any;
    }

    export interface IArticleLabelInfo {
        name: string;
        disable: "label" | "header";
        ref?: boolean | string;
        [property: string]: unknown;
    }

    export interface IArticleMenuOptions {
        select?: ArticleInfo;
        deep?: boolean | number;
        mkt?: string | boolean;
        arr?: Hje.DescriptionContract[];
        path?: string | ((original: string, article: ArticleInfo) => string);
        className?: string | string[];
        click?(ev: Event, article: ArticleInfo): void;
        render?(model: Hje.DescriptionContract, article: ArticleInfo, options: {
            level: number;
            mkt?: string | boolean;
            path: string;
            select: boolean;
        }): void;
    }

    /**
     * The gallery information.
     */
    export interface IImageGalleryInfo {
        /**
         * The identifier of the gallery.
         */
        id: string;
        /**
         * The additional alias.
         */
        alias?: string[] | null;
        /**
         * A value indicating whether the gallery item is disabled.
         */
        disable?: boolean;
        /**
         * The display name.
         */
        name: string;
        /**
         * The subtitle.
         */
        subtitle?: string;
        /**
         * The options.
         */
        options?: {
            /**
             * The string case of display name.
             */
            nameCase?: ITitleCaseKind;
            /**
             * The string case of subtitle.
             */
            subtitleCase?: ITitleCaseKind;
            /**
             * The default name for each image.
             */
            defaultItemName?: string | boolean;
            /**
             * The image ratio.
             */
            ratio?: IImageRatio;
            /**
             * A value indicating whether each image has a thumbnail.
             */
            thumb?: boolean;
            [property: string]: any;
        };
        /**
         * The icon.
         */
        icon?: string;
        /**
         * The introduction.
         */
        intro?: string;
        /**
         * The start year published.
         */
        year: number;
        /**
         * The related links.
         */
        links?: DeepX.MdBlogs.IArticleRelatedLinkItemInfo[];
        /**
         * The link or collection of items.
         */
        items: string | IImageItemInfo[];
        /**
         * The data.
         */
        data?: Record<string, any>;

        [property: string]: any;
    }

    /**
     * The settings and markdown URL of article.
     */
    export interface IArticleInfo {
        /**
         * The identifier. Should be a UUID/GUID.
         */
        id?: string;
        /**
         * The name of article.
         */
        name: string;
        /**
         * A flag indicate whether disable this article.
         */
        disable?: boolean;
        /**
         * The subtitle of the article.
         */
        subtitle?: string;
        /**
         * The introduction of the article.
         */
        intro?: string;
        /**
         * The relative URL of the article thumbnail.
         */
        thumb?: string | {
            /**
             * The relative URL of the article thumbnail in square (1:1) ratio.
             */
            square?: string;
            /**
             * The relative URL of the article thumbnail in common (4:3 or 3:2) ratio.
             */
            common?: string;
            /**
             * The relative URL of the article thumbnail in wide (16:9 or 16:10) ratio.
             */
            wide?: string;
            /**
             * The relative URL of the article thumbnail in tall (3:4 or 9:16) ratio.
             */
            tall?: string;
        };
        /**
         * The relative directory path with the article markdown file.
         */
        dir?: string;
        /**
         * The file name of the article markdown file.
         */
        file?: string | boolean;
        /**
         * The keywords.
         */
        keywords?: INameValueModelValue;
        /**
         * The publish date in YYYYMMDD format.
         */
        date?: string;
        /**
         * The article authors.
         */
        author?: IContributorsInfo;
        /**
         * The city where the article publishes.
         */
        location?: string | INameValueModel;
        /**
         * The related links (display in section see also).
         */
        related?: (IArticleRelatedLinkItemInfo | {
            disable?: boolean;
            [property: string]: any;
        } | IArticleLabelInfo | string)[];
        /**
         * The mark of end comment in markdown.
         */
        end?: boolean | string | {
            /**
             * The mark of start comment in markdown.
             */
            start?: boolean | string;
            /**
             * The mark of end comment in markdown.
             */
            end?: boolean | string;
            /**
             * The replacement of URLS in markdown.
             */
            urls?: {
                /**
                 * The original text to replace.
                 */
                old: string;
                /**
                 * The new text used to replace with.
                 */
                by: string;
            }[];
        };
        /**
         * The additional notes of the article to display at the end of content.
         */
        notes?: string[];
        /**
         * The child articles.
         */
        children?: IArticleInfo[];
        /**
         * Addtional data for reference.
         */
        data?: any;
        /**
         * The options of the article.
         */
        options?: {
            /**
             * A flag to indicate whether need hide the contents in article.
             */
            disableMenu?: boolean;
            /**
             * A flag to indicate whether need hide the authors and publish date in article.
             */
            disableAuthors?: boolean;
            /**
             * The banner image URL or info.
             */
            banner?: string | {
                /**
                 * The alt name of banner image.
                 */
                name?: string;
                /**
                 * The URL of banner.
                 */
                url: string;
                /**
                 * The max height of banner image.
                 */
                maxHeight?: number;
                /**
                 * A flag indicating whether fit cover.
                 */
                cover?: boolean;
            },
            /**
             * The additional kind of article for filter.
             */
            kind?: string[] | string;
            /**
             * The identifier of gallery to bind
             */
            gallery?: string | string[] | null;
            /**
             * The case of name.
             */
            nameCase?: ITitleCaseKind;
        };

        [property: string]: any;
    }

    /**
     * The config of blog.
     */
    export interface IArticleBlogConfig {
        /**
         * The optional name of blog.
         */
        name?: string;
        /**
         * The maximum count to display.
         */
        count?: number;
        /**
         * The collection of blog.
         */
        list: IArticleInfo[];
        /**
         * The relative path of root directory of blog articles.
         */
        dir?: string;
        /**
         * The relative paths of all rest articles in pages.
         */
        further?: string[];
        /**
         * The root display path mode.
         */
        year?: IArticleYearConfig & string;
        /**
         * A flag to indicate whether reverse the article list to diplay.
         * 
         * The blog articles in `list` should order by publish `date` ascending (earliest to latest).
         * Sets this field to `true` if the list is sort descending (latest to earlist).
         * Default is `false`.
         */
        reverse?: boolean;

        [property: string]: any;
    }

    export interface IArticlesPartData {
        mkt?: string | boolean;
        banner?: Hje.DescriptionContract;
        supplement?: Hje.DescriptionContract;
        lifecycle?: IArticlesLifecycle;
        articles?: string | Articles;
        select?: string;
        q?: string;
        store?: any;
        galleryUrl?(info: IImageGalleryInfo): string;
        onselect?(ev: IArticlesPartDataSelectParams): void;
        onhome?(ev: IArticlesPartDataHomeParams): void;
        onfetch?(ev: IArticlesPartDataFetchParams): void;
    }

    export interface IArticleInfoOptions {
        rela?: Hje.RelativePathInfo;
        year?: IArticleYearConfig;
        fetch?: ((url: Hje.RelativePathInfo) => Promise<string>);
        definitions?: IArticlesDefinitions;
        gallery?: IImageGalleryInfo[];
    }

    export interface IArticlesDefinitions {
        /**
         * All keywords information.
         */
        keywords?: INameValueModelDefinitions;
        /**
         * All roles information.
         */
        roles?: INameValueModelDefinitions;
        /**
         * All contributors.
         */
        contributors?: IContributorInfo[];
        /**
         * The string resources.
         */
        strings?: Record<string, string>;

        [property: string]: any;
    }

    /**
     * The model of previous blog articles in page.
     */
    export interface IArticlePagingModel {
        /**
         * A flag indicating whether this page is disabled.
         */
        disable?: boolean;
        /**
         * All blog articles.
         */
        blog: IArticleInfo[];
        /**
         * Options of this paging model.
         */
        options?: {
            /**
             * A flag to indicate whether reverse the article list to diplay.
             * 
             * The blog articles in `list` should order by publish `date` ascending (earliest to latest).
             * Sets this field to `true` if the list is sort descending (latest to earlist).
             * Default is `false`.
             */
            reverse?: boolean;
        }
    }

    /**
     * The model of blog and docs.
     */
    export interface IArticleCollection {
        /**
         * The website name.
         */
        name?: string;
        /**
         * The description of the website.
         */
        description?: string;
        /**
         * The relative URL of home markdown file.
         */
        home?: string;
        /**
         * All blog info.
         */
        blog?: IArticleInfo[] | IArticleBlogConfig;
        /**
         * The docs or wiki with tree articles.
         */
        docs?: (IArticleInfo | IArticleLabelInfo | string)[];
        /**
         * The additional articles which hide in menu of all articles.
         */
        hiddenArticles?: IArticleInfo[];
        /**
         * The gallery collection.
         */
        gallery?: IImageGalleryInfo[];
        /**
         * The mapping of route.
         */
        redir?: {
            [alias: string]: string;
        };
        /**
         * The additional links. They will display under the list of docs and blog.
         */
        links?: {
            /**
             * The display name.
             */
            name: string;
            /**
             * The link URL.
             */
            url: string;
            /**
             * A flag indicating opens in a new window or tab.
             */
            newWindow?: boolean;

            [property: string]: any;
        }[];
        /**
         * The additional options of website.
         */
        options?: {
            /**
             * A flag indicating whether hide website name.
             */
            disableName?: boolean;
            /**
             * A flag to indicate whether need hide the authors and publish date in article.
             */
            disableAuthors?: boolean;
            /**
             * A flag to indicate whether need hide the contents in article.
             */
            disableMenu?: boolean;
            /**
             * A flag to indicate whether need disable search functionality.
             */
            disableSearch?: boolean;
            /**
             * The title of links.
             */
            linksTitle?: string;
            /**
             * The title to display under gallery collection.
             */
            galleryTitle?: string;
            /**
             * The tips to display under gallery collection.
             */
            galleryTips?: string;
            /**
             * The title of keywords section.
             */
            keywordsTitle?: string;
            /**
             * The title of content creator section.
             */
            contentCreatorTitle?: string;
            /**
             * The title of see also section.
             */
            seeAlsoTitle?: string;
            /**
             * The title of other links section.
             */
            otherLinksTitle?: string;
            /**
             * The text of search. 
             */
            search?: string;
            /**
             * The text of going to previous article.
             */
            previous?: string;
            /**
             * The text of going to next article.
             */
            next?: string;
            /**
             * The text of turning back.
             */
            back?: string;
            /**
             * The text of empty.
             */
            empty?: string;
        };
        /**
         * The definitions.
         */
        "$defs"?: IArticlesDefinitions;

        [property: string]: any;
    }

    export interface IArticlesLifecycle {
        disable?: boolean;
        oninit?(instance: ArticlesPart): void;
        onselect?(instance: ArticlesPart, article: ArticleInfo): void;
        onhome?(instance: ArticlesPart): void;
    }

    export interface IImageItemInfo {
        id: string;
        disable?: boolean;
        name?: string;
        year: number;
        month?: number;
        day?: number;
        url?: string;
        thumb?: boolean | string;
        keywords?: string[];
        size?: string;
        data?: Record<string, unknown>;
    }

    export interface IImageClickInfo {
        item: IImageItemInfo;
        component: ImageCollectionPart;
        info: {
            name: string;
            url: string;
            thumb?: string;
        };
    }

    export interface IImageCollectionPartOptions {
        itemUrl?(item: IImageItemInfo, options: IImageUrlResolveOptions): string | undefined;
        click?(data: IImageClickInfo, ev: MouseEvent): void;
        close?(ev: MouseEvent): void;
        mkt?: string | boolean;
        page?: number;
    }

    export interface IImageGalleryPartData extends IImageCollectionPartOptions {
        gallery: (IImageGalleryInfo | string | DeepX.MdBlogs.IArticleLabelInfo)[];
        items?: Record<string, IImageItemInfo[] | {
            items: IImageItemInfo[];
            rela?: string | Hje.RelativePathInfo;
        }>;
        select?: string | boolean;
        rela?: string | Hje.RelativePathInfo;
        blogRela?: string | Hje.RelativePathInfo;
        url?: string | boolean;
        blog?: DeepX.MdBlogs.ArticleInfo[];
        styles?: {
            header?: string | string[];
            main?: string | string[];
            next?: string | string[];
            related?: string | string[];
            share?: string | string[];
        };
        strings?: {
            all?: string;
            pics?: string;
            site?: string;
        };
        before?: Hje.DescriptionContract;
        after?: Hje.DescriptionContract;
        selected?(info: IImageGalleryInfo, component: ImageGalleryPart): void;
        fetch?: (url: Hje.RelativePathInfo) => Promise<any>,
    }

    export interface IRelatedInfoPartData {
        title?: string;
        links?: DeepX.MdBlogs.IArticleRelatedLinkItemInfo[];
        images?: IImageItemInfo[];
        imageRela?: string | Hje.RelativePathInfo;
        defaultImageName?: string;
        mkt?: string | boolean;
        itemUrl?(item: IImageItemInfo, kind: IImageUrlResolveOptions): string | undefined;
        click?(data: IImageClickInfo, ev?: MouseEvent): void;
        close?(ev?: MouseEvent): void;
    }

    export interface IImageCollectionPartData extends IImageCollectionPartOptions {
        rela?: string | Hje.RelativePathInfo;
        items: IImageItemInfo[];
        defaultName?: string;
    }

    export interface IImageItemsData {
        items: IImageItemInfo[] | Record<string, IImageItemInfo[]>;
        options?: {
            imageRela?: string | Hje.RelativePathInfo;
            [property: string]: any;
        }
    }

    export interface IHeadingLevelInfo {
        level: number;
        text: string;
        scroll(): void;
    }

    export interface INameValueModel {
        /**
         * The name.
         */
        name?: string;
        /**
         * The value.
         */
        value: string | undefined;

        [property: string]: any;
    }

    export interface ILocalePropOptions<T = any> {
        mkt?: string | boolean;
        fallback?: T;
    }
}