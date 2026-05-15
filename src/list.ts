namespace Hje {

type IListComponentItemGenerator<T> = (model: T) => DescriptionContract | undefined;

export interface IListComponentData<T = any> {
    source?: T[];
    item?: IListComponentItemGenerator<T>;
}

interface IListComponentInternal<T> {
    source: {
        model: T;
        info?: any;
    }[];
}

/**
 * The list component.
 */
export class ListComponent<T = any> extends DataComponent<IListComponentData<T>, IListComponentInternal<T>> {
    /**
     * Initializes a new instance of the ListComponent class.
     * @param args The intialization arguments.
     */
    constructor(args: Object) {
        super(args);
    }

    /**
     * Gets the index of the given child item model.
     * @param model The item model to test.
     * @returns The index; or -1, if does not exist.
     */
    indexOf(model: T | BaseComponent) {
        const index = this.childrenAccess.indexOf(model as BaseComponent);
        if (index >= 0) return index;
        else if (model === undefined) return -1;
        const col = this.internal.source;
        for (let i = 0; i < col.length; i++) {
            const item = col[i];
            if (item && item.model === model) return i;
        }

        return -1;
    }

    /**
     * Gets the index of the last occurrence of of the given child item model.
     * @param model The item model to test.
     * @returns The index; or -1, if does not exist.
     */
    lastIndexOf(model: T | BaseComponent) {
        const index = this.childrenAccess.lastIndexOf(model as BaseComponent);
        if (index >= 0) return index;
        else if (model === undefined) return -1;
        const col = this.internal.source;
        for (let i = col.length - 1; i >= 0; i--) {
            const item = col[i];
            if (item && item.model === model) return i;
        }

        return -1;
    }

    /**
     * Appends new model items to the end of the content list.
     * @param items New items to add.
     */
    push(...items: T[]) {
        items = items.filter(ele => ele !== undefined);
        const h = modelToDescriptionHandler(this.data("item"), this.originalTagName);
        this.internal.source.push(...items.map(ele => {
            return {
                model: ele,
            };
        }));
        this.childrenAccess.append(...items.map(h));
    }

    /**
     * Removes a specific item.
     * @param model The item to remove.
     * @returns A value indicating whether remove succeeded; or false, if does not exist.
     */
    remove(model: T | BaseComponent) {
        const i = this.indexOf(model);
        if (i < 0) return false;
        this.removeAt(i);
        return true;
    }

    /**
     * Removes an item by given index.
     * @param index The index of item to remove.
     * @returns A value indicating whether remove succeeded; or false, if does not exist.
     */
    removeAt(index: number) {
        if (!this.childrenAccess.remove(index)) return false;
        const removed = this.internal.source.splice(index, 1);
        return removed && removed.length > 0;
    }

    toDescription(model: T) {
        const item = this.data("item");
        if (typeof item === "function") return item(model);
        const tagName = getSubTagName(this.originalTagName);
        return {
            tagName: tagName,
            children: String(model),
        };
    }

    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any) {
        this.internal.source.map(ele => ele.model).forEach(callbackfn, thisArg);
    }

    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any) {
        return this.internal.source.map(ele => ele.model).map(callbackfn, thisArg);
    }

    filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any) {
        return this.internal.source.map(ele => ele.model).filter(predicate, thisArg);
    }

    /**
     * Gets the item model of the specific index.
     * @param index The index to get model.
     * @returns The model item; or undefined, if the index is out of range.
     */
    get(index: number) {
        return index >= 0 ? this.internal.source[index]?.model : undefined;
    }

    first() {
        const arr = this.internal.source.map(ele => ele.model);
        return arr.length > 0 ? arr[0] : undefined;
    }

    last() {
        const arr = this.internal.source.map(ele => ele.model);
        return arr.length > 0 ? arr[arr.length - 1] : undefined;
    }

    protected onDataChange(info: ComponentDataUpdateInfo<IListComponentData<T>>) {
        super.onDataChange(info);
        if (!info.delta.source && !info.delta.item) return;
        let source = info.get("source");
        if (!(source instanceof Array)) source = [];
        const h = modelToDescriptionHandler(info.get("item"), this.originalTagName);
        const store = this.internal.source;
        store.splice(0);
        const children = [] as DescriptionContract[];
        for (const model of source) {
            if (model === undefined) continue;
            const element = h(model);
            if (!element) continue;
            children.push(element);
            store.push({
                model,
            });
        }
        this.childrenAccess.set(children);
    }

    protected onInitInternal() {
        return { source: [] };
    }
}

function getSubTagName(containerTagName: string | undefined) {
    switch ((containerTagName || "").toLowerCase()) {
        case "div":
        case "section":
            break;
        case "ul":
        case "ol":
            return "li";
        case "span":
        case "a":
        case "button":
        case "em":
        case "strong":
            return "span";
    }
    return "div";
}

function modelToDescriptionHandler<T>(h: undefined | IListComponentItemGenerator<T>, containerTagName: string | undefined) {
    if (typeof h === "function") return h;
    const tagName = getSubTagName(containerTagName);
    return (m: T) => {
        return {
            tagName: tagName,
            children: String(m),
        } as DescriptionContract;
    };
}

}