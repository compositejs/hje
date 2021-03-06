/// <reference path="./disposable.ts" />

namespace Hje {
    
/**
 * The view description model.
 */
export interface DescriptionContract {
    /**
     * The preferred tag name.
     */
    tagName?: string;

    /**
     * The key.
     */
    key?: string;

    /**
     * The control type to initialize.
     */
    control?: typeof BaseComponent;

    /**
     * The class name of style.
     */
    styleRefs?: string[] | string | {
        subscribe(h: any): any;
        [property: string]: any;
    };

    /**
     * Inline style.
     */
    style?: any;

    /**
     * Properties (attributes).
     */
    props?: {
        [property: string]: string | any;
    };

    /**
     * The events.
     */
    on?: {
        [property: string]: ((ev: any) => void) | {
            process(ev: any, context: ViewGeneratingContextContract<any>): void;
            thisArg: any;
            [property: string]: any;
        };
    };

    /**
     * Childrens.
     */
    children?: DescriptionContract[] | string;

    /**
     * Data bound.
     */
    data?: any;

    /**
     * Occurs on initialization.
     * @param context  The context.
     */
    onInit?(context: ViewGeneratingContextContract<any>): void;

    /**
     * Occurs on load completed.
     * @param context  The context.
     */
    onLoad?(context: ViewGeneratingContextContract<any>): void;
}

/**
 * The view context during rendering.
 */
export interface ViewGeneratingContextContract<T> {
    /**
     * Gets the source element.
     */
    element(): T;

    /**
     * Gets the source description model of view.
     */
    model(): DescriptionContract;

    /**
     * Gets the control created if has.
     */
    control(): BaseComponent | undefined;

    /**
     * Adds a disposable instance to maintain.
     * @param items  The disposable instance to add.
     */
    pushDisposable(...items: DisposableContract[]): number;

    /**
     * Removes a specific disposable instance.
     * @param items  The disposable instance to remove.
     */
    removeDisposable(...items: DisposableContract[]): number;

    /**
     * Gets or sets the additional information.
     * @param key  The property key.
     */
    info: {
        /**
         * Gets or sets the additional information.
         * @param key  The property key.
         * @param value  The value of property to set.
         */
        <T = any>(key: string, value?: T): T;

        /**
         * Checks if contains the context information key.
         * @param key  The property key.
         */
        contain(key: string): boolean;

        /**
         * Gets all keys.
         */
        keys(): string[];
    };
  
    /**
     * Gets the child context by specific key.
     * @param key  The key of context cached.
     */
    childContext: {
        /**
         * Gets the child context by specific key.
         * @param key  The key of child declared in description.
         */
        (key: string): ViewGeneratingContextContract<T> | undefined;

        /**
         * Checks if contains the child context key.
         * @param key  The key of child declared in description.
         */
        contain(key: string): boolean;

        /**
         * Gets all keys.
         */
        keys(): string[];

        /**
         * Remove a specific child context.
         * @param key  The key of child declared in description.
         */
        remove(key: string | string[]): void;
    };
  
    /**
     * Checks whether the element is still in the document.
     */
    alive(): boolean;

    /**
     * Refreshes.
     */
    refresh(): void;
}

export interface BindPropKeyInfoContract {
    keys(): string[];
    length(): number;
    get(key: string): any;
    reg(key: string, then: ((setter: ((value: any) => boolean)) => void)): void;
    contain(key: string): boolean;
    on(key: string, handler: (ev: any) => void): void;
}

/**
 * The view generator.
 */
export interface ViewGeneratorContract<T> {
    /**
     * Gets the default tag name.
     */
    defaultTagName: string;

    /**
     * Creates or initializes a element.
     * @param context  The context.
     * @param tagName  The preferred tag nam.
     */
    initView(context: ViewGeneratingContextContract<T>, tagName: string): T;
    
    /**
     * Checks whether the element is still in the document.
     * @param element  The element to check.
     */
    alive(element: T): boolean;

    /**
     * Removes a specific element from document and clear its children.
     * @param element  The element to remove.
     */
    unmount(element: T): void;

    /**
     * Appends an element into a container.
     * @param parent  The parent container element.
     * @param child  The element to add.
     */
    append(parent: T, child: T): void;

    /**
     * Sets a property (or an attribute).
     * @param context  The context.
     * @param key  The property (attribute) key.
     * @param value  The value to set.
     */
    setProp(context: ViewGeneratingContextContract<T>, key: string, value: any): void;

    /**
     * Gets a property (or an attribute).
     * @param context  The context.
     * @param key  The property (attribute) key.
     * @param value  The value to set.
     */
    getProp(context: ViewGeneratingContextContract<T>, key: string): any;

    /**
     * Sets the styles.
     * @param context  The context.
     * @param style  The style.
     * @param styleRefs  The class name list of style.
     */
    setStyle(context: ViewGeneratingContextContract<T>, style: any, styleRefs: string[]): void;

    /**
     * Gets the style.
     * @param context  The context.
     */
    getStyle(context: ViewGeneratingContextContract<T>): {
        inline: any,
        refs: string[] | undefined
    }

    /**
     * Sets the text into element.
     * @param context  The context.
     * @param value  The text value.
     */
    setTextValue(context: ViewGeneratingContextContract<T>, value: string): void;

    /**
     * Processes additional customized logic for attributes (props) to bind.
     * @param context  The context.
     * @param keys  The key will bind.
     */
    bindProp?(context: ViewGeneratingContextContract<T>, keys: BindPropKeyInfoContract): void;

    /**
     * Occurs when the view is initialized.
     * @param context  The context
     */
    onInit(context: ViewGeneratingContextContract<T>): void;

    /**
     * Binds an event handler.
     * @param context  The context.
     * @param key  The event key.
     * @param handler  The event handler to raise.
     */
    on(context: ViewGeneratingContextContract<T>, key: string, handler: (ev: any) => void): DisposableContract;
}

interface CreatingBagContract<T> {
    element: T
    keyRefs: any,
    model: DescriptionContract,
    info: any,
    c: BaseComponent,
    dispose(): void;
}

function setProp(props: any, key: string, value?: any, disposable?: DisposableArray | boolean) {
    if (!key || typeof key !== "string") return false;
    let ele = props[key];
    if (ele && ele.value === value) return false;
    if (value === undefined) {
        delete props[key];
    } else {
        if (!value) {
            props[key] = { value };
        } else if (typeof value.subscribe === "function") {
            let v = props[key] = {} as any;
            if (typeof value.get === "function") v.value = value.get();
            let subscriber = (value as ObservableCompatibleContract).subscribe(nv => {
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

export interface ComponentOptionsContract {
    data?: any;
    children?: string | DescriptionContract[],
    contextRef?(context: ViewGeneratingContextContract<any>): void;
    [property: string]: any;
}

/**
 * The base component that you can extend customized business logic
 * by a) updating constructor to set new model and refreshing;
 * b) adding methods to update specific child model and refreshing.
 */
export class BaseComponent {
    private readonly _inner = {
        props: {} as any,
        disposable: new DisposableArray(),
        isDisposed: false
    };
    private _context: ViewGeneratingContextContract<any>;

    /**
     * Initializes a new instance of the BaseComponent class.
     * @param element The element.
     * @param options The options.
     */
    constructor(element: any, options?: ComponentOptionsContract) {
        if (!options) options = {};
        let self = this;
        if (typeof (options as any).disposeFlagHandler === "function") (options as any).disposeFlagHandler(() => {
            this._inner.isDisposed = true;
            this._inner.disposable.dispose();
        });
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
        let c = this._context.childContext(key);
        return c ? c.control() as T : undefined;
    }

    /**
     * Gets or sets the view model of the current instance.
     * @param key The child key.
     * @param value The optional view model to override by setting its properties. The original reference will not replace but keep.
     * @param clearOriginal true if clear all properties of the original view model before set; otherwise, false.
     */
    protected childModel(key: string, value?: any, clearOriginal?: boolean) {
        let context = this._context.childContext(key);
        if (!context) return undefined;
        let m = context.model();
        if (arguments.length < 2 || !m) return m;
        if (!clearOriginal) for (let key in m) {
            delete (m as any)[key];
        }

        if (!value) return undefined;
        for (let key in value) {
            (m as any)[key] = value[key];
        }

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
     * Refreshes a specific child by key.
     * @param key The child key; or null for updating the current component.
     */
    protected refreshChild(key?: string) {
        let context = this._context.childContext(key);
        if (!context) return;
        context.refresh();
    }

    /**
     * Gets or sets the child property.
     * @param childKey The child key; or null for the current component.
     * @param propKey The property key.
     * @param v An opitonal value to set.
     */
    protected childProps(childKey: string, propKey: string | number | string[] | any, v?: any) {
        if (!propKey || typeof propKey === "boolean") return undefined;
        let h = viewGenerator();
        let context = this._context.childContext(childKey);
        if (!context) return undefined;
        if (arguments.length > 2) {
            let m = context.model();
            if (!m.props) m.props = {};
            m.props[propKey] = v;
            h.setProp(context, propKey, v);
        }

        if (typeof propKey === "string" || typeof propKey === "symbol" || typeof propKey === "number")
            return h.getProp(context, propKey.toString());
        
        let result: any = {};
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
        let h = viewGenerator();
        let context = this._context.childContext(childKey);
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
            let obj: any = {};
            if (value === true) {
                let oldKeys = Object.keys(this._inner.props);
                let disposable = new DisposableArray();
                for (let i in oldKeys) {
                    let k = oldKeys[i];
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

            let onPropsChanged = (this as any).onPropsChanged;
            if (onPropsChanged === false) {
            } else if (!onPropsChanged || onPropsChanged === true) {
                let h = viewGenerator();
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
            let obj = {} as any;
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
        let g = viewGenerator();
        if (this._inner.isDisposed) return undefined;
        let selfContext = this._context;
        if (typeof (this as any).onListened === "function") typeof (this as any).onListened(key, handler, {
            onChild(childKey: string, eventKey: string, h: any) {
                let context = selfContext.childContext(childKey);
                if (!context) return undefined;
                let c = context.control();
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
        let ele = this._context.element();
        if (!ele) return;
        let h = viewGenerator();
        h.unmount(ele);
    }
}

}
