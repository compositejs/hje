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

/**
 * The view description model.
 */
export interface DescriptionContract {
    /**
     * The preferred tag name.
     */
    tagName?: string;

    /**
     * The key.
     */
    key?: string;

    /**
     * The control type to initialize.
     */
    control?: typeof BaseComponent;

    /**
     * The class name of style.
     */
    styleRefs?: string[] | string | {
        subscribe(h: any): any;
        [property: string]: any;
    };

    /**
     * Inline style.
     */
    style?: any;

    /**
     * Properties (attributes).
     */
    props?: {
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
    children?: DescriptionContract[] | string | number;

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
     * Gets the control created if has.
     */
    control(): BaseComponent | undefined;

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
        remove(key: string | string[]): void;
    };

    /**
     * Gets the model of a specific child by specific key.
     */
    childModel: {
        /**
         * Gets the model of a specific child by specific key.
         * @param key  The key of context cached; or the zero-based index of child.
         */
        (key: string | number): DescriptionContract | undefined;

        /**
         * Gets the prop of a specific child by specific key.
         * @param key  The key of context cached; or the zero-based index of child.
         * @param propKey  The additional property key.
         */
        prop(key: string | number, propKey?: string | undefined | null): any;

        /**
         * Gets the style of a specific child by specific key.
         * @param key  The key of context cached; or the zero-based index of child.
         */
        style(key: string | number): any;

        /**
         * Gets the class name of the style of a specific child by specific key.
         * @param key  The key of context cached; or the zero-based index of child.
         */
        styleRefs(key: string | number): string | string[] | {
            subscribe(h: any): any;
            [property: string]: any;
        } | undefined;

        /**
         * Gets the data of a specific child by specific key.
         * @param key  The key of context cached; or the zero-based index of child.
         */
        data(key: string | number): any;

        /**
         * Gets the children of a specific child by specific key.
         * @param key  The key of context cached; or the zero-based index of child.
         * @param index  The additional zero-base index, if gets the child of the children.
         */
        children(key: string | number): DescriptionContract[] | string | number | undefined;

        /**
         * Gets the children of a specific child by specific key.
         * @param key  The key of context cached; or the zero-based index of child.
         * @param index  The additional zero-base index, if gets the child of the children.
         */
        children(key: string | number, index: number): DescriptionContract | undefined;
    }
  
    /**
     * Checks whether the element is still in the document.
     */
    alive(): boolean;

    /**
     * Refreshes.
     */
    refresh(): void;
}

export interface BindPropKeyInfoContract {
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
     * Sets a property (or an attribute).
     * @param context  The context.
     * @param key  The property (attribute) key.
     * @param value  The value to set.
     */
    setProp(context: ViewGeneratingContextContract<T>, key: string, value: any): void;

    /**
     * Gets a property (or an attribute).
     * @param context  The context.
     * @param key  The property (attribute) key.
     * @param value  The value to set.
     */
    getProp(context: ViewGeneratingContextContract<T>, key: string): any;

    /**
     * Sets the styles.
     * @param context  The context.
     * @param style  The style.
     * @param styleRefs  The class name list of style.
     */
    setStyle(context: ViewGeneratingContextContract<T>, style: any, styleRefs: string[]): void;

    /**
     * Gets the style.
     * @param context  The context.
     */
    getStyle(context: ViewGeneratingContextContract<T>): {
        inline: any,
        refs: string[] | undefined
    }

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
    bindProp?(context: ViewGeneratingContextContract<T>, keys: BindPropKeyInfoContract): void;

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
    on(context: ViewGeneratingContextContract<T>, key: string, handler: (ev: any) => void): DisposableContract;
}

/**
 * THe model about the control is creating.
 */
export interface CreatingBagContract<T> {
    /**
     * The element.
     */
    element: T;

    /**
     * The key references.
     */
    keyRefs: any;

    /**
     * A value indicating whether inherit the key references from parent.
     */
    inheritRefs: boolean;

    /**
     * The description model.
     */
    model: DescriptionContract;

    /**
     * The additional information.
     */
    info: any;

    /**
     * The control created if has.
     */
    c: BaseComponent;

    /**
     * Disposes this instance.
     */
    dispose(): void;
}

/**
 * The options to initialize a component.
 */
export interface ComponentOptionsContract<T = any> {
    /**
     * The data bound in this component.
     */
    data?: T;

    /**
     * The description models of children.
     */
    children?: DescriptionContract[] | string | number,

    /**
     * Occurs to get the context of view.
     * @param context 
     */
    contextRef?(context: ViewGeneratingContextContract<any>): void;

    [property: string]: unknown;
}

}
