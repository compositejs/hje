declare namespace DeepX.MdBlogs {
    function setElementProp(element: HTMLElement | string, key: string | null | undefined, value: any): void;
    function batchSetElementProp(list: {
        element: HTMLElement | string;
        key?: string | null;
        value: any;
    }[]): void;
    function firstQuery(): string;
    function filterFirst<T>(arr: T[], predicate: (item: T, index?: number) => boolean): T | undefined;
    function scrollToTop(): void;
    function getCaseClassName<T = any>(obj: T | undefined | null, key: keyof T, options?: {
        mkt?: string | boolean;
    }): "x-text-case-capital" | "x-text-case-lower" | "x-text-case-small" | "x-text-case-upper" | undefined;
    function getLocaleProp<T = any>(obj: T | undefined, key?: keyof (T) | null, options?: {
        mkt?: string | boolean;
        fallback?: any;
        bind?: any;
    }): any;
}
