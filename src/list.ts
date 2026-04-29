namespace Hje {

export interface IListComponentData<T = any> {
    source?: T[];
    item?(model: T): DescriptionContract | undefined;
}

/**
 * The list component.
 */
export class ListComponent<T = any> extends DataComponent<IListComponentData<T>> {
    /**
     * Initializes a new instance of the ListComponent class.
     * @param args The intialization arguments.
     */
    constructor(args: Object) {
        super(args);
    }

    onDataChange(info: ComponentDataUpdateInfo<IListComponentData<T>>) {
        super.onDataChange(info);
        let source = info.get("source");
        if (!(source instanceof Array)) source = [];
        let item = info.get("item");
        if (typeof item !== "function") {
            const containerTagName = this.originalTagName?.toLowerCase();
            const tagName = containerTagName === "ul" || containerTagName === "ol" ? "li" : undefined;
            item = m => {
                return {
                    tagName: tagName,
                    children: String(item),
                };
            };
        }
        this.childrenAccess.set(source.map(ele => {
            return ele ? item(ele) : undefined;
        }));
    }
}

}