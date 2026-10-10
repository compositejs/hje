declare namespace DeepX.MdBlogs {
    interface IImageGalleryPartInternalData {
        gallery: (IImageGalleryInfo | string | DeepX.MdBlogs.IArticleLabelInfo)[];
        items: Record<string, {
            items: IImageItemInfo[];
            rela?: string | Hje.RelativePathInfo;
        }>;
        rela: Hje.RelativePathInfo;
        blogRela: Hje.RelativePathInfo;
        mkt?: {
            mkt?: string | boolean;
        };
        mainStyle: string[];
        select?: IImageGalleryInfo;
        siteName?: string;
        defaultItemName?: string;
        needBack?: boolean;
        url?: string | boolean;
        before?: string;
        after?: string;
        selected?: (info: IImageGalleryInfo, component: ImageGalleryPart) => void;
    }
    export class ImageGalleryPart extends Hje.DataComponent<IImageGalleryPartData, IImageGalleryPartInternalData> {
        constructor(args: any);
        get blogRela(): Hje.RelativePathInfo;
        get before(): Hje.BaseComponent | undefined;
        get after(): Hje.BaseComponent | undefined;
        get gallery(): IImageGalleryInfo[];
        getGallery(id: string): IImageGalleryInfo | undefined;
        selectGalleryAsync(id: string | IImageGalleryInfo): Promise<IImageGalleryInfo | undefined>;
        selectGalleryInCache(value: IImageGalleryInfo): IImageGalleryInfo;
        relativePath(path: string | undefined): string;
        scrollContentIntoView(): false | undefined;
        scrollMenuIntoView(): false | undefined;
        getGalleryLinkInfo(value: IImageGalleryInfo): {
            title: string;
            url: string | undefined;
            kind: "route" | "link" | "func";
        };
        closeImage(ev?: MouseEvent): void;
        registerHistoryPop(): void;
        protected onSelect(info: IImageGalleryInfo): void;
        private refreshRelated;
        private genGalleryMenu;
    }
    export class ImageCollectionPart extends Hje.DataComponent<IImageCollectionPartData, {
        items: IImageItemInfo[];
        rela: Hje.RelativePathInfo;
        itemUrl(item: IImageItemInfo, options: IImageUrlResolveOptions): string | undefined;
        click?(data: IImageClickInfo, ev?: MouseEvent): void;
        close?(ev?: MouseEvent): void;
        mkt?: {
            mkt: string | boolean;
        };
        defaultName?: string;
        pageSize?: number;
        nextIndex: number;
        renderedCount: number;
    }> {
        constructor(args: any);
        get length(): IImageItemInfo[];
        setDefaultName(value: string): void;
        getItem(index: number | string): IImageItemInfo | undefined;
        pushWithoutRender(...items: IImageItemInfo[]): number;
        push(...items: IImageItemInfo[]): number;
        clear(): void;
        nextPage(): boolean;
        indexOf(item: string | IImageItemInfo): number;
        setImageRela(value: string | Hje.RelativePathInfo | null): void;
        imageRelative(url: string | undefined): string;
        openImage(item: IImageItemInfo | string, ev?: MouseEvent): undefined;
        closeImage(ev?: MouseEvent): void;
        private genItemModel;
    }
    export class RelatedInfoPart extends Hje.DataComponent {
        constructor(args: any);
        setData(links: DeepX.MdBlogs.IArticleRelatedLinkItemInfo[] | null | undefined, images: IImageItemInfo[] | null | undefined): number;
    }
    export function galleryList(col: IImageGalleryInfo[], imageRela: string | Hje.RelativePathInfo | ImageGalleryPart | ImageCollectionPart, link?: string, options?: {
        mkt?: string | boolean;
    }): {
        tagName: string;
        className: string;
        props: {
            href: string;
        };
        children: Hje.DescriptionContract[];
    }[] | null;
    export function getGallery(gallery: IImageGalleryInfo[], id: string): IImageGalleryInfo | undefined;
    export {};
}
