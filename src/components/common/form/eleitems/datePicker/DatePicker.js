import BaseFormItem, {formItemAttrs, formItemScript} from "../BaseFormItem";
import IceDatePicker from '@/components/common/base/IceDatePicker.vue'
import './DatePicker.less'

export default {
    meta: {
        name: 'datepicker',
        type: 'eleItem',
        icon(h, dragstart, dragend) {
            return <div class="datePicker">
                <i class=" el-input__icon el-icon-date icon"></i>
                日期选择
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
            return []
        }
    },
    clazz: class DatePicker extends BaseFormItem {
        constructor(editor) {
            super(editor);
            this.name = 'datepicker';
            this.type = 'eleItem';
            this.basicAttrs = {}
            this.layoutAttrs['maxH'] = 1
            this.validateEvent = 'blur';
            /* this.layoutAttrs.w = 2*/
        }

        render(h) {
            return super.render(h, h => {

                    return (<ice-date-picker disabled={this.isDisabled()}
                                             value={this.getValue()}
                                             {...{
                                                 "attrs": this.getBasicAttrs(),
                                                 "on": {
                                                     "input": value => {
                                                         if (!this.attrs.readonly) {
                                                             this.setValue(value);
                                                         }
                                                         this.change(value);
                                                     },
                                                     "change": value => {
                                                         this.blur(value);
                                                     }
                                                 },
                                             }}
                                             ref={this.getRefName()}>

                    </ice-date-picker>)
                }
            )
        }

        renderEdirtor(h) {
            return super.renderEdirtor(h, h =>
                <div class="form-datePicker">
                    <i class=" el-input__icon el-icon-date icon"></i>
                </div>
            )
        }


        setBasicAttrs(attrs) {
            super.setBasicAttrs(attrs);
        }

    },
    components: {
        IceDatePicker
    }
}