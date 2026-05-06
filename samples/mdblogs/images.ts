namespace DeepX.MdBlogs {

    type IImageUrlKind = 'thumb' | 'source';
    type IImageRatio = "p" | "page" | "v" | "vertical" | "h" | "horizontal" | "s" | "square" | "w" | "wide";

    export type ITitleCaseKind = "upper" | "lower" | "capital" | "small" | "normal" | "none" | null;

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
        data?: any;
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
        itemUrl?(item: IImageItemInfo, kind: IImageUrlKind): string | undefined;
        click?(data: IImageClickInfo, ev: MouseEvent): void;
        close?(ev: MouseEvent): void;
        mkt?: string | boolean;
        page?: number;
    }

    export interface IImageSeriesPartData extends IImageCollectionPartOptions {
        series: (IImageSeriesInfo | string | DeepX.MdBlogs.IArticleLabelInfo)[];
        items: Record<string, IImageItemInfo[]>;
        select?: string | boolean;
        seriesRela?: string | Hje.RelativePathInfo;
        blogRela?: string | Hje.RelativePathInfo;
        imageRela?: string | Hje.RelativePathInfo;
        url?: string | boolean;
        blogs?: DeepX.MdBlogs.ArticleInfo[];
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
        selected?(info: IImageSeriesInfo, component: ImageSeriesPart): void;
    }

    export interface IImageCollectionPartData extends IImageCollectionPartOptions {
        rela?: string | Hje.RelativePathInfo;
        items: IImageItemInfo[];
        defaultName?: string;
    }

    export interface IRelatedInfoPartData {
        title?: string;
        links?: DeepX.MdBlogs.IArticleRelatedLinkItemInfo[];
        images?: IImageItemInfo[];
        imageRela?: string | Hje.RelativePathInfo;
        defaultImageName?: string;
        mkt?: string | boolean;
        itemUrl?(item: IImageItemInfo, kind: IImageUrlKind): string | undefined;
        click?(data: IImageClickInfo, ev?: MouseEvent): void;
        close?(ev?: MouseEvent): void;
    }

    export class ImageSeriesPart extends Hje.DataComponent<IImageSeriesPartData> {
        private __inner: {
            series: (IImageSeriesInfo | string | DeepX.MdBlogs.IArticleLabelInfo)[];
            items: Record<string, IImageItemInfo[]>;
            seriesRela: Hje.RelativePathInfo;
            blogRela: Hje.RelativePathInfo;
            imageRela: Hje.RelativePathInfo;
            mkt?: { mkt: string | boolean };
            mainStyle: string[];
            select?: IImageSeriesInfo;
            siteName?: string;
            defaultItemName?: string;
            needBack?: boolean;
            url?: string | boolean;
            before?: string;
            after?: string;
            selected?: (info: IImageSeriesInfo, component: ImageSeriesPart) => void;
        };

        constructor(args: any) {
            super(args);
            const data = this.data();
            const seriesCol = data.series || [];
            const mktOptions = data.mkt !== undefined ? { mkt: data.mkt } : undefined;
            const seriesRela = toRela(data.seriesRela || "./");
            const blogRela = toRela(data.blogRela || "../blog/");
            const imageRela = toRela(data.imageRela || "../images/");
            const styles = data.styles || {};
            const strings = data.strings || {};
            const mainStyle = mergeArray(["x-container-pics"], styles.main);
            this.__inner = {
                series: seriesCol,
                items: data.items || {},
                seriesRela,
                blogRela,
                mkt: mktOptions,
                imageRela,
                mainStyle,
                url: data.url,
                siteName: strings.site,
                defaultItemName: strings.pics,
                selected: data.selected,
            };
            const self = this;
            let select = data.select;
            if (select === true || select === undefined) select = this.series[0]?.id;
            else if (!select || typeof select !== "string") select = undefined;
            if (data.before) {
                this.__inner.before = data.before.key;
                if (!this.__inner.before) {
                    this.__inner.before = "comp-ref-image-series-part-before";
                    data.before.key = this.__inner.before;
                }
            }
            if (data.after) {
                this.__inner.after = data.after.key;
                if (!this.__inner.after) {
                    this.__inner.after = "comp-ref-image-series-part-after";
                    data.after.key = this.__inner.after;
                }
            }
            this.childrenAccess.setRange({
                tagName: "article",
                children: [data.before, genHeader([{
                    tagName: "span",
                    children: strings.pics,
                }], styles.header, "h1", "title", "title-container"), {
                    key: "gallery",
                    tagName: "main",
                    component: ImageCollectionPart,
                    className: mainStyle,
                    data: {
                        rela: imageRela,
                        itemUrl: data.itemUrl,
                        click: data.click ? (d, ev) => {
                            if (typeof data.click === "function") data.click(d, ev);
                            const selectItem = self.__inner.select;
                            if (!d.component || !d.item?.id || !selectItem) return;
                            const { url, kind } = self.getSeriesLinkInfo(selectItem);
                            if (kind !== "route" || !url || !url.includes("?")) return;
                            const question = url.includes("?") ? "&" : "?";
                            const selectImage = Hje.getQuery("id");
                            if (selectImage) {
                                history.replaceState(new ImageHistoryState(selectItem, d.item), "", `${url}${question}id=${d.item.id}`);
                            } else {
                                self.__inner.needBack = true;
                                history.pushState(new ImageHistoryState(selectItem, d.item), "", `${url}${question}id=${d.item.id}`);
                            }
                        } : undefined,
                        close: data.close,
                        mkt: data.mkt,
                        defaultName: strings.pics,
                        page: data.page,
                    } as IImageCollectionPartData,
                }, {
                    key: "actions",
                    tagName: "section",
                    style: { display: "none" },
                    className: mergeArray(["x-part-blog-next"], styles.next),
                    children: [{
                        tagName: "div",
                        children: [{
                            tagName: "button",
                            className: ["x-button-more", "link-button-normal"],
                            children: [span(DeepX.MdBlogs.getLocaleString("seeMore", data.mkt))],
                            on: {
                                click() {
                                    const gallery = self.getChild("gallery") as ImageCollectionPart;
                                    if (!gallery) return;
                                    const hasNextPage = gallery.nextPage();
                                    if (hasNextPage) return;
                                    self.childrenAccess.update("actions", {
                                        style: { display: "none" },
                                    });
                                },
                            },
                        }]
                    }]
                }, {
                    key: "related",
                    tagName: "section",
                    style: { display: "none" },
                    className: mergeArray(["x-part-blog-related"], styles.related),
                    children: [],
                }, data.after,
            ].filter(ele => !!ele)}, {
                tagName: "nav",
                children: [genHeader([{
                    tagName: "span",
                    children: getLocaleString("picLibs", mktOptions?.mkt),
                }], styles.header, "h1", undefined, "menu"), {
                    key: "all",
                    tagName: "section",
                    children: select ? [] : this.genSeriesMenu(select),
                }].filter(ele => !!ele)
            });

            if (!select || self.__inner.select) return;
            const sel = self.selectSeries(select);
            if (!sel) return;
            const { url, kind, title } = self.getSeriesLinkInfo(sel);
            if (kind !== "route" || !url) return;
            if (self.__inner.siteName)
                document.title = title;
            const imageId = Hje.getQuery("id");
            if (!imageId || !url.includes("?")) {
                history.replaceState(new ImageHistoryState(sel), "", url);
                return;
            }
            const gallery = self.getChild("gallery") as ImageCollectionPart;
            if (!gallery) {
                history.replaceState(new ImageHistoryState(sel), "", url);
                return;
            }
            const url2 = `${url}&id=${imageId}`;
            const imageSelected = gallery.getItem(imageId);
            history.replaceState(new ImageHistoryState(sel, imageSelected), "", url2);
            if (imageSelected?.id) gallery.openImage(imageSelected.id);
        }

        get imageRela() {
            return this.__inner.imageRela;
        }

        get blogRela() {
            return this.__inner.blogRela;
        }

        get before() {
            return this.__inner.before ? this.childrenAccess.get(this.__inner.before) : undefined;
        }

        get after() {
            return this.__inner.after ? this.childrenAccess.get(this.__inner.after) : undefined;
        }

        get series() {
            const col = this.__inner.series;
            const arr: IImageSeriesInfo[] = [];
            for (let i = 0; i < col.length; i++) {
                const series = col[i];
                if (!series || typeof series === "string" || series.disable) continue;
                arr.push(series as IImageSeriesInfo);
            }

            return arr;
        }

        getSeries(id: string) {
            if (!id) return undefined;
            id = id.replace("=", "").replace(" ", "");
            const series = this.series;
            for (let i in series) {
                const item = series[i];
                if (item?.id !== id || item.disable) continue;
                return item;
            }

            for (let i in series) {
                const item = series[i];
                if (!item?.alias || item.disable || !(item.alias instanceof Array)) continue;
                if (item.alias.indexOf(id) > -1) return item;
            }

            return undefined;
        }

        selectSeries(id: string | IImageSeriesInfo) {
            if (!id) return undefined;
            if (typeof id === "string") {
                const sel = this.getSeries(id);
                if (!sel) return undefined;
                id = sel;
            }

            if (!id.id) return undefined;
            const items = this.__inner.items[id.id];
            const gallery = this.getChild("gallery") as ImageCollectionPart;
            if (!gallery) return id;
            const mkt = this.__inner.mkt;
            this.__inner.select = id;
            gallery.clear();
            gallery.className(mergeArray(this.__inner.mainStyle, ratioClassName(id.options?.ratio)));
            const name: string = DeepX.MdBlogs.getLocaleProp(id, "name", mkt);
            let defaultName = DeepX.MdBlogs.getLocaleProp(id.options, "defaultItemName", mkt) as string | boolean | undefined;
            if (!defaultName) defaultName = this.__inner.defaultItemName || DeepX.MdBlogs.getLocaleString("pic");
            else if (defaultName === true) defaultName = name;
            gallery.setDefaultName(name);
            gallery.pushWithoutRender(...items);
            const hasNextPage = gallery.nextPage();
            this.childrenAccess.update("actions", {
                style: { display: hasNextPage ? "" : "none" },
            });
            const rela = this.__inner.imageRela;
            const title: Hje.DescriptionContract[] = [];
            let text = DeepX.MdBlogs.getLocaleProp(id, "icon", mkt);
            if (text) title.push({
                tagName: "img",
                props: {
                    src: relativePath(rela, text),
                    alt: name,
                },
            });
            title.push(span(name, caseStyleRef(id.options, "subtitleCase", mkt)));
            text = DeepX.MdBlogs.getLocaleProp(id, "subtitle", mkt);
            if (text) title.push(span(text, caseStyleRef(id.options, "subtitleCase", mkt)));
            this.childrenAccess.update("title", { children: title });
            this.refreshRelated();
            this.childrenAccess.update("all", { children: this.genSeriesMenu(id.id) });
            this.onSelect(id);
            const h = this.__inner.selected;
            if (typeof h === "function") h(id, this);
            return id;
        }

        scrollContentIntoView() {
            const element = this.getChild("title-container")?.element() as HTMLElement | undefined;
            if (!element) return false;
            element.scrollIntoView({ behavior: "smooth" });
        }

        scrollMenuIntoView() {
            const element = this.getChild("menu")?.element() as HTMLElement | undefined;
            if (!element) return false;
            element.scrollIntoView({ behavior: "smooth" });
        }

        imageRelative(url: string | undefined) {
            return relativePath(this.__inner.imageRela, url);
        }

        closeImage(ev?: MouseEvent) {
            if (this.__inner.needBack) {
                history.back();
                return;
            }
            const gallery = this.getChild("gallery") as ImageCollectionPart;
            if (!gallery) return;
            gallery.closeImage(ev);
        }

        registerHistoryPop() {
            const self = this;
            window.addEventListener("popstate", function(ev) {
                delete self.__inner.needBack;
                const stateInfo = ev?.state as ImageHistoryState | undefined;
                if (!stateInfo?.series) return;
                self.selectSeries(stateInfo.series);
                const gallery = self.getChild("gallery") as ImageCollectionPart;
                if (!gallery) return;
                if (!stateInfo.image?.id) {
                    gallery.closeImage();
                    const imageId = Hje.getQuery("id");
                    if (imageId) {
                        const { url } = self.getSeriesLinkInfo(stateInfo.series);
                        this.history.replaceState(new ImageHistoryState(stateInfo.series), "", url);
                    }
                } else {
                    console.log("open image");
                    gallery.openImage(stateInfo.image);
                }
            });
        }

        protected onSelect(info: IImageSeriesInfo) {
        }

        private async refreshRelated() {
            const series = this.__inner.select;
            if (!series) return;
            const elements: Hje.DescriptionContract[] = [];
            let links = genLinkList(DeepX.MdBlogs.getLocaleString("relatedLinks", this.__inner.mkt?.mkt), series.links);
            if (links?.children?.length === 2) elements.push(links.children[0], links.children[1]);
            this.childrenAccess.update("related", {
                style: { display: elements.length ? "" : "none" },
                children: elements,
            });
            const blogs = this.data("blogs");
            const articles = series.id && blogs ? blogs.filter(ele => ele && ele.hasSeries(series.id)) : undefined;
            if (this.__inner.select !== series || !articles?.length) return;
            const mkt = this.__inner.mkt;
            const rela = this.__inner.blogRela;
            links = genLinkList(getLocaleString("relatedBlog", mkt?.mkt), articles.map(ele => {
                const subtitle: string[] = [];
                let text = ele.getSubtitle(mkt);
                if (text) subtitle.push(text);
                const date = ele.dateString;
                if (date) subtitle.push(date);
                return {
                    name: ele.getName(mkt),
                    subtitle: subtitle.length ? subtitle : undefined,
                    url: `${rela.value}?${ele.getRoutePath(mkt)}`,
                };
            }));
            if (links?.children?.length !== 2) return;
            this.childrenAccess.update("related", {
                style: { display: "" },
                children: [links.children[0], links.children[1], ...elements],
            });
        }

        private genSeriesMenu(selected?: string) {
            const self = this;
            const inner = self.__inner;
            const arr: Hje.DescriptionContract[] = [];
            let label: string | undefined;
            inner.series.forEach(ele => {
                if (!ele) return;
                if (typeof ele === "string") {
                    label = ele;
                    return;
                }
                const name = DeepX.MdBlogs.getLocaleProp(ele, "name", inner.mkt);
                if (!name) return null;
                if (ele.disable === "label" || ele.disable === "header") {
                    label = name;
                    return;
                }
                if (ele.disable || !ele.id) return;
                if (label) {
                    arr.push(span(label, "grouping-header"));
                    label = undefined;
                }
                const labels: Hje.DescriptionContract[] = [];
                if (ele.icon) labels.push({
                    tagName: "img",
                    props: {
                        alt: name,
                        src: relativePath(inner.imageRela, ele.icon),
                    }
                });
                labels.push(span(name, caseStyleRef(ele.options, "nameCase", inner.mkt)));
                const desc = DeepX.MdBlogs.getLocaleProp(ele, "subtitle", inner.mkt);
                if (desc) labels.push(span([span(desc)], caseStyleRef(ele.options, "subtitleCase", inner.mkt)));
                const className = ["link-long-button"];
                if (selected === ele.id) className.push("state-sel");
                const { url: seriesLink, kind } = self.getSeriesLinkInfo(ele);
                const enableRoute = kind === "route";
                arr.push({
                    tagName: "a",
                    className,
                    props: {
                        href: seriesLink || "#",
                    },
                    children: labels,
                    data: ele,
                    on: {
                        click(ev: MouseEvent) {
                            if (seriesLink && !enableRoute) return;
                            ev.preventDefault();
                            const old = inner.select;
                            self.selectSeries(ele);
                            if (!enableRoute) {
                                self.scrollContentIntoView();
                                return;
                            }
                            if (ele !== old) {
                                history.pushState(new ImageHistoryState(ele), "", seriesLink);
                                if (inner.siteName) document.title = `${name} - ${inner.siteName}`;
                            }
                            scrollToTop();
                        }
                    },
                });
            });
            return arr;
        }

        getSeriesLinkInfo(value: IImageSeriesInfo): {
            title: string;
            url: string | undefined;
            kind: "route" | "link" | "func",
        } {
            const inner = this.__inner;
            let seriesLink = inner.url;
            if (seriesLink) {
                if (seriesLink === true) seriesLink = "./";
                else if (seriesLink === "?" || seriesLink === ".") seriesLink = "./";
                else if (seriesLink.endsWith("?")) seriesLink = seriesLink.substring(0, seriesLink.length - 1);
                else if (seriesLink === "#") seriesLink = undefined;
            } else {
                seriesLink = undefined;
            }
            const enableRoute = seriesLink === "./";
            if (seriesLink) {
                if (seriesLink.endsWith("="))
                    seriesLink += value.id;
                else if (enableRoute && (value.id === "default" || value.id === "index") && value === inner.series[0])
                    seriesLink = "./";
                else
                    seriesLink += "?" + value.id;
            }
            return {
                title: `${DeepX.MdBlogs.getLocaleProp(value, "name", inner.mkt)} - ${inner.siteName}`,
                url: seriesLink,
                kind: enableRoute ? "route" : (seriesLink ? "link" : "func"),
            };
        }
    }

    export class ImageCollectionPart extends Hje.DataComponent {
        private __inner: {
            items: IImageItemInfo[];
            rela: Hje.RelativePathInfo;
            itemUrl(item: IImageItemInfo, kind: IImageUrlKind): string | undefined;
            click?(data: IImageClickInfo, ev?: MouseEvent): void;
            close?(ev?: MouseEvent): void;
            mkt?: { mkt: string | boolean };
            defaultName?: string;
            pageSize?: number;
            nextIndex: number;
            renderedCount: number;
        };
        constructor(args: any) {
            super(args);
            const data = this.data() || {
                items: []
            };
            const elements: Hje.DescriptionContract[] = [];
            const self = this;
            const pageSize = data.page && data.page > 0 ? data.page : undefined;
            this.__inner = {
                items: [],
                rela: toRela(data.rela),
                itemUrl: data.itemUrl || (() => {
                    return undefined
                }),
                click: data.click,
                close: data.close,
                mkt: data.mkt !== undefined ? { mkt: data.mkt } : undefined,
                defaultName: data.defaultName,
                pageSize: pageSize,
                nextIndex: 0,
                renderedCount: 0,
            };
            const pageSize2 = pageSize || Number.MAX_SAFE_INTEGER;
            if (data?.items) {
                let i = 0;
                let j = 0;
                for (; i < data.items.length; i++) {
                    const item = data.items[i];
                    const element = self.genItemModel(item);
                    if (!element) continue;
                    self.__inner.items.push(item);
                    if (item.disable) continue;
                    if (j >= pageSize2) continue;
                    j++;
                    elements.push(element);
                }

                this.__inner.nextIndex = i;
                this.__inner.renderedCount = j;
            }

            this.childrenAccess.set(elements);
        }

        get length() {
            return this.__inner.items;
        }

        setDefaultName(value: string) {
            this.__inner.defaultName = value;
        }

        getItem(index: number | string) {
            if (typeof index === "number")
                return index < 0 ? undefined : this.__inner.items[index];
            if (!index || typeof index !== "string") return undefined;
            const col = this.__inner.items;
            for (let i = 0; i < col.length; i++) {
                const item = col[i];
                if (index === col[i]?.id) return item;
            }
            return undefined;
        }

        pushWithoutRender(...items: IImageItemInfo[]) {
            let j = 0;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const element = this.genItemModel(item);
                if (!element) continue;
                if (this.__inner.items.indexOf(item) >= 0) continue;
                this.__inner.items.push(item);
                j++;
            }

            return j;
        }

        push(...items: IImageItemInfo[]) {
            const pageSize = this.__inner.pageSize || Number.MAX_SAFE_INTEGER;
            let j = 0;
            let k = 0;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const element = this.genItemModel(item);
                if (!element) continue;
                if (this.__inner.items.indexOf(item) >= 0) continue;
                this.__inner.items.push(item);
                j++;
                if (item.disable || k >= pageSize) continue;
                this.childrenAccess.append(element);
                k++;
            }

            return j;
        }

        clear() {
            this.__inner.items = [];
            this.__inner.nextIndex = 0;
            this.__inner.renderedCount = 0;
            this.childrenAccess.clear();
        }

        nextPage() {
            let pageSize = this.__inner.pageSize;
            let first = this.__inner.renderedCount;
            if (first < 0) first = 0;
            if (!pageSize || pageSize <= 0) {
                pageSize = Number.MAX_SAFE_INTEGER;
            } else {
                const more = first % pageSize;
                if (more === 0) {
                } else if (more === 1 && pageSize > 3) {
                    pageSize--;
                } else {
                    pageSize = pageSize - more + pageSize;
                }
            }
            const col = this.__inner.items;
            let j = 0;
            let i = this.__inner.nextIndex;
            for (; i < this.__inner.items.length; i++) {
                const item = col[i];
                if (item.disable) continue;
                if (j >= pageSize) {
                    this.__inner.nextIndex = i;
                    this.__inner.renderedCount += j;
                    return true;
                }

                const element = this.genItemModel(item);
                if (!element) continue;
                j++;
                this.childrenAccess.append(element);
            }

            this.__inner.nextIndex = i;
            this.__inner.renderedCount += j;
            return false;
        }

        indexOf(item: string | IImageItemInfo) {
            const col = this.__inner.items;
            if (!item) return -1;
            if (typeof item !== "string") {
                return col.indexOf(item);
            } else {
                for (let i = 0; i < col.length; i++) {
                    if (item === col[i]?.id) return i;
                }
            }

            return -1;
        }

        imageRelative(url: string | undefined) {
            return relativePath(this.__inner.rela, url);
        }

        openImage(item: IImageItemInfo | string, ev?: MouseEvent) {
            if (!item) return;
            if (typeof item === "string") {
                const item2 = this.getItem(item);
                if (!item2) return;
                item = item2;
            }
            const inner = this.__inner;
            const self = this;
            const name = DeepX.MdBlogs.getLocaleProp(item, "name", inner.mkt) || this.__inner.defaultName;
            let url = inner.itemUrl(item, "source");
            if (!url) return undefined;
            url = relativePath(inner.rela, url) || url;
            let thumb = item.thumb && typeof item.thumb === "string" ? item.thumb : undefined;
            if (!thumb && item.thumb !== false) thumb = inner.itemUrl(item, "thumb");
            if (thumb) thumb = relativePath(inner.rela, thumb);
            else thumb = url;
            if (typeof inner.click !== "function") return;
            inner.click({
                item,
                component: self,
                info: {
                    name,
                    url,
                    thumb,
                }
            }, ev);
        }

        closeImage(ev?: MouseEvent) {
            if (typeof this.__inner.close === "function") this.__inner.close(ev);
        }

        private genItemModel(item: IImageItemInfo) {
            if (!item) return undefined;
            const inner = this.__inner;
            const self = this;
            const name = DeepX.MdBlogs.getLocaleProp(item, "name", inner.mkt) || this.__inner.defaultName;
            let url = inner.itemUrl(item, "source");
            if (!url) return undefined;
            url = relativePath(inner.rela, url) || url;
            let thumb = item.thumb && typeof item.thumb === "string" ? item.thumb : undefined;
            if (!thumb && item.thumb !== false) thumb = inner.itemUrl(item, "thumb");
            if (thumb) thumb = relativePath(inner.rela, thumb);
            else thumb = url;
            return {
                tagName: "img",
                props: {
                    loading: "lazy",
                    src: thumb,
                    title: item.year && typeof item.year === "number" && item.year > 2000 ? `${name}\n${item.year.toString(10)}` : name,
                    alt: name,
                },
                style: item.disable ? { display: "none" } : null,
                on: {
                    click(ev) {
                        if (typeof inner.click !== "function") return;
                        inner.click({
                            item,
                            component: self,
                            info: {
                                name,
                                url,
                                thumb,
                            }
                        }, ev);
                    }
                },
                data: item,
            } as Hje.DescriptionContract;
        }
    }

    export class RelatedInfoPart extends Hje.DataComponent {
        constructor(args: any) {
            super(args);
            const data = this.data() || {};
            this.childrenAccess.set([data.title ? genHeader(data.title) : null, {
                tagName: "section",
                key: "gallery",
                component: ImageCollectionPart,
                data: {
                    rela: data.imageRela,
                    mkt: data.mkt,
                    defaultName: data.defaultImageName,
                    click: data.click,
                    close: data.close,
                    itemUrl: data.itemUrl,
                } as IImageCollectionPartData,
                className: ["x-container-pics"],
                style: { display: "none" },
            }, {
                tagName: "section",
                key: "links",
                style: { display: "none" },
            }].filter(ele => !!ele));
            if (!data.links && !data.images) return;
            this.setData(data.links, data.images);
        }

        setData(links: DeepX.MdBlogs.IArticleRelatedLinkItemInfo[] | null | undefined, images: IImageItemInfo[] | null | undefined) {
            const menu = genLinkListChildren(links);
            let count = menu?.length || 0;
            this.childrenAccess.update("links", {
                children: menu || [],
                style: { display: menu ? "" : "none" },
            });
            const gallery = this.getChild("gallery") as ImageCollectionPart;
            if (!gallery) return count;
            gallery.clear();
            const styleInfo = { display: "none" };
            if (images && images instanceof Array) {
                const count2 = gallery.push(...images);
                if (count2 > 0) styleInfo.display = "";
                count += count2;
            }
            gallery.style(styleInfo);
            return count;
        }
    }

    class ImageHistoryState {
        constructor(public series: IImageSeriesInfo, public image?: IImageItemInfo) {
        }
    }

    export function seriesList(col: IImageSeriesInfo[], imageRela: string | Hje.RelativePathInfo | ImageSeriesPart | ImageCollectionPart, link?: string, options?: {
        mkt?: string | boolean;
    }) {
        if (!link) link = "./";
        if (!col) return null;
        let imageUrl: (value: string | undefined) => string | undefined;
        if (!imageRela) imageUrl = value => value;
        else if (typeof imageRela === "string") imageUrl = value => relativePath(toRela(imageRela), value);
        else if (imageRela instanceof Hje.RelativePathInfo) imageUrl = value => relativePath(imageRela, value);
        else if (imageRela instanceof ImageCollectionPart) imageUrl = value => imageRela.imageRelative(value);
        else if (imageRela instanceof ImageSeriesPart) imageUrl = value => imageRela.imageRelative(value);
        else imageUrl = value => value;
        return col.map(ele => {
            if (!ele?.id || ele.disable) return null;
            const name = DeepX.MdBlogs.getLocaleProp(ele, "name", options);
            if (!name) return null;
            const label: Hje.DescriptionContract[] = [];
            let text = imageUrl(DeepX.MdBlogs.getLocaleProp(ele, "icon", options));
            if (text) label.push({
                tagName: "img",
                props: {
                    alt: name,
                    src: text,
                }
            });
            label.push({
                tagName: "span",
                className: caseStyleRef(ele.options, "nameCase", options),
                children: name,
            });
            text = DeepX.MdBlogs.getLocaleProp(ele, "subtitle", options);
            if (text) label.push({
                tagName: "span",
                className: caseStyleRef(ele.options, "subtitleCase", options),
                children: text,
            });
            return {
                tagName: "a",
                className: "link-long-button",
                props: {
                    href: `${link}?${ele.id}`
                },
                children: label,
            };
        }).filter(ele => !!ele);
    }

    function caseStyleRef(ele: any, key: string, options?: { mkt?: string | boolean }) {
        if (!ele) return undefined;
        const cap = DeepX.MdBlogs.getLocaleProp(ele, key || "nameCase", options) as ITitleCaseKind;
        if (!cap) return undefined;
        switch (cap.toLowerCase()) {
            case "upper":
                return "x-text-case-upper";
            case "lower":
                return "x-text-case-lower";
            case "captial":
                return "x-text-case-capital";
            case "small":
                return "x-text-case-small";
            default:
                return undefined;
        }
    }

    function toRela(rela: string | Hje.RelativePathInfo | null | undefined) {
        return (rela && rela instanceof Hje.RelativePathInfo)
            ? rela
            : new Hje.RelativePathInfo(rela || "./");
    }

    function mergeArray(original: string[], options?: string | string[] | null) {
        if (!options) return original;
        if (!original) {
            if (!options) return [];
            if (typeof options === "string") return [options];
            return options;
        }
        if (typeof options === "string") return [...original, options];
        return [...original, ...options];
    }

    function ratioClassName(ratio: string | null | undefined) {
        if (!ratio) return null;
        switch (ratio) {
            case "w":
            case "wide":
                return "x-image-ratio-w";
            case "s":
            case "square":
                return "x-image-ratio-s";
            case "p":
            case "page":
                return "x-image-ratio-p";
            case "h":
            case "horizontal":
                return "x-image-ratio-h";
            case "v":
            case "vertical":
            default:
                return null;
        }
    }

    function genLinkList(title: string | null, list: ({
        name: string;
        subtitle?: string | null | (string | number | null | undefined)[];
        url: string | { type: string; value: string; };
        newWindow?: boolean;
    } | DeepX.MdBlogs.IArticleRelatedLinkItemInfo | null | undefined)[] | null | undefined) {
        const elements = genLinkListChildren(list);
        if (!elements?.length) return null;
        const container = title ? genHeader(title) : { children: [] as Hje.DescriptionContract[] };
        container.children.push({
            tagName: "ul",
            className: "link-tile-compact",
            children: elements,
        });
        return container;
    }

    function genLinkListChildren(list: ({
        name: string;
        subtitle?: string | null | (string | number | null | undefined)[];
        url: string | { type: string; value: string; };
        newWindow?: boolean;
    } | DeepX.MdBlogs.IArticleRelatedLinkItemInfo | null | undefined)[] | null | undefined) {
        if (!list?.length || !(list instanceof Array)) return null;
        const elements = list.map(ele => {
            if (!ele?.name || !ele.url || typeof ele.url !== "string") return null;
            const children: Hje.DescriptionContract[] = [span(ele.name)];
            if (ele.subtitle) {
                if (typeof ele.subtitle === "string") {
                    children.push(span(ele.subtitle));
                } else if (ele.subtitle instanceof Array) {
                    for (let i = 0; i < ele.subtitle.length; i++) {
                        const subtitle = ele.subtitle[i];
                        if (!subtitle) continue;
                        if (typeof subtitle === "number") children.push(span(subtitle.toString(10)));
                        else if (typeof subtitle === "string") children.push(span(subtitle));
                    }
                }
            }
            const props = {
                href: ele.url,
                title: children.map(ele => ele.children).join("\n"),
            };
            if (ele.newWindow) (props as any).target = "_blank";
            return {
                tagName: "li",
                children: [{
                    tagName: "a",
                    props,
                    children,
                }],
            } as Hje.DescriptionContract;
        }).filter(ele => !!ele);
        if (!elements.length) return null;
        return elements;
    }

    function genHeader(
        children: Hje.DescriptionContract[] | string,
        className?: string | string[],
        tagName?: string,
        key?: string,
        containerKey?: string) {
        return {
            tagName: "section",
            key: containerKey,
            className,
            children: [{
                tagName: tagName || "h2",
                key,
                children,
            } as Hje.DescriptionContract],
        };
    }

    function span(text: string | Hje.DescriptionContract[], className?: string | string[], tagName?: string): Hje.DescriptionContract {
        return {
            tagName: tagName || "span",
            className,
            children: text,
        };
    }

    function multipleLines(text: string | (string | number)[] | null | undefined, className?: string | string[], tagName?: string) {
        if (!text) return null;
        if (typeof text === "string") return {
            tagName: tagName || "div",
            className,
            children: [span(text, undefined, "p")]
        };
        if (!(text instanceof Array) || !text.length) return null;
        const children = text.map(ele => {
            if (typeof ele === "number") return span(ele.toString(10), undefined, "p");
            if (!ele || typeof ele !== "string") return null;
            return span(ele, undefined, "p");
        }).filter(ele => !!ele);
        return children.length ? {
            tagName: tagName || "div",
            className,
            children,
        } : null;
    }

    function relativePath(rela: Hje.RelativePathInfo, url: string | undefined) {
        if (!url || typeof url !== "string") return undefined;
        if (url.indexOf("://") >= 0) return url;
        return rela.relative(url)?.value || url;
    }

    function hasShareApi() {
        try {
            if (typeof navigator !== "object") return false;
            return typeof navigator.share === "function";
        } catch {
            return false;
        }
    }

}
