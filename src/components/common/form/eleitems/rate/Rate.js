import BaseFormItem, {formItemAttrs, formItemScript} from "../BaseFormItem";
import './Rate.less'

export default {
    meta: {
        name: 'rate',
        type: 'eleItem',
        icon(h, dragstart, dragend) {
            return <div class="form-rate">
                <i class="el-icon-star-on icon"></i>
                <i class="el-icon-star-on icon"></i>
                <i class="el-icon-star-on icon"></i>
                评分条
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
                {key: 'max', keylabel: '最大分值', deleteable: false, valuetype: "number"},
                {key: 'allow-half', keylabel: '允许半选', deleteable: false, valuetype: "checkbox"},
                {
                    key: 'show-text',
                    keylabel: '显示辅助文字',
                    deleteable: true,
                    valuetype: "checkbox",
                    showable: attr => !attr['show-score']
                },
                {
                    key: 'show-score',
                    keylabel: '显示分数',
                    deleteable: true,
                    valuetype: "checkbox",
                    showable: attr => !attr['show-text']
                },

            ]
        }
    },
    clazz: class Rate extends BaseFormItem {
        constructor(editor) {
            super(editor);
            this.name = 'rate';
            this.type = 'eleItem';
            this.basicAttrs = {
                'max': 5,
                'allow-half': false
            }
            this.layoutAttrs['maxH'] = 1
            /* this.layoutAttrs.w = 2*/
            //this.setValue(0);
        }

        render(h) {
            return super.render(h, h => {
                    return (
                        <div class="form-rate-render">
                            <el-rate disabled={this.isDisabled()}
                                     value={this.getValue()}
                                     {...{
                                         "attrs": this.getBasicAttrs(),
                                         "on": {
                                             "change": value => {
                                                 if (!this.attrs.readonly) {
                                                     this.setValue(value);
                                                 }
                                                 this.change(value);
                                             },
                                         },
                                     }}
                                     ref={this.getRefName()}>

                            </el-rate>
                        </div>
                    )
                }
            )
        }

        renderEdirtor(h) {
            return super.renderEdirtor(h, h =>
                <div class="form-rate-editor">
                    <i class="el-icon-star-on icon"></i>
                    <i class="el-icon-star-on icon"></i>
                    <i class="el-icon-star-on icon"></i>
                    <i class="el-icon-star-on icon"></i>
                    <i class="el-icon-star-on icon"></i>
                </div>
            )
        }

        getValue() {
            const value = super.getValue();
            if (value === '' || value === undefined) {
                return 0;
            }
            return value
        }

    }
}