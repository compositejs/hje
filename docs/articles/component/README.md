# Component

You can use extend the base class `BaseComponent` or `DataComponent` for rich UX component.

Following is a sample to render a title and a list.

```typescript
export interface ISampleComponentData {
    title?: string;
    list?: string[];
}

export class SampleComponent extends Hje.DataComponent<ISampleComponentData> {
    constructor(args: any) {
        super(args);
        this.childrenAccess.append({ key: "title", tagName: "h1" }, { key: "list", tagName: "ul" });
    }

    protected onDataChange(info: ComponentDataUpdateInfo<ISampleComponentData>) {
        this.onDataChange(info);

        if (info.typeOf("title") !== "undefined") {
            this.childrenAccess.update("title", {
                children: info.delta.title
            });
        }

        if (info.typeOf("list") !== "undefined") {
            const list: Hje.DescriptionContract[] = [];
            if (list instanceof Array && list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                    list.push({ tagName: "li", children: list[i] });
                }
            }

            this.childrenAccess.update("list", { children: list });
        }
    }

    get title() {
        return this.data("title");
    }

    set title(newValue: string) {
        return this.data("title", newValue);
    }

    get list() {
        return this.data("list");
    }
}
```

```html
<main id="main-container"></main>
```

```javascript
Hje.render("main-container", {
    control: SampleComponent,
    data: {
        title: "Test",
        list: [
            "first line",
            "second line"
        ]
    }
});
```

<!-- End -->
---

[Back](../../../)
