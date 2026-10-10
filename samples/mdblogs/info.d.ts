declare namespace DeepX.MdBlogs {
    class ArticleInfo {
        private _inner;
        constructor(data: IArticleInfo, options: IArticleInfoOptions);
        get id(): string | undefined;
        get name(): string;
        get subtitle(): string;
        get keywords(): NameValueModel[] | undefined;
        get intro(): string;
        get notes(): string[];
        get gallery(): IImageGalleryInfo[];
        get authors(): ContributorCollection;
        get contentCache(): string | undefined;
        get dateObj(): {
            year: number;
            month: number;
            date: number;
        } | undefined;
        get dateString(): string | undefined;
        get location(): string | INameValueModel | undefined;
        get data(): any;
        get disableMenu(): boolean | undefined;
        get disableAuthors(): boolean | undefined;
        get bannerImage(): string | {
            name?: string;
            url: string;
            maxHeight?: number;
            cover?: boolean;
        } | undefined;
        getOptions(key: string): string | boolean | string[] | {
            name?: string;
            url: string;
            maxHeight?: number;
            cover?: boolean;
        } | null | undefined;
        defs(key: string): any;
        hasGallery(value: string): boolean;
        getRoutePath(options?: {
            mkt?: string | boolean;
        }): string | undefined;
        is(name: string, options?: {
            mkt?: string | boolean;
        }): boolean;
        getPath(options?: ILocalePropOptions<string>): Hje.RelativePathInfo | undefined;
        getName(options?: ILocalePropOptions<string>): string;
        getSubtitle(options?: ILocalePropOptions<string>): string;
        getIntro(options?: ILocalePropOptions<string>): string;
        getNotes(options?: ILocalePropOptions<string>): string[];
        getThumb(kind?: "square" | "common" | "wide" | "tall"): string | Hje.RelativePathInfo | undefined;
        getContent(options?: IArticleLocaleOptions): Promise<string>;
        relative(path: string): Hje.RelativePathInfo;
        related(options?: {
            mkt?: string | boolean;
        }): (IArticleRelatedLinkItemInfo | string)[];
        children(options?: IArticleLocaleOptions): ArticleInfo[];
        hasKeyword(test: string): boolean;
        isKind(test: string): boolean;
        string(key: string, options?: {
            mkt?: string | boolean;
            fallback?: string;
        }): any;
        toJSON(): IArticleInfo;
        protected getDirPath(options?: ILocalePropOptions<string>): string;
    }
}
