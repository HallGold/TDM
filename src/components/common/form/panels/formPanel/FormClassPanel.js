import BasePanel from "../BasePanel";
import {dragableAttrs} from '../../BaseDragableElement'
import IceFormGroup from "../../../base/IceFormGroup";
import IceForm from "../../../base/IceForm";
import VueGridLayout from "vue-grid-layout";
import './FormClassPanel.less'
import {addResizeListener} from 'element-ui/src/utils/resize-event';

export default {
    meta: {
        name: 'formpanel',
        type: 'panel',
        icon(h, dragstart, dragend) {
            return <div class="input iconfont icon-biaodan">表单组件</div>

        },
        dragable(overEleType, overEleName) {
            if (overEleType == "layout") {
                return true
            }
            return false;
        },

        attrs() {
            return [
                ...dragableAttrs,
                {key: 'code', keylabel: '表单编码', deleteable: false, keyreadonly: true},
                {key: 'colNum', keylabel: '列数', deleteable: false, keyreadonly: true, valuetype: "number", valuemin: 1},
                {
                    key: 'rowHeight',
                    keylabel: '行高',
                    deleteable: false,
                    keyreadonly: true,
                    valuetype: "number",
                    valuemin: 1,
                },
                {key: 'rowNum', keylabel: '行数', deleteable: false, keyreadonly: true, valuetype: "number", valuemin: 1},
                {key: 'autoRank', keylabel: '纵向自动压缩', deleteable: false, keyreadonly: true, valuetype: "checkbox"},]
            /*      {key: 'validate', keylabel: '表单是否校验', deleteable: false, keyreadonly: true, valuetype: "checkbox"},*/

        }
    },
    clazz: class FormClassPanel extends BasePanel {
        constructor(editor) {
            super(editor);
            this.name = 'formpanel';
            this.type = 'panel';
            this.hasValue = false;
            this.attrs.showTitle = true//是否显示标题
            this.attrs.title = "表单标题"//标题
            this.attrs.code = ""//列数
            this.attrs.colNum = 3//列数
            this.attrs.rowHeight = 50//行高
            this.attrs.rowNum = 3//行数
            this.attrs.autoRank = false//表单自动排列
            this.attrs.expandable = true//是否可收缩展开
            this.formAttrs = {validate: true, rules: {}}
            /*        this.editor.formData[this.id] = {}*/
            this.validateTypeMessage = {
                'string': '必须输入文本',
                'number': '必须输入数字',
                'integer': '必须输入整数',
                'float': '必须输入浮点数',
                'email': '格式不正确',
                'date': '必须输入日期',
                'url': '格式不正确'
            }
            this.setBackgroundItemsArray();

        }

        getSnapshot() {
            return {
                ...super.getSnapshot(),
                formAttrs: this.formAttrs,
            };
        }

        recoverSnapshoot(snapshoot) {
            super.recoverSnapshoot(snapshoot)
            this.formAttrs = snapshoot.formAttrs
        }

        setBackgroundItemsArray() {
            const length = Number(this.attrs.rowNum) * Number(this.attrs.colNum);
            this.backgroundArray = this.createArray(length)
        }

        createArray(length) {
            // debugger
            const a = [];
            for (let i = 0; i < length; i++) {
                a.push(i)
            }
            return a
        }

        setFormFieldValue(field, value) {
            this.editor.$set(this.editor.formData, field, value);
            //this.reChangeFormData()
        }


        getFormFieldValue(field) {
            return this.editor.formData[field]
        }

        removeFormFieldValue(field) {
            delete this.editor.formData[field]
        }

        getFormValue() {
            return this.editor.formData
        }

        /**
         * 加载form校验规则，读取所有子元素
         */
        loadFormRules() {
            let rules = {}
            if (this.pageReadonly()) {
                return rules;
            }
            this.children.default.map(id => this.getComponentById(id)).forEach(item => {
                let arr = [];
                if (item.attrs.required) {
                    arr.push({required: true, message: `${item.attrs.label}不能为空`, trigger: item.validateEvent})
                }
                if (!item.attrs.whitespace && item.attrs.type == 'string') {
                    arr.push({whitespace: true, message: `${item.attrs.label}不能是空格`, trigger: item.validateEvent})
                }
                if (item.attrs.type) {

                    if (item.attrs.type == 'remote') {
                        arr.push({
                            validator: (rule, value, callback) => {
                                return new Promise((resolve, reject) => {
                                    const params = {}
                                    params[item.attrs.keyCode] = value;
                                    const {$axios, $message} = this.editor;
                                    $axios.get(item.attrs.url, {params})
                                        .then(result => {
                                            if (result.data) {
                                                resolve()
                                            } else {
                                                reject(item.attrs.message ? item.attrs.message : '数据校验不通过');
                                            }
                                        })
                                        .catch(error => {
                                            reject('数据校验接口异常,请联系管理员');
                                        })


                                });
                            },
                            trigger: item.validateEvent
                        })
                    } else if (item.attrs.type == 'pattern') {
                        arr.push({
                            pattern: new RegExp(item.attrs.pattern),
                            message: item.attrs.message ? item.attrs.message : `${item.attrs.label}格式不匹配`,
                            trigger: item.validateEvent
                        })
                    } else {
                        arr.push({
                            type: item.attrs.type,
                            message: `${item.attrs.label}${this.validateTypeMessage[item.attrs.type]}`,
                            trigger: item.validateEvent,
                            transform(value) {
                                if ((item.attrs.type == 'number' ||
                                    item.attrs.type == 'integer' ||
                                    item.attrs.type == 'float') && typeof value == 'string') {
                                    return Number(value)
                                }
                                return value
                            }
                        })
                    }


                }
                rules[item.attrs.code] = arr
            })
            return rules;
        }

        renderFormGrid(h) {
            return (<grid-layout
                style={`min-height:${(Number(this.attrs.rowHeight) + 0) * Number(this.attrs.rowNum)}px;width:100%;${this.getStyleString("min-height", "width")}`}
                layout={this.children.default.map(id => this.getComponentById(id)).map(item => item.layoutAttrs)}
                col-num={Number(this.attrs.colNum)}
                row-height={Number(this.attrs.rowHeight)}
                auto-size={false}
                is-draggable={false}
                is-resizable={false}
                vertical-compact={this.attrs.autoRank}
                margin={[0, 0]}
                use-css-transforms={false}>
                {
                    /*使用ctrl控制item复制功能，使用alt控制跨form移动的功能*/
                    this.children.default.map(id => this.getComponentById(id)).map(item => {
                        return (<grid-item
                            x={item.layoutAttrs.x}
                            y={item.layoutAttrs.y}
                            w={item.layoutAttrs.w}
                            h={item.layoutAttrs.h}
                            i={item.layoutAttrs.i}>
                            {
                                item.render(h)
                            }
                        </grid-item>)
                    })

                }

            </grid-layout>)
        }

        render(h) {
            return super.render(h, h => {
                if (this.formAttrs.validate) {
                    return (<ice-form rules={this.loadFormRules()}
                                      ice-model={this.getFormValue()}
                                      validate-on-rule-change={false}
                                      label-position="right"
                                      class="form-content"
                                      ref={this.getRefName()}>
                        {this.renderFormGrid(h)}
                    </ice-form>)
                } else {
                    return this.renderFormGrid(h)
                }
            })


        }

        renderEdirtor(h) {
            return super.renderEdirtor(h, h =>
                (<div class="form-content" style="flex-grow:1">
                    <div class="background form">
                        {this.backgroundArray.map(item => {
                            return <div class="item"
                                        style={`width:calc(100% /${this.attrs.colNum}  - 1px);height:${Number(this.attrs.rowHeight) + 0}px`}></div>
                        })}
                    </div>
                    <grid-layout
                        style={`min-height:${(Number(this.attrs.rowHeight) + 0) * Number(this.attrs.rowNum)}px;width:100%`}
                        {...{
                            on: {
                                'layout-updated': value => {
                                    value.forEach(item => {
                                        //判断是否超出背景高度
                                        if (item.y >= Number(this.attrs.rowNum)) {
                                            this.attrs.rowNum = item.y + 1
                                        }
                                        const comp = this.getComponentById(item.i);
                                        comp.setLayoutAttrs(item)
                                    })
                                    //重新计算背景高度
                                    this.setBackgroundItemsArray()
                                }
                            }
                        }}
                        nativeOn-dragover={evt => this.onDragOver(evt)}
                        nativeOn-drop={evt => this.onDrop(evt)}
                        ref={this.id + ''}
                        layout={this.children.default.map(id => this.getComponentById(id)).map(item => item.layoutAttrs)}
                        col-num={Number(this.attrs.colNum)}
                        row-height={Number(this.attrs.rowHeight)}
                        auto-size={true}
                        is-draggable={true}
                        is-resizable={true}
                        vertical-compact={false}
                        margin={[0, 0]}
                        use-css-transforms={false}>
                        {
                            /*使用ctrl控制item复制功能，使用alt控制跨form移动的功能*/
                            this.children.default.map(id => this.getComponentById(id)).map(item => {
                                return (<grid-item
                                    nativeOn-keydown={evt => {
                                        let keyNum = window.event ? evt.keyCode : evt.which;
                                        if (keyNum == 17) {
                                            item.formItemStatusAttrs.withCtrl = true
                                            evt.stopPropagation()
                                            evt.preventDefault()
                                        } else if (keyNum == 18) {
                                            item.formItemStatusAttrs.withAlt = true
                                            evt.stopPropagation()
                                            evt.preventDefault()
                                        }
                                    }}
                                    nativeOn-keyup={evt => {
                                        let keyNum = window.event ? evt.keyCode : evt.which;
                                        if (keyNum == 17) {
                                            item.formItemStatusAttrs.withCtrl = false
                                            evt.stopPropagation()
                                            evt.preventDefault()
                                        } else if (keyNum == 18) {
                                            item.formItemStatusAttrs.withAlt = false
                                            evt.stopPropagation()
                                            evt.preventDefault()
                                        }
                                    }}
                                    draggable={(item.formItemStatusAttrs.withCtrl || item.formItemStatusAttrs.withAlt) ? "true" : 'false'}
                                    is-draggable={!item.formItemStatusAttrs.withCtrl && !item.formItemStatusAttrs.withAlt}
                                    nativeOn-dragstart={evt => {
                                        this.editor.dragstart(evt, item.type, item.name)
                                        if (item.formItemStatusAttrs.withCtrl) {
                                            this.editor.dragingComponent = item.copyEleItem();
                                            this.editor.dragingComponent.formItemStatusAttrs.withCtrl = false;
                                        } else if (item.formItemStatusAttrs.withAlt) {
                                            this.editor.dragingComponent = item;
                                            this.editor.dragingComponent.formItemStatusAttrs.withAlt = false;
                                        }

                                    }}
                                    nativeOn-dragend={evt => this.editor.dragend(evt, item.type, item.name)}
                                    x={item.layoutAttrs.x}
                                    y={item.layoutAttrs.y}
                                    w={item.layoutAttrs.w}
                                    h={item.layoutAttrs.h}
                                    i={item.layoutAttrs.i}
                                    maxW={item.layoutAttrs.maxW}
                                    maxH={item.layoutAttrs.maxH}>
                                    {
                                        item.renderEdirtor(h)
                                    }
                                </grid-item>)
                            })

                        }

                    </grid-layout>
                </div>)
            )
        }

        onDrop(ev) {
            super.onDrop(ev);
            const formItem = this.getEditorDragingComponent();

            /**
             *  通过鼠标坐标计算拖拽的组件在表单网格上放置的位置（好像有bug）
             */


            let x = 0;
            let y = 0;


            let pos = {x: ev.offsetX, y: ev.offsetY};
            //debugger
            let grid = this.editor.$refs[this.id];
            // debugger
            let width = grid.$el.offsetWidth;
            let height = grid.$el.offsetHeight;
            //console.log(width, height)
            let colWidth = width / this.attrs.colNum;

            let rowNum = height / this.attrs.rowHeight;

            //debugger
            for (let i = 0; i < grid.colNum; i++) {
                if (i * colWidth < pos.x && pos.x < (i + 1) * colWidth) {
                    x = i;
                }
            }
            for (let i = 0; i < rowNum; i++) {
                if (i * grid.rowHeight < pos.y && pos.y < (i + 1) * grid.rowHeight) {
                    y = i;
                }
            }

            formItem.layoutAttrs.x = x;
            formItem.layoutAttrs.y = y;

            /*   debugger*/
            /**
             * 如果组件的表单ID存在，则表示这个组件在别的表单上，需要先删除然后在本表单上新增,主要用于跨表单拖拽控件
             */
            if (formItem.formItemStatusAttrs.formID && formItem.formItemStatusAttrs.formID != this.id) {
                this.getComponentById(formItem.formItemStatusAttrs.formID).removeChild(formItem.id);
                //console.log(this.getComponentById(formItem.formItemStatusAttrs.formID).children.default)
            }
            this.children.default.push(formItem.id);
            formItem.formItemStatusAttrs.formID = this.id;
            this.setFormFieldValue(formItem.attrs.code, formItem.value);
        }

        removeChild(childid) {
            this.children.default.remove(childid)
        }


        getChildrenIds() {
            return [...this.children.default];
        }


        attrsChange(before, after) {
            if (super.attrsChange(before, after)) {
                this.setBackgroundItemsArray();
                return true
            } else {
                return false
            }

        }

        getRefName() {
            return this.type + ":" + this.name + ":" + this.attrs.code;
        }

        validate(...params) {
            const form = this.getVueComponent(this.attrs.code);
            if (form) {
                //valid, invalidFields
                form.validate(...params);
            }
        }

        validateField(...params) {
            const form = this.getVueComponent(this.attrs.code);
            if (form) {
                //valid, invalidFields
                form.validateField(...params);
            }
        }


        resetFields() {
            const form = this.getVueComponent(this.attrs.code);
            if (form) {
                //valid, invalidFields
                form.resetFields();
            }
        }


        clearValidate(...params) {
            const form = this.getVueComponent(this.attrs.code);
            if (form) {
                //valid, invalidFields
                form.clearValidate(...params);
            }
        }


        getPublicScope() {
            return {
                clearValidate: this.clearValidate,
                validate: this.validate,
                resetFields: this.resetFields
            };
        }

    }
    ,
    components: {
        IceForm,
        IceFormGroup,
        GridItem: VueGridLayout.GridItem,
        GridLayout: VueGridLayout.GridLayout,
    }
}