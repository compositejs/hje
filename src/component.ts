namespace Hje {

/**
 * The data handler result.
 */
interface DataHanlderResult {
    /**
     * The key of data.
     */
    key: string;
    /**
     * A value indicating whether the property of data exists and is the type of function.
     */
    handler: boolean;
    /**
     * The result of the function.
     */
    result?: any;
}

/**
 * The base component.
 */
export class BaseComponent {
    private __innerStore = {
        tagName: undefined as string | undefined,
        disposable: new DisposableArray(),
        engine: undefined as unknown as IComponentRenderEngine,
        info: genDataInfo(),
        children: undefined as unknown as ComponentChildren,
        lifecycle: undefined as DescriptionContract["lifecycle"],
        current: {
            keyed: {} as Record<string, BaseComponent>,
            className: [] as string[],
            props: {} as Record<string, any>,
            style: {} as Partial<CSSStyleDeclaration>,
            on: {} as Record<string, IComponentEventHandler[]>,
            onHandlers: {} as Record<string, (ev: any) => void>,
            data: {} as Record<string, any>,
            text: undefined as string | undefined,
            propsSubscribers: {} as Record<string, SubscriberCompatibleResultContract>,
            dataSubscribers: {} as Record<string, SubscriberCompatibleResultContract>,
            dataBounds: {} as Record<string, {
                callback(nv: any): void;
                thisArg: any;
                key: string | undefined;
            }[]>,
            classNameSubscriber: undefined as SubscriberCompatibleResultContract | undefined,
        }
    };

    /**
     * Initializes a new instance of the BaseComponent class.
     * @param args The intialization arguments.
     */
    constructor(args: Object) {
        const store = this.__innerStore;
        if (!(args instanceof ComponentInitArgs)) {
            store.engine = defaultRenderEngine();
            store.children = new ComponentChildren(undefined, store.engine, undefined, undefined);
            store.lifecycle = {};
            return;
        }

        store.engine = args.engine;
        const model = args.model;
        const children = args.children;
        store.children = children;
        const done = args.init(this, () => {
            try {
                if (this instanceof DataComponent) this.patchData({}, true);
                else this.setDataByDelta(new ComponentDeltaUpdateInfo({}, undefined, true));
            } catch {
            }
            this.offAll();
            for (const key in store.current.dataBounds) {
                delete store.current.dataBounds[key];
            }
            try {
                store.disposable.dispose();
            } catch {
            }
            store.children.clear();
            if (typeof store.lifecycle?.unload !== "function") nextWave(() => {
                try {
                    if (typeof store.lifecycle?.unload === "function")
                        store.lifecycle.unload();
                } catch {
                }
            });
            this.onUnload();
            if (typeof lifecycle.onunload === "function") lifecycle.onunload();
        });
        if (!model) {
            store.lifecycle = {};
            if (typeof done === "function") done();
            return;
        }

        store.lifecycle = model.lifecycle;
        store.tagName = model.tagName;
        if (typeof model.lifecycle?.init === "function") model.lifecycle.init(this);
        const lifecycle = args.lifecycle;
        if (typeof lifecycle.oninit === "function") lifecycle.oninit(this);
        if (model.props) this.patchProps(model.props);
        this.className(model.className);
        this.style(model.style);
        if (model.on) {
            for (const event in model.on) {
                this.on(event, model.on[event] as any);
            }
        }

        if (model.children) children.set(model.children);
        if (model.data) {
            if (this instanceof DataComponent) this.patchData(model.data, true);
            else this.setDataByDelta(new ComponentDeltaUpdateInfo(model.data, undefined, true));
        }
        if (typeof done === "function") done();
    }

    /**
     * Gets the accessor of children.
     */
    protected get childrenAccess() {
        return this.__innerStore.children;
    }

    /**
     * Gets the original tag name set.
     */
    get originalTagName() {
        return this.__innerStore.tagName;
    }

    /**
     * Gets the reference of element.
     */
    get element() {
        return this.__innerStore.children.parent;
    }

    /**
     * Accesses the additional information.
     */
    get info() {
        return this.__innerStore.info;
    }

    /**
     * Gets the count of child items.
     */
    get childrenCount() {
        return this.__innerStore.children.length;
    }

    /**
     * Gets the count of child items.
     */
    get childrenKeys() {
        return this.__innerStore.children.keys;
    }

    /**
     * Adds a disposable instance to maintain.
     * @param items  The disposable instance to add.
     */
    pushDisposable(...items: DisposableContract[]) {
        return this.__innerStore.disposable.push(...items);
    }

    /**
     * Removes a specific disposable instance.
     * @param items  The disposable instance to remove.
     */
    removeDisposable(...items: DisposableContract[]) {
        return this.__innerStore.disposable.remove(...items);
    }

    /**
     * Checks whether the element is still in the document.
     */
    alive() {
        return this.__innerStore.children.parent && this.__innerStore.engine.alive(this.__innerStore.children.parent);
    }

    /**
     * Gets a specific child item.
     * @param index The index or key of the child item.
     * @returns The child item component; or undefined, if does not exist.
     */
    getChild(index: number | string) {
        return this.childrenAccess.get(index);
    }

    /**
     * Gets the specific child item if it is an element component.
     * @param index The index or key of the child item.
     * @returns The child item element component; or undefined, if does not exist, or it is not an element component.
     */
    getChildAsElementComponent(index: number | string) {
        const c = this.childrenAccess.get(index);
        return c instanceof ElementComponent ? c : undefined;
    }

    /**
     * Checks if has the index or contains the child context key.
     * @param key The index of child, or the key of child declared in description.
     */
    containChild(key: number | string | BaseComponent | ComponentChildren) {
        if (key instanceof ComponentChildren) return this.childrenAccess === key;
        return this.childrenAccess.contain(key);
    }

    /**
     * Checks if the specific component is the parent of the current component.
     * @param component The component to test.
     * @returns true if the specific component is the parent of the current component; otherwise, false.
     */
    isParent(component: BaseComponent | ComponentChildren) {
        if (!component) return false;
        if (component instanceof BaseComponent) return component.containChild(this);
        if (component instanceof ComponentChildren) return component.contain(this);
        return false;
    }

    /**
     * Gets or sets the property of the element.
     * @param key The property key.
     * @param value The value of property; or undefined, if remove the property.
     * @returns The value of the property; or undefined, if does not exist.
     */
    prop(key: string, value?: any) {
        if (!key) return undefined;
        if (arguments.length === 2) this.patchProps({ [key]: value });
        return this.__innerStore.current.props[key];
    }

    /**
     * Sets properties batch with delta object.
     * @param obj The new properties object, or the function to set properties.
     * @param remove true if remove all rest properties out of the given; false if keep rest; a string array if remove the specific property keys.
     */
    patchProps(obj: IDeltaObject, remove?: boolean | string[]) {
        if (!this.alive()) return;
        const store = this.__innerStore;
        updateObservableProps(obj, store.current.props, store.disposable, store.current.propsSubscribers, info => {
            store.engine.props(store.children.parent, info.delta);
        }, () => {
            return store.engine.alive(store.children.parent);
        }, remove);
    }

    /**
     * Gets or sets the class name list of the style.
     * @param value Optional. To get only if no such parameter. The new class name list of the style, if set.
     * @returns The class name list of the style.
     */
    className(value?: IClassNameSetValue) {
        const oldClassName = [ ...this.__innerStore.current.className ];
        if (arguments.length < 1) return oldClassName;
        tryUnsubscribe(this.__innerStore.current.classNameSubscriber);
        this.__innerStore.current.classNameSubscriber = undefined;
        if (!this.alive()) return oldClassName;
        const newClassName = setClassName(oldClassName, value, obs => {
            this.__innerStore.current.classNameSubscriber = subscribeNewValue(obs, nv => {
                if (nv === undefined || !this.alive()) return;
                nv = stringArray(nv);
                if (!nv) return;
                this.__innerStore.current.className = [ ...nv ];
                this.__innerStore.engine.style(this.__innerStore.children.parent, {
                    oldClassName: [ ...this.__innerStore.current.className ],
                    newClassName: nv
                });
            });
        });
        if (newClassName === oldClassName) return oldClassName;
        this.__innerStore.current.className = [ ...newClassName ];
        this.__innerStore.engine.style(this.__innerStore.children.parent, { oldClassName, newClassName });
        return [ ...newClassName ];
    }

    /**
     * Gets or sets the inline style.
     * @param value The style object.
     * @returns The inline style.
     */
    style(value?: Partial<CSSStyleDeclaration>): Partial<CSSStyleDeclaration> {
        if (arguments.length > 0 && this.alive()) {
            const oldStyle = this.__innerStore.current.style;
            this.__innerStore.current.style = value ? { ...value } : {};
            this.__innerStore.engine.style(this.__innerStore.children.parent, {
                oldStyle: { ...oldStyle },
                newStyle: { ...this.__innerStore.current.style },
            })
        }

        return { ...this.__innerStore.current.style };
    }

    /**
     * Patches the inline style.
     * @returns The inline style.
     */
    patchStyle(value: Partial<CSSStyleDeclaration>) {
        if (!value || !this.alive()) return;
        const oldStyle = this.__innerStore.current.style;
        this.__innerStore.current.style = { ...oldStyle, ...value };
        this.__innerStore.engine.style(this.__innerStore.children.parent, {
            oldStyle: { ...oldStyle },
            newStyle: { ...this.__innerStore.current.style },
        })
    }

    /**
     * Adds an event listener.
     * @param event The event key.
     * @param handler The event handler.
     */
    on(event: string, handler: IComponentEventHandler) {
        if (!event || !handler || !this.alive()) return errorDisposable();
        const self = this;
        let handlers = this.__innerStore.current.on[event];
        if (!handlers) {
            handlers = [];
            this.__innerStore.current.on[event] = handlers;
            this.__innerStore.current.onHandlers[event] = (ev) => {
                occurEventHandlers(event, handlers, ev);
            }
            this.__innerStore.engine.on(this.__innerStore.children.parent, event, this.__innerStore.current.onHandlers[event]);
        }

        if (handlers.indexOf(handler) < 0) handlers.push(handler);
        return {
            dispose() {
                const index = handlers.indexOf(handler);
                if (index < 0) return;
                handlers.splice(index, 1);
            },
        } as DisposableContract;
    }

    /**
     * Removes an event listener.
     * @param event The event key.
     * @param handler The event handler.
     */
    off(event: string, handler: IComponentEventHandler) {
        if (!event || !handler || !this.alive()) return;
        let handlers = this.__innerStore.current.on[event];
        if (!handlers) return;
        const index = handlers.indexOf(handler);
        if (index < 0) return;
        handlers.splice(index, 1);
        if (handlers.length < 1) {
            delete this.__innerStore.current.on[event];
            const h = this.__innerStore.current.onHandlers[event];
            if (!h) return;
            delete this.__innerStore.current.onHandlers[event];
            this.__innerStore.engine.off(this.__innerStore.children.parent, event, h);
        }
    }

    /**
     * Removes all event listeners.
     */
    protected offAll() {
        let onKeys = Object.keys(this.__innerStore.current.on);
        for (const key of onKeys) {
            if (key) delete this.__innerStore.current.on[key];
        }
        for (const key in this.__innerStore.current.onHandlers) {
            if (!key) continue;
            const h = this.__innerStore.current.onHandlers[key];
            if (!h) continue;
            try {
                this.__innerStore.engine.off(this.__innerStore.children.parent, key, h);
            } catch {
            }
        }
        onKeys = Object.keys(this.__innerStore.current.onHandlers);
        for (const key of onKeys) {
            if (key) delete this.__innerStore.current.onHandlers[key];
        }
    }

    /**
     * Gets data.
     * @param key The property key of data.
     * @returns The data.
     */
    protected getData(key?: string) {
        return arguments.length === 0
            ? { ...this.__innerStore.current.data }
            : (key ? this.__innerStore.current.data[key] : undefined);
    }

    /**
     * Sets data batch with delta object.
     * @param obj The new properties object, or the function to set properties.
     * @param remove true if remove all rest properties out of the given; false if keep rest; a string array if remove the specific property keys.
     */
    protected setDataByDelta(obj: any) {
        if (!this.alive()) return;
        const store = this.__innerStore;
        let remove: boolean | string[] | undefined;
        let callback: undefined | ((info: ComponentDataUpdateInfo) => void);
        if (obj instanceof ComponentDeltaUpdateInfo) {
            remove = obj.remove as any;
            callback = obj.callback;
            obj = obj.obj;
        }
        updateObservableProps(obj, store.current.data, store.disposable, store.current.dataSubscribers, info => {
            if (typeof callback === "function") callback.call(this, info);
            const delta = info.delta;
            for (const key in delta) {
                const bound = store.current.dataBounds[key];
                if (!bound) continue;
                const v = delta[key];
                for (const item of bound) {
                    if (typeof item?.callback !== "function") continue;
                    item.callback.call(item.thisArg, unwrapObservableObject(v, item.key));
                }
            }
        }, () => {
            return store.engine.alive(store.children.parent);
        }, remove);
    }

    protected dataObservable(key: string, subKey?: string): ObservableCompatibleContract {
        if (!key) return {
            get() {
                return undefined;
            },
            subscribe(callback, thisArg) {
                return createSubscriberCompatibleResult(() => { }, "No key");
            }
        };
        const current = this.__innerStore.current;
        return {
            get() {
                return unwrapObservableProp(current.data, key, subKey);
            },
            subscribe(callback, thisArg) {
                if (typeof callback !== "function")
                    return createSubscriberCompatibleResult(() => { }, "No callback");
                let bounds = current.dataBounds[key];
                if (!bounds) {
                    bounds = [];
                    current.dataBounds[key] = bounds;
                }

                const item = {
                    callback,
                    thisArg,
                    key: subKey,
                };
                bounds.push(item);
                return createSubscriberCompatibleResult(() => {
                    removeFromArray(bounds, item);
                    removeFromArray(current.dataBounds[key], item);
                });
            },
        }
    }

    /**
     * Occurs when the component is unloaded.
     */
    protected onUnload() {
    }
}

/**
 * The base component with data driven.
 */
export class DataComponent<TData extends Record<string, any> = Record<string, any>, TInternal extends Record<string, any> = Record<string, any>>
extends BaseComponent {
    private __innerStore2: TInternal | undefined;

    /**
     * Initializes a new instance of the BaseComponent class.
     * @param args The intialization arguments.
     */
    constructor(args: Object) {
        super(args);
    }

    /**
     * Gets the internal context.
     */
    protected get internal() {
        if (this.__innerStore2 === undefined) {
            this.__innerStore2 = this.onInitInternal();
            if (this.__innerStore2 === undefined) this.__innerStore2 = {} as TInternal;
        }
        return this.__innerStore2;
    }

    /**
     * Gets the data copied.
     * @param key The property key of data.
     * @returns The value of the data property; or undefined, if does not exist.
     */
    data(): TData;
    /**
     * Gets the data property bound.
     * @param key The property key of data.
     * @returns The value of the data property; or undefined, if does not exist.
     */
    data<P extends keyof TData>(key: P): TData[P];
    /**
     * Gets the data copied with the specific properties.
     * @param key The property keys of data.
     * @returns All the value of the data property in the object.
     */
    data<P extends keyof TData>(key: P[]): Record<P, TData[P]>;
    /**
     * Sets the data property bound.
     * @param key The property key of data.
     * @param value The value of data property; or undefined, if remove the property.
     * @returns The value of the data property; or undefined, if does not exist.
     */
    data<P extends keyof TData>(key: P, value: any): TData[P];
    /**
     * Gets or sets the data property bound.
     * @param key The property key of data.
     * @param value The value of data property; or undefined, if remove the property.
     * @returns The value of the data property; or undefined, if does not exist.
     */
    data<P extends keyof TData>(key?: P | P[], value?: any) {
        if (!key) return arguments.length === 0 ? this.getData() : undefined;
        if (key instanceof Array) {
            const obj: Record<typeof key[number], any> = {} as any;
            for (const k of key) {
                if (k && typeof k === "string") obj[k] = this.data(k);
            }
            return obj;
        }
        if (arguments.length === 2) this.patchData({ [key]: value } as any);
        return this.getData(key as any);
    }

    patchData(obj: IDeltaObject<TData>): void;
    patchData(obj: IDeltaObject<TData>, remove: boolean): void;
    patchData<P extends keyof TData>(obj: IDeltaObject<TData>, remove: P[]): void;
    patchData<P extends keyof TData>(obj: IDeltaObject<TData>, remove?: boolean | P[]) {
        super.setDataByDelta(new ComponentDeltaUpdateInfo<TData>(obj, info => this.onDataChange(info), remove));
    }

    /**
     * Calls the method which is the specific property in data, substituting another object for the current object.
     * @param key The property key of data.
     * @param thisArg The object to be used as the current object.
     * @param argArray A list of arguments to be passed to the method.
     * @returns The result of the method; or undefined, if no such method, or the result is undefined.
     */
    callDataHandler<P extends keyof TData>(key: P, thisArg: any, ...argArray: any[]): DataHanlderResult {
        const h = super.getData(key as string);
        if (typeof h !== "function") return {
            key: key as string,
            handler: false,
        };
        return {
            key: key as string,
            handler: true,
            result: (h as Function).call(thisArg, ...argArray)
        };
    }

    /**
     * Calls the function which is the specific property in data, substituting the specified object for the this value of the function, and the specified array for the arguments of the function.
     * @param key The property key of data.
     * @param thisArg The object to be used as the this object.
     * @param argArray A set of arguments to be passed to the function.
     * @returns The result of the function; or undefined, if no such function, or the result is undefined.
     */
    applyDataHandler<P extends keyof TData>(key: P, thisArg: any, argArray?: any): DataHanlderResult {
        const h = super.getData(key as string);
        if (typeof h !== "function") return {
            key: key as string,
            handler: false,
        };
        return {
            key: key as string,
            handler: true,
            result: (h as Function).apply(thisArg, argArray)
        };
    }

    /**
     * Occurs when the data changes.
     * @param delta The changed and current data.
     */
    protected onDataChange(info: ComponentDataUpdateInfo<TData>) {
    }

    /**
     * Occurs when initialize to access the internal context object.
     * @returns The object created for internal context.
     */
    protected onInitInternal(): TInternal {
        return {} as TInternal;
    }
}

class ComponentDeltaUpdateInfo<T extends Record<string, any>> {
    constructor(
        public obj: IDeltaObject<T>,
        public callback: undefined | ((info: ComponentDataUpdateInfo<T>) => void),
        public remove: boolean | (keyof T)[] | undefined) {
        }
}

/**
 * The initialization arguments for component.
 */
class ComponentInitArgs {
    private __innerStore: {
        children: ComponentChildren;
        model: DescriptionContract;
        engine: IComponentRenderEngine;
        callback?: (component: BaseComponent, dispose: () => void) => (null | (() => void));
        lifecycle: {
            oninit?(component: BaseComponent): void;
            onload?(component: BaseComponent): void;
            onunload?(): void;
        }
    }
    constructor(element: any, model: DescriptionContract, engine?: IComponentRenderEngine, options?: IComponentRenderingOptions) {
        if (!engine) engine = defaultRenderEngine();
        let callback: (component: BaseComponent, dispose: () => void) => (null | (() => void));
        this.__innerStore = {
            children: new ComponentChildren(element, engine, model?.key, options, h => {
                callback = h;
            }),
            model,
            engine,
            lifecycle: {
                oninit: options?.oninit,
                onload: options?.onload,
                onunload: options?.onunload,
            }
        };
        this.__innerStore.callback = callback!;
    }
    get children() {
        return this.__innerStore.children;
    }
    get model() {
        return this.__innerStore.model;
    }
    get engine() {
        return this.__innerStore.engine;
    }
    get lifecycle() {
        return this.__innerStore.lifecycle;
    }
    init(component: BaseComponent, dispose: () => void) {
        if (typeof this.__innerStore.callback !== "function" || !component.containChild(this.__innerStore.children)) return null;
        const done = this.__innerStore.callback(component, dispose);
        delete this.__innerStore.callback;
        return done;
    }
}

/**
 * Creates a component instance with the given element and description model.
 * @param element The element reference.
 * @param model The description model.
 * @param engine The render engine.
 * @param keyed The keyed component record to store the created component with key.
 * @returns The component instance created; or undefined if fails.
 */
export function render(element: any, model: DescriptionContract, engine?: IComponentRenderEngine, options?: IComponentRenderingOptions) {
    if (!element) return undefined;
    const type = getComponentType(model);
    const args = new ComponentInitArgs(element, model, engine, options);
    const component = new type(args);
    if (typeof model?.lifecycle?.load === "function") model.lifecycle.load(component);
    if (typeof options?.onload === "function") options.onload(component);
    return component;
}

function updateObservableProps(
    obj: IDeltaObject | undefined,
    current: Record<string, any>,
    disposable: DisposableArray,
    subscribers: Record<string, SubscriberCompatibleResultContract>,
    callback: (delta: ComponentDataUpdateInfo) => void,
    check: () => boolean,
    remove: boolean | string[] | undefined) {
    if (!obj) return;
    if (typeof obj === "function") {
        const result = obj({ ...current });
        if (!result || typeof result === "function" || typeof result === "string") return;
        if (result instanceof Promise) {
            result.then(r => {
                if (!r || typeof r === "function" || typeof r === "string" || (typeof check === "function" && !check())) return;
                updateObservableProps(r, current, disposable, subscribers, callback, check, remove);
            });
        } else {
            updateObservableProps(result, current, disposable, subscribers, callback, check, remove);
        }

        return;
    }

    if (obj instanceof Array) {
        const obj2: Record<string, any> = {};
        for (const record of obj) {
            if (!record?.key) continue;
            if (record.skip && obj2[record.key]) continue;
            obj2[record.key] = record.value;
        }
        obj = obj2;
    }

    const delta = mapObservable(obj, disposable, subscribers, (key, nv) => {
        if (current[key] === nv || (typeof check === "function" && !check())) return;
        const delta2 = { [key]: nv };
        nv = delta2[key];
        const info2 = new ComponentDataUpdateInfo(delta2, current);
        if (nv === undefined) delete current[key];
        else current[key] = delta2[key];
        callback(info2);
    });
    if (remove) {
        if (remove instanceof Array) {
            for (const item in remove) {
                if (!item || typeof item !== "string") continue;
                delta[item] = undefined;
            }
        } else if (remove === true) {
            const keys = Object.keys(delta);
            for (const item in current) {
                if (!item || keys.indexOf(item) >= 0) continue;
                delta[item] = undefined;
            }
        }
    }

    const info = new ComponentDataUpdateInfo(delta, current);
    for (const key in delta) {
        if (!key) continue;
        const v = delta[key];
        if (v === current[key]) delete delta[key];
        else if (v === undefined) delete current[key];
        else current[key] = v;
    }

    callback(info);
}

function occurEventHandlers(event: string, handlers: IComponentEventHandler[], ev: any) {
    const start = new Date();
    for (const h of handlers) {
        if ((h as IComponentEventHandlerInstance).disable) continue;
        if (!isEventHandlerInstance(h)) {
            if (typeof h === "function") h(ev);
            continue;
        }
        const options: Parameters<IComponentEventHandlerInstance["process"]>[0] = {
            key: event,
            occur: start,
            context: self,
            info: h.info,
            off() {
                const index = handlers.indexOf(h);
                if (index < 0) return;
                handlers.splice(index, 1);
            },
        };
        if (typeof h.delay === "number") {
            if (h.delay >= 0) {
                setTimeout(() => {
                    if (!h.disable && typeof h.process === "function")
                        h.process.call(h.thisArg, ev, options);
                }, h.delay);
            } else {
                setTimeout(() => {
                    if (!h.disable && typeof h.process === "function")
                        h.process.call(h.thisArg, ev, options);
                });
            }
        } else if (h.delay) {
            setTimeout(() => {
                if (!h.disable && typeof h.process === "function")
                    h.process.call(h.thisArg, ev, options);
            });
        } else {
            h.process.call(h.thisArg, ev, options);
        }
    }
}

function isEventHandlerInstance(handler: IComponentEventHandler): handler is IComponentEventHandlerInstance {
    return typeof (handler as IComponentEventHandlerInstance).process === "function";
}

function createSubscriberCompatibleResult(callback: () => void, message?: string) {
    const f = function () {
        callback();
    } as SubscriberCompatibleResultContract;
    f.dispose = callback;
    if (message) (f as any).message = message;
    return f;
}

}