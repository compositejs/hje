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
}