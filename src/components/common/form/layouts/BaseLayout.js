import BaseElement from "../BaseElement";

export default class BaseLayout extends BaseElement {

    constructor(editor) {
        super(editor)
        this.type = 'layout';
        this.children = {default: []}

    }

    getSnapshot() {
        return {
            ...super.getSnapshot(),
            children: this.children
        };
    }

    recoverSnapshoot(snapshoot) {
        super.recoverSnapshoot(snapshoot)
        this.children = snapshoot.children
    }
}