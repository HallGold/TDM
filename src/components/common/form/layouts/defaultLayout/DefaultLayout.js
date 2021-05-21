import BaseLayout from "../BaseLayout";
import './DefaultLayout.css'

export default {

    meta: {
        name: 'defaultlayout',
        type: 'layout',
        icon(h, dragstart, dragend) {
            return <div class="input iconfont icon-houtai-changfangxing">默认布局</div>

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
                    key: 'fixedHeight',
                    keylabel: '是否固定高度',
                    deleteable: false,
                    keyreadonly: true,
                    valuetype: "checkbox",
                },
                {
                    key: 'height',
                    keylabel: '高度',
                    deleteable: false,
                    keyreadonly: true,
                    showable: attrs => attrs['fixedHeight']
                },
                {
                    key: 'showScroll',
                    keylabel: '显示滚动条',
                    deleteable: false,
                    keyreadonly: true,
                    valuetype: "checkbox",
                    showable: attrs => attrs['fixedHeight']
                }
            ]
        }
    },

    clazz: class DefaultLayout extends BaseLayout {

        constructor(editor) {
            super(editor);
            this.name = 'defaultlayout';
            this.type = 'layout';
            this.attrs['fixedHeight'] = false;
            this.attrs['height'] = '100%';
            this.attrs['showScroll'] = true;
            this.style = {'min-height': '100%', 'width': '100%', 'background': '#fff'}
            this.direction = true;
            this.splitActive = -1;
        }

        getSnapshot() {
            return {
                ...super.getSnapshot(),
                direction: this.direction,
            };
        }

        recoverSnapshoot(snapshoot) {
            super.recoverSnapshoot(snapshoot)
            this.direction = snapshoot.direction
        }

        renderEdirtor(h) {
            return (<div class="full-border1px"
                         style={this.getEditorStyleString()}
                         tabIndex='1'
                         on-keyup={
                             evt => {
                                 this.onKeyUp(evt)
                             }}
                         on-click={
                             evt => {
                                 this.onClick(evt)
                             }
                         }
                         on-drop={
                             evt => {
                                 this.onDrop(evt)
                                 this.splitActive = -1
                             }
                         }
                         on-dragover={
                             evt => {
                                 this.onDragOver(evt)
                             }
                         }>
                {
                    /**
                     * 渲染子元素、底部分割
                     */
                    this.children.default.map(id => this.getComponentById(id)).map((item, index) => {
                        const flagIndex = index;
                        return <div>
                            {item.renderEdirtor(h)}
                            <div class={`form-split ${this.splitActive == flagIndex ? 'active' : ''}`}
                                 style={`height:${this.direction ? '20px' : '100%'};width:${this.direction ? '100%' : '20px'}`}
                                 on-dragover={
                                     evt => {
                                         this.onDragOver(evt, false)
                                         this.splitActive = flagIndex
                                     }
                                 }
                                 on-dragleave={
                                     evt => {
                                         this.onDragOver(evt, false)
                                         this.splitActive = -1
                                     }
                                 }>

                            </div>
                        </div>;
                    })
                }
            </div>)
        }

        onDrop(evt) {
            super.onDrop(evt);
            /**
             * 正在拖拽的元素
             */
            const draging = this.getEditorDragingComponent();
            /**
             * 拖拽的元素是否是内部的子元素本身,如果是则先删除再新增
             */
            const innerChildIndex = this.children.default.indexOf(draging.id);
            if (innerChildIndex != -1) {
                this.removeChild(draging.id);
                if (innerChildIndex < this.splitActive) {
                    this.splitActive -= 1
                }
            }
            if (this.splitActive != -1) {
                this.children.default.splice(this.splitActive + 1, 0, draging.id);
            } else {
                this.children.default.push(this.getEditorDragingComponent().id);
            }
        }

        render(h) {
            return <div style={this.getStyleString()}>
                {
                    this.children.default.map(id => this.getComponentById(id)).map((item, index) => {
                        return item.render(h)
                    })
                }
            </div>
        }

        removeChild(childid) {
            this.children.default.remove(childid)
        }

        getChildrenIds() {
            return [...this.children.default];
        }


        getStyleString() {
            let styleString = super.getStyleString("height");
            if (this.attrs['fixedHeight']) {
                styleString += `;height:${this.attrs.height}`
                if (this.attrs['showScroll']) {
                    styleString += `;overflow-y:auto;`
                } else {
                    styleString += `;overflow-y:hidden;`
                }
            }
            return styleString;

        }

        getEditorStyleString() {
            let styleString = super.getStyleString("height");
            if (this.attrs['fixedHeight']) {
                styleString += `;height:${this.attrs.height}`
                styleString += `;overflow-y:auto;`
            }
            return styleString;

        }
    }

}