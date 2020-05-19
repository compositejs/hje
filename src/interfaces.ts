namespace Hje {
    export type EventHandlerContract<T> = (ev: T) => void;
    export type ChangeActionContract = "add" | "remove" | "update" | "delta" | "none" | "invalid" | "unknown";
    
    /**
     * Disposable instance.
     */
    export interface DisposableContract {
        /**
         * Disposes the instance.
         */
        dispose(): void;
    }

    export interface SubscriberCompatibleResultContract extends DisposableContract {
        (): void;
        unsubscribe(): void;
    }

    /**
     * The additional information which will pass to the event handler argument.
     */
    export interface FireInfoContract {
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
    export interface ChangedInfoContract<T> {
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
    export interface ObservableCompatibleContract<T = any> extends DisposableContract {
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
     export interface GestureActionOptionsContract {

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
     export interface PlaneCoordinate {

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
    export interface StereoscopicCoordinate extends PlaneCoordinate {

        /**
          * Z for height.
          */
        z: number;
    }

    /**
      * Action without parameter.
      */
     export interface Action {
        (): void;
    }

    /**
      * Action with a parameter.
      */
    export interface Action1<T> {
        (arg: T): void;
    }

    /**
      * Action with 2 parameters.
      */
    export interface Action2<T1, T2> {
        (arg1: T1, arg2: T2): void;
    }

    /**
      * Action with 3 parameters.
      */
    export interface Action3<T1, T2, T3> {
        (arg1: T1, arg2: T2, arg3: T3): void;
    }

    /**
      * Action with 4 parameters.
      */
    export interface Action4<T1, T2, T3, T4> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4): void;
    }

    /**
      * Action with 5 parameters.
      */
    export interface Action5<T1, T2, T3, T4, T5> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): void;
    }

    /**
      * Action with 6 parameters.
      */
    export interface Action6<T1, T2, T3, T4, T5, T6> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): void;
    }

    /**
      * Action with 7 parameters.
      */
    export interface Action7<T1, T2, T3, T4, T5, T6, T7> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): void;
    }

    /**
      * Action with 8 parameters.
      */
    export interface Action8<T1, T2, T3, T4, T5, T6, T7, T8> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8): void;
    }

    /**
      * Function without parameter.
      */
    export interface Func<T> {
        (): T;
    }

    /**
      * Function with a parameter.
      */
    export interface Func1<T, TResult> {
        (arg: T): TResult;
    }

    /**
      * Function with 2 parameters.
      */
    export interface Func2<T1, T2, TResult> {
        (arg1: T1, arg2: T2): TResult;
    }

    /**
      * Function with 3 parameters.
      */
    export interface Func3<T1, T2, T3, TResult> {
        (arg1: T1, arg2: T2, arg3: T3): TResult;
    }

    /**
      * Function with 4 parameters.
      */
    export interface Func4<T1, T2, T3, T4, TResult> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4): TResult;
    }

    /**
      * Function with 5 parameters.
      */
    export interface Func5<T1, T2, T3, T4, T5, TResult> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): TResult;
    }

    /**
      * Function with 6 parameters.
      */
    export interface Func6<T1, T2, T3, T4, T5, T6, TResult> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): TResult;
    }

    /**
      * Function with 7 parameters.
      */
    export interface Func7<T1, T2, T3, T4, T5, T6, T7, TResult> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): TResult;
    }

    /**
      * Function with 8 parameters.
      */
    export interface Func8<T1, T2, T3, T4, T5, T6, T7, T8, TResult> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8): TResult;
    }
}