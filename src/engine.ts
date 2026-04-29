namespace Hje {

export interface IComponentRenderEngine<T = any> {
    alive(target: T): boolean;
    get(element: any): T | undefined;
    text(target: T, text: string): void;
    setChildren(parent: T, child: DescriptionContract[], old: BaseComponent[]): T[];
    append(parent: T, child: DescriptionContract[], old: BaseComponent[]): T[];
    insert(parent: T, index: number, child: DescriptionContract[], old: BaseComponent[]): T[];
    remove(parent: T, index: number, item: BaseComponent): boolean;
    move(parent: T, newIndex: number, oldIndex: number): void;
    props(target: T, set: Record<string, any>): void;
    style(target: T, changes: {
        oldStyle?: Record<string, any>;
        newStyle?: Record<string, any>;
        oldClassName?: string[];
        newClassName?: string[];
    }): void;
    on(target: T, event: string, handler: (ev: any) => void): void;
    off(target: T, event: string, handler: (ev: any) => void): void;
}

}