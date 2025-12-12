# 组件

你可以继承 `BaseComponent` 基类来实现更高级封装的富交互组件。

以下是个示例，用于展示标题和列表。

```typescript
export interface ISampleComponentData {
    title?: string;
    list?: string[];
}

export class SampleComponent extends Hje.BaseComponent {
    constructor(element: any, options?: Hje.ComponentOptionsContract<ISampleComponentData>) {
        super(element, options);
        const data = options?.data || {};
        if (data.title) this.currentModel.children.push({ key: "title", tagName: "h1", children: data.title });
        if (data.list instanceof Array && data.list.length > 0) {
            const list: Hje.DescriptionContract[] = [];
            this.currentModel.children.push({ tagName: "ul", children: list });
            for (let i = 0; i < data.list.length; i++) {
                list.push({ tagName: "li", children: data.list[i] });
            }
        }
        this.refreshChild();
    }

    get title() {
        return super.childModel("title").children;
    }

    set title(newValue?: string) {
        super.refreshChild("title", context => {
            context.model().children = newValue;
        });
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

[Back](../shuoming/)
