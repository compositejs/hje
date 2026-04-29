namespace Hje {

const internals = {
    factory: {} as Record<string, typeof BaseComponent>,
    engine: undefined as IComponentRenderEngine | undefined,
    html: undefined as HtmlRenderEngine | undefined,
};

export function regComponent(key: string, type: typeof BaseComponent | undefined | null) {
    if (type) internals.factory[key] = type;
    else delete internals.factory[key];
}

export function getComponentType(model: DescriptionContract): typeof BaseComponent {
    if (!model.component) return ElementComponent;
    if (typeof model.component === "function") return model.component;
    if (typeof model.component === "string") {
        const h = internals.factory[model.component];
        if (h) return h;
    }
    return ElementComponent;
}

export function defaultRenderEngine() {
    if (internals.engine) return internals.engine;
    if (!internals.html) internals.html = new HtmlRenderEngine();
    return internals.html;
}

export function setDefaultRenderEngine(value: IComponentRenderEngine) {
    internals.engine = value;
}

}