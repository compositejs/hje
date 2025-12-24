namespace Hje {
    /**
     * Converts a text or string array into the description models.
     * @param line The text or each line.
     * @param arr true if always returns an array; otherwise, false.
     * @returns The description model item or array.
     */
    export function toSpan(line: string | number | boolean | Hje.DescriptionContract | (string | number | boolean | Hje.DescriptionContract)[], arr?: boolean) : (Hje.DescriptionContract | Hje.DescriptionContract[]) {
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
    export function inArray<T>(test: T, arr: T | T[] | {
        subscribe(h: any): any;
        [property: string]: any;
    }) {
        if (!arr || test == null) return false;
        if (arr === test) return true;
        if (Array.isArray(arr)) return arr.indexOf(test) >= 0;
        if (typeof (arr as any).get === "function") {
            const v2 = (arr as any).get();
            if (v2 === test) return true;
            if (Array.isArray(v2)) return v2.indexOf(test) >= 0;
        }

        return false;
    }
}
