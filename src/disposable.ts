namespace Hje {

/**
 * Removes an item from given array.
 * @param {Array} originalList  The array to be merged.
 * @param {*} item  An item to remove.
 * @param {string | function} compare  The property key; or a function to compare.
 */
function removeFromList(list: any[], item: any, compare?: string | number | ((a: any, b: any) => boolean)) {
    if (!list) return 0;
    let removing: number[] = [];
    if (!compare) {
        list.forEach((ele, eleIndex) => {
            if (ele === item) removing.push(eleIndex);
        });
    } else if (typeof compare === "string" || typeof compare === "number") {
        list.forEach((ele, eleIndex) => {
            if (ele[compare] === item) removing.push(eleIndex);
        });
    } else if (typeof compare === "function") {
        list.forEach((ele, eleIndex) => {
            if (compare(ele, item)) removing.push(eleIndex);
        });
    }

    let count = removing.length;
    for (let i = count - 1; i--; i >= 0) {
        list.splice(removing[i], 1);
    }

    return count;
}

/**
 * Disposes disposable instances.
 */
function disposeDisposable(disposable: DisposableContract | DisposableContract[]) {
    if (!disposable) return;
    if (!(disposable instanceof Array)) disposable = [disposable];
    let listFailed: DisposableContract[] = [];
    disposable.forEach(item => {
        if (!item || typeof item.dispose !== "function") return;
        try {
            item.dispose();
        } catch (ex) {
            listFailed.push(item);
        }
    });
    listFailed.forEach(item => {
        if (!item || typeof item.dispose !== "function") return;
        item.dispose();
    });
}

const regs = {} as any;
function accessRegInstance<T = any>(key: string, value?: T, validation?: (v: T | undefined) => boolean) {
    if (!key) return undefined;
    let needSet = false;
    if (typeof validation === "function") {
        if (validation(value)) needSet = true;
    } else if (value !== undefined) {
        needSet = true;
    }

    if (needSet) regs[key] = value;
    return regs[key];
}

/**
 * Internal injection pool.
 */
export const InternalInjectionPool = {
    /**
     * Gets or sets the HitTask class from DataSense library.
     * @param value The HitTask class.
     */
    hittask(value?: any) {
        return accessRegInstance("hittask", value, v => {
            return typeof v === "function";
        });
    }
};

export function errorDisposable(message?: string) {
    return {
        error: true,
        message,
        dispose() {
        }
    };
}

/**
 * A container for store and manage a number of disposable object.
 * @param items  The objects to add.
 */
export class DisposableArray {
    private _list: DisposableContract[] = [];

    /**
     * Adds disposable objects so that they will be disposed when this instance is disposed.
     * @param items  The objects to add.
     */
    public push(...items: DisposableContract[]) {
        let count = 0;
        const self = this;
        items.forEach(item => {
            if (!item || self._list.indexOf(item) >= 0) return;
            if (!item.dispose) {
                if (typeof (item as any).unsubscribe === "function") item.dispose = (item as any).unsubscribe;
                // else if (typeof item === "function") item = { dispose: item };
            }

            self._list.push(item);
            if (typeof (item as DisposableArray).pushDisposable === "function") (item as DisposableArray).pushDisposable({
                dispose() {
                    removeFromList(self._list, item);
                }
            });
            count++;
        });
        return count;
    }

    /**
     * Adds disposable objects so that they will be disposed when this instance is disposed.
     * @param items  The objects to add.
     */
    public pushDisposable(...items: DisposableContract[]) {
        return this.push(...items);
    }

    /**
     * Removes the ones added here.
     * @param items  The objects to remove.
     */
    public remove(...items: DisposableContract[]) {
        let count = 0;
        items.forEach(item => {
            if (item && removeFromList(this._list, item) < 1) return;
            count++;
        });
        return count;
    }

    /**
     * Removes the ones added here.
     * @param items  The objects to remove.
     */
    public removeDisposable(...items: DisposableContract[]) {
        return this.remove(...items);
    }

    /**
     * Gets the count.
     */
    public count() {
        return this._list.length;
    }

    /**
     * Disposes the instance.
     */
    public dispose() {
        let list = this._list;
        this._list = [];
        disposeDisposable(list);
    }
}

}
    