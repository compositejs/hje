# 组件

你可以继承 `BaseComponent` 基类来实现更高级封装的富交互组件。

以下是个示例，用于展示标题和列表。

```typescript
export interface ISampleComponentData {
    title?: string;
    list?: string[];
}

export class SampleComponent extends Hje.BaseComponent {
    constructor(args: any) {
        super(args);
        const { title, list } = super.data();
        if (title) this.currentModel.children.push({ key: "title", tagName: "h1", children: title });
        if (list instanceof Array && list.length > 0) {
            const list: Hje.DescriptionContract[] = [];
            this.currentModel.children.push({ tagName: "ul", children: list });
            for (let i = 0; i < list.length; i++) {
                list.push({ tagName: "li", children: list[i] });
            }
        }
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
    component: SampleComponent,
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
