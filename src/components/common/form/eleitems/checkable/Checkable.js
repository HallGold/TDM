import BaseFormItem, {formItemAttrs, formItemScript} from "../BaseFormItem";
import './Checkable.less'
import RadiosEditor from './CheckableItemsEditor'

export default {
    meta: {
        name: 'radio',
        type: 'eleItem',
        icon(h,) {
            return <div class="input iconfont icon-radio">单/复选框</div>

        },
        dragable(overEleType, overEleName) {
            if (overEleName == 'formpanel') {
                return true
            }
            return false;
        },

        attrs() {
            return [
                ...formItemAttrs,
                ...formItemScript,

            ]
        },
        basicAttrs() {
            return [
                {
                    key: 'isBoolean',
                    keylabel: '是否Boolean',
                    keyreadonly: true,
                    deleteable: false,
                    valuetype: "checkbox",
                },
                {
                    key: 'true-label',
                    keylabel: '选中时值',
                    keyreadonly: true,
                    deleteable: true,
                    showable: (attr) => attr['isBoolean'],
                },
                {
                    key: 'false-label',
                    keylabel: '未选中时值',
                    keyreadonly: true,
                    deleteable: true,
                    showable: (attr) => attr['isBoolean'],
                },
                {
                    key: 'multiple',
                    keylabel: '是否多选',
                    keyreadonly: true,
                    deleteable: false,
                    valuetype: "checkbox",
                    showable: (attr) => !attr['isBoolean'],
                },
                {
                    key: 'value-model',
                    keylabel: '返回值模式',
                    deleteable: true,
                    valuetype: "select",
                    showable: (attr) => attr['multiple'],
                    list: [{code: 'string', text: '字符串(,分割)'}, {code: 'array', text: '数组'}]
                },
                /*{key: 'maxlength', keylabel: '最大长度', deleteable: true, valuetype: "number"},
                {key: 'clearable', keylabel: '是否可清空', deleteable: true, valuetype: "checkbox"},*/
            ]
        }
    },
    clazz: class Checkable extends BaseFormItem {
        constructor(editor) {
            super(editor);
            this.name = 'radio';
            this.type = 'eleItem';
            this.validateEvent = 'change';
            this.basicAttrs.isBoolean = false;
            this.basicAttrs.multiple = false;
            this.basicAttrs['value-model'] = 'array';
            this.layoutAttrs['maxH'] = 1
            this.items = [{label: '选项', value: ''}]
            this.itemsDialogVisable = false;

        }

        getSnapshot() {
            return {
                ...super.getSnapshot(),
                items: this.items
            };
        }

        recoverSnapshoot(snapshoot) {
            super.recoverSnapshoot(snapshoot)
            if (snapshoot.items) {
                this.items = snapshoot.items
            }
            if (this.basicAttrs.isBoolean) {
                this.setValue(false)
            }/* else if (this.basicAttrs['value-model'] == 'array') {
                this.setValue([])
            } */else {
                this.setValue([])
            }
        }


        getValue() {
            const value = super.getValue()
            if (this.basicAttrs.isBoolean) {
                return value
            } else if (value === undefined || value === '') {
                return []
            } else {
                if (this.basicAttrs['multiple'] && this.basicAttrs['value-model'] == 'string') {
                    return value.split(",")
                }
                return value;
            }
        }

        setValue(value) {
            if (this.basicAttrs.isBoolean) {
                super.setValue(value)
                return
            } else if (this.basicAttrs['value-model'] == 'string') {
                super.setValue(value.join(","))
                return
            }
            super.setValue(value);
        }


        render(h) {
            return super.render(h, h => {
                    if (this.basicAttrs.isBoolean) {
                        return (<el-checkbox
                            value={this.getValue()}
                            disabled={this.isDisabled()} {...{
                            "attrs": this.getBasicAttrs(),
                            'on': {
                                'change': value => {
                                    if (!this.attrs.readonly) {
                                        this.setValue(value);
                                    }
                                    this.change(value);
                                }
                            }
                        }}></el-checkbox>)
                    } else if (this.basicAttrs['multiple']) {
                        return (
                            <el-checkbox-group value={this.getValue()}
                                               disabled={this.isDisabled()}
                                               {...{
                                                   'on': {
                                                       'input': value => {
                                                           if (!this.attrs.readonly) {
                                                               this.setValue(value);
                                                           }
                                                           this.change(value);
                                                       }
                                                   }
                                               }}>
                                {
                                    this.items.map(item => {
                                        return <el-checkbox label={item.value}>{item.label}</el-checkbox>
                                    })
                                }
                            </el-checkbox-group>
                        )
                    } else {
                        return (
                            <el-radio-group value={this.getValue()}
                                            disabled={this.isDisabled()}
                                            {...{
                                                'on': {
                                                    'input': value => {
                                                        this.setValue(value)
                                                    }
                                                }
                                            }}>
                                {
                                    this.items.map(item => {
                                        return <el-radio label={item.value}>{item.label}</el-radio>
                                    })
                                }
                            </el-radio-group>
                        )
                    }
                }
            )
        }

        renderEdirtor(h) {
            return super.renderEdirtor(h, h =>
                <div class="form-radio" style="background: #f2f6fc;position:relative">
                    <el-radio-group>
                        {
                            this.items.map(item => {
                                return <el-radio label={item.value}>{item.label}</el-radio>
                            })
                        }
                    </el-radio-group>
                    <div style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:3"></div>
                </div>
            )
        }


        additionAttrsRender(h) {
            if (!this.basicAttrs.isBoolean) {
                return (<el-card header="自定义数据列表" class="card">
                    <div style="display: flex;justify-content: center;">
                        <el-button type="text" style="margin:auto;" {...{
                            on: {
                                'click': evt => {
                                    this.itemsEdit()
                                }
                            }
                        }} >列表项维护(共{this.items.length}个)
                        </el-button>
                        <radios-editor value={this.items}
                                       visible={this.itemsDialogVisable}
                                       {...{
                                           on: {
                                               'update:visible': value => {
                                                   this.itemsDialogVisable = value
                                               },
                                               'radios-update': value => {
                                                   this.items = value
                                                   this.itemsDialogVisable = false
                                               },
                                           }
                                       }} >
                        </radios-editor>

                    </div>
                </el-card>)
            } else {
                return '';
            }

        }

        itemsEdit() {
            this.itemsDialogVisable = true
        }


        setBasicAttrs(attrs) {
            super.setBasicAttrs(attrs);
            if (this.basicAttrs.isBoolean) {
                this.setValue(false)
            } else {
                this.setValue("")
            }


        }

    }
    ,
    components: {
        RadiosEditor,
    }
}