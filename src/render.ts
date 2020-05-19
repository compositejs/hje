/// <reference path="./disposable.ts" />

namespace Hje {

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

interface CreatingBagContract<T> {
    element: T
    keyRefs: any,
    model: DescriptionContract,
    info: any,
    c: BaseComponent,
    dispose(): void;
}

const inner = {
    contextHandlers: {
        alive() {
            return false;
        },
        refresh() {}
    }
};

function createContext<T = any>(
    element: T,
    model: any,
    assertElement: (bag: CreatingBagContract<T>, context: ViewGeneratingContextContract<T>) => boolean,
    refresh: (bag: CreatingBagContract<T>, context: ViewGeneratingContextContract<T>) => void) {
    let disposable = new DisposableArray();
    let handlers = {} as {
        alive(): boolean;
        refresh(): void;
    };
    let bag: CreatingBagContract<T> = {
        element,
        keyRefs: {},
        model,
        info: {},
        c: undefined,
        dispose() {
            handlers = inner.contextHandlers;
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
            return handlers.alive();
        },
        refresh() {
            handlers.refresh();
        }
    } as any;
    handlers.alive = () => {
        return assertElement(bag, context);
    };
    handlers.refresh = () => {
        refresh(bag, context);
    };
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

interface MemoryJsonSourceContract {
    tagName: string;
    parent?: MemoryJsonSourceContract;
    props: any;
    handlers: any;
    style: any;
    styleRefs: string[];
    children: MemoryJsonSourceContract[];
}

export class MemoryJsonGenerator implements ViewGeneratorContract<MemoryJsonSourceContract> {
    defaultTagName = "default";
    initView(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, tagName: string) {
        let ele = context.element();
        let eleType = typeof ele;
        if (!ele || eleType !== "object") return {
            tagName: tagName || "default",
            props: {},
            handlers: {},
            style: {},
            styleRefs: [],
            children: []
        };
        if (!ele.props) ele.props = {};
        if (!ele.handlers) ele.handlers = {};
        if (!ele.style) ele.style = {};
        if (!ele.styleRefs) ele.styleRefs = [];
        if (!ele.children) ele.children = [];
        return ele;
    }
    alive(element: MemoryJsonSourceContract) {
        if (!element || !element.parent) return false;
        return true;
    }
    unmount(element: MemoryJsonSourceContract) {
        if (!element) return;
        if (element.parent) {
            let i = element.parent.children.indexOf(element);
            if (i >= 0) delete element.parent.children[i];
        }

        element.parent = null;
        element.children = [];
    }
    append(parent: MemoryJsonSourceContract, child: MemoryJsonSourceContract) {
        if (!parent || !child) return;
        if (child.parent) {
            let i = child.parent.children.indexOf(child);
            if (i >= 0) delete child.parent.children[i];
        }

        child.parent = parent;
        if (parent.children.indexOf(child) < 0) parent.children.push(child);
    }
    setProp(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, key: string, value: any) {
        let element = context.element();
        if (!element) return;
        element.props[key] = value;
    }
    getProp(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, key: string) {
        let element = context.element();
        if (!element) return undefined;
        return element.props[key];
    }
    setStyle(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, style: any, styleRefs: string[]) {
        let element = context.element();
        if (!element) return;
        element.style = style;
        element.styleRefs = styleRefs;
    }
    getStyle(context: ViewGeneratingContextContract<MemoryJsonSourceContract>) {
        let element = context.element();
        let result = {
            inline: undefined as any,
            refs: [] as string[],
            computed(pseudoElt?: string): any {
                return element.style || {};
            }
        };
        if (!element) return result;
        result.inline = element.style || {};
        result.refs = element.styleRefs || [];
        return result;
    }
    setTextValue(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, value: string) {
        let element = context.element();
        if (!element) return;
        let text: MemoryJsonSourceContract = {
            tagName: "text",
            parent: element,
            props: {},
            handlers: {},
            style: {},
            styleRefs: [],
            children: []
        };
    }
    bindProp(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, keys: BindPropKeyInfoContract) {
    }
    onInit(context: ViewGeneratingContextContract<MemoryJsonSourceContract>) {
    }
    on(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, key: string, handler: (ev: any) => void) {
        let element = context.element();
        if (!element) return;
        element.handlers[key] = handler;
        return {
            dispose() {
                delete element.handlers[key];
            }
        };
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

function updateContext<T = any>(h: ViewGeneratorContract<T>, bag: CreatingBagContract<T>, context: ViewGeneratingContextContract<T>, options?: RenderingOptions, parent?: T) {
    let model = bag.model;
    let appendMode = options.appendMode;

    // Create or update the view.
    bag.element = h.initView(context, model.tagName);
    if (!bag.element) return undefined;

    // Control controlling logic.
    if (typeof model.control === "function") {
        if (appendMode) {
            if (options.parent) h.append(options.parent, bag.element);
            appendMode = false;
        }

        bag.c = new model.control(bag.element, {
            children: model.children
        });
        if (model.props && typeof model.props === "object") {
            bag.c.prop(model.props);
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
                if (typeof v.get === "function") h.setProp(context, key, v.get());
                let subscribe = (v as ObservableCompatibleContract).subscribe(nv => {
                    if (context.alive()) h.setProp(context, key, nv);
                });
                context.pushDisposable(subscribe);
                return;
            }

            if (typeof v.then === "function") {
                let noNeed = false;
                (v as Promise<any>).then(nv => {
                    if (!noNeed) h.setProp(context, key, nv);
                });
                context.pushDisposable({
                    dispose() {
                        noNeed = true;
                    }
                });
                return;
            }

            if (!v.source) {
                h.setProp(context, key, v);
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
    if (appendMode && options.parent) h.append(options.parent, bag.element);
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
        delete b.c;
        b.info = {};
        if (!inheritRefs) b.keyRefs = {};
        else if (regKey) delete b.keyRefs[regKey];
        h.unmount(element);
        b.dispose();
        return false;
    }, (b, c) => {
        updateContext(h, bag, c);
    });

    return updateContext(h, bag, context, options);
}

}
