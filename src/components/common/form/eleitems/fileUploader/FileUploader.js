import BaseFormItem, {formItemAttrs, formItemScript} from "../BaseFormItem";
import IceSingleUpload from '@/components/common/base/IceSingleUpload.vue'
import './FileUploader.less'

export default {
    meta: {
        name: 'fileUploader',
        type: 'eleItem',
        icon(h, dragstart, dragend) {
            return <div class="form-file-uploader">
                <i class=" el-icon-upload icon"></i>
                附件上传
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
                    key: 'style-type',
                    keylabel: '风格',
                    valuetype: "select",
                    deleteable: false,
                    list: [{code: 'button', text: '仅按钮'}, {code: 'input', text: '输入框'}]
                },
                {key: 'do-secret', keylabel: '附加密级信息', deleteable: false, valuetype: "checkbox"},
                {key: 'accept', keylabel: '附件类型', deleteable: true},
            ]
        }
    },
    clazz: class FileUploader extends BaseFormItem {
        constructor(editor) {
            super(editor);
            this.name = 'fileUploader';
            this.type = 'eleItem';
            this.basicAttrs = {
                'style-type': 'input',
                'do-secret': false
            }
            /* this.layoutAttrs.w = 2*/
        }

        render(h) {
            return super.render(h, h => {
                    return (<ice-single-upload disabled={this.isDisabled()}
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

                    </ice-single-upload>);
                }
            )
        }

        renderEdirtor(h) {
            return super.renderEdirtor(h, h =>
                <div class="file-uploader">
                    <div class="file-icon el-icon-upload"></div>
                </div>
            )
        }


        setBasicAttrs(attrs) {
            super.setBasicAttrs(attrs);
        }

    },
    components: {
        IceSingleUpload
    }
}