namespace Hje {

/**
 * The action result with unsubscribe handler.
 */
interface UnsubscribeInstanceContract {
    unsubscribe(): void;
}

/**
 * Internal store.
 */
const internals = {
    nextWave: null as null | (() => void)[],
};

/**
 * Removes an item from an array.
 * @param list The array.
 * @param item The item to remove.
 * @returns The index of item in the array; or -1, if not exists.
 */
export function removeFromArray(list: any[], item: any) {
    if (!list) return -1;
    const i = list.indexOf(item);
    if (i < 0) return -1;
    list.splice(i, 1);
    const j = list.indexOf(item);
    if (j < 0) return i;
    list.splice(j, 1);
    return i;
}

/**
 * Schedules a handler to execute in the next wave of event loop.
 * @param handler The handler to process.
 */
export function nextWave(handler: () => void) {
    let h = internals.nextWave;
    if (!h) {
        h = [];
        internals.nextWave = h;
        setTimeout(() => {
            internals.nextWave = null;
            for (const item of h!) {
                item();
            }
        });
    }
    h.push(handler);
}

/**
 * Converts a text or string array into the description models.
 * @param line The text or each line.
 * @param arr true if always returns an array; otherwise, false.
 * @returns The description model item or array.
 */
export function toSpan(line: string | number | boolean | Hje.DescriptionContract | (string | number | boolean | Hje.DescriptionContract)[], arr?: boolean) : (Hje.DescriptionContract | Hje.DescriptionContract[] | undefined) {
    if (line === false || line == null) {
        return undefined;
    } else if (line === true) {
        const m = {
            tagName: "span",
        };
        return arr ? [m] : m;
    }

    if (typeof line === "number") line = line.toString(10);
    if (typeof line === "string") {
        const m = {
            tagName: "span",
            children: line
        };
        return arr ? [m] : m;
    }

    if (line instanceof Array) {
        const list: Hje.DescriptionContract[] = [];
        for (let i = 0; i < line.length; i++) {
            const item = line[i];
            const m = toSpan(item);
            if (m) list.push(m as DescriptionContract);
        }

        return arr ? list : {
            tagName: "span",
            children: list
        };
    }

    return arr ? [line] : line;
}

/**
 * Appends an element to a specific parent element.
 * @param parent The parent to append child.
 * @param tag The element tag.
 * @returns The element created to append.
 */
export function appendChild(parent: HTMLElement | null, tag?: string) {
    const ele = document.createElement(tag || "div");
    (parent || document.body).appendChild(ele);
    return ele;
}

/**
 * Tests if the specific value is in the array.
 * @param test The value to test.
 * @param arr The array.
 * @returns true if exists; otherwise, false.
 */
export function inArray<T>(test: T, arr: T | T[] | ObservableCompatibleContract<T>) {
    if (!arr || test == null) return false;
    if (arr === test) return true;
    if (Array.isArray(arr)) return arr.indexOf(test) >= 0;
    if (isObservable(arr) && typeof arr.get === "function") {
        const v2 = arr.get();
        if (v2 === test) return true;
        if (Array.isArray(v2)) return v2.indexOf(test) >= 0;
    }

    return false;
}

export function setClassName(oldClassName: string[], value?: IClassNameSetValue, callback?: (obs: ObservableCompatibleContract<string[] | string | null | undefined>) => void) {
    if (value === undefined || typeof value === "number") return oldClassName;
    if (!value) {
        return [] as string[];
    }

    if (typeof value === "string") {
        return oldClassName.length === 1 && oldClassName[0] === value ? oldClassName : (value ? [value] : []);
    }

    if (value instanceof Array) {
        return value.map(ele => {
            return ele && typeof ele === "string" ? ele : null;
        }).filter(ele => !!ele) as string[];
    }

    if (!(value as { disable?: boolean }).disable || typeof value === "boolean") return oldClassName;
    if (isObservable(value)) {
        const arr2 = typeof value.get === "function" ? stringArray(value.get()) : oldClassName;
        if (typeof callback === "function") callback(value);
        return arr2 || [];
    }

    const add = stringArray(value.add);
    if (!value.remove) {
        if (!add?.length) return oldClassName;
        return [ ...oldClassName, ...add ];
    }

    const remove = stringArray(value.remove as string[]);
    if (!remove?.length) return add || [];
    const arr: string[] = [];
    for (const item in oldClassName) {
        if (!item || remove.indexOf(item) >= 0) continue;
        arr.push(item);
    }

    if (add?.length) arr.push(...add);
    return arr;
}

export function stringArray(arr: string | number | (string | number)[] | null | undefined) {
    if (typeof arr === "number") return isNaN(arr) ? [] : [arr.toString(10)];
    if (!arr) return [];
    if (typeof arr === "string") return [arr];
    if (!(arr instanceof Array)) return undefined;
    return arr.map(ele => {
        if (typeof ele === "number") return isNaN(ele) ? null : ele.toString(10);
        if (!ele) return null;
        if (typeof ele !== "string") return null;
        return ele;
    }).filter(ele => !!ele) as string[];
}

export function observeIfIs<T = any>(value: T | ObservableCompatibleContract<T>, subscription: (newValue: T) => void, thisArg?: any) {
    if (!isObservable(value)) {
        subscription.call(thisArg, value);
        return undefined;
    }
    if (typeof value.get === "function") subscription.call(thisArg, value.get());
    return subscribeNewValue(value, subscription, thisArg);
}

export function mapObservable(obj: Record<string, any>, disposable: DisposableArray, subscribers: Record<string, SubscriberCompatibleResultContract>, callback: (key: string, newValue: any) => void, thisArg?: any) {
    const result: Record<string, any> = {};
    for (const key in obj) {
        if (!key) continue;
        const v = obj[key];
        let subscriber = subscribers[key];
        if (subscriber) {
            tryUnsubscribe(subscriber);
            disposable.remove(subscriber);
        }

        if (!v) {
            result[key] = v;
        } else if (isObservable(v)) {
            if (typeof v.get === "function") result[key] = v.get();
            subscriber = subscribeNewValue(v, nv => {
                callback.call(thisArg, key, nv);
            });
            subscribers[key] = subscriber;
            disposable.push(subscriber);
        } else if (v instanceof Promise) {
            v.then(r => {
                callback.call(thisArg, key, r);
            });
        } else if (typeof v.getProp === "function" && typeof v.onAnyPropChanged === "function") {
            subscriber = v.onAnyPropChanged((ev: {
                key: string;
                value: any;
                oldValue?: any;
                [property: string]: unknown;
            }) => {
                if (ev.key === key) callback.call(thisArg, key, ev.value);
            });
            subscribers[key] = subscriber;
            disposable.push(subscriber);
        } else {
            result[key] = v;
        }
    }

    return result;
}

function isObservable<T = any>(value: T | ObservableCompatibleContract<T> | any): value is ObservableCompatibleContract<T> {
    if (!value) return false;
    return typeof (value as ObservableCompatibleContract<T>).subscribe === "function";
}

export function subscribeNewValue<T>(obs: ObservableCompatibleContract<T>, callback: (nv: T) => void, thisArg?: any) {
    if (typeof obs.subscribe === "function") return obs.subscribe(callback, thisArg);
    if (typeof obs.onChanged === "function") return obs.onChanged(ev => {
        if (ev.success) callback.call(thisArg, ev.value);
    }) as SubscriberCompatibleResultContract;
    return {
        error: true,
        dispose() {},
    } as unknown as SubscriberCompatibleResultContract;
}

export function tryUnsubscribe(subscriber: SubscriberCompatibleResultContract | undefined) {
    if (!subscriber) return;
    try {
        if (typeof subscriber.dispose === "function")
            subscriber.dispose();
        else if (typeof (subscriber as unknown as UnsubscribeInstanceContract).unsubscribe === "function")
            (subscriber as unknown as UnsubscribeInstanceContract).unsubscribe();
    } catch {
    }
}

export function unwrapObservableProp(container: Record<string, any>, key: string, subKey?: string) {
    if (!key) {
        if (subKey) {
            key = subKey;
            subKey = undefined;
        } else {
            return undefined;
        }
    }

    const data = container[key];
    return unwrapObservableObject(data, subKey);
}

export function unwrapObservableObject(data: any, subKey?: string) {
    if (!data) return subKey ? undefined : data;
    if (typeof data.getProp === "function") {
        if (subKey) return data.getProp(subKey);
        if (typeof data.copyModel === "function") return data.copyModel();
        return data;
    }

    if (isObservable(data) && typeof data.get === "function") {
        const value = data.get();
        if (!value) return subKey ? undefined : value;
        return subKey ? value[subKey] : value;
    }

    return subKey ? data[subKey] : data;
}

/**
 * Generates info store.
 * @returns An instance of info store.
 */
export function genDataInfo() {
    const obj: Record<string, any> = {};
    return {
        get(key: string) {
            return key ? obj[key] : undefined;
        },
        set(key: string, value: any) {
            if (!key) return;
            if (value === undefined) delete obj[key];
            else obj[key] = value;
        },
        remove(key: string | string[]) {
            if (!key) return;
            if (!(key instanceof Array)) key = [key];
            for (const k of key) {
                if (k) delete obj[k];
            }
        },
        contain(key: string) {
            return key && Object.keys(obj).indexOf(key) >= 0;
        },
        keys() {
            return Object.keys(obj);
        },
    }
}

}
