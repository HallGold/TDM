import BaseFormItem, {formItemAttrs, formItemScript} from "../BaseFormItem";
import './NumberInput.less'

export default {
    meta: {
        name: 'numberInput',
        type: 'eleItem',
        icon(h) {
            return (<div class="form-number-input">
                <div class="icon-left el-icon-minus"></div>
                <div class="icon-right el-icon-plus"></div>
                数字输入框
            </div>)

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

                {key: 'controls', keylabel: '启用控制按钮', deleteable: true, valuetype: "checkbox"},
                {
                    key: 'controls-position',
                    keylabel: '按钮位置',
                    deleteable: true,
                    valuetype: "select",
                    showable: attr => attr['controls'],
                    list: [{code: '', text: '两边'}, {code: 'right', text: '右边'}]
                },
                {key: 'step', keylabel: '步长', deleteable: true, valuetype: "number"},
                {key: 'step-strictly', keylabel: '步长约束', deleteable: true, valuetype: "checkbox"},
                {key: 'min', keylabel: '最小值', deleteable: true, valuetype: "number"},
                {key: 'max', keylabel: '最大值', deleteable: true, valuetype: "number"},
            ]
        }
    },
    clazz: class NumberInput extends BaseFormItem {
        constructor(editor) {
            super(editor);
            this.name = 'numberInput';
            this.type = 'eleItem';
            this.basicAttrs = {
                controls: false
            }
            this.layoutAttrs['maxH'] = 1
            this.validateEvent = 'blur';
           // this.setValue(0);
            /* this.layoutAttrs.w = 2*/
        }


        render(h) {
            return super.render(h, h => {

                    return (<el-input-number disabled={this.isDisabled()}
                                             value={this.getValue()}
                                             {...{
                                                 "attrs": this.getBasicAttrs(),
                                                 "on": {
                                                     "input": value => {
                                                         if (!this.isDisabled() && this.isShow()) {
                                                             this.setValue(value);
                                                         }
                                                         this.change(value);
                                                     },
                                                     "change": value => {
                                                         this.blur(value);
                                                     }
                                                 },
                                             }}
                                             ref={this.getRefName()}></el-input-number>)
                }
            )
        }

        renderEdirtor(h) {
            return super.renderEdirtor(h, h =>
                <div class="form-number-input">
                    <div class="icon-left el-icon-minus"></div>
                    <div class="icon-right el-icon-plus"></div>
                </div>
            )
        }


    }
}