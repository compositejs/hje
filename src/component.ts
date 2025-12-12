namespace Hje {

/**
 * The base component that you can extend customized business logic
 * by a) updating constructor to set new model and refreshing;
 * b) adding methods to update specific child model and refreshing.
 */
export class BaseComponent {
    private readonly _inner = {
        props: {} as any,
        disposable: new DisposableArray(),
        isDisposed: false,
        data: undefined as any,
        refreshKeys: [] as string[],
        refreshToken: undefined as number,
    };
    private _context: ViewGeneratingContextContract<any>;

    /**
     * Initializes a new instance of the BaseComponent class.
     * @param element The element.
     * @param options The options.
     */
    constructor(element: any, options?: ComponentOptionsContract<any>) {
        if (!options) options = {};
        const self = this;
        if (typeof (options as any).disposeFlagHandler === "function") (options as any).disposeFlagHandler(() => {
            this._inner.isDisposed = true;
            this._inner.disposable.dispose();
        });
        this._inner.data = options.data;
        render(element, {}, {
            onInit(c) {
                self._context = c;
                if (typeof options.contextRef === "function") options.contextRef(c);
            }
        });
    }

    /**
     * Gets the generating context of the current instance.
     */
    protected get currentContext() {
        return this._context;
    }

    /**
     * Gets the view model of the current instance.
     */
    protected get currentModel() {
        return this._context ? this._context.model() : undefined;
    }

    /**
     * Sets the view model of the current instance.
     * @param value The view model.
     */
    protected set currentModel(value: DescriptionContract) {
        this.childModel(null, value);
    }

    /**
     * Gets the generating context of a specific child.
     * @param key The child key.
     */
    protected childContext(key: string) {
        return this._context.childContext(key);
    }

    /**
     * Gets the control of a specific child.
     * @param key The child key.
     */
    protected childControl<T extends BaseComponent = BaseComponent>(key: string) {
        const c = this._context.childContext(key);
        return c ? c.control() as T : undefined;
    }

    /**
     * Gets or sets the view model of the current instance.
     * @param key The child key.
     * @param value The optional view model to override by setting its properties. The original reference will not replace but keep.
     * @param clearOriginal true if clear all properties of the original view model before set; otherwise, false.
     */
    protected childModel(key: string, value?: DescriptionContract, clearOriginal?: boolean) {
        const context = this._context.childContext(key);
        if (!context) return undefined;
        const m = context.model();
        if (arguments.length < 2 || !m) return m;
        let change = false;
        if (!clearOriginal) {
            change = true;
            for (const key in m) {
                delete (m as any)[key];
            }

            this.refreshChild(key, true);
        }

        if (!value) return undefined;
        for (const key in value) {
            (m as any)[key] = (value as any)[key];
        }

        if (!change) this.refreshChild(key, true);
        return value;
    }

    /**
     * Gets a disposable array attached in this component
     * which will dispose automatically when the component is disposed.
     */
    protected get disposableStore() {
        return this._inner.disposable;
    }

    /**
     * Gets the data bound in this component.
     */
    protected get data() {
        return this._inner.data;
    }

    /**
     * Refreshes a specific child by key.
     * @param key The child key; or null for updating the current component.
     * @param handler An optional handler to process before refreshing.
     */
    protected refreshChild(key?: string | boolean, handler?: ((context: ViewGeneratingContextContract<any>) => void) | boolean) {
        if (typeof key === "boolean") {
            if (!key) return;
            this._inner.refreshToken = undefined;
            const keys2 = this._inner.refreshKeys;
            if (keys2.length < 1) return;
            this._inner.refreshKeys = [];
            for (let i = 0; i < keys2.length; i++) {
                const key2 = keys2[i];
                const context2 = this._context.childContext(key2);
                if (context2) context2.refresh();
            }

            return;
        }

        const context = this._context.childContext(key);
        if (!context) return;
        const keys = this._inner.refreshKeys;
        if (keys.indexOf(key) < 0) keys.push(key);
        if (typeof handler === "function") {
            handler(context);
            this.refreshChild(true);
        } else if (handler === false) {
        } else if (handler === true) {
            if (this._inner.refreshToken) return;
            this._inner.refreshToken = setTimeout(() => {
                this.refreshChild(true);
            });
        } else {
            this.refreshChild(true);
        }
    }

    /**
     * Gets or sets the child property.
     * @param childKey The child key; or null for the current component.
     * @param propKey The property key.
     * @param v An opitonal value to set.
     */
    protected childProps(childKey: string, propKey: string | number | string[] | any, v?: any) {
        if (!propKey || typeof propKey === "boolean") return undefined;
        const h = viewGenerator();
        const context = this._context.childContext(childKey);
        if (!context) return undefined;
        if (arguments.length > 2) {
            const m = context.model();
            if (!m.props) m.props = {};
            m.props[propKey] = v;
            h.setProp(context, propKey, v);
        }

        if (typeof propKey === "string" || typeof propKey === "symbol" || typeof propKey === "number")
            return h.getProp(context, propKey.toString());
        
        const result: any = {};
        if (propKey instanceof Array) {
            propKey.forEach(k => {
                if (typeof k !== "string" && typeof k !== "symbol" && typeof k !== "number") return;
                result[k] = h.getProp(context, k.toString());
            });
            return result;
        }

        if (typeof propKey !== "object") return undefined;
        Object.keys(propKey).forEach(k => {
            result[k] = this.childProps(childKey, k, propKey[k]);
        });
        return result;
    }

    /**
     * Gets or sets the style information of the specific child.
     * @param childKey The child key; or null for the current component.
     * @param style The inner style object.
     * @param styleRefs The style class reference name list.
     */
    protected childStyle(childKey: string, style?: any, styleRefs?: string[] | string | boolean | {
        subscribe(h: any): any;
        [property: string]: any;
    }) {
        const h = viewGenerator();
        const context = this._context.childContext(childKey);
        if (!context || this._inner.isDisposed) return undefined;
        if (arguments.length > 2 && typeof styleRefs !== "boolean") {
            if (styleRefs) {
                if (typeof (styleRefs as any).subscribe === "function") {
                    (styleRefs as any).subscribe((nv: string[]) => {
                        if (!nv) nv = [];
                        else if (typeof nv === "string") nv = [nv as any];
                        else if (!(nv instanceof Array)) return;
                        h.setStyle(context, undefined, nv);
                    });
                    if (typeof (styleRefs as any).get === "function") styleRefs = (styleRefs as any).get();
                }
    
                if (typeof styleRefs === "string") styleRefs = [styleRefs];
                else if (!(styleRefs instanceof Array)) styleRefs = [];    
            }

            h.setStyle(context, style, styleRefs as any);
            return h.getStyle(context);
        }

        let styleInfo = h.getStyle(context);
        if (!styleInfo) styleInfo = {} as any;
        if (arguments.length > 1) {
            if (style === true) style = styleInfo.inline;
            else if (style === false) style = undefined;
            else if (styleRefs === true && styleInfo.inline) style = { ...styleInfo.inline, ...(style || {}) };
            h.setStyle(context, style, styleInfo.refs);
            return h.getStyle(context);
        }

        return styleInfo;
    }

    /**
     * Sets the style references of the specific child.
     * @param childKey The child key; or null for the current component.
     * @param value The style class reference name list.
     */
    protected childStyleRefs(childKey: string, value: string[]) {
        return this.childStyle(childKey, null, value);
    }

    /**
     * Gets a value indicating whether the component is disposed.
     */
    get isDisposed() {
        return this._inner.isDisposed;
    }

    /**
     * Adds disposable objects so that they will be disposed when this instance is disposed.
     * @param items  The objects to add.
     */
    pushDisposable(...items: DisposableContract[]) {
        return this._inner.disposable.push(...items);
    }

    /**
     * Removes the disposable objects added in this instance.
     * @param items  The objects to remove.
     */
    removeDisposable(...items: DisposableContract[]) {
        return this._inner.disposable.remove(...items);
    }

    /**
     * Gets or sets a property.
     * @param key The property key.
     * @param value The optional value of the property if need set.
     */
    prop<T = any>(key: string | any, value?: T | any) {
        if (arguments.length === 0) return Object.keys(this._inner.props);
        if (!key || this._inner.isDisposed) return undefined;
        if (typeof key === "object") {
            const obj: any = {};
            if (value === true) {
                const oldKeys = Object.keys(this._inner.props);
                const disposable = new DisposableArray();
                for (const i in oldKeys) {
                    const k = oldKeys[i];
                    setProp(this._inner.props, k, undefined, disposable);
                    obj[k] = undefined;
                }

                if (disposable.count() > 0) setInterval(() => {
                    disposable.dispose();
                }, 0);
            }

            Object.keys(key).forEach(k => {
                setProp(this._inner.props, k, key[k]);
                obj[k] = (this._inner.props[k] || {}).value;
            });

            const onPropsChanged = (this as any).onPropsChanged;
            if (onPropsChanged === false) {
            } else if (!onPropsChanged || onPropsChanged === true) {
                const h = viewGenerator();
                Object.keys(obj).forEach(k => {
                    h.setProp(this._context, k, obj[k]);
                });
            } else if (typeof onPropsChanged === "function") {
                (this as any).onPropsChanged(obj);
            } else if (typeof onPropsChanged === "object") {
                Object.keys(obj).forEach(k => {
                    if (!(this as any).onPropsChanged[k])
                        return;
                    if (typeof (this as any).onPropsChanged[k].set === "function")
                        (this as any).onPropsChanged[k].set(obj[k]);
                    else if (typeof (this as any).onPropsChanged[k].next === "function")
                        (this as any).onPropsChanged[k].next(obj[k]);
                    else if (typeof (this as any).onPropsChanged[k] === "function")
                        (this as any).onPropsChanged[k](obj[k]);
                });
            }

            return Object.keys(key);
        }

        if (arguments.length > 1 && setProp(this._inner.props, key, value)) {
            const obj = {} as any;
            obj[key] = value;
            this.prop(obj);
        }

        return this._inner.props[key];
    }

    /**
     * Adds an event listener.
     * @param key The event key.
     * @param handler The handler of the event to add.
     */
    on(key: string, handler: any) {
        const g = viewGenerator();
        if (this._inner.isDisposed) return undefined;
        const selfContext = this._context;
        if (typeof (this as any).onListened === "function") typeof (this as any).onListened(key, handler, {
            onChild(childKey: string, eventKey: string, h: any) {
                const context = selfContext.childContext(childKey);
                if (!context) return undefined;
                const c = context.control();
                if (c) {
                    c.on(eventKey, h);
                    return;
                }

                return g.on(context, eventKey, h);
            }
        });
        else return g.on(selfContext, key, handler);
    }

    /**
     * Gets or sets the style information.
     * @param value The inner style object.
     * @param refs The style class reference name list.
     */
    style(value?: any, refs?: string[] | string | boolean | {
        subscribe(h: any): any;
        [property: string]: any;
    }) {
        return this.childStyle(null, value, refs);
    }

    /**
     * Sets the style references.
     * @param value The style class reference name list.
     */
    styleRefs(value: string[]) {
        return this.style(true, value);
    }

    /**
     * Gets the raw element.
     */
    element() {
        return this._context.element();
    }

    /**
     * Disposeses this instance and remove the element from the tree.
     */
    dispose() {
        if (this._inner.isDisposed) return;
        this._inner.isDisposed = true;
        this._inner.disposable.dispose();
        if (typeof (this as any).onUnmount === "function") (this as any).onUnmount();
        const ele = this._context.element();
        if (!ele) return;
        const h = viewGenerator();
        h.unmount(ele);
    }
}

function setProp(props: any, key: string, value?: any, disposable?: DisposableArray | boolean) {
    if (!key || typeof key !== "string") return false;
    const ele = props[key];
    if (ele && ele.value === value) return false;
    if (value === undefined) {
        delete props[key];
    } else {
        if (!value) {
            props[key] = { value };
        } else if (typeof value.subscribe === "function") {
            const v = props[key] = {} as any;
            if (typeof value.get === "function") v.value = value.get();
            const subscriber = (value as ObservableCompatibleContract).subscribe(nv => {
                setProp(props, key, nv, false);
            });
            if (disposable instanceof DisposableArray) disposable.push(subscriber);
        } else if (typeof value.then === "function") {
            let noNeed = false;
            (value as Promise<any>).then(nv => {
                if (!noNeed) setProp(props, key, nv, false);
            });
            if (disposable instanceof DisposableArray) disposable.push({
                dispose() {
                    noNeed = true;
                }
            });
        } else {
            props[key] = { value };
        }
    }

    if (!ele || disposable === false) return true;
    if (typeof ele.dispose !== "function") return true;
    if (!disposable) ele.dispose();
    else if (disposable === true) setTimeout(() => {
        ele.dispose();
    }, 0);
    else disposable.push(ele);
    return true;
}

}