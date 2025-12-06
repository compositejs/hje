namespace Hje {

/**
 * View generator for HTML element.
 */
export class HtmlGenerator implements ViewGeneratorContract<HTMLElement> {
    defaultTagName = "div";
    initView(context: ViewGeneratingContextContract<HTMLElement>, tagName: string) {
        let ele = context.element();
        const eleType = typeof ele;
        if (!ele || eleType === "symbol" || ele as any === true) {
            let tagNs = (context.model() as any || {} as any).tagNamespace;
            if (!tagNs && tagName && tagName.indexOf(":") >= 0) {
                if (tagName.startsWith("svg:")) {
                    tagNs = "http://www.w3.org/2000/svg";
                    tagName = tagName.substring(4);
                    if (!tagName) tagName = "svg";
                } else if (tagName.startsWith("mathml:")) {
                    tagNs = "http://www.w3.org/1998/Math/MathML";
                    tagName = tagName.substring(7);
                    if (!tagName) tagName = "math";
                } else if (tagName.startsWith("math:")) {
                    tagNs = "http://www.w3.org/1998/Math/MathML";
                    tagName = tagName.substring(5);
                    if (!tagName) tagName = "math";
                } else if (tagName.startsWith("html:")) {
                    tagNs = "http://www.w3.org/1999/xhtml";
                    tagName = tagName.substring(5);
                } else if (tagName.startsWith("xbl:")) {
                    tagNs = "http://www.mozilla.org/xbl";
                    tagName = tagName.substring(4);
                } else if (tagName.startsWith("xul:")) {
                    tagNs = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
                    tagName = tagName.substring(4);
                } else if (tagName.startsWith(":")) {
                    tagName = tagName.substring(1);
                }
            }

            return tagNs
                ? document.createElementNS(tagNs, tagName || this.defaultTagName || "div")
                : document.createElement(tagName || this.defaultTagName || "div");
        }

        if (eleType === "string") ele = document.getElementById(ele as any)!;
        else if (eleType === "number") ele = document.body.children[ele as any] as HTMLElement;
        if (ele) ele.innerHTML = "";
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
        element.innerHTML = "";
        element.remove();
    }
    append(parent: HTMLElement, child: HTMLElement) {
        if (!parent || !child) return;
        parent.appendChild(child);
    }
    setProp(context: ViewGeneratingContextContract<HTMLElement>, key: string, value: any) {
        const element = context.element();
        if (!element) return;
        if (!value || typeof value === "string") element.setAttribute(key, value);
        else (element as any)[key] = value;
    }
    getProp(context: ViewGeneratingContextContract<HTMLElement>, key: string) {
        const element = context.element();
        if (!element) return undefined;
        return (element as any)[key] || element.getAttribute(key);
    }
    setStyle(context: ViewGeneratingContextContract<HTMLElement>, style: any, styleRefs: string[]) {
        const element = context.element();
        if (!element) return;
        if (style) {
            const len = element.style.length;
            const old = [];
            for (let i = 0; i < len; i++) {
                const key = element.style.item(i);
                old.push(key);
            }
            for (let i = 0; i < old.length; i++) {
                const key = old[i];
                if (!style[key]) element.style.removeProperty(key);
            }
            Object.keys(style).forEach(key => {
                (element.style as any)[key] = style[key];
            });
        }
        if (!styleRefs) return;
        if (typeof styleRefs === "string") {
            element.className = styleRefs;
            return;
        }

        element.className = Array.prototype.join.call(styleRefs, " ");
    }
    getStyle(context: ViewGeneratingContextContract<HTMLElement>) {
        const element = context.element();
        const result = {
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
        const element = context.element();
        if (!element) return;
        if (element.tagName === "input") {
            (element as HTMLInputElement).value = value;
            return;
        }
        
        element.innerHTML = "";
        element.appendChild(new Text(value));
    }
    bindProp(context: ViewGeneratingContextContract<HTMLElement>, keys: BindPropKeyInfoContract) {
        keys.reg("value", setter => {
            const element = context.element() as HTMLInputElement;
            if (!element) return;
            keys.on("change", ev => {
                setter(element.value);
            });
        });
    }
    onInit(context: ViewGeneratingContextContract<HTMLElement>) {
    }
    on(context: ViewGeneratingContextContract<HTMLElement>, key: string, handler: (ev: any) => void) {
        const element = context.element();
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

/**
 * Converts an HTML element to a description model.
 * @param element The element to parse.
 * @returns The description model.
 */
export function from(element: Element | string) {
    if (typeof element === "string") element = document.getElementById(element);
    if (!element?.tagName) return undefined;
    const classNameStr = element.className;
    const classNames = classNameStr && typeof classNameStr === "string" ? classNameStr.split(" ").filter(v => !!v) : undefined;
    const obj: Hje.DescriptionContract = {
        tagName: element.tagName.toLowerCase(),
        props: {},
        styleRefs: classNames
    };
    readPropertyOfElement(obj.props, element, "hidden");
    readPropertyOfElement(obj.props, element, "value");
    readPropertyOfElement(obj.props, element, "type");
    readPropertyOfElement(obj.props, element, "href");
    readPropertyOfElement(obj.props, element, "title");
    readPropertyOfElement(obj.props, element, "target");
    readPropertyOfElement(obj.props, element, "alt");
    readPropertyOfElement(obj.props, element, "src");
    readPropertyOfElement(obj.props, element, "srcset");
    readPropertyOfElement(obj.props, element, "dir");
    readPropertyOfElement(obj.props, element, "accessKey");
    readPropertyOfElement(obj.props, element, "placeholder");
    readPropertyOfElement(obj.props, element, "inputMode");
    readPropertyOfElement(obj.props, element, "lang");
    const data = (element as HTMLElement).dataset;
    if (Object.keys(data).length > 0) obj.data = { ...data };
    const children = element.children;
    if (children && children.length > 0) {
        obj.children = [];
        for (let i = 0; i < children.length; i++) {
            obj.children.push(from(children[i]));
        }
    } else if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
        obj.children = element.childNodes[0].textContent;
    }
    return obj;
}

function readPropertyOfElement(props: Record<string, any>, element: Element, key: string) {
    const v = (element as any)[key];
    if (!v) return false;
    props[key] = v;
    return true;
}

}