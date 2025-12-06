/// <reference path="./disposable.ts" />

namespace Hje {

const inner = {
    contextHandlers: {
        alive() {
            return false;
        },
        refresh() {}
    },
    controls: {} as Record<string, typeof BaseComponent>
};

function createContext<T = any>(
    element: T,
    model: DescriptionContract,
    assertElement: (bag: CreatingBagContract<T>, context: ViewGeneratingContextContract<T>) => boolean,
    refresh: (bag: CreatingBagContract<T>, context: ViewGeneratingContextContract<T>) => void) {
    const disposable = new DisposableArray();
    let handlers = {} as {
        alive(): boolean;
        refresh(): void;
    };
    const bag: CreatingBagContract<T> = {
        element,
        keyRefs: {},
        inheritRefs: false,
        model,
        info: {},
        c: undefined,
        dispose() {
            handlers = inner.contextHandlers;
            disposable.dispose();
        }
    };
    const context: ViewGeneratingContextContract<T> = {
        element() {
            return bag.element;
        },
        model() {
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
        childModel(key: string | number) {
            if (typeof key === "number") {
                const children = bag.model.children;
                if (!children || typeof children === "string" || typeof children === "number") return key === 0 ? children : undefined;
                const model = children[key];
                return model;
            }

            if (!key) return bag.model;
            if (typeof key !== "string") return undefined;
            const context = bag.keyRefs[key];
            if (!context) return undefined;
            return context.model();
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

        if (key instanceof Array) for (const i in key) {
            const s = key[i];
            if (!s) continue;
            if (typeof s === "string" || typeof s === "symbol")
                delete bag.keyRefs[s];
        }
    };
    context.childModel.prop = (key, propKey?) => {
        const m = context.childModel(key);
        if (!m) return undefined;
        if (!propKey) return m.props;
        return m.props ? m.props[propKey] : undefined;
    };
    context.childModel.style = key => {
        const m = context.childModel(key);
        return m ? m.style : undefined;
    };
    context.childModel.styleRefs = key => {
        const m = context.childModel(key);
        return m ? m.styleRefs : undefined;
    };
    context.childModel.data = key => {
        const m = context.childModel(key);
        return m ? m.data : undefined;
    };
    (context.childModel.children as any) = (key: string | number, index?: number | undefined | null) => {
        const m = context.childModel(key);
        if (!m) return;
        if (typeof index !== "number") return m.children;
        if (!m.children || !(m.children instanceof Array)) return undefined;
        return m.children[index];
    };
    return {
        context,
        bag
    };
}

let viewGen: ViewGeneratorContract<any>;
let htmlGen: HtmlGenerator;

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
    const model = bag.model;
    if (!options) options = {};
    let appendMode = options.appendMode;

    // Create or update the view.
    bag.element = h.initView(context, model.tagName);
    if (!bag.element) return undefined;

    // Control controlling logic.
    let componentType = model.control;
    if (typeof componentType === "string") componentType = inner.controls[componentType];
    if (typeof componentType === "function") {
        if (appendMode) {
            if (options.parent) h.append(options.parent, bag.element);
            appendMode = false;
        }

        let cc: any = bag.c = new componentType(bag.element, {
            data: model.data,
            children: model.children,
            disposeFlagHandler(h: Function) {
                if (typeof h !== "function") return;
                context.pushDisposable({
                    dispose() {
                        h();
                    }
                })
            }
        });
        if (model.props && typeof model.props === "object") {
            bag.c.prop(model.props);
        }

        bag.c.style(model.style, model.styleRefs || (model as any).className);
        if (model.on && typeof model.on === "object") {
            Object.keys(model.on).forEach(key => {
                if (!key || typeof key !== "string") return;
                const h = model.on[key];
                bag.c.on(key, h);
            });
        }

        if (typeof cc.onInit === "function") cc.onInit();
        h.onInit(context);
        if (typeof options.onInit === "function") options.onInit(context);
        if (typeof model.onInit === "function") model.onInit(context);
        if (typeof options.onLoad === "function") options.onLoad(context);
        if (typeof model.onLoad === "function") model.onLoad(context);
        return bag.element;
    }

    // Set properties.
    const props = model.props || (model as any).attr || {};
    const propsB: string[] = [];
    if (typeof props === "object") {
        Object.keys(props).forEach(key => {
            if (!key || typeof key !== "string") return;
            const v = props[key];
            if (!v || typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol") {
                h.setProp(context, key, v);
                return;
            }

            if (isObservable(v)) {
                propsB.push(key);
                if (typeof v.get === "function") h.setProp(context, key, v.get());
                const subscribe = (v as ObservableCompatibleContract).subscribe(nv => {
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

    // Set style.
    let styleRefs = model.styleRefs as string[] || (model as any).className;
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

    if (model.style || styleRefs) h.setStyle(context, model.style, styleRefs);

    // Add event listeners.
    if (model.on && typeof model.on === "object") {
        Object.keys(model.on).forEach(key => {
            const handler = model.on[key] as any;
            if (!handler) return;
            if (typeof handler.process === "function") {
                let proc = handler.process as Function;
                if (handler.options) {
                    try {
                        const HitTask = InternalInjectionPool.hittask();
                        if (HitTask) {
                            const task = new HitTask();
                            task.setOptions(handler.options);
                            const proc2 = proc;
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
                const obs = props[key] as ObservableCompatibleContract;
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
            render(bag.element, child, {
                onInit: context2 => {
                    const element = context2.element();
                    if (!element) return;
                    h.append(bag.element, element);
                    if (child.key && typeof child.key === "string") bag.keyRefs[child.key] = context2;
                },
                keyRefs: bag.keyRefs,
                appendMode: true
            });
        });
        else if (typeof model.children === "string") h.setTextValue(context, model.children);
        else if (typeof model.children === "number") h.setTextValue(context, model.children.toString(10));
    }

    // Finish.
    if (typeof model.onLoad === "function") model.onLoad(context);
    if (typeof options.onLoad === "function") options.onLoad(context);
    return context.element();
}

/**
 * Gets the children by tag name.
 * @param model The model.
 * @param key The tag name.
 */
export function getChildrenByTagName(model: DescriptionContract, ...key: string[]) {
    if (!model || !model.children) return undefined;
    if (!key || !key.length) return model.children;
    if (typeof model.children === "string" || typeof model.children === "number") {
        return undefined;
    }

    return Array.prototype.some.call(model.children, (ele: DescriptionContract) => {
        return key.indexOf(ele.tagName) >= 0;
    });
}

/**
 * Gets the first child by tag name.
 * @param model The model.
 * @param key The tag name.
 */
export function getChildByTagName(model: DescriptionContract, ...key: string[]) {
    const c = getChildrenByTagName(model, ...key);
    return c && c.length ? c[0] : undefined;
}

/**
 * Registers the component type with a specific key.
 * @param name The key to reference in factory to the component type. It should be unique.
 * @param component The component type.
 */
export function registerComponentType(name: string, component: typeof BaseComponent) {
    if (!name) return;
    if (component === undefined) delete inner.controls[name];
    else inner.controls[name] = component;
}

/**
 * Renders.
 * @param target  The target element to present the view.
 * @param model  The instance of view description.
 * @param options  Additional options.
 */
export function render<T = any>(target: T, model: DescriptionContract, options?: RenderingOptions | "html"): (ViewGeneratingContextContract<T> | undefined) {
    let h: ViewGeneratorContract<T>;
    if (arguments.length > 3 && arguments[3]) {
        const h2 = arguments[3] as ViewGeneratorContract<any>;
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

    // Get the options information and create an empty internal data store.
    const appendMode = options.appendMode;
    const inheritRefs = options.keyRefs && typeof options.keyRefs === "object";
    let regKey = model.key;
    if (!regKey || typeof regKey !== "string") regKey = undefined;

    // Create the generating context.
    const { context, bag } = createContext(appendMode ? undefined : target, model, b => {
        const element = b.element;
        if (!element) return false;
        if (h.alive(element)) return true;
        delete b.element;
        if (b.c) {
            if (typeof (b.c as any).onUnmount === "function") (b.c as any).onUnmount();
            delete b.c;
        }

        b.info = {};
        if (!inheritRefs) b.keyRefs = {};
        else if (regKey) delete b.keyRefs[regKey];
        h.unmount(element);
        b.dispose();
        return false;
    }, (b, c) => {
        updateContext(h, bag, c);
    });

    if (inheritRefs) {
        bag.keyRefs = options.keyRefs;
        bag.inheritRefs = true;
    }

    if (regKey) bag.keyRefs[regKey] = context;
    updateContext(h, bag, context, options);
    return context;
}

}
