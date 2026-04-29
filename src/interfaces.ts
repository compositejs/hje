namespace Hje {
export type EventHandlerContract<T> = (ev: T) => void;
export type ChangeActionContract = "add" | "remove" | "update" | "delta" | "none" | "invalid" | "unknown";

export type IDeltaObject<T = Record<string, any>> = 
    | Partial<T>
    | {
        key: keyof T,
        value: any,
        skip?: boolean,
    }[]
    | ((old: T) => T | undefined);

export type IClassNameSetValue = string | string[] | null | {
    add?: string | string[] | null;
    remove?: string | string[] | boolean | null;
    disable?: boolean;
} | ObservableCompatibleContract<string[] | string | null | undefined>;

/**
 * The options on rendering.
 */
export interface IComponentRenderingOptions {
    /**
     * Occurs on initialization.
     * @param component  The component.
     */
    oninit?(component: BaseComponent): void;

    /**
     * Occurs on load completed.
     * @param context  The context.
     */
    onload?(component: BaseComponent): void;

    /**
     * Occurs on load completed.
     * @param context  The context.
     */
    onunload?(): void;

    /**
     * Gets or sets the property.
     */
    [property: string]: any;
}

export interface IComponentEventHandlerInstance {
    process(ev: any, options: {
        key: string;
        occur: Date;
        info: any;
        context: BaseComponent;
        off(): void;
    }): void;
    disable?: boolean;
    thisArg: any;
    delay?: boolean | number;
    info?: any;
    [property: string]: any;
};

export type IComponentEventHandler = ((ev: any) => void) | IComponentEventHandlerInstance | null;

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
     * The component type to initialize this instance.
     */
    component?: typeof BaseComponent;

    /**
     * The class name of style.
     */
    className?: string[] | string | ObservableCompatibleContract<string[] | string | null | undefined>;

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
        [property: string]: IComponentEventHandler;
    };

    /**
     * Child models.
     */
    children?: DescriptionContract[] | string | number | null;

    /**
     * Data bound.
     */
    data?: any;

    /**
     * The lifecycle of the component.
     */
    lifecycle?: {
        /**
         * Occurs on initialization.
         * @param context  The context.
         */
        init?(context: BaseComponent): void;

        /**
         * Occurs on load completed.
         * @param context  The context.
         */
        load?(context: BaseComponent): void;

        /**
         * Occurs on the element is removed.
         * @param context  The context.
         */
        unload?(): void;
    };
}

}