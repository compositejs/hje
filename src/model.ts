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
    styleRefs?: string[];

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
            props[key] = {};
            if (typeof value.get === "function") props[key].value = value.get();
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
        }
    }

    if (!ele || disposable === false) return true;
    if (typeof ele.dispose !== "function") return true;
    if (!disposable) ele.dispose();
    else if (disposable === true) setTimeout(() => {
        ele.dispose();
    }, 0);
    else disposable.push(ele);
}

export interface ComponentOptionsContract {
    children?: string | DescriptionContract[],
    contextRef?(context: ViewGeneratingContextContract<any>): void;
}

export class BaseComponent {
    private readonly _inner = {
        props: {} as any,
        isDisposed: false
    };
    protected readonly _context: ViewGeneratingContextContract<any>;
    constructor(element: any, options?: ComponentOptionsContract) {
        if (!options) options = {};
        render(element, {}, {
            onInit(c) {
                this._context = c;
                if (typeof options.contextRef === "function") options.contextRef(c);
            }
        });
    }
    protected childContext(key: string) {
        return this._context.childContext(key);
    }
    protected childModel(key: string) {
        let context = this._context.childContext(key);
        if (!context) return undefined;
        return context.model();
    }
    protected refreshChild(key: string) {
        let context = this._context.childContext(key);
        if (!context) return;
        context.refresh();
    }
    protected childProps(childKey: string, propKey: string, v?: any) {
        let h = viewGenerator();
        let context = this._context.childContext(childKey);
        if (!context) return undefined;
        if (arguments.length > 2) h.setProp(context, propKey, v);
        return h.getProp(context, propKey);
    }
    protected childStyle(childKey: string, style?: any, styleRefs?: string[] | boolean) {
        let h = viewGenerator();
        let context = this._context.childContext(childKey);
        if (!context || this._inner.isDisposed) return undefined;
        if (arguments.length > 2 && typeof styleRefs !== "boolean") {
            h.setStyle(context, style, styleRefs);
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
    prop<T = any>(key: string | any, value?: T | any) {
        if (arguments.length === 0) return Object.keys(this._inner.props);
        if (!key || this._inner.isDisposed) return undefined;
        let obj: any = {};
        if (typeof key === "object") {
            if (value === true) {
                let oldKeys = Object.keys(this._inner.props);
                let disposable = new DisposableArray();
                for (let i in oldKeys) {
                    let k = oldKeys[i];
                    obj[k] = undefined;
                    setProp(this._inner.props, k, undefined, disposable);
                }

                if (disposable.count() > 0) setInterval(() => {
                    disposable.dispose();
                }, 0);
            }

            Object.keys(key).forEach(k => {
                setProp(this._inner.props, k, key[k]);
                obj[key] = (this._inner.props[k] || {}).value;
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
                return;
            } else if (typeof onPropsChanged === "object") {
                Object.keys(obj).forEach(k => {
                    if (!(this as any).onPropsChanged[key])
                        return;
                    if (typeof (this as any).onPropsChanged[key].set === "function")
                        (this as any).onPropsChanged[key].set(value);
                    else if (typeof (this as any).onPropsChanged[key].next === "function")
                        (this as any).onPropsChanged[key].next(value);
                    else if (typeof (this as any).onPropsChanged[key] === "function")
                        (this as any).onPropsChanged[key](value);
                });
            }

            return Object.keys(this._inner.props);
        }

        if (arguments.length > 1 && setProp(this._inner.props, key, value)) {
            let obj = {} as any;
            obj[key] = value;
            this.prop(obj);
        }

        return this._inner.props[key];
    }
    on(key: string, handler: any) {
        let h = viewGenerator();
        if (this._inner.isDisposed) return undefined;
        let selfContext = this._context;
        if (typeof (this as any).onListened === "function") typeof (this as any).onListened(key, handler, {
            onChild(childKey: string, eventKey: string, handler: any) {
                let context = selfContext.childContext(childKey);
                if (!context) return undefined;
                return h.on(context, eventKey, handler);
            }
        });
        else return h.on(selfContext, key, handler);
    }
    style(value?: any, refs?: string[] | boolean) {
        return this.childStyle(null, value, refs);
    }
    styleRefs(value: string[]) {
        return this.style(true, value);
    }
    element() {
        return this._context.element();
    }
    dispose() {
        let h = viewGenerator();
        h.unmount(this._context.element());
    }
}

}
