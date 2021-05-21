import './Select.less'
import IceSelect from '@/components/common/base/IceSelect.vue'
import BaseFormItem, {formItemAttrs, formItemScript} from "../BaseFormItem";
import OptionListEditor from './OptionListEditor'

export default {
    meta: {
        name: 'select',
        type: 'eleItem',
        icon(h, dragstart, dragend) {
            return <div class="select">
                <div class="select-icon el-icon-arrow-down"></div>
                下拉选择框
            </div>

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
                ...formItemScript
            ]
        },
        basicAttrs() {
            return [
                {
                    key: 'datasource',
                    keylabel: '数据源',
                    deleteable: true,
                    valuetype: "select",
                    list: [
                        {code: 'dataurl', text: 'url服务'},
                        {code: 'maptype', text: '数据字典'},
                        {code: 'custom', text: '自定义'}
                    ]
                },
                {
                    key: 'data-url',
                    keylabel: 'url地址',
                    deleteable: true,
                    showable: (attr) => attr['datasource'] == 'dataurl'
                },
                {
                    key: 'map-type-code',
                    keylabel: '数据字典编码',
                    deleteable: true,
                    showable: (attr) => attr['datasource'] == 'maptype'
                },
                /* {
                     key: 'options',
                     keylabel: '自定义数据',
                     deleteable: true,
                     showable: (attr) => attr['datasource'] == 'custom'
                 },*/
                {key: 'iscascader', keylabel: '是否级联', deleteable: true, valuetype: "checkbox"},
                {
                    key: 'parent-prop',
                    keylabel: '级联属性',
                    deleteable: true,
                    showable: (attr) => attr['iscascader'],
                },
                {
                    key: 'parent-value',
                    keylabel: '级联父编码',
                    deleteable: true,
                    showable: (attr) => attr['iscascader'],
                },
                {key: 'multiple', keylabel: '是否多选', deleteable: true, valuetype: "checkbox"},
                {
                    key: 'value-model',
                    keylabel: '返回值模式',
                    deleteable: true,
                    valuetype: "select",
                    showable: (attr) => attr['multiple'],
                    list: [{code: 'string', text: '字符串(,分割)'}, {code: 'array', text: '数组'}]
                },
                {
                    key: 'filterable',
                    keylabel: '启用搜索',
                    deleteable: true,
                    valuetype: "checkbox",
                    keyreadonly: true
                },
            ]
        }
    },
    clazz: class Select extends BaseFormItem {
        constructor(editor) {
            super(editor);
            this.name = 'select';
            this.type = 'eleItem';
            this.basicAttrs = {}
            this.layoutAttrs['maxH'] = 1
            this.validateEvent = 'blur';
            this.optionList = []
            this.optionListDialog = false;
            /* this.layoutAttrs.w = 2*/
        }

        getSnapshot() {
            return {
                ...super.getSnapshot(),
                optionList: this.optionList
            };
        }

        recoverSnapshoot(snapshoot) {
            super.recoverSnapshoot(snapshoot)
            if (snapshoot.optionList) {
                this.optionList = snapshoot.optionList
            }
        }


        render(h) {
            return super.render(h, h => {

                    return (<ice-select disabled={this.isDisabled()}
                                        value={this.getValue()}
                                        options={this.optionList}
                                        {...{
                                            "attrs": this.getBasicAttrs(),
                                            "on": {
                                                "changevalue": value => {
                                                    this.setValue(value);
                                                    this.change(value);
                                                },
                                                "update:text": value => {
                                                    this.setTextValue(value);
                                                }
                                            },
                                        }}
                                        ref={this.getRefName()}></ice-select>)
                }
            )
        }

        renderEdirtor(h) {
            return super.renderEdirtor(h, h =>
                <div class="form-select">
                    <div class="select-icon el-icon-arrow-down"></div>
                </div>
            )
        }

        additionAttrsRender(h) {
            if (this.basicAttrs.datasource !== 'custom') {
                return '';
            }

            return (<el-card header="自定义数据列表" class="card">
                <div style="display: flex;justify-content: center;">
                    <el-button type="text" style="margin:auto;" {...{
                        on: {
                            'click': evt => {
                                this.listItemsEdit()
                            }
                        }
                    }} >列表项维护(共{this.optionList.length}个)
                    </el-button>

                    <option-list-editor value={this.optionList}
                                        visible={this.optionListDialog}
                                        {...{
                                            on: {
                                                'update:visible': value => {
                                                    this.optionListDialog = value
                                                },
                                                'options-update': value => {
                                                    this.optionList = value
                                                    this.optionListDialog = false
                                                },
                                            }
                                        }} >
                    </option-list-editor>

                </div>
            </el-card>)
        }

        listItemsEdit() {
            this.optionListDialog = true;
        }


        setTextValue(value) {
            if (!this.attrs.code) {
                return;
            }
            this.editor.$set(this.editor.formData, `${this.attrs.code}#text`, value);
        }


        getBasicAttrs() {
            const basicAttrs = {...super.getBasicAttrs()};

            if (basicAttrs["datasource"] == 'dataurl') {
                delete basicAttrs["map-type-code"];

            } else if (basicAttrs["datasource"] == 'maptype') {
                delete basicAttrs["data-url"];

            } else {
                delete basicAttrs["data-url"];
                delete basicAttrs["map-type-code"];
            }


            delete basicAttrs["textValue"];
            delete basicAttrs["datasource"];
            if (basicAttrs['iscascader']) {
                basicAttrs['parent-value'] = this.getFieldValue(basicAttrs['parent-value']);
            } else {
                delete basicAttrs["parent-prop"];
                delete basicAttrs["parent-value"];
            }
            delete basicAttrs["iscascader"];

            return basicAttrs
        }

    }

    ,
    components: {
        IceSelect,
        OptionListEditor
    }
}