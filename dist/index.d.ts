declare namespace Hje {
    type EventHandlerContract<T> = (ev: T) => void;
    type ChangeActionContract = "add" | "remove" | "update" | "delta" | "none" | "invalid" | "unknown";
    /**
     * Disposable instance.
     */
    interface DisposableContract {
        /**
         * Disposes the instance.
         */
        dispose(): void;
    }
    interface SubscriberCompatibleResultContract extends DisposableContract {
        (): void;
        unsubscribe(): void;
    }
    /**
     * The additional information which will pass to the event handler argument.
     */
    interface FireInfoContract {
        /**
         * An additional message.
         */
        message?: string;
        /**
         * Sender source string.
         */
        source?: string;
        /**
         * The additional data.
         */
        addition?: any;
    }
    /**
     * The changed information.
     */
    interface ChangedInfoContract<T> {
        /**
         * The property key; or null or undefined for the object itself.
         */
        key?: string;
        /**
         * The change state.
         */
        action: ChangeActionContract;
        /**
         * The current value changed.
         */
        value: T;
        /**
         * The old value before changing.
         */
        oldValue: T;
        /**
         * A value request to change. This value might be changed to set.
         */
        valueRequested: T;
        /**
         * true if change succeeded; or false if failed; or undefined if it is still pending to change.
         */
        success: boolean | undefined;
        /**
         * The error information.
         */
        error?: any;
    }
    /**
     * The observable for data value.
     */
    interface ObservableCompatibleContract<T = any> extends DisposableContract {
        /**
         * Gets the value.
         */
        get?(): T;
        /**
         * Registers an event listener on the value has been changed.
         * @param h  The handler or handlers of the event listener.
         * @param thisArg  this arg.
         * @param options  The event listener options.
         * @param disposableArray  An additional disposable array instance for push current event handler.
         */
        onChanged?(h: EventHandlerContract<ChangedInfoContract<T>>, thisArg?: any, options?: any): DisposableContract;
        /**
         * Subscribes for what the value has been changed.
         * @param h  The callback.
         * @param thisArg  this arg.
         */
        subscribe?(h: (newValue: T) => void, thisArg?: any): SubscriberCompatibleResultContract;
        /**
         * Sets value.
         * @param value  The value of the property to set.
         * @param message  A message for the setting event.
         */
        set?(value: T, message?: FireInfoContract | string): boolean;
        /**
         * Sets value.
         * @param value  The value of the property to set.
         * @param message  A message for the setting event.
         */
        next?(value: T): void;
    }
    /**
      * Gesture handlers options.
      */
    interface GestureActionOptionsContract {
        /**
          * The mininum horizontal value to active related gesture handlers.
          */
        minX?: number | ObservableCompatibleContract<number>;
        /**
          * The mininum vertical value to active related gesture handlers.
          */
        minY?: number | ObservableCompatibleContract<number>;
        /**
          * The handler rasied on turning up. The element and distance will be provided.
          */
        turnUp?: Action2<HTMLElement | Window | Document, number>;
        /**
          * The handler rasied on turning right. The element and distance will be provided.
          */
        turnRight?: Action2<HTMLElement | Window | Document, number>;
        /**
          * The handler rasied on turning down. The element and distance will be provided.
          */
        turnDown?: Action2<HTMLElement | Window | Document, number>;
        /**
          * The handler rasied on turning left. The element and distance will be provided.
          */
        turnLeft?: Action2<HTMLElement | Window | Document, number>;
        /**
          * The handler rasied before moving. The element will be provided.
          */
        moveStart?: Action1<HTMLElement | Window | Document>;
        /**
          * The handler rasied after moving. The element and distance will be provided.
          */
        moveEnd?: Action2<HTMLElement | Window | Document, PlaneCoordinate>;
        /**
          * The handler rasied on moving. The element and distance will be provided.
          */
        moving?: Action2<HTMLElement | Window | Document, PlaneCoordinate>;
    }
    /**
      * 2D coordinate.
      */
    interface PlaneCoordinate {
        /**
          * X for horizontal.
          */
        x: number;
        /**
          * Y for vertical.
          */
        y: number;
    }
    /**
      * 3D coordinate.
      */
    interface StereoscopicCoordinate extends PlaneCoordinate {
        /**
          * Z for height.
          */
        z: number;
    }
    /**
      * Action without parameter.
      */
    interface Action {
        (): void;
    }
    /**
      * Action with a parameter.
      */
    interface Action1<T> {
        (arg: T): void;
    }
    /**
      * Action with 2 parameters.
      */
    interface Action2<T1, T2> {
        (arg1: T1, arg2: T2): void;
    }
    /**
      * Action with 3 parameters.
      */
    interface Action3<T1, T2, T3> {
        (arg1: T1, arg2: T2, arg3: T3): void;
    }
    /**
      * Action with 4 parameters.
      */
    interface Action4<T1, T2, T3, T4> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4): void;
    }
    /**
      * Action with 5 parameters.
      */
    interface Action5<T1, T2, T3, T4, T5> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): void;
    }
    /**
      * Action with 6 parameters.
      */
    interface Action6<T1, T2, T3, T4, T5, T6> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): void;
    }
    /**
      * Action with 7 parameters.
      */
    interface Action7<T1, T2, T3, T4, T5, T6, T7> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): void;
    }
    /**
      * Action with 8 parameters.
      */
    interface Action8<T1, T2, T3, T4, T5, T6, T7, T8> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8): void;
    }
    /**
      * Function without parameter.
      */
    interface Func<T> {
        (): T;
    }
    /**
      * Function with a parameter.
      */
    interface Func1<T, TResult> {
        (arg: T): TResult;
    }
    /**
      * Function with 2 parameters.
      */
    interface Func2<T1, T2, TResult> {
        (arg1: T1, arg2: T2): TResult;
    }
    /**
      * Function with 3 parameters.
      */
    interface Func3<T1, T2, T3, TResult> {
        (arg1: T1, arg2: T2, arg3: T3): TResult;
    }
    /**
      * Function with 4 parameters.
      */
    interface Func4<T1, T2, T3, T4, TResult> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4): TResult;
    }
    /**
      * Function with 5 parameters.
      */
    interface Func5<T1, T2, T3, T4, T5, TResult> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): TResult;
    }
    /**
      * Function with 6 parameters.
      */
    interface Func6<T1, T2, T3, T4, T5, T6, TResult> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): TResult;
    }
    /**
      * Function with 7 parameters.
      */
    interface Func7<T1, T2, T3, T4, T5, T6, T7, TResult> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): TResult;
    }
    /**
      * Function with 8 parameters.
      */
    interface Func8<T1, T2, T3, T4, T5, T6, T7, T8, TResult> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8): TResult;
    }
}
declare namespace Hje {
    /**
     * Internal injection pool.
     */
    const InternalInjectionPool: {
        /**
         * Gets or sets the HitTask class from DataSense library.
         * @param value The HitTask class.
         */
        hittask(value?: any): any;
    };
    /**
     * A container for store and manage a number of disposable object.
     * @param items  The objects to add.
     */
    class DisposableArray {
        private _list;
        /**
         * Adds disposable objects so that they will be disposed when this instance is disposed.
         * @param items  The objects to add.
         */
        push(...items: DisposableContract[]): number;
        /**
         * Adds disposable objects so that they will be disposed when this instance is disposed.
         * @param items  The objects to add.
         */
        pushDisposable(...items: DisposableContract[]): number;
        /**
         * Removes the ones added here.
         * @param items  The objects to remove.
         */
        remove(...items: DisposableContract[]): number;
        /**
         * Removes the ones added here.
         * @param items  The objects to remove.
         */
        removeDisposable(...items: DisposableContract[]): number;
        /**
         * Gets the count.
         */
        count(): number;
        /**
         * Disposes the instance.
         */
        dispose(): void;
    }
}
declare namespace Hje {
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
     * View generator for HTML element.
     */
    export class HtmlGenerator implements ViewGeneratorContract<HTMLElement> {
        defaultTagName: string;
        initView(context: ViewGeneratingContextContract<HTMLElement>, tagName: string): HTMLElement;
        alive(element: HTMLElement): boolean;
        unmount(element: HTMLElement): void;
        append(parent: HTMLElement, child: HTMLElement): void;
        setProp(context: ViewGeneratingContextContract<HTMLElement>, key: string, value: any): void;
        getProp(context: ViewGeneratingContextContract<HTMLElement>, key: string): any;
        setStyle(context: ViewGeneratingContextContract<HTMLElement>, style: any, styleRefs: string[]): void;
        getStyle(context: ViewGeneratingContextContract<HTMLElement>): {
            inline: any;
            refs: string[];
            computed(pseudoElt?: string): any;
        };
        setTextValue(context: ViewGeneratingContextContract<HTMLElement>, value: string): void;
        bindProp(context: ViewGeneratingContextContract<HTMLElement>, keys: BindPropKeyInfoContract): void;
        onInit(context: ViewGeneratingContextContract<HTMLElement>): void;
        on(context: ViewGeneratingContextContract<HTMLElement>, key: string, handler: (ev: any) => void): {
            dispose(): void;
        };
    }
    interface MemoryJsonSourceContract {
        tagName: string;
        parent?: MemoryJsonSourceContract;
        props: any;
        handlers: any;
        style: any;
        styleRefs: string[];
        children: MemoryJsonSourceContract[];
    }
    export class MemoryJsonGenerator implements ViewGeneratorContract<MemoryJsonSourceContract> {
        defaultTagName: string;
        initView(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, tagName: string): MemoryJsonSourceContract;
        alive(element: MemoryJsonSourceContract): boolean;
        unmount(element: MemoryJsonSourceContract): void;
        append(parent: MemoryJsonSourceContract, child: MemoryJsonSourceContract): void;
        setProp(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, key: string, value: any): void;
        getProp(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, key: string): any;
        setStyle(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, style: any, styleRefs: string[]): void;
        getStyle(context: ViewGeneratingContextContract<MemoryJsonSourceContract>): {
            inline: any;
            refs: string[];
            computed(pseudoElt?: string): any;
        };
        setTextValue(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, value: string): void;
        bindProp(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, keys: BindPropKeyInfoContract): void;
        onInit(context: ViewGeneratingContextContract<MemoryJsonSourceContract>): void;
        on(context: ViewGeneratingContextContract<MemoryJsonSourceContract>, key: string, handler: (ev: any) => void): {
            dispose(): void;
        };
    }
    export function viewGenerator<T = any>(h?: ViewGeneratorContract<T>): ViewGeneratorContract<any>;
    /**
     * Gets the children by tag name.
     * @param model The model.
     * @param key The tag name.
     */
    export function getChildrenByTagName(model: DescriptionContract, ...key: string[]): any;
    /**
     * Gets the first child by tag name.
     * @param model The model.
     * @param key The tag name.
     */
    export function getChildByTagName(model: DescriptionContract, ...key: string[]): any;
    /**
     * Renders.
     * @param target  The target element to present the view.
     * @param model  The instance of view description.
     * @param options  Additional options.
     */
    export function render<T = any>(target: T, model: DescriptionContract, options?: RenderingOptions | "html"): (ViewGeneratingContextContract<T> | undefined);
    export {};
}
declare namespace Hje {
    /**
     * The view description model.
     */
    interface DescriptionContract {
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
    interface ViewGeneratingContextContract<T> {
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
            };
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
        };
        /**
         * Checks whether the element is still in the document.
         */
        alive(): boolean;
        /**
         * Refreshes.
         */
        refresh(): void;
    }
    interface BindPropKeyInfoContract {
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
    interface ViewGeneratorContract<T> {
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
            inline: any;
            refs: string[] | undefined;
        };
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
    interface CreatingBagContract<T> {
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
    interface ComponentOptionsContract<T = any> {
        /**
         * The data bound in this component.
         */
        data?: T;
        /**
         * The description models of children.
         */
        children?: DescriptionContract[] | string | number;
        /**
         * Occurs to get the context of view.
         * @param context
         */
        contextRef?(context: ViewGeneratingContextContract<any>): void;
        [property: string]: unknown;
    }
    /**
     * The base component that you can extend customized business logic
     * by a) updating constructor to set new model and refreshing;
     * b) adding methods to update specific child model and refreshing.
     */
    class BaseComponent<T = any> {
        private readonly _inner;
        private _context;
        /**
         * Initializes a new instance of the BaseComponent class.
         * @param element The element.
         * @param options The options.
         */
        constructor(element: any, options?: ComponentOptionsContract<T>);
        /**
         * Gets the generating context of the current instance.
         */
        protected get currentContext(): ViewGeneratingContextContract<any>;
        /**
         * Gets the view model of the current instance.
         */
        protected get currentModel(): DescriptionContract;
        /**
         * Sets the view model of the current instance.
         * @param value The view model.
         */
        protected set currentModel(value: DescriptionContract);
        /**
         * Gets the generating context of a specific child.
         * @param key The child key.
         */
        protected childContext(key: string): ViewGeneratingContextContract<any>;
        /**
         * Gets the control of a specific child.
         * @param key The child key.
         */
        protected childControl<T extends BaseComponent = BaseComponent>(key: string): T;
        /**
         * Gets or sets the view model of the current instance.
         * @param key The child key.
         * @param value The optional view model to override by setting its properties. The original reference will not replace but keep.
         * @param clearOriginal true if clear all properties of the original view model before set; otherwise, false.
         */
        protected childModel(key: string, value?: any, clearOriginal?: boolean): any;
        /**
         * Gets a disposable array attached in this component
         * which will dispose automatically when the component is disposed.
         */
        protected get disposableStore(): DisposableArray;
        /**
         * Gets the data bound in this component.
         */
        protected get data(): T;
        /**
         * Refreshes a specific child by key.
         * @param key The child key; or null for updating the current component.
         * @param handler An optional handler to process before refreshing.
         */
        protected refreshChild(key?: string, handler?: (context: ViewGeneratingContextContract<any>) => void): void;
        /**
         * Gets or sets the child property.
         * @param childKey The child key; or null for the current component.
         * @param propKey The property key.
         * @param v An opitonal value to set.
         */
        protected childProps(childKey: string, propKey: string | number | string[] | any, v?: any): any;
        /**
         * Gets or sets the style information of the specific child.
         * @param childKey The child key; or null for the current component.
         * @param style The inner style object.
         * @param styleRefs The style class reference name list.
         */
        protected childStyle(childKey: string, style?: any, styleRefs?: string[] | string | boolean | {
            subscribe(h: any): any;
            [property: string]: any;
        }): {
            inline: any;
            refs: string[] | undefined;
        };
        /**
         * Sets the style references of the specific child.
         * @param childKey The child key; or null for the current component.
         * @param value The style class reference name list.
         */
        protected childStyleRefs(childKey: string, value: string[]): {
            inline: any;
            refs: string[] | undefined;
        };
        /**
         * Gets a value indicating whether the component is disposed.
         */
        get isDisposed(): boolean;
        /**
         * Adds disposable objects so that they will be disposed when this instance is disposed.
         * @param items  The objects to add.
         */
        pushDisposable(...items: DisposableContract[]): number;
        /**
         * Removes the disposable objects added in this instance.
         * @param items  The objects to remove.
         */
        removeDisposable(...items: DisposableContract[]): number;
        /**
         * Gets or sets a property.
         * @param key The property key.
         * @param value The optional value of the property if need set.
         */
        prop<T = any>(key: string | any, value?: T | any): any;
        /**
         * Adds an event listener.
         * @param key The event key.
         * @param handler The handler of the event to add.
         */
        on(key: string, handler: any): DisposableContract;
        /**
         * Gets or sets the style information.
         * @param value The inner style object.
         * @param refs The style class reference name list.
         */
        style(value?: any, refs?: string[] | string | boolean | {
            subscribe(h: any): any;
            [property: string]: any;
        }): {
            inline: any;
            refs: string[] | undefined;
        };
        /**
         * Sets the style references.
         * @param value The style class reference name list.
         */
        styleRefs(value: string[]): {
            inline: any;
            refs: string[] | undefined;
        };
        /**
         * Gets the raw element.
         */
        element(): any;
        /**
         * Disposeses this instance and remove the element from the tree.
         */
        dispose(): void;
    }
}
declare namespace Hje {
    /**
     * The relative path info.
     */
    class RelativePathInfo {
        private _info;
        /**
         * Initializes a new instance of the RelativePathInfo class.
         * @param path The current path.
         */
        constructor(path: string);
        /**
         * Gets the current relative path.
         */
        get value(): string;
        get childPath(): string;
        get parentLevel(): number;
        get isAbsolute(): string | boolean;
        toPathArray(onlyChildPathName?: boolean): string[];
        relative(path: string | RelativePathInfo): RelativePathInfo;
        toString(): string;
        toJSON(): string;
    }
    function getCookie(key: string): string;
    function getQuery(): (string | {
        key: string;
        value: string;
    })[];
    function getValueFromKeyedArray(arr: (string | {
        key: string;
        value: string;
    })[], key: string): string;
}
