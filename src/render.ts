/// <reference path="./disposable.ts" />

namespace Hje {
    
/**
 * The view description model.
 */
export interface DescriptionContract {
    // control?: ComponentContract;
    
    /**
     * The preferred tag name.
     */
    tagName?: string;

    /**
     * The key.
     */
    key?: string;

    /**
     * The class name of style.
     */
    styleRefs?: string[];

    /**
     * Inline style.
     */
    style?: any;

    /**
     * Attributes (props).
     */
    attr?: {
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
        remove(key: string): boolean;
    };
  
    /**
     * Checks whether the element is still in the document.
     */
    alive(): boolean;
}

export interface BindAttrKeyInfoContract {
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
     * Sets an attribute (or a property).
     * @param context  The context.
     * @param key  The attribute (property) key.
     * @param value  The value to set.
     */
    setAttr(context: ViewGeneratingContextContract<T>, key: string, value: any): void;

    /**
     * Sets the styles.
     * @param context  The context.
     * @param style  The style.
     * @param styleRefs  The class name list of style.
     */
    setStyle(context: ViewGeneratingContextContract<T>, style: any, styleRefs: string[]): void;

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
    bindAttr?(context: ViewGeneratingContextContract<T>, keys: BindAttrKeyInfoContract): void;

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
    on(context: ViewGeneratingContextContract<T>, key: string, handler: (ev: any) => void): void;
}

export interface VisualControlContract {
    defaultTagName?: string;
    onInit(context: ViewGeneratingContextContract<any>): DescriptionContract;
    onLoad(): void;
}

export class VisualControl {
    private readonly _bag = {
        element: undefined as any,
        keyRefs: {} as any
    };
    constructor(element: any) {
        this._bag.element = element;
    }
    protected render(key: string, model: DescriptionContract) {
        let options: RenderingOptions = {
            keyRefs: this._bag.keyRefs
        };
        if (!key || key as any === true) {
            return render(this._bag.element, model, options);
        }

        let context = this.getChildContext(key);
        if (!context || typeof context.element !== "function") return undefined;
        let element = context.element();
        if (!element) return undefined;
        return render(element, model, options);
    }
    protected getChildContext(key: string): ViewGeneratingContextContract<any> | undefined {
        return key && typeof key === "string" ? this._bag.keyRefs[key] : undefined;
    }
    protected removeChildContext(key: string) {
        if (!key || typeof key !== "string")
        delete this._bag.keyRefs[key];
    }
    element() {
        return this._bag.element;
    }
}

let viewGen: ViewGeneratorContract<any>;
let htmlGen: HtmlGenerator;

// let components: ComponentContract[] = [];

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
    setAttr(context: ViewGeneratingContextContract<HTMLElement>, key: string, value: any) {
        context.element().setAttribute(key, value);
    }
    setStyle(context: ViewGeneratingContextContract<HTMLElement>, style: any, styleRefs: string[]) {
        let element = context.element();
        if (!element) return;
        Object.keys(style).forEach(key => {
            (element.style as any)[key] = style[key];
        });
        element.className = styleRefs.join(" ");
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
    bindAttr(context: ViewGeneratingContextContract<HTMLElement>, keys: BindAttrKeyInfoContract) {
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
        if (element.addEventListener) element.addEventListener(key, handler, false);
        else if ((element as any).attachEvent) (element as any).attachEvent("on" + key, handler);
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
    if (typeof h.on !== "function") h.on = (c, k, v) => {};
    if (typeof h.onInit !== "function") h.onInit = c => {};
    if (typeof h.setAttr !== "function") h.setAttr = (c, k, v) => {};
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

// export function regComponent(key: string, handler: ComponentContract) {
//     components.push(handler);
// }

function isObservable(value: any): boolean {
    if (!value) return false;
    return typeof value.subscribe === "function";
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

    if (!h) h = viewGenerator();
    if (!model || !h) return undefined;
    if (!options) {
        options = {};
    } else if (typeof options === "string") {
        if (options.toLowerCase() === "html") h = getHtmlGen() as any;
        options = {};
    }

    let appendMode = options.appendMode;
    let inheritRefs = options.keyRefs && typeof options.keyRefs === "object";
    let regKey = model.key;
    if (!regKey || typeof regKey !== "string") regKey = undefined;
    let bag = {
        element: appendMode ? undefined : target,
        info: {} as any,
        keyRefs: inheritRefs ? options.keyRefs : {}
    };
    let disposable = new DisposableArray();
    function assertElement() {
        let element = bag.element;
        if (!element) return false;
        if (h.alive(element)) return true;
        delete bag.element;
        bag.info = {};
        if (!inheritRefs) bag.keyRefs = {};
        else if (regKey) delete bag.keyRefs[regKey];
        h.unmount(element);
        disposable.dispose();
        return false;
    }

    let context: ViewGeneratingContextContract<T> = {
        element() {
            return bag.element;
        },
        model() {
            return model;
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
            return key && typeof key === "string" ? bag.keyRefs[key] : undefined;
        },
        alive() {
            return assertElement();
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
        return delete bag.keyRefs[key];
    };

    bag.element = h.initView(context, model.tagName);
    if (!bag.element) return undefined;

    let attr = model.attr || {};
    let attrB: string[] = [];
    if (model.attr && typeof model.attr === "object") {
        Object.keys(attr).forEach(key => {
            if (!key || typeof key !== "string") return;
            let v = attr[key];
            if (!v || typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol") {
                h.setAttr(context, key, v);
                return;
            }

            if (isObservable(v)) {
                attrB.push(key);
                let subscribe = (v as ObservableCompatibleContract).subscribe(nv => {
                    if (assertElement()) h.setAttr(context, key, nv);
                });
                context.pushDisposable(subscribe);
            }
        });
    }

    h.setStyle(context, model.style || {}, model.styleRefs || []);
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

    if (attrB.length > 0 && h.bindAttr) h.bindAttr(context, {
        keys() {
            return attrB;
        },
        length() {
            return attrB.length;
        },
        get(key) {
            return attr[key];
        },
        reg(key, then) {
            if (typeof then !== "function") return;
            then(value => {
                let obs = attr[key] as ObservableCompatibleContract;
                if (!isObservable(obs)) {
                    attr[key] = obs;
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
            return Object.keys(attr).indexOf(key) >= 0;
        },
        on(key, handler) {
            h.on(context, key, handler);
        }
    });

    if (appendMode) h.append(target, bag.element);
    h.onInit(context);
    if (typeof options.onInit === "function") options.onInit(context);
    if (typeof model.onInit === "function") model.onInit(context);

    if (model.children) {
        if (model.children instanceof Array) model.children.forEach(child => {
            if (!child) return;
            render<T>(undefined, child, {
                onInit: context2 => {
                    let element = context2.element();
                    if (!element) return;
                    h.append(bag.element, element);
                    if (child.key && typeof child.key === "string") bag.keyRefs[child.key] = context2;
                },
                keyRefs: bag.keyRefs
            });
        });
        else if (typeof model.children === "string") h.setTextValue(context, model.children);
    }

    if (typeof model.onLoad === "function") model.onLoad(context);
    if (typeof options.onLoad === "function") options.onLoad(context);
    return context.element();
}

}
