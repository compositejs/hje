namespace Hje {

/**
 * The component for element.
 */
export class ElementComponent extends DataComponent<Record<string, any>> {
    /**
     * Initializes a new instance of the ElementComponent class.
     * @param args The intialization arguments.
     */
    constructor(args: Object) {
        super(args);
    }

    /**
     * Gets or sets the children to text content.
     * @param text Optional. The text content to set. Skip to get only.
     * @returns The new text content; or null, if its child is not a text node.
     */
    text(text?: string | number | null) {
        return arguments.length < 1 ? this.childrenAccess.text() : this.childrenAccess.text(text);
    }

    /**
     * Sets the child items.
     * @param models The models to set.
     * @returns The count of items added.
     */
    setChildren(models: DescriptionContract[] | null | string | number) {
        this.childrenAccess.set(models);
    }

    /**
     * Appends the child items.
     * @param models The models to append.
     * @returns The count of items added.
     */
    appendChild(...models: DescriptionContract[]) {
        return this.childrenAccess.append(...models);
    }
    /**
     * Inserts the child items at the specific position.
     * @param index The index to insert.
     * @param models The models to insert.
     * @returns The count of items inserted.
     */
    insertChild(index: number, ...models: DescriptionContract[]) {
        return this.childrenAccess.insert(index, ...models);
    }

    /**
     * Remove a specific child item.
     * @param key The index of child.
     * @returns true if the item has removed; otherwise, false. Not exists also returns false.
     */
    removeChild(key: number) {
        return this.childrenAccess.remove(key);
    }

    /**
     * Replaces an existed child item by given one.
     * @param index The index of child.
     * @param model The description model of new item.
     * @returns The component; or undefined, if the index is out of range.
     */
    replace(index: number, model: DescriptionContract) {
        return this.childrenAccess.replace(index, model);
    }

    /**
     * Clears all child items.
     */
    clearChildren() {
        this.childrenAccess.clear();
    }

    /**
     * Performs the specified action for each element in children.
     * @param callbackfn A function that accepts up to three arguments. forEach calls the callbackfn function one time for each component in the children.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    forEachChild(callbackfn: (value: BaseComponent, index: number, array: BaseComponent[]) => void, thisArg?: any) {
        this.childrenAccess.items().forEach(callbackfn, thisArg);
    }
}

}