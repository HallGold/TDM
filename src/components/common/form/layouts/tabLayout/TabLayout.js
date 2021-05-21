import "./TabLayout.less"
import BaseDragableLayout from "../BaseDragableLayout";
import {dragableAttrs} from '../../BaseDragableElement'

export default {

    meta: {
        name: 'tablayout',
        type: 'layout',
        icon(h, dragstart, dragend) {
            return   <div class="input iconfont icon-tab">tab布局</div>

        },
        dragable(overEleType, overEleName) {
            if (overEleName == 'tablayout') {
                return false
            }
            if (overEleType == 'pageRoot' || overEleType == "layout") {
                return true
            }
            return false;
        },

        attrs() {
            return [
                ...dragableAttrs
            ]
        },
        basicAttrs() {
            return [
                {
                    key: 'type',
                    keylabel: '风格类型',
                    deleteable: false,
                    keyreadonly: true,
                    valuetype: "select",
                    list: [
                        {code: ' ', text: '简洁'},
                        {code: 'card', text: '卡片'},
                        {code: 'border-card', text: '带边框卡片'}
                    ]
                },
                {
                    key: 'tab-position',
                    keylabel: '选项卡位置',
                    deleteable: false,
                    keyreadonly: true,
                    valuetype: "select",
                    list: [
                        {code: 'top', text: '上'},
                        {code: 'bottom', text: '下'},
                        {code: 'left', text: '左'},
                        {code: 'right', text: '右'}
                    ]
                }
            ]
        }
    },

    clazz: class TabLayout extends BaseDragableLayout {
        constructor(editor) {
            super(editor)
            this.name = 'tablayout';
            this.type = 'layout';
            this.style = {'min-height': '300px'}
            this.children = []
            this.basicAttrs = {
                'type': 'border-card',
                'tab-position': "top"
            }
            /*this.attrs.tabsize = 1*/
            this.tabIndex = 0;
            this.tabAttrs = [{name: '页签0', code: 'tab0', isShow: true}]
        }

        getSnapshot() {
            return {
                ...super.getSnapshot(),
                tabAttrs: this.tabAttrs,
            };
        }

        recoverSnapshoot(snapshoot) {
            super.recoverSnapshoot(snapshoot)
            this.tabAttrs = snapshoot.tabAttrs
        }


        getValue() {
            if (this.tabAttrs.length > this.tabIndex && this.tabIndex != -1) {
                return this.tabAttrs[this.tabIndex].code
            } else {
                return '';
            }
        }


        renderTab(h, item, index) {
            return <el-tab-pane
                label={item.name}
                name={item.code}>
                <div class="layout-content">
                    {
                        this.children[index] ? this.getComponentById(this.children[index]).render(h) : ''
                    }
                </div>
            </el-tab-pane>
        }


        render(h) {
            return super.render(h, h => (
                <el-tabs style={this.getStyleString()}
                         value={this.tabAttrs[this.tabIndex].code}
                         {...{
                             "attrs": {
                                 ...this.getBasicAttrs(),
                                 type: this.getBasicAttrs().type == ' ' ? '' : this.getBasicAttrs().type
                             },
                             on: {
                                 'input': value => {
                                     let index = this.tabAttrs.findIndex(item => item.code == value);
                                     this.tabIndex = index;
                                 }
                             }
                         }}>
                    {
                        this.tabAttrs.map((item, index) => {
                            /*   this.resolveExpressString(item, 'isShowExpress', 'isShow')*/
                            if (typeof item['isShow'] === 'boolean') {
                                if (item['isShow']) {
                                    return this.renderTab(h, item, index)
                                } else {
                                    return '';
                                }
                            }

                            if (typeof item['isShow'] === 'object' && item['isShow'].editExpress) {

                                if (this.execFunction(item['isShow'])) {
                                    return this.renderTab(h, item, index)
                                } else {
                                    return '';
                                }

                            }

                            return this.renderTab(h, item)
                        })
                    }
                </el-tabs>))
        }


        renderEdirtor(h) {
            return super.renderEdirtor(h, h =>
                <el-tabs type="border-card"
                         class="form-tab-layout"
                         style={this.getStyleString() + ';flex-grow:1'}
                         editable={true}
                         value={this.getValue()}
                         {...{
                             on: {
                                 'input': value => {
                                     let index = this.tabAttrs.findIndex(item => item.code == value);
                                     this.tabIndex = index;
                                     //console.log(this.tabIndex)
                                 },
                                 'edit': (targetName, action) => {
                                     if (action == 'add') {
                                         this.addTab();
                                     } else if (action == 'remove') {
                                         this.removeTab(targetName)
                                     }
                                 }
                             }
                         }}>
                    {
                        this.tabAttrs.map((item, index) => {
                            return <el-tab-pane
                                label={item.name}
                                name={item.code}>
                                <div class="layout-content"
                                     on-drop={
                                         evt => {
                                             this.onDrop(evt)
                                         }
                                     }
                                     on-dragover={
                                         evt => {
                                             this.onDragOver(evt)
                                         }
                                     }>
                                    {
                                        this.children[index] ? this.getComponentById(this.children[index]).renderEdirtor(h) : ''
                                    }
                                </div>
                            </el-tab-pane>
                        })
                    }
                </el-tabs>)
        }


        additionAttrsRender(h) {
            return (<div>
                {
                    this.tabAttrs.map(item => {

                        return <el-card header={item.name} class="card">
                            <key-value-editable
                                newable={false}
                                value={item}
                                tattrs={
                                    [
                                        {
                                            key: 'name',
                                            keylabel: '页签名称',
                                            deleteable: false,
                                            keyreadonly: true
                                        },
                                        {
                                            key: 'code',
                                            keylabel: '页签编码',
                                            deleteable: false,
                                            keyreadonly: true
                                        },
                                        {
                                            key: 'isShow',
                                            keylabel: '显示规则',
                                            deleteable: false,
                                            valuetype: "script",
                                            keyreadonly: true,
                                            initValueModel: 'function'
                                        }
                                    ]
                                }
                                {...{
                                    "on": {
                                        "change": value => {
                                            Object.assign(item, value)
                                        }
                                    }
                                }}>

                            </key-value-editable>
                        </el-card>
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

            this.children[Number(this.tabIndex)] = draging.id

        }

        addTab() {

            this.tabAttrs.push({
                name: '页签' + this.tabAttrs.length,
                code: 'tab' + this.tabAttrs.length,
                isShow: true
            })
        }

        removeTab(code) {
            const tab = this.tabAttrs.find(item => item.code == code);
            const index = this.tabAttrs.findIndex(item => item.code == code);
            if (tab) {
                if (index == this.tabIndex) {
                    if (this.tabIndex == this.tabAttrs.length - 1 && this.tabIndex != 0) {
                        this.tabIndex = this.tabIndex - 1
                    }
                } else if (index < this.tabIndex) {
                    this.tabIndex = this.tabIndex - 1
                } else {

                }
                this.tabAttrs.remove(tab);
            }
        }

        removeChild(childid) {
            const itemIndex = this.children.indexOf(childid)
            if (itemIndex != -1) {
                this.children[itemIndex] = null;
                this.children = [...this.children]
            }

        }

        getChildrenIds() {
            return [...this.children];
        }

    }
}