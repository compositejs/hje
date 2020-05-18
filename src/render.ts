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
 * The options on rendering.
 */
export interface RenderingOptions {
    /**
     * true if append a new element to the target; otherwise, false.
     */
    appendMode?: boolean;

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

    /**
     * Gets or sets the property.
     */
    [property: string]: any;
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

function createContext<T = any>(element: T, model: any, assertElement: (bag: CreatingBagContract<T>) => boolean) {
    let disposable = new DisposableArray();
    let bag: CreatingBagContract<T> = {
        element,
        keyRefs: {},
        model,
        info: {},
        c: undefined,
        dispose() {
            disposable.dispose();
        }
    };
    let context: ViewGeneratingContextContract<T> = {
        element() {
            return bag.element;
        },
        model(): any {
            return bag.model;
        },
        control () {
            return bag.c;
        },
        pushDisposable(...items: DisposableContract[]) {
            return disposable.push(...items);
        },
        removeDisposable(...items: DisposableContract[]) {
            return disposable.remove(...items);
        },
        info(key: string, value: any) {
            if (arguments.length > 1) {
                if (value === undefined) delete bag.info[key];
                else bag.info[key] = value;
            }

            return bag.info[key];
        },
        childContext(key: string) {
            if (!key) return context;
            return typeof key === "string" ? bag.keyRefs[key] : undefined;
        },
        alive() {
            return assertElement(bag);
        }
    } as any;
    context.info.contain = key => {
        return Object.keys(bag.info).indexOf(key) >= 0;
    };
    context.info.keys = () => {
        return Object.keys(bag.info);
    };
    context.childContext.contain = key => {
        return Object.keys(bag.keyRefs).indexOf(key) >= 0;
    };
    context.childContext.keys = () => {
        return Object.keys(bag.keyRefs);
    };
    context.childContext.remove = key => {
        if (!key) return;
        if (typeof key === "string" || typeof key === "symbol") {
            delete bag.keyRefs[key];
            return;
        }

        if (key instanceof Array) for (let i in key) {
            let s = key[i];
            if (!s) continue;
            if (typeof s === "string" || typeof s === "symbol")
                delete bag.keyRefs[s];
        }
    };
    return {
        context,
        bag
    };
}

let viewGen: ViewGeneratorContract<any>;
let htmlGen: HtmlGenerator;

export class HtmlGenerator implements ViewGeneratorContract<HTMLElement> {
    defaultTagName = "div";
    initView(context: ViewGeneratingContextContract<HTMLElement>, tagName: string) {
        let ele = context.element();
        let eleType = typeof ele;
        if (!ele || eleType === "symbol" || ele as any === true) return document.createElement(tagName || "div");
        if (eleType === "string") ele = document.getElementById(ele as any);
        else if (eleType === "number") ele = document.body.children[ele as any] as HTMLElement;
        return ele;
    }
    alive(element: HTMLElement) {
        if (!element || !element.parentElement) return false;
        try {
            if (!element.parentElement.parentElement && element != document.body) return false;
        }
        catch (ex) {}
        return true;
    }
    unmount(element: HTMLElement) {
        if (!element) return;
        element.innerHTML = null;
        element.remove();
    }
    append(parent: HTMLElement, child: HTMLElement) {
        if (!parent || !child) return;
        parent.appendChild(child);
    }
    setProp(context: ViewGeneratingContextContract<HTMLElement>, key: string, value: any) {
        let element = context.element();
        if (!element) return;
        if (!value || typeof value === "string") element.setAttribute(key, value);
        else (element as any)[key] = value;
    }
    getProp(context: ViewGeneratingContextContract<HTMLElement>, key: string) {
        let element = context.element();
        if (!element) return undefined;
        return (element as any)[key] || element.getAttribute(key);
    }
    setStyle(context: ViewGeneratingContextContract<HTMLElement>, style: any, styleRefs: string[]) {
        let element = context.element();
        if (!element) return;
        if (style) Object.keys(style).forEach(key => {
            (element.style as any)[key] = style[key];
        });
        if (styleRefs) element.className = styleRefs.join(" ");
    }
    getStyle(context: ViewGeneratingContextContract<HTMLElement>) {
        let element = context.element();
        let result = {
            inline: undefined as any,
            refs: [] as string[],
            computed(pseudoElt?: string): any {
                return element ? getComputedStyle(element, pseudoElt) : undefined;
            }
        };
        if (!element) return result;
        result.inline = element.style;
        result.refs = (element.classList as any) || (element.className || "").split(" ");
        return result;
    }
    setTextValue(context: ViewGeneratingContextContract<HTMLElement>, value: string) {
        let element = context.element();
        if (!element) return;
        if (element.tagName === "input") {
            (element as HTMLInputElement).value = value;
            return;
        }
        
        element.appendChild(new Text(value));
    }
    bindProp(context: ViewGeneratingContextContract<HTMLElement>, keys: BindPropKeyInfoContract) {
        keys.reg("value", setter => {
            let element = context.element() as HTMLInputElement;
            if (!element) return;
            keys.on("change", ev => {
                setter(element.value);
            });
        });
    }
    onInit(context: ViewGeneratingContextContract<HTMLElement>) {
    }
    on(context: ViewGeneratingContextContract<HTMLElement>, key: string, handler: (ev: any) => void) {
        let element = context.element();
        if (!element) return;
        if (element.addEventListener) {
            element.addEventListener(key, handler, false);
            return {
                dispose() {
                    element.removeEventListener(key, handler, false);
                }
            };
        } else if ((element as any).attachEvent) {
            (element as any).attachEvent("on" + key, handler);
            return {
                dispose() {
                    if ((element as any).detachEvent) (element as any).detachEvent(key, handler, false);
                }
            };
        }
    }
}

function getHtmlGen() {
    if (!htmlGen) htmlGen = new HtmlGenerator();
    return htmlGen;
}

function formatGenerator(h: ViewGeneratorContract<any>) {
    if (!h || typeof h.initView !== "function") return false;
    if (typeof h.alive !== "function") h.alive = e => e !== null;
    if (typeof h.append !== "function") h.append = (p, e) => {};
    if (typeof h.on !== "function") h.on = (c, k, v) => {
        return { dispose() {} }
    };
    if (typeof h.onInit !== "function") h.onInit = c => {};
    if (typeof h.setProp !== "function") h.setProp = (c, k, v) => {};
    if (typeof h.setStyle !== "function") h.setStyle = (c, s, r) => {};
    if (typeof h.setTextValue !== "function") h.setTextValue = (c, v) => {};
    if (typeof h.unmount !== "function") h.unmount = e => {
        if (!e) return;
        if (typeof e.dispose === "function") e.dispose();
    };
}

export function viewGenerator<T = any>(h?: ViewGeneratorContract<T>) {
    if (arguments.length > 0) {
        if (!h) {
            viewGen = undefined;
        } else if (formatGenerator(h)) {
            viewGen = h;
        }
    }

    if (!viewGen) {
        try {
            if (window.document) viewGen = getHtmlGen();
        } catch (ex) {}
    }
    
    return viewGen;
}

function isObservable(value: any): boolean {
    if (!value) return false;
    return typeof value.subscribe === "function";
}

export class BaseComponent {
    private readonly _bag: CreatingBagContract<any> & {
        props: any
    };
    protected readonly _context: ViewGeneratingContextContract<any>;
    constructor(element: any) {
        let { context, bag } = createContext(element, undefined, b => {
            let element = b.element;
            if (!element) return false;
            let h = viewGenerator();
            if (h.alive(element)) return true;
            delete b.element;
            b.info = {};
            b.keyRefs = {};
            h.unmount(element);
            b.dispose();
            return false;
        });
        this._bag = bag as any;
        this._bag.props = {};
        this._context = context;
    }
    protected render(key: string, model: DescriptionContract) {
        let options: RenderingOptions = {
            keyRefs: this._bag.keyRefs
        };
        if (!key || key as any === true) {
            return render(this._bag.element, model, options);
        }

        let context = this._context.childContext(key);
        if (!context || typeof context.element !== "function") return undefined;
        let element = context.element();
        if (!element) return undefined;
        return render(element, model, options);
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
        if (!context) return undefined;
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
    protected addChildEventListener(childKey: string, eventKey: string, value?: any) {
        let h = viewGenerator();
        let context = this._context.childContext(childKey);
        h.on(context, eventKey, value);
    }
    prop(key: string, value?: any) {
        if (arguments.length > 1) {
            this._bag.props[key] = value;
            if (typeof (this as any).onPropChanged === "function") (this as any).onPropChanged(key, value, this.childProps);
        }

        return this._bag.props[key];
    }
    on(key: string, handler?: any) {
        this.addChildEventListener(null, key, handler);
    }
    style(value?: any, refs?: string[]) {
        return this.childStyle(null, value, refs);
    }
    styleRefs(value: string[]) {
        return this.childStyle(null, true, value);
    }
    element() {
        return this._bag.element;
    }
}

/**
 * Renders.
 * @param target  The target element to present the view.
 * @param model  The instance of view description.
 * @param options  Additional options.
 */
export function render<T = any>(target: T, model: DescriptionContract, options?: RenderingOptions | "html"): (T | undefined) {
    let h: ViewGeneratorContract<T>;
    if (arguments.length > 3 && arguments[3]) {
        let h2 = arguments[3] as ViewGeneratorContract<any>;
        if (typeof h2.initView === "function" && typeof h2.alive === "function") h = h2;
    }

    // Ensure the arguments are valid.
    if (!h) h = viewGenerator();
    if (!model || !h) return undefined;
    if (!options) {
        options = {};
    } else if (typeof options === "string") {
        if (options.toLowerCase() === "html") h = getHtmlGen() as any;
        options = {};
    }

    // Get the options information and create a empty internal data store.
    let appendMode = options.appendMode;
    let inheritRefs = options.keyRefs && typeof options.keyRefs === "object";
    let regKey = model.key;
    if (!regKey || typeof regKey !== "string") regKey = undefined;

    // Create the generating context.
    let { context, bag } = createContext(appendMode ? undefined : target, model, b => {
        let element = b.element;
        if (!element) return false;
        if (h.alive(element)) return true;
        delete b.element;
        b.info = {};
        if (!inheritRefs) b.keyRefs = {};
        else if (regKey) delete b.keyRefs[regKey];
        h.unmount(element);
        b.dispose();
        return false;
    });

    // Create or update the view.
    bag.element = h.initView(context, model.tagName);
    if (!bag.element) return undefined;

    // Control controlling logic.
    if (typeof model.control === "function") {
        if (appendMode) {
            h.append(target, bag.element);
            appendMode = false;
        }

        bag.c = new model.control(bag.element);
        if (model.props && typeof model.props === "object") {
            Object.keys(model.props).forEach(key => {
                if (!key || typeof key !== "string") return;
                let v = model.props[key];
                bag.c.prop(key, v);
            });
        }

        bag.c.style(model.style, model.styleRefs);
        if (model.on && typeof model.on === "object") {
            Object.keys(model.on).forEach(key => {
                if (!key || typeof key !== "string") return;
                let h = model.on[key];
                bag.c.on(key, h);
            });
        }

        h.onInit(context);
        if (typeof options.onInit === "function") options.onInit(context);
        if (typeof model.onInit === "function") model.onInit(context);
        if (typeof options.onLoad === "function") options.onLoad(context);
        if (typeof model.onLoad === "function") model.onLoad(context);
        return bag.element;
    }

    // Set properties.
    let props = model.props || (model as any).attr || {};
    let propsB: string[] = [];
    if (typeof props === "object") {
        Object.keys(props).forEach(key => {
            if (!key || typeof key !== "string") return;
            let v = props[key];
            if (!v || typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol") {
                h.setProp(context, key, v);
                return;
            }

            if (isObservable(v)) {
                propsB.push(key);
                let subscribe = (v as ObservableCompatibleContract).subscribe(nv => {
                    if (context.alive()) h.setProp(context, key, nv);
                });
                context.pushDisposable(subscribe);
                return;
            }

            if (typeof v.then === "function") {
                v.then((nv: any) => h.setProp(context, key, nv));
                return;
            }

            if (!v.source) {
                if (typeof v === "object") h.setProp(context, key, v);
                return;
            }

            switch (v.source) {
                case "data":
                    h.setProp(context, key, (model.data || {})[v.value]);
                    return;
            }
        });
    }

    if (model.style || model.styleRefs) h.setStyle(context, model.style, model.styleRefs);

    // Add event listeners.
    if (model.on && typeof model.on === "object") {
        Object.keys(model.on).forEach(key => {
            let handler = model.on[key] as any;
            if (!handler) return;
            if (typeof handler.process === "function") {
                let proc = handler.process as Function;
                if (handler.options) {
                    try {
                        let HitTask = InternalInjectionPool.hittask();
                        if (HitTask) {
                            let task = new HitTask();
                            task.setOptions(handler.options);
                            let proc2 = proc;
                            task.pushHandler(() => proc2.call);
                            proc = task.process;
                        }
                    } catch (ex) { }
                }

                h.on(context, key, ev => {
                    proc.call(handler.thisArg, ev, context);
                });
            } else if (typeof handler === "function") {
                h.on(context, key, handler);
            }
        });
    }

    if (propsB.length > 0 && h.bindProp) h.bindProp(context, {
        keys() {
            return propsB;
        },
        length() {
            return propsB.length;
        },
        get(key) {
            return props[key];
        },
        reg(key, then) {
            if (typeof then !== "function") return;
            then(value => {
                let obs = props[key] as ObservableCompatibleContract;
                if (!isObservable(obs)) {
                    props[key] = obs;
                    return false;
                }
    
                if (typeof obs.set === "function") obs.set(value);
                else if (typeof obs.next === "function") obs.next(value);
                else if (typeof obs === "function") (obs as Function)(value);
                else return false;
                return true;
            });
        },
        contain(key) {
            return Object.keys(props).indexOf(key) >= 0;
        },
        on(key, handler) {
            h.on(context, key, handler);
        }
    });

    // Complete initialization.
    if (appendMode) h.append(target, bag.element);
    h.onInit(context);
    if (typeof options.onInit === "function") options.onInit(context);
    if (typeof model.onInit === "function") model.onInit(context);

    // Appends children.
    if (model.children) {
        if (model.children instanceof Array) model.children.forEach(child => {
            if (!child) return;
            render<T>(bag.element, child, {
                onInit: context2 => {
                    let element = context2.element();
                    if (!element) return;
                    h.append(bag.element, element);
                    if (child.key && typeof child.key === "string") bag.keyRefs[child.key] = context2;
                },
                keyRefs: bag.keyRefs,
                appendMode: true
            });
        });
        else if (typeof model.children === "string") h.setTextValue(context, model.children);
    }

    // Finish.
    if (typeof model.onLoad === "function") model.onLoad(context);
    if (typeof options.onLoad === "function") options.onLoad(context);
    return context.element();
}

}
