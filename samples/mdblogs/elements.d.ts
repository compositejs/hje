declare namespace DeepX.MdBlogs {
    export const hooks: {
        renderMd: undefined | ((element: HTMLElement, md: string) => void);
        fetchList: undefined | ((input: RequestInfo | URL, init?: RequestInit) => Promise<Response>);
    };
    export function showElements(show: string[], hide: string[]): void;
    export function codeElements(element: HTMLElement): HTMLElement[] | undefined;
    export function generateMenu(params: (ArticleInfo | string)[], options?: IArticleMenuOptions): Hje.DescriptionContract;
    /**
     * Generates the description model of the specific articles.
     * @param articles The URL or promise object to fetch articles.
     * @param filter The handler to filter the articles to display.
     * @param options Additional options.
     * @returns A promise object of description model. It is a `ul` element.
     */
    export function generateMenuPromise(articles: Promise<Articles> | string, filter: "blogs" | "blog" | "docs" | "wiki" | ((articles: Articles) => (ArticleInfo | string)[]), options?: IArticleMenuOptions & {
        onfetch?(ev: IArticlesPartDataFetchParams): void;
    }): Promise<Hje.DescriptionContract | undefined>;
    export function generateMenuItem(article: ArticleInfo, level: number, path?: string | ((original: string, article: ArticleInfo) => string), click?: (ev: Event, article: ArticleInfo) => void, options?: ILocalePropOptions): Hje.DescriptionContract;
    export function generateCdnScript(name: string, ver: string, url: string, path: string): {
        tagName: string;
        className: string;
        children: {
            tagName: string;
            children: ({
                tagName: string;
                className: string;
                children: string;
            } | {
                tagName: string;
                children: string;
                className?: undefined;
            })[];
        }[];
    } | undefined;
    interface IButtonListItem {
        className?: string[] | string | {
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
        className?: string[] | string | {
            subscribe(h: any): any;
            [property: string]: any;
        };
        style?: any;
        groupclassName?: string[] | string | {
            subscribe(h: any): any;
            [property: string]: any;
        };
        data?: any;
        props?: Record<string, unknown>;
        text?: string;
        item?: boolean | IButtonListItem;
        list?: (IButtonListItem | string | number | boolean)[];
        click?(ev: Event): void;
    }): Hje.DescriptionContract | undefined;
    export {};
}
