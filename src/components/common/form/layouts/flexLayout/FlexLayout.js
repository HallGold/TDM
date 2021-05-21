import BaseLayout from "../BaseLayout";
import './FlexLayout.less'


export default {

    meta: {
        name: 'flexlayout',
        type: 'layout',
        icon(h, dragstart, dragend) {
            return <div class="input iconfont icon-ai234">flex布局</div>

        },
        dragable(overEleType, overEleName) {
            if (overEleName == 'defaultlayout') {
                return false
            }
            if (overEleType == 'pageRoot' || overEleType == "layout") {
                return true
            }
            return false;
        },

        attrs() {
            return [
                {
                    key: 'direction',
                    keylabel: '布局方向',
                    deleteable: false,
                    keyreadonly: true,
                    valuetype: "select",
                    list: [
                        {code: 'row', text: '横向'},
                        {code: 'column', text: '纵向'}
                    ]
                },
                {
                    key: 'listType',
                    keylabel: '布局内容',
                    deleteable: false,
                    keyreadonly: true,
                    valuetype: "select",
                    list: [
                        {code: 'aside-main', text: 'aside-main'},
                        {code: 'main-aside', text: 'main-aside'},
                        {code: 'aside-main-aside', text: 'aside-main-aside'}
                    ]
                },
                {
                    key: 'aside1Size',
                    keylabel: 'aside1(px)',
                    deleteable: false,
                    keyreadonly: true,
                    valuetype: "number",
                    showable: attrs => attrs.listType == 'aside-main' || attrs.listType == 'aside-main-aside'
                },
                {
                    key: 'aside2Size',
                    keylabel: 'aside2(px)',
                    deleteable: false,
                    keyreadonly: true,
                    valuetype: "number",
                    showable: attrs => attrs.listType == 'main-aside' || attrs.listType == 'aside-main-aside'
                }
            ]
        }
    },
    clazz: class FlexLayout extends BaseLayout {
        constructor(editor) {
            super(editor);
            this.name = 'flexlayout';
            this.type = 'layout';
            this.attrs["direction"] = 'row';
            this.attrs["listType"] = 'aside-main';
            this.attrs["aside1Size"] = 232;
            this.attrs["aside2Size"] = 232;
            this.children.default = [null, null, null]
        }

        getSnapshot() {
            return {
                ...super.getSnapshot(),
            };
        }

        recoverSnapshoot(snapshoot) {
            super.recoverSnapshoot(snapshoot)
        }

        renderEdirtor(h) {
            return (<div class="flex-layout full-border1px"
                         style={`flex-direction:${this.attrs["direction"]};`}
                         tabIndex='1'
                         on-keyup={
                             evt => {
                                 this.onKeyUp(evt)
                             }}
                         on-click={
                             evt => {
                                 this.onClick(evt)
                             }
                         }>
                {
                    /**
                     * 渲染子元素、底部分割
                     */
                    (_ => {
                        return this.children.default.slice(0, 3).map((item, index) => {
                            if (index == 0 && (this.attrs["listType"] == 'aside-main' || this.attrs["listType"] == 'aside-main-aside')) {
                                return this.renderEditorAside1(h, item)
                            } else if (index == 2 && (this.attrs["listType"] == 'main-aside' || this.attrs["listType"] == 'aside-main-aside')) {
                                return this.renderEditorAside2(h, item)
                            } else if (index == 1) {
                                return this.renderEditorMain(h, item)
                            } else {
                                return '';
                            }
                        })

                    })()
                }
            </div>)
        }


        renderEditorAside1(h, item) {
            if (item) {
                return (<div class="aside"
                             style={`${this.attrs["direction"] == 'row' ? 'width' : 'height'}:${this.attrs["aside1Size"] > 110 ? this.attrs["aside1Size"] : 110}px;background:white;`}>
                    {this.getComponentById(item).renderEdirtor(h)}
                </div>)
            } else {
                return <div class="aside"
                            style={`${this.attrs["direction"] == 'row' ? 'width' : 'height'}:${this.attrs["aside1Size"] > 110 ? this.attrs["aside1Size"] : 110}px`}
                            on-drop={
                                evt => {
                                    this.onDrop(evt, 0)
                                }
                            }
                            on-dragover={
                                evt => {
                                    this.onDragOver(evt)
                                }
                            }>

                </div>
            }


        }

        renderEditorMain(h, item) {
            if (item) {
                return (<div class="main"
                             style={`margin:${this.attrs["direction"] == 'row' ? '0 10px ' : '10px 0'};background:white;`}>
                    <div class="ice-full-absolute">
                        {this.getComponentById(item).renderEdirtor(h)}
                    </div>
                </div>)

            } else {
                return <div class="main" style={`margin:${this.attrs["direction"] == 'row' ? '0 10px ' : '10px 0'};`}
                            on-drop={
                                evt => {
                                    this.onDrop(evt, 1)
                                }
                            }
                            on-dragover={
                                evt => {
                                    this.onDragOver(evt)
                                }
                            }>
                </div>
            }

        }

        renderEditorAside2(h, item) {

            if (item) {
                return <div class="aside"
                            style={`${this.attrs["direction"] == 'row' ? 'width' : 'height'}:${this.attrs["aside2Size"] > 110 ? this.attrs["aside2Size"] : 110}px;background:white;`}>
                    {this.getComponentById(item).renderEdirtor(h)}
                </div>
            } else {
                return <div class="aside"
                            style={`${this.attrs["direction"] == 'row' ? 'width' : 'height'}:${this.attrs["aside2Size"] > 110 ? this.attrs["aside2Size"] : 100}px`}
                            on-drop={
                                evt => {
                                    this.onDrop(evt, 2)
                                }
                            }
                            on-dragover={
                                evt => {
                                    this.onDragOver(evt)
                                }
                            }>
                </div>
            }


        }


        onDrop(evt, targetIndex) {
            super.onDrop(evt);
            this.children.default[targetIndex] = this.getEditorDragingComponent().id
            this.reRender();
        }

        render(h) {
            return (<div class="flex-layout render"
                         style={`flex-direction:${this.attrs["direction"]};`}>
                {
                    /**
                     * 渲染子元素、底部分割
                     */
                    (_ => {
                        return this.children.default.slice(0, 3).map((item, index) => {
                            if (index == 0 && (this.attrs["listType"] == 'aside-main' || this.attrs["listType"] == 'aside-main-aside')) {
                                return this.renderAside1(h, item)
                            } else if (index == 2 && (this.attrs["listType"] == 'main-aside' || this.attrs["listType"] == 'aside-main-aside')) {
                                return this.renderAside2(h, item)
                            } else if (index == 1) {
                                return this.renderMain(h, item)
                            } else {
                                return '';
                            }
                        })

                    })()
                }
            </div>)
        }

        renderAside1(h, item) {
            if (item) {
                return (<div class="aside"
                             style={`${this.attrs["direction"] == 'row' ? 'width' : 'height'}:${this.attrs["aside1Size"]}px`}>
                    {this.getComponentById(item).render(h)}
                </div>)
            } else {
                return <div class="aside"
                            style={`${this.attrs["direction"] == 'row' ? 'width' : 'height'}:${this.attrs["aside1Size"]}px`}>

                </div>
            }


        }

        renderMain(h, item) {
            if (item) {
                return (<div class="main">
                    <div class="ice-full-absolute">
                        {this.getComponentById(item).render(h)}
                    </div>
                </div>)

            } else {
                return <div class="main">
                </div>
            }

        }

        renderAside2(h, item) {

            if (item) {
                return <div class="aside"
                            style={`${this.attrs["direction"] == 'row' ? 'width' : 'height'}:${this.attrs["aside2Size"]}px`}>
                    {this.getComponentById(item).render(h)}
                </div>
            } else {
                return <div class="aside"
                            style={`${this.attrs["direction"] == 'row' ? 'width' : 'height'}:${this.attrs["aside2Size"]}px`}>
                </div>
            }


        }


        removeChild(childid) {
            const childIndex = this.children.default.findIndex(item => childid == item)
            if (childIndex != -1) {
                this.children.default[childIndex] = null
            }
        }

        getChildrenIds() {
            return [...this.children.default];
        }

    }
}