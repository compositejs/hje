namespace Hje {

interface MemoryJsonSourceContract {
    tagName: string;
    parent?: MemoryJsonSourceContract;
    props: any;
    handlers: any;
    style: any;
    styleRefs: string[];
    children: MemoryJsonSourceContract[];
}

/**
 * View generator for mock in memory.
 */
export class MemoryJsonGenerator implements ViewGeneratorContract<MemoryJsonSourceContract> {
    defaultTagName = "default";
    initView(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, tagName: string) {
        const ele = context.element();
        const eleType = typeof ele;
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
        if (!ele.styleRefs) {
            const className = (ele as any).className;
            ele.styleRefs = className && className instanceof Array ? className : [];
        } else if (!(ele.styleRefs instanceof Array)) {
            ele.styleRefs = typeof ele.styleRefs === "string" ? [ele.styleRefs] : [];
        }

        if (!ele.children || !(ele.children instanceof Array)) ele.children = [];
        else while (ele.children.length) ele.children.pop();
        return ele;
    }
    alive(element: MemoryJsonSourceContract) {
        if (!element || !element.parent) return false;
        return true;
    }
    unmount(element: MemoryJsonSourceContract) {
        if (!element) return;
        if (element.parent) {
            const i = element.parent.children.indexOf(element);
            if (i >= 0) delete element.parent.children[i];
        }

        element.parent = undefined;
        element.children = [];
    }
    append(parent: MemoryJsonSourceContract, child: MemoryJsonSourceContract) {
        if (!parent || !child) return;
        if (child.parent) {
            const i = child.parent.children.indexOf(child);
            if (i >= 0) delete child.parent.children[i];
        }

        child.parent = parent;
        if (parent.children.indexOf(child) < 0) parent.children.push(child);
    }
    setProp(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, key: string, value: any) {
        const element = context.element();
        if (!element) return;
        element.props[key] = value;
    }
    getProp(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, key: string) {
        const element = context.element();
        if (!element) return undefined;
        return element.props[key];
    }
    setStyle(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, style: any, styleRefs: string[]) {
        const element = context.element();
        if (!element) return;
        if (style) element.style = style;
        if (!styleRefs) element.styleRefs = [];
        if (typeof styleRefs === "string") element.styleRefs = [styleRefs];
        else element.styleRefs = styleRefs;
    }
    getStyle(context: ViewGeneratingContextContract<MemoryJsonSourceContract>) {
        const element = context.element();
        const result = {
            inline: undefined as any,
            refs: [] as string[],
            computed(pseudoElt?: string): any {
                return element.style || {};
            }
        };
        if (!element) return result;
        result.inline = element.style || {};
        result.refs = element.styleRefs || (element as any).className || [];
        return result;
    }
    setTextValue(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, value: string) {
        const element = context.element();
        if (!element) return;
        const text: MemoryJsonSourceContract = {
            tagName: "text",
            parent: element,
            props: { value },
            handlers: {},
            style: {},
            styleRefs: [],
            children: []
        };
        element.children = [text];
    }
    bindProp(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, keys: BindPropKeyInfoContract) {
    }
    onInit(context: ViewGeneratingContextContract<MemoryJsonSourceContract>) {
    }
    on(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, key: string, handler: (ev: any) => void) {
        const element = context.element();
        if (!element) return;
        element.handlers[key] = handler;
        return {
            dispose() {
                delete element.handlers[key];
            }
        };
    }
}

}