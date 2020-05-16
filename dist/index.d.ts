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
         * Disposes the instance.
         */
        dispose(): void;
    }
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
         * The class name of style.
         */
        styleRefs?: string[];
        /**
         * Inline style.
         */
        style?: any;
        /**
         * Attributes (props).
         */
        attr?: {
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
        children?: DescriptionContract[] | string;
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
     * The options on rendering.
     */
    interface RenderingOptions {
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
         * @param key  The key of context cached.
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
            remove(key: string): boolean;
        };
        /**
         * Checks whether the element is still in the document.
         */
        alive(): boolean;
    }
    interface BindAttrKeyInfoContract {
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
         * Sets an attribute (or a property).
         * @param context  The context.
         * @param key  The attribute (property) key.
         * @param value  The value to set.
         */
        setAttr(context: ViewGeneratingContextContract<T>, key: string, value: any): void;
        /**
         * Sets the styles.
         * @param context  The context.
         * @param style  The style.
         * @param styleRefs  The class name list of style.
         */
        setStyle(context: ViewGeneratingContextContract<T>, style: any, styleRefs: string[]): void;
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
        bindAttr?(context: ViewGeneratingContextContract<T>, keys: BindAttrKeyInfoContract): void;
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
        on(context: ViewGeneratingContextContract<T>, key: string, handler: (ev: any) => void): void;
    }
    interface VisualControlContract {
        defaultTagName?: string;
        onInit(context: ViewGeneratingContextContract<any>): DescriptionContract;
        onLoad(): void;
    }
    class HtmlGenerator implements ViewGeneratorContract<HTMLElement> {
        defaultTagName: string;
        initView(context: ViewGeneratingContextContract<HTMLElement>, tagName: string): HTMLElement;
        alive(element: HTMLElement): boolean;
        unmount(element: HTMLElement): void;
        append(parent: HTMLElement, child: HTMLElement): void;
        setAttr(context: ViewGeneratingContextContract<HTMLElement>, key: string, value: any): void;
        setStyle(context: ViewGeneratingContextContract<HTMLElement>, style: any, styleRefs: string[]): void;
        setTextValue(context: ViewGeneratingContextContract<HTMLElement>, value: string): void;
        bindAttr(context: ViewGeneratingContextContract<HTMLElement>, keys: BindAttrKeyInfoContract): void;
        onInit(context: ViewGeneratingContextContract<HTMLElement>): void;
        on(context: ViewGeneratingContextContract<HTMLElement>, key: string, handler: (ev: any) => void): void;
    }
    function viewGenerator<T = any>(h?: ViewGeneratorContract<T>): ViewGeneratorContract<any>;
    /**
     * Renders.
     * @param target  The target element to present the view.
     * @param model  The instance of view description.
     * @param options  Additional options.
     */
    function render<T = any>(target: T, model: DescriptionContract, options?: RenderingOptions | "html"): (T | undefined);
}
