namespace Hje {

interface IAdvancedComponentInfo {
    component: BaseComponent;
    dispose(): void;
}

/**
 * The children context of component.
 */
export class ComponentChildren {
    private __innerStore = {
        element: undefined as any,
        engine: undefined as unknown as IComponentRenderEngine,
        items: [] as IAdvancedComponentInfo[],
        text: undefined as string | undefined,
        keyed: undefined as unknown as ComponentKeyedStore,
        init: false,
    };

    /**
     * Initializes a new instance of the ComponentChildren class.
     * @param element The element reference.
     * @param engine The render engine.
     * @param lifecycle The lifecycle handlers of the component.
     * @param key The key of the current component.
     * @param keyed The store for managing component by key.
     * @param callback The handler which occurs when the children context is initialized.
     */
    constructor(
        element: any,
        engine: IComponentRenderEngine,
        key?: string | null,
        options?: IComponentRenderingOptions,
        callback?: (init: (component: BaseComponent, dispose: () => void) => null | (() => void)) => void) {
        this.__innerStore.engine = engine;
        this.__innerStore.element = engine.get(element);
        const creation = options instanceof ComponentChildCreationOptions ? options : undefined;
        if (creation?.keyed) {
            this.__innerStore.keyed = creation.keyed;
        } else {
            this.__innerStore.init = true;
            this.__innerStore.keyed = new ComponentKeyedStore();
        }
        if (typeof callback !== "function") return;
        callback((component, dispose) => {
            if (this.__innerStore.init) return null;
            if (creation) creation.registerRemoveHandler(dispose);
            if (key && typeof key === "string" && component && component instanceof BaseComponent)
                this.__innerStore.keyed.set(key, component);
            this.__innerStore.init = true;
            return () => {
                this.__innerStore.keyed = new ComponentKeyedStore();
            };
        });
    }

    /**
     * Gets the reference of parent element.
     */
    get parent() {
        return this.__innerStore.element;
    }

    /**
     * Gets all keys.
     */
    get keys() {
        return Object.keys(this.__innerStore.keyed);
    }

    /**
     * Gets the length of children.
     */
    get length() {
        return this.__innerStore.items.length;
    }

    /**
     * Gets a specific child item.
     * @param index The index or key of the child item.
     */
    get(index: number | string) {
        if (typeof index === "number")
            return index >= 0 && index < this.__innerStore.items.length ? this.__innerStore.items[index]?.component : undefined;
        if (typeof index === "string")
            return this.__innerStore.keyed.get(index);
        return undefined;
    }

    /**
     * Gets the index of the given child item.
     * @param child The item to test.
     * @returns The index; or -1, if non-exists.
     */
    indexOf(child: BaseComponent) {
        if (!child || !(child instanceof BaseComponent)) return -1;
        const list = this.__innerStore.items;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item.component === child) return i;
        }
        return -1;
    }

    /**
     * Checks if has the index or contains the child context key.
     * @param key The index of child, or the key of child declared in description.
     */
    contain(key: number | string | BaseComponent) {
        if (typeof key === "number")
            return key >= 0 && key < this.__innerStore.items.length && !!this.__innerStore.items[key]?.component;
        if (!key)
            return false;
        if (typeof key === "string")
            return !!this.__innerStore.keyed.get(key);
        if (key instanceof BaseComponent)
            return this.__innerStore.items.findIndex(ele => ele.component === key) >= 0;
        return false;
    }

    /**
     * Gets or sets the children to text content.
     * @param text Optional. The text content to set. Skip to get only.
     * @returns The new text content; or null, if its child is not a text node.
     */
    text(text?: string | number | null) {
        if (text === undefined || arguments.length < 1) {
            return this.__innerStore.text;
        }
        let s: string;
        if (typeof text === "number") {
            s = text.toString(10);
        } else if (typeof text === "string") {
            s = text;
        } else if (text) {
            s = (text as any).toString();
        } else {
            s = "";
        }

        if (this.__innerStore.items.length > 0) this.clear();
        this.__innerStore.text = s;
        this.__innerStore.engine.text(this.__innerStore.element, s);
        return this.__innerStore.text;
    }

    /**
     * Sets the child items.
     * @param models The models to set.
     * @returns The count of items added.
     */
    set(models: (DescriptionContract | null | undefined)[] | null | string | number) {
        if (typeof models === "number" || typeof models === "string") {
            this.text(models);
            return;
        }

        const modelArr = (models || []).filter(ele => !!ele) as DescriptionContract[];
        this.__innerStore.text = undefined;
        for (const item of this.__innerStore.items) {
            item.dispose();
        }
        const arr = this.__innerStore.engine.setChildren(this.__innerStore.element, modelArr, this.items());
        fillComponentContextList(this.__innerStore.items, arr, modelArr, this.__innerStore.engine, this.__innerStore.keyed);
        return modelArr.length;
    }

    /**
     * Sets the child items.
     * @param models The models to set.
     * @returns The count of items added.
     */
    setRange(...models: DescriptionContract[]) {
        return this.set(models);
    }

    /**
     * Appends the child items.
     * @param models The models to append.
     * @returns The count of items added.
     */
    append(...models: (DescriptionContract | undefined)[]) {
        if (!models?.length) return 0;
        models = models.filter(ele => !!ele);
        if (models.length < 1) return 0;
        this.__innerStore.text = undefined;
        const arr = this.__innerStore.engine.append(this.__innerStore.element, models as DescriptionContract[], this.items());
        fillComponentContextList(this.__innerStore.items, arr, models as DescriptionContract[], this.__innerStore.engine, this.__innerStore.keyed);
        return models.length;
    }

    /**
     * Inserts the child items at the specific position.
     * @param index The index to insert.
     * @param models The models to insert.
     * @returns The count of items inserted.
     */
    insert(index: number, ...models: DescriptionContract[]) {
        if (!models?.length) return 0;
        if (index < 0) return;
        if (index >= this.__innerStore.items.length) {
            return this.append(...models);
        }

        models = models.filter(ele => !!ele);
        const arr = this.__innerStore.engine.insert(this.__innerStore.element, index, models, this.items());
        const list: IAdvancedComponentInfo[] = [];
        fillComponentContextList(list, arr, models, this.__innerStore.engine, this.__innerStore.keyed);
        this.__innerStore.items.splice(index, 0, ...list);
        return models.length;
    }

    /**
     * Remove a specific child item.
     * @param index The index of child.
     * @returns true if the item has removed; otherwise, false. Not exists also returns false.
     */
    remove(index: number | BaseComponent) {
        if (typeof index !== "number") {
            index = this.indexOf(index);
            if (index < 0) return false;
        }
        if (index < 0 || index >= this.__innerStore.items.length || !Number.isInteger(index) || isNaN(index)) return false;
        const deleting = this.__innerStore.items.splice(index, 1);
        if (deleting.length < 1 || !deleting[0]) return false;
        deleting[0].dispose();
        this.__innerStore.engine.remove(this.__innerStore.element, index, deleting[0].component);
        return true;
    }

    /**
     * Replaces an existed child item by given one.
     * @param index The index of child.
     * @param model The description model of new item.
     * @returns The component; or undefined, if the index is out of range.
     */
    replace(index: number, model: DescriptionContract) {
        if (typeof index !== "number" || index < 0 || isNaN(index) || !Number.isInteger(index)) return undefined;
        if (index < 0) return undefined;
        if (index >= this.__innerStore.items.length) {
            const count = this.append(model);
            return count > 0 ? this.get(this.__innerStore.items.length - 1) : undefined;
        }
        const deleting = this.__innerStore.items.splice(index, 1);
        if (deleting.length) {
            deleting[0].dispose();
            this.__innerStore.engine.remove(this.__innerStore.element, index, deleting[0].component);
        }
        if (model) {
            const models = [model];
            const arr = this.__innerStore.engine.insert(this.__innerStore.element, index, models, this.items());
            const list: IAdvancedComponentInfo[] = [];
            fillComponentContextList(list, arr, models, this.__innerStore.engine, this.__innerStore.keyed);
            if (!list.length) return undefined;
            this.__innerStore.items.splice(index, 0, ...list);
            return list[0].component;
        }
        return model;
    }

    /**
     * Clears all child items.
     */
    clear() {
        this.set(null);
    }

    /**
     * Gets all child components.
     * @returns 
     */
    items() {
        return this.__innerStore.items.map(ele => ele.component).filter(ele => !!ele);
    }
}

/**
 * The store for managing components by key.
 */
export class ComponentKeyedStore {
    private __innerStore: Record<string, BaseComponent> = {};

    /**
     * Gets the component by key.
     * @param key The key of component.
     * @returns The component instance; or undefined if not exists.
     */
    get(key: string) {
        return key && typeof key === "string" ? this.__innerStore[key] : undefined;
    }

    /**
     * Sets the component by a specific key.
     * @param key The key of component.
     * @param value The component instance.
     */
    set(key: string | DescriptionContract, value: BaseComponent) {
        if (!key) return;
        if (typeof key === "string")
            this.__innerStore[key] = value;
        else if (key.key && typeof key.key === "string")
            this.__innerStore[key.key] = value;
    }

    /**
     * Clears the mapping of key and components.
     * Any component instance stored in the keyed store will not be cleared by this method; but will be removed from the store.
     */
    reset() {
        this.__innerStore = {};
    }
}

export class ComponentDataUpdateInfo<T = Record<string, any>> {
    private __innerStore: {
        delta: Partial<T>;
        old: T;
        info: Record<string, any>;
    }

    constructor(delta: Partial<T>, old: T) {
        this.__innerStore = {
            delta: delta || {},
            old: old ? { ...old } : {} as any,
            info: {},
        };
    }

    get delta() {
        return this.__innerStore.delta;
    }

    get<P extends keyof T>(key: P) {
        const v = this.__innerStore.delta[key];
        if (v !== undefined) return v;
        return this.__innerStore.old[key];
    }

    oldValue<P extends keyof T>(key: P) {
        return this.__innerStore.old[key];
    }

    info(key: string, value?: any) {
        if (!key) return undefined;
        if (arguments.length > 1) {
            if (value === undefined) delete this.__innerStore.info[key];
            else this.__innerStore.info[key] = value;
        }
        return this.__innerStore.info[key];
    }
}

class ComponentChildCreationOptions {
    private __innerStore: {
        keyed: ComponentKeyedStore | undefined;
        remove?: () => void;
    }
    constructor(keyed: ComponentKeyedStore | undefined) {
        this.__innerStore = {
            keyed
        };
    }
    get keyed() {
        return this.__innerStore.keyed;
    }
    registerRemoveHandler(handler: () => void) {
        this.__innerStore.remove = handler;
    }
    render(element: any, model: DescriptionContract, engine: IComponentRenderEngine) {
        const component = render(element, model, engine, this);
        return {
            component,
            dispose: this.__innerStore.remove || emptyFunction,
        } as IAdvancedComponentInfo;
    }
}

function fillComponentContextList(items: IAdvancedComponentInfo[], elements: any[], models: DescriptionContract[], engine: IComponentRenderEngine, keyed?: ComponentKeyedStore) {
    if (elements.length > models.length) throw new Error("The render engine does not work correctly.");
    for (let i = 0; i < elements.length; i++) {
        const ele = elements[i];
        if (!ele) continue;
        const m = models[i];
        const options = new ComponentChildCreationOptions(keyed);
        const info = options.render(ele, m, engine);
        if (info.component) items.push(info);
    }
}

function emptyFunction() {
}

}
