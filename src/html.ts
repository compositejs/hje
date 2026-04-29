namespace Hje {

export class HtmlRenderEngine implements IComponentRenderEngine<Element> {
    defaultTagName = "div";

    get(element: any) {
        if (!element) return undefined;
        if (typeof element === "string") return document.getElementById(element);
        return element;
    }

    alive(target: HTMLElement) {
        if (!target || !target.parentElement) return false;
        try {
            if (!target.parentElement.parentElement && target != document.body) return false;
        }
        catch (ex) {}
        return true;
    }

    text(target: HTMLElement, text: string) {
        if (target.tagName?.toLowerCase() === "input") {
            (target as HTMLInputElement).value = text;
        } else {
            target.innerText = text;
        }
    }

    setChildren(parent: HTMLElement, child: DescriptionContract[], old: BaseComponent[]) {
        while (parent.childNodes.length > 0) {
            const item = parent.childNodes[0];
            if (item) parent.removeChild(item);
        }
        return this.append(parent, child, old);
    }

    append(parent: HTMLElement, child: DescriptionContract[], old: BaseComponent[]) {
        const arr: Element[] = [];
        for (const item of child) {
            if (!item) continue;
            const element = this.createEmptyElementFromDescription(item, parent);
            if (element) arr.push(element);
        }
        return arr;
    }

    insert(parent: HTMLElement, index: number, child: DescriptionContract[], old: BaseComponent[]) {
        const arr: Element[] = [];
        const rest = this.removeStart(parent, index);
        for (const item of child) {
            if (!item) continue;
            const element = this.createEmptyElementFromDescription(item, parent);
            if (element) arr.push(element);
        }
        for (const item of rest) {
            parent.appendChild(item);
        }
        return arr;
    }

    remove(parent: HTMLElement, index: number, item: BaseComponent) {
        let child = parent.childNodes[index];
        if (!child) return false;
        child = parent.removeChild(child);
        return !!child;
    }

    move(parent: HTMLElement, newIndex: number, oldIndex: number) {
        const child = parent.children[oldIndex];
        if (!child) return;
        parent.removeChild(child);
        const rest = this.removeStart(parent, newIndex);
        parent.appendChild(child);
        for (const item of rest) {
            parent.appendChild(item);
        }
    }

    props(target: Element, set: Record<string, any>) {
        const keys = Object.keys(set);
        for (const key of keys) {
            if (!key) continue;
            const v = set[key];
            let suc = false;
            if (key.indexOf("-") < 0) {
                if (target instanceof HTMLElement) {
                    if (v === undefined) delete (target as any)[key];
                    else (target as any)[key] = v;
                    suc = true;
                // } else if (target instanceof SVGElement && target[key as keyof SVGElement]?.baseVal) {
                //     if (v === undefined) delete target[key as keyof SVGElement].baseVal.value;
                //     else target[key as keyof SVGElement].baseVal.value = v;
                //     suc = true;
                }
            }

            if (!suc) {
                if (v === undefined || v === null) target.removeAttribute(key);
                else if (typeof v === "number") target.setAttribute(key, v.toString(10));
                else target.setAttribute(key, v.toString());
            }
        }
    }

    style(target: HTMLElement, changes: {
        oldStyle?: Record<string, any>;
        newStyle?: Record<string, any>;
        oldClassName?: string[];
        newClassName?: string[];
    }) {
        if (!changes) return;
        if (changes.newClassName !== undefined) target.className = changes.newClassName.join(" ");
        if (!changes.newStyle) return;
        const oldKeys = Object.keys(changes.oldStyle || {});
        const newKeys = Object.keys(changes.newStyle);
        for (const key of oldKeys) {
            if (key && newKeys.indexOf(key) < 0) target.style[key as any] = "";
        }
        for (const key of newKeys) {
            target.style[key as any] = changes.newStyle[key];
        }
    }

    on(target: HTMLElement, event: string, handler: (ev: any) => void) {
        target.addEventListener(event, handler);
    }

    off(target: HTMLElement, event: string, handler: (ev: any) => void) {
        target.removeEventListener(event, handler);
    }

    removeStart(parent: HTMLElement, index: number) {
        const arr = [];
        while (parent.childNodes.length > index) {
            let element = parent.childNodes[index];
            element = parent.removeChild(element);
            if (element) arr.push(element);
        }
        return arr;
    }

    createElement(tagName: string, tagNamespace?: string) {
        if (!tagNamespace && tagName && tagName.indexOf(":") >= 0) {
            if (tagName.startsWith("svg:")) {
                tagNamespace = "http://www.w3.org/2000/svg";
                tagName = tagName.substring(4);
                if (!tagName) tagName = "svg";
            } else if (tagName.startsWith("mathml:")) {
                tagNamespace = "http://www.w3.org/1998/Math/MathML";
                tagName = tagName.substring(7);
                if (!tagName) tagName = "math";
            } else if (tagName.startsWith("math:")) {
                tagNamespace = "http://www.w3.org/1998/Math/MathML";
                tagName = tagName.substring(5);
                if (!tagName) tagName = "math";
            } else if (tagName.startsWith("html:")) {
                tagNamespace = "http://www.w3.org/1999/xhtml";
                tagName = tagName.substring(5);
            } else if (tagName.startsWith("xbl:")) {
                tagNamespace = "http://www.mozilla.org/xbl";
                tagName = tagName.substring(4);
            } else if (tagName.startsWith("xul:")) {
                tagNamespace = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
                tagName = tagName.substring(4);
            } else if (tagName.startsWith(":")) {
                tagName = tagName.substring(1);
            }
        }

        return tagNamespace
            ? document.createElementNS(tagNamespace, tagName || this.defaultTagName || "div")
            : document.createElement(tagName || this.defaultTagName || "div");
    }

    createEmptyElementFromDescription(item: DescriptionContract, parent?: HTMLElement) {
        if (!item) return undefined;
        const element = this.createElement(item.tagName || this.defaultTagName || "div", (item as any).tagNamespace);
        if (!element) return undefined;
        if (parent) parent.appendChild(element);
        return element;
    }
}

/**
 * Converts an HTML element to a description model.
 * @param element The element to parse.
 * @returns The description model.
 */
export function from(element: Element | string) {
    if (typeof element === "string") element = document.getElementById(element) as HTMLElement;
    if (!element?.tagName) return undefined;
    const classNameStr = element.className;
    const classNames = classNameStr && typeof classNameStr === "string" ? classNameStr.split(" ").filter(v => !!v) : undefined;
    const obj: {
        tagName: Hje.DescriptionContract["tagName"];
        props: Record<string, any>;
        className: Hje.DescriptionContract["className"];
        data?: Hje.DescriptionContract["data"];
        children?: Hje.DescriptionContract["children"];
    } = {
        tagName: element.tagName.toLowerCase(),
        props: {},
        className: classNames
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
            const child = from(children[i]);
            if (child) obj.children.push(child);
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