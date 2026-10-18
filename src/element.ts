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
     * @param models The models or text to set.
     * @returns The count of items added.
     */
    setChildren(models: DescriptionContract[] | null | string | number) {
        this.childrenAccess.set(models);
    }

    /**
     * Sets the child items.
     * @param model The model to set.
     * @returns The count of items added.
     */
    setChildItems(...model: DescriptionContract[]) {
        this.childrenAccess.set(model);
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
    replaceChild(index: number, model: DescriptionContract) {
        return this.childrenAccess.replace(index, model);
    }

    /**
     * Updates a specific child item by given patch.
     * @param index The index or key of child.
     * @param patch The patch data.
     * @returns true if update successfully; otherwise, false. Not exists also returns false.
     */
    updateChild(index: number | string, patch: {
        props?: IDeltaObject;
        children?: DescriptionContract["children"];
        style?: DescriptionContract["style"];
        className?: IClassNameSetValue;
        data?: IDeltaObject;
        appendChildren?: boolean | number;
        overrideStyle?: boolean;
    }) {
        return this.childrenAccess.update(index, patch);
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

    /**
     * Filters the child items based on the specified predicate function.
     * @param predicate A function that accepts up to three arguments. filter calls the predicate function one time for each component in the children.
     * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
     * @returns An array containing all child items that pass the test implemented by the predicate function.
     */
    filterChild(predicate: (value: BaseComponent, index: number, array: BaseComponent[]) => boolean, thisArg?: any) {
        return this.childrenAccess.items().filter(predicate, thisArg);
    }

    /**
     * Maps the child items based on the specified callback function.
     * @typeParam T The type of the value returned by the callback function.
     * @param callbackfn A function that accepts up to three arguments. map calls the callbackfn function one time for each component in the children.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     * @returns An array containing the results of calling the callback function on each child item.
     */
    mapChild<T>(callbackfn: (value: BaseComponent, index: number, array: BaseComponent[]) => T, thisArg?: any) {
        return this.childrenAccess.items().map(callbackfn, thisArg);
    }
}

}