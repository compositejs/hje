declare namespace DeepX.MdBlogs {
    /**
     * Renders a markdown blog UX.
     * @param element The element to render.
     * @param data The URL of articles config or the collection of articles.
     * @param options The options.
     * @returns The view generating context.
     */
    function render(element: HTMLElement | string, data: string | Articles, options?: {
        title?: string | boolean;
        banner?: Hje.DescriptionContract;
        supplement?: Hje.DescriptionContract;
        galleryUrl?(info: IImageGalleryInfo): string;
        onfetch?(ev: IArticlesPartDataFetchParams): void;
        onselect?(ev: IArticlesPartDataSelectParams): void;
        onhome?(ev: IArticlesPartDataHomeParams): void;
    }): ArticlesPart;
}
