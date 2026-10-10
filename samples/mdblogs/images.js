"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var DeepX;
(function (DeepX) {
    var MdBlogs;
    (function (MdBlogs) {
        class ImageGalleryPart extends Hje.DataComponent {
            constructor(args) {
                var _a;
                super(args);
                const data = this.data();
                const galleryCol = data.gallery || [];
                const mktOptions = data.mkt !== undefined ? { mkt: data.mkt } : undefined;
                const blogRela = toRela(data.blogRela || "../blog/");
                const styles = data.styles || {};
                const strings = data.strings || {};
                const mainStyle = mergeArray(["x-container-pics"], styles.main);
                this.internal.gallery = galleryCol;
                const items = {};
                if (data.items) {
                    for (const key in data.items) {
                        if (!key)
                            continue;
                        const itemCol = data.items[key];
                        if (!itemCol) {
                            continue;
                        }
                        else if (itemCol instanceof Array) {
                            items[key] = { items: itemCol };
                        }
                        else if (itemCol.items instanceof Array) {
                            items[key] = itemCol;
                        }
                    }
                }
                Object.assign(this.internal, {
                    gallery: galleryCol,
                    items,
                    rela: toRela(data.rela || "./"),
                    blogRela,
                    mkt: mktOptions,
                    mainStyle,
                    url: data.url,
                    siteName: strings.site,
                    defaultItemName: strings.pics,
                    selected: data.selected,
                });
                const self = this;
                let select = data.select;
                if (select && typeof select === "string") {
                    select = select.replace(" ", "").replace(" ", "");
                    const eqIndex = select.indexOf("=");
                    if (eqIndex === 0) {
                        select = select.length > 1 ? select.substring(1) : undefined;
                    }
                    else if (eqIndex > 0) {
                        if (eqIndex === select.length - 1)
                            select = select.substring(0, select.length - 1);
                        else
                            select = undefined;
                    }
                }
                if (select === true || select === undefined)
                    select = (_a = this.gallery[0]) === null || _a === void 0 ? void 0 : _a.id;
                else if (!select || typeof select !== "string")
                    select = undefined;
                if (data.before) {
                    this.internal.before = data.before.key;
                    if (!this.internal.before) {
                        this.internal.before = "comp-ref-image-gallery-part-before";
                        data.before.key = this.internal.before;
                    }
                }
                if (data.after) {
                    this.internal.after = data.after.key;
                    if (!this.internal.after) {
                        this.internal.after = "comp-ref-image-gallery-part-after";
                        data.after.key = this.internal.after;
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
                                rela: this.internal.rela,
                                itemUrl: data.itemUrl,
                                click: data.click ? (d, ev) => {
                                    var _a;
                                    if (typeof data.click === "function")
                                        data.click(d, ev);
                                    const selectItem = self.internal.select;
                                    if (!d.component || !((_a = d.item) === null || _a === void 0 ? void 0 : _a.id) || !selectItem)
                                        return;
                                    const { url, kind } = self.getGalleryLinkInfo(selectItem);
                                    if (kind !== "route" || !url || (!url.includes("?") && url !== "./"))
                                        return;
                                    const question = url.includes("?") ? "&" : "?";
                                    const selectImage = Hje.getQuery("id");
                                    if (selectImage) {
                                        history.replaceState(new ImageHistoryState(selectItem, d.item), "", `${url}${question}id=${d.item.id}`);
                                    }
                                    else {
                                        self.internal.needBack = true;
                                        history.pushState(new ImageHistoryState(selectItem, d.item), "", `${url}${question}id=${d.item.id}`);
                                    }
                                } : undefined,
                                close: data.close,
                                mkt: data.mkt,
                                defaultName: strings.pics,
                                page: data.page,
                            },
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
                                                    const gallery = self.getChild("gallery");
                                                    if (!gallery)
                                                        return;
                                                    const hasNextPage = gallery.nextPage();
                                                    if (hasNextPage)
                                                        return;
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
                        }, data.after,].filter(ele => !!ele)
                }, {
                    tagName: "nav",
                    children: [genHeader([{
                                tagName: "span",
                                children: MdBlogs.getLocaleString("picLibs", mktOptions === null || mktOptions === void 0 ? void 0 : mktOptions.mkt),
                            }], styles.header, "h1", undefined, "menu"), {
                            key: "all",
                            tagName: "section",
                            children: select ? [] : this.genGalleryMenu(select),
                        }].filter(ele => !!ele)
                });
                if (!select || self.internal.select)
                    return;
                const selPromise = self.selectGalleryAsync(select);
                if (!selPromise)
                    return;
                selPromise.then(sel => {
                    if (!sel)
                        return;
                    const { url, kind, title } = self.getGalleryLinkInfo(sel);
                    if (kind !== "route" || !url)
                        return;
                    if (self.internal.siteName)
                        document.title = title;
                    const imageId = Hje.getQuery("id");
                    if (!imageId || (!url.includes("?") && url !== "./")) {
                        history.replaceState(new ImageHistoryState(sel), "", url);
                        return;
                    }
                    const gallery = self.getChild("gallery");
                    if (!gallery) {
                        history.replaceState(new ImageHistoryState(sel), "", url);
                        return;
                    }
                    const url2 = `${url}${url.includes("?") ? "&" : "?"}id=${imageId}`;
                    const imageSelected = gallery.getItem(imageId);
                    history.replaceState(new ImageHistoryState(sel, imageSelected), "", url2);
                    if (imageSelected === null || imageSelected === void 0 ? void 0 : imageSelected.id)
                        gallery.openImage(imageSelected.id);
                });
            }
            get blogRela() {
                return this.internal.blogRela;
            }
            get before() {
                return this.internal.before ? this.childrenAccess.get(this.internal.before) : undefined;
            }
            get after() {
                return this.internal.after ? this.childrenAccess.get(this.internal.after) : undefined;
            }
            get gallery() {
                const col = this.internal.gallery;
                const arr = [];
                for (let i = 0; i < col.length; i++) {
                    const gallery = col[i];
                    if (!gallery || typeof gallery === "string" || gallery.disable)
                        continue;
                    arr.push(gallery);
                }
                return arr;
            }
            getGallery(id) {
                return getGallery(this.gallery, id);
            }
            selectGalleryAsync(id) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    if (!id)
                        return undefined;
                    if (typeof id === "string") {
                        const sel = this.getGallery(id);
                        if (!sel)
                            return undefined;
                        id = sel;
                    }
                    if (!id.id)
                        return undefined;
                    if (!this.internal.items[id.id]) {
                        if (!id.items) {
                        }
                        else if (id.items instanceof Array) {
                            this.internal.items[id.id] = { items: id.items };
                        }
                        else if (typeof id.items === "string") {
                            const fetchHandler = this.data("fetch");
                            const url = this.internal.rela.relative(id.items);
                            const resp = yield (typeof fetchHandler === "function" ? fetchHandler(url) : fetch(url.toString()));
                            const json = resp ? yield resp.json() : { items: [] };
                            const items = json === null || json === void 0 ? void 0 : json.items;
                            const imagesRela = (_a = json.options) === null || _a === void 0 ? void 0 : _a.imageRela;
                            if (!items) {
                            }
                            else if (items instanceof Array) {
                                this.internal.items[id.id] = {
                                    items,
                                    rela: url.relative(imagesRela || "./"),
                                };
                            }
                            else if (items[id.id] instanceof Array) {
                                for (const key in items) {
                                    if (!key || this.internal.items[key])
                                        continue;
                                    const itemCol = items[key];
                                    if (itemCol instanceof Array)
                                        this.internal.items[key] = {
                                            items: itemCol,
                                            rela: url.relative(imagesRela || "./"),
                                        };
                                }
                            }
                        }
                    }
                    return this.selectGalleryInCache(id);
                });
            }
            selectGalleryInCache(value) {
                var _a;
                const items = this.internal.items[value.id] || [];
                const gallery = this.getChild("gallery");
                if (!gallery)
                    return value;
                const mkt = this.internal.mkt;
                this.internal.select = value;
                gallery.clear();
                gallery.className(mergeArray(this.internal.mainStyle, ratioClassName((_a = value.options) === null || _a === void 0 ? void 0 : _a.ratio)));
                const name = DeepX.MdBlogs.getLocaleProp(value, "name", mkt);
                let defaultName = DeepX.MdBlogs.getLocaleProp(value.options, "defaultItemName", mkt);
                if (!defaultName)
                    defaultName = this.internal.defaultItemName || DeepX.MdBlogs.getLocaleString("pic");
                else if (defaultName === true)
                    defaultName = name;
                gallery.setDefaultName(name);
                gallery.pushWithoutRender(...items.items);
                gallery.setImageRela(items.rela || this.internal.rela);
                const hasNextPage = gallery.nextPage();
                this.childrenAccess.update("actions", {
                    style: { display: hasNextPage ? "" : "none" },
                });
                const rela = this.internal.rela;
                const title = [];
                let text = DeepX.MdBlogs.getLocaleProp(value, "icon", mkt);
                if (text)
                    title.push({
                        tagName: "img",
                        props: {
                            src: rela.relative(text).toString(),
                            alt: name,
                        },
                    });
                title.push(span(name, MdBlogs.getCaseClassName(value.options, "subtitleCase", mkt)));
                text = DeepX.MdBlogs.getLocaleProp(value, "subtitle", mkt);
                if (text)
                    title.push(span(text, MdBlogs.getCaseClassName(value.options, "subtitleCase", mkt)));
                this.childrenAccess.update("title", { children: title });
                this.refreshRelated();
                this.childrenAccess.update("all", { children: this.genGalleryMenu(value.id) });
                this.onSelect(value);
                const h = this.internal.selected;
                if (typeof h === "function")
                    h(value, this);
                return value;
            }
            relativePath(path) {
                return this.internal.rela.relative(path).toString();
            }
            scrollContentIntoView() {
                var _a;
                const element = (_a = this.getChild("title-container")) === null || _a === void 0 ? void 0 : _a.element;
                if (!element)
                    return false;
                element.scrollIntoView({ behavior: "smooth" });
            }
            scrollMenuIntoView() {
                var _a;
                const element = (_a = this.getChild("menu")) === null || _a === void 0 ? void 0 : _a.element;
                if (!element)
                    return false;
                element.scrollIntoView({ behavior: "smooth" });
            }
            getGalleryLinkInfo(value) {
                const inner = this.internal;
                let galleryLink = inner.url;
                if (galleryLink) {
                    if (galleryLink === true)
                        galleryLink = "./";
                    else if (galleryLink === "?" || galleryLink === ".")
                        galleryLink = "./";
                    else if (galleryLink.endsWith("?"))
                        galleryLink = galleryLink.substring(0, galleryLink.length - 1);
                    else if (galleryLink === "#")
                        galleryLink = undefined;
                }
                else {
                    galleryLink = undefined;
                }
                const enableRoute = galleryLink === "./";
                if (galleryLink) {
                    if (galleryLink.endsWith("="))
                        galleryLink += value.id;
                    else if (enableRoute && (value.id === "default" || value.id === "index") && value === inner.gallery[0])
                        galleryLink = "./";
                    else
                        galleryLink += "?" + value.id;
                }
                return {
                    title: `${DeepX.MdBlogs.getLocaleProp(value, "name", inner.mkt)} - ${inner.siteName}`,
                    url: galleryLink,
                    kind: enableRoute ? "route" : (galleryLink ? "link" : "func"),
                };
            }
            closeImage(ev) {
                if (this.internal.needBack) {
                    history.back();
                    return;
                }
                const gallery = this.getChild("gallery");
                if (!gallery)
                    return;
                if (this.internal.select && Hje.getQuery("id")) {
                    const path = this.getGalleryLinkInfo(this.internal.select);
                    if (path.kind === "route" && path.url) {
                        history.replaceState(new ImageHistoryState(this.internal.select), "", path.url);
                    }
                }
                gallery.closeImage(ev);
            }
            registerHistoryPop() {
                const self = this;
                window.addEventListener("popstate", function (ev) {
                    var _a;
                    delete self.internal.needBack;
                    const stateInfo = ev === null || ev === void 0 ? void 0 : ev.state;
                    const old = self.internal.select;
                    if (!(stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.gallery))
                        return;
                    if (!old || !(stateInfo.gallery.id === old.id && stateInfo.gallery.name === old.name))
                        self.selectGalleryInCache(stateInfo.gallery);
                    const gallery = self.getChild("gallery");
                    if (!gallery)
                        return;
                    if (!((_a = stateInfo.image) === null || _a === void 0 ? void 0 : _a.id)) {
                        gallery.closeImage();
                        const imageId = Hje.getQuery("id");
                        if (imageId) {
                            const { url } = self.getGalleryLinkInfo(stateInfo.gallery);
                            history.replaceState(new ImageHistoryState(stateInfo.gallery), "", url);
                        }
                    }
                    else {
                        gallery.openImage(stateInfo.image);
                    }
                });
            }
            onSelect(info) {
            }
            refreshRelated() {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c;
                    const gallery = this.internal.select;
                    if (!gallery)
                        return;
                    const elements = [];
                    let links = genLinkList(DeepX.MdBlogs.getLocaleString("relatedLinks", (_a = this.internal.mkt) === null || _a === void 0 ? void 0 : _a.mkt), gallery.links);
                    if (((_b = links === null || links === void 0 ? void 0 : links.children) === null || _b === void 0 ? void 0 : _b.length) === 2)
                        elements.push(links.children[0], links.children[1]);
                    this.childrenAccess.update("related", {
                        style: { display: elements.length ? "" : "none" },
                        children: elements,
                    });
                    const blogs = this.data("blog");
                    const articles = gallery.id && blogs ? blogs.filter(ele => ele && ele.hasGallery(gallery.id)) : undefined;
                    if (this.internal.select !== gallery || !(articles === null || articles === void 0 ? void 0 : articles.length))
                        return;
                    const mkt = this.internal.mkt;
                    const rela = this.internal.blogRela;
                    links = genLinkList(MdBlogs.getLocaleString("relatedBlog", mkt === null || mkt === void 0 ? void 0 : mkt.mkt), articles.map(ele => {
                        const subtitle = [];
                        let text = ele.getSubtitle(mkt);
                        if (text)
                            subtitle.push(text);
                        const date = ele.dateString;
                        if (date)
                            subtitle.push(date);
                        return {
                            name: ele.getName(mkt),
                            subtitle: subtitle.length ? subtitle : undefined,
                            url: `${rela.value}?${ele.getRoutePath(mkt)}`,
                        };
                    }));
                    if (((_c = links === null || links === void 0 ? void 0 : links.children) === null || _c === void 0 ? void 0 : _c.length) !== 2)
                        return;
                    this.childrenAccess.update("related", {
                        style: { display: "" },
                        children: [links.children[0], links.children[1], ...elements],
                    });
                });
            }
            genGalleryMenu(selected) {
                const self = this;
                const inner = self.internal;
                const arr = [];
                let label;
                inner.gallery.forEach(ele => {
                    if (!ele)
                        return;
                    if (typeof ele === "string") {
                        label = ele;
                        return;
                    }
                    const name = DeepX.MdBlogs.getLocaleProp(ele, "name", inner.mkt);
                    if (!name)
                        return null;
                    if (ele.disable === "label" || ele.disable === "header") {
                        label = name;
                        return;
                    }
                    if (ele.disable || !ele.id)
                        return;
                    if (label) {
                        arr.push(span(label, "grouping-header"));
                        label = undefined;
                    }
                    const labels = [];
                    if (ele.icon)
                        labels.push({
                            tagName: "img",
                            props: {
                                alt: name,
                                src: inner.rela.relative(ele.icon).toString(),
                            }
                        });
                    labels.push(span(name, MdBlogs.getCaseClassName(ele.options, "nameCase", inner.mkt)));
                    const desc = DeepX.MdBlogs.getLocaleProp(ele, "subtitle", inner.mkt);
                    if (desc)
                        labels.push(span([span(desc)], MdBlogs.getCaseClassName(ele.options, "subtitleCase", inner.mkt)));
                    const className = ["link-long-button"];
                    if (selected === ele.id)
                        className.push("state-sel");
                    const { url: galleryLink, kind } = self.getGalleryLinkInfo(ele);
                    const enableRoute = kind === "route";
                    arr.push({
                        tagName: "a",
                        className,
                        props: {
                            href: galleryLink || "#",
                        },
                        children: labels,
                        data: ele,
                        on: {
                            click(ev) {
                                if (galleryLink && !enableRoute)
                                    return;
                                ev.preventDefault();
                                const old = inner.select;
                                if (old !== ele)
                                    self.selectGalleryAsync(ele);
                                if (!enableRoute) {
                                    self.scrollContentIntoView();
                                    return;
                                }
                                if (ele !== old) {
                                    history.pushState(new ImageHistoryState(ele), "", galleryLink);
                                    if (inner.siteName)
                                        document.title = `${name} - ${inner.siteName}`;
                                }
                                MdBlogs.scrollToTop();
                            }
                        },
                    });
                });
                return arr;
            }
        }
        MdBlogs.ImageGalleryPart = ImageGalleryPart;
        class ImageCollectionPart extends Hje.DataComponent {
            constructor(args) {
                super(args);
                const data = this.data() || {
                    items: []
                };
                const elements = [];
                const self = this;
                const pageSize = data.page && data.page > 0 ? data.page : undefined;
                Object.assign(this.internal, {
                    items: [],
                    rela: toRela(data.rela),
                    itemUrl: data.itemUrl || (() => {
                        return undefined;
                    }),
                    click: data.click,
                    close: data.close,
                    mkt: data.mkt !== undefined ? { mkt: data.mkt } : undefined,
                    defaultName: data.defaultName,
                    pageSize: pageSize,
                    nextIndex: 0,
                    renderedCount: 0,
                });
                const pageSize2 = pageSize || Number.MAX_SAFE_INTEGER;
                if (data === null || data === void 0 ? void 0 : data.items) {
                    let i = 0;
                    let j = 0;
                    for (; i < data.items.length; i++) {
                        const item = data.items[i];
                        const element = self.genItemModel(item);
                        if (!element)
                            continue;
                        self.internal.items.push(item);
                        if (item.disable)
                            continue;
                        if (j >= pageSize2)
                            continue;
                        j++;
                        elements.push(element);
                    }
                    this.internal.nextIndex = i;
                    this.internal.renderedCount = j;
                }
                this.childrenAccess.set(elements);
            }
            get length() {
                return this.internal.items;
            }
            setDefaultName(value) {
                this.internal.defaultName = value;
            }
            getItem(index) {
                var _a;
                if (typeof index === "number")
                    return index < 0 ? undefined : this.internal.items[index];
                if (!index || typeof index !== "string")
                    return undefined;
                const col = this.internal.items;
                for (let i = 0; i < col.length; i++) {
                    const item = col[i];
                    if (index === ((_a = col[i]) === null || _a === void 0 ? void 0 : _a.id))
                        return item;
                }
                return undefined;
            }
            pushWithoutRender(...items) {
                let j = 0;
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const element = this.genItemModel(item);
                    if (!element)
                        continue;
                    if (this.internal.items.indexOf(item) >= 0)
                        continue;
                    this.internal.items.push(item);
                    j++;
                }
                return j;
            }
            push(...items) {
                const pageSize = this.internal.pageSize || Number.MAX_SAFE_INTEGER;
                let j = 0;
                let k = 0;
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const element = this.genItemModel(item);
                    if (!element)
                        continue;
                    if (this.internal.items.indexOf(item) >= 0)
                        continue;
                    this.internal.items.push(item);
                    j++;
                    if (item.disable || k >= pageSize)
                        continue;
                    this.childrenAccess.append(element);
                    k++;
                }
                return j;
            }
            clear() {
                this.internal.items = [];
                this.internal.nextIndex = 0;
                this.internal.renderedCount = 0;
                this.childrenAccess.clear();
            }
            nextPage() {
                let pageSize = this.internal.pageSize;
                let first = this.internal.renderedCount;
                if (first < 0)
                    first = 0;
                if (!pageSize || pageSize <= 0) {
                    pageSize = Number.MAX_SAFE_INTEGER;
                }
                else {
                    const more = first % pageSize;
                    if (more === 0) {
                    }
                    else if (more === 1 && pageSize > 3) {
                        pageSize--;
                    }
                    else {
                        pageSize = pageSize - more + pageSize;
                    }
                }
                const col = this.internal.items;
                let j = 0;
                let i = this.internal.nextIndex;
                for (; i < this.internal.items.length; i++) {
                    const item = col[i];
                    if (item.disable)
                        continue;
                    if (j >= pageSize) {
                        this.internal.nextIndex = i;
                        this.internal.renderedCount += j;
                        return true;
                    }
                    const element = this.genItemModel(item);
                    if (!element)
                        continue;
                    j++;
                    this.childrenAccess.append(element);
                }
                this.internal.nextIndex = i;
                this.internal.renderedCount += j;
                return false;
            }
            indexOf(item) {
                var _a;
                const col = this.internal.items;
                if (!item)
                    return -1;
                if (typeof item !== "string") {
                    return col.indexOf(item);
                }
                else {
                    for (let i = 0; i < col.length; i++) {
                        if (item === ((_a = col[i]) === null || _a === void 0 ? void 0 : _a.id))
                            return i;
                    }
                }
                return -1;
            }
            setImageRela(value) {
                this.internal.rela = toRela(value);
            }
            imageRelative(url) {
                return this.internal.rela.relative(url).toString();
            }
            openImage(item, ev) {
                if (!item)
                    return;
                if (typeof item === "string") {
                    const item2 = this.getItem(item);
                    if (!item2)
                        return;
                    item = item2;
                }
                const inner = this.internal;
                const self = this;
                const name = DeepX.MdBlogs.getLocaleProp(item, "name", inner.mkt) || this.internal.defaultName;
                let url = inner.itemUrl(item, {
                    kind: "source",
                    rela: inner.rela,
                });
                if (!url)
                    return undefined;
                url = inner.rela.relative(url).toString();
                let thumb = item.thumb && typeof item.thumb === "string" ? item.thumb : undefined;
                if (!thumb && item.thumb !== false)
                    thumb = inner.itemUrl(item, {
                        kind: "thumb",
                        rela: inner.rela,
                    });
                if (thumb)
                    thumb = inner.rela.relative(thumb).toString();
                else
                    thumb = url;
                if (typeof inner.click !== "function")
                    return;
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
            closeImage(ev) {
                if (typeof this.internal.close === "function")
                    this.internal.close(ev);
            }
            genItemModel(item) {
                if (!item)
                    return undefined;
                const inner = this.internal;
                const self = this;
                const name = DeepX.MdBlogs.getLocaleProp(item, "name", inner.mkt) || this.internal.defaultName;
                let url = inner.itemUrl(item, {
                    kind: "source",
                    rela: inner.rela,
                });
                if (!url)
                    return undefined;
                url = inner.rela.relative(url).toString();
                let thumb = item.thumb && typeof item.thumb === "string" ? item.thumb : undefined;
                if (!thumb && item.thumb !== false)
                    thumb = inner.itemUrl(item, {
                        kind: "thumb",
                        rela: inner.rela,
                    });
                if (thumb)
                    thumb = inner.rela.relative(thumb).toString();
                else
                    thumb = url;
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
                            if (typeof inner.click !== "function")
                                return;
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
                };
            }
        }
        MdBlogs.ImageCollectionPart = ImageCollectionPart;
        class RelatedInfoPart extends Hje.DataComponent {
            constructor(args) {
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
                        },
                        className: ["x-container-pics"],
                        style: { display: "none" },
                    }, {
                        tagName: "section",
                        key: "links",
                        style: { display: "none" },
                    }].filter(ele => !!ele));
                if (!data.links && !data.images)
                    return;
                this.setData(data.links, data.images);
            }
            setData(links, images) {
                const menu = genLinkListChildren(links);
                let count = (menu === null || menu === void 0 ? void 0 : menu.length) || 0;
                this.childrenAccess.update("links", {
                    children: menu || [],
                    style: { display: menu ? "" : "none" },
                });
                const gallery = this.getChild("gallery");
                if (!gallery)
                    return count;
                gallery.clear();
                const styleInfo = { display: "none" };
                if (images && images instanceof Array) {
                    const count2 = gallery.push(...images);
                    if (count2 > 0)
                        styleInfo.display = "";
                    count += count2;
                }
                gallery.style(styleInfo);
                return count;
            }
        }
        MdBlogs.RelatedInfoPart = RelatedInfoPart;
        class ImageHistoryState {
            constructor(gallery, image) {
                this.gallery = gallery;
                this.image = image;
            }
        }
        function galleryList(col, imageRela, link, options) {
            if (!link)
                link = "./";
            if (!col)
                return null;
            let imageUrl;
            if (!imageRela)
                imageUrl = value => value;
            else if (typeof imageRela === "string")
                imageUrl = value => toRela(imageRela).relative(value).toString();
            else if (imageRela instanceof Hje.RelativePathInfo)
                imageUrl = value => imageRela.relative(value).toString();
            else if (imageRela instanceof ImageCollectionPart)
                imageUrl = value => imageRela.imageRelative(value);
            else if (imageRela instanceof ImageGalleryPart)
                imageUrl = value => imageRela.relativePath(value);
            else
                imageUrl = value => value;
            return col.map(ele => {
                if (!(ele === null || ele === void 0 ? void 0 : ele.id) || ele.disable)
                    return null;
                const name = DeepX.MdBlogs.getLocaleProp(ele, "name", options);
                if (!name)
                    return null;
                const label = [];
                let text = imageUrl(DeepX.MdBlogs.getLocaleProp(ele, "icon", options));
                if (text)
                    label.push({
                        tagName: "img",
                        props: {
                            alt: name,
                            src: text,
                        }
                    });
                label.push({
                    tagName: "span",
                    className: MdBlogs.getCaseClassName(ele.options, "nameCase", options),
                    children: name,
                });
                text = DeepX.MdBlogs.getLocaleProp(ele, "subtitle", options);
                if (text)
                    label.push({
                        tagName: "span",
                        className: MdBlogs.getCaseClassName(ele.options, "subtitleCase", options),
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
        MdBlogs.galleryList = galleryList;
        function getGallery(gallery, id) {
            if (!id)
                return undefined;
            for (let i in gallery) {
                const item = gallery[i];
                if ((item === null || item === void 0 ? void 0 : item.id) !== id || item.disable)
                    continue;
                return item;
            }
            for (let i in gallery) {
                const item = gallery[i];
                if (!(item === null || item === void 0 ? void 0 : item.alias) || item.disable || !(item.alias instanceof Array))
                    continue;
                if (item.alias.indexOf(id) > -1)
                    return item;
            }
            return undefined;
        }
        MdBlogs.getGallery = getGallery;
        function toRela(rela) {
            return (rela && rela instanceof Hje.RelativePathInfo)
                ? rela
                : new Hje.RelativePathInfo(rela || "./");
        }
        function mergeArray(original, options) {
            if (!options)
                return original;
            if (!original) {
                if (!options)
                    return [];
                if (typeof options === "string")
                    return [options];
                return options;
            }
            if (typeof options === "string")
                return [...original, options];
            return [...original, ...options];
        }
        function ratioClassName(ratio) {
            if (!ratio)
                return null;
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
        function genLinkList(title, list) {
            const elements = genLinkListChildren(list);
            if (!(elements === null || elements === void 0 ? void 0 : elements.length))
                return null;
            const container = title ? genHeader(title) : { children: [] };
            container.children.push({
                tagName: "ul",
                className: "link-tile-compact",
                children: elements,
            });
            return container;
        }
        function genLinkListChildren(list) {
            if (!(list === null || list === void 0 ? void 0 : list.length) || !(list instanceof Array))
                return null;
            const elements = list.map(ele => {
                if (!(ele === null || ele === void 0 ? void 0 : ele.name) || !ele.url || typeof ele.url !== "string")
                    return null;
                const children = [span(ele.name)];
                if (ele.subtitle) {
                    if (typeof ele.subtitle === "string") {
                        children.push(span(ele.subtitle));
                    }
                    else if (ele.subtitle instanceof Array) {
                        for (let i = 0; i < ele.subtitle.length; i++) {
                            const subtitle = ele.subtitle[i];
                            if (!subtitle)
                                continue;
                            if (typeof subtitle === "number")
                                children.push(span(subtitle.toString(10)));
                            else if (typeof subtitle === "string")
                                children.push(span(subtitle));
                        }
                    }
                }
                const props = {
                    href: ele.url,
                    title: children.map(ele => ele.children).join("\n"),
                };
                if (ele.newWindow)
                    props.target = "_blank";
                return {
                    tagName: "li",
                    children: [{
                            tagName: "a",
                            props,
                            children,
                        }],
                };
            }).filter(ele => !!ele);
            if (!elements.length)
                return null;
            return elements;
        }
        function genHeader(children, className, tagName, key, containerKey) {
            return {
                tagName: "section",
                key: containerKey,
                className,
                children: [{
                        tagName: tagName || "h2",
                        key,
                        children,
                    }],
            };
        }
        function span(text, className, tagName) {
            return {
                tagName: tagName || "span",
                className,
                children: text,
            };
        }
        function multipleLines(text, className, tagName) {
            if (!text)
                return null;
            if (typeof text === "string")
                return {
                    tagName: tagName || "div",
                    className,
                    children: [span(text, undefined, "p")]
                };
            if (!(text instanceof Array) || !text.length)
                return null;
            const children = text.map(ele => {
                if (typeof ele === "number")
                    return span(ele.toString(10), undefined, "p");
                if (!ele || typeof ele !== "string")
                    return null;
                return span(ele, undefined, "p");
            }).filter(ele => !!ele);
            return children.length ? {
                tagName: tagName || "div",
                className,
                children,
            } : null;
        }
    })(MdBlogs = DeepX.MdBlogs || (DeepX.MdBlogs = {}));
})(DeepX || (DeepX = {}));
//# sourceMappingURL=images.js.map