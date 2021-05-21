import BaseFormItem, {formItemAttrs, formItemScript} from "../BaseFormItem";
import IceImageUpload from '@/components/common/base/IceImageUpload.vue'
import './ImageUploader.less'

export default {
    meta: {
        name: 'imageUploader',
        type: 'eleItem',
        icon(h, dragstart, dragend) {
            return <div class="form-image-uploader">
                <i class=" el-icon-picture icon"></i>
                图片上传
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
                {key: 'width', keylabel: '宽度(px)', deleteable: false, valuetype: "number"},
                {key: 'height', keylabel: '高度(px)', deleteable: false, valuetype: "number"},
            ]
        }
    },
    clazz: class ImageUploader extends BaseFormItem {
        constructor(editor) {
            super(editor);
            this.name = 'imageUploader';
            this.type = 'eleItem';
            this.basicAttrs = {
                height: 100,
                width: 100,
            }
            this.layoutAttrs.w = 1;
            this.layoutAttrs.h = 3;
            /* this.layoutAttrs.w = 2*/
        }

        render(h) {
            return super.render(h, h => {
                    return (
                        <div class="image-uploader-editor">
                            <ice-image-upload disabled={this.isDisabled()}
                                              value={this.getValue()}
                                              {...{
                                                  "attrs": this.getBasicAttrs(),
                                                  "on": {
                                                      "uploadChange": value => {
                                                          if (!this.attrs.readonly) {
                                                              this.setValue(value);
                                                          }
                                                          this.change(value);
                                                      },
                                                  },
                                              }}
                                              ref={this.getRefName()}>

                            </ice-image-upload>
                        </div>);
                }
            )
        }

        renderEdirtor(h) {
            return super.renderEdirtor(h, h =>
                <div class="image-uploader-editor">
                    <div class="uploader"
                         style={`width:${this.basicAttrs.width}px;height:${this.basicAttrs.height}px;`}>图片上传
                    </div>
                </div>
            )
        }


        setBasicAttrs(attrs) {
            super.setBasicAttrs(attrs);
        }

    },
    components: {
        IceImageUpload
    }
}