import BaseFormItem from "../BaseFormItem";
import './Text.less'

export default {
    meta: {
        name: 'text',
        type: 'eleItem',
        icon(h, dragstart, dragend) {
            return <div class="input iconfont icon-tubiao-">文字</div>

        },
        dragable(overEleType, overEleName) {
            if (overEleName == 'formpanel') {
                return true
            }
            return false;
        },

        attrs() {
            return [
                {key: 'hasLabel', keylabel: '是否有label', deleteable: false, valuetype: "checkbox", keyreadonly: true},
                {
                    key: 'label',
                    keylabel: '控件label',
                    deleteable: false,
                    keyreadonly: true,
                    realtime: true,
                    showable: attr => attr['hasLabel']
                },
                {
                    key: 'computed',
                    keylabel: '文字内容',
                    deleteable: false,
                    valuetype: "script",
                    keyreadonly: true,
                    initValueModel: 'function'
                },
                {key: 'isLink', keylabel: '是否链接', deleteable: false, valuetype: "checkbox", keyreadonly: true},
                {
                    key: 'linkUrl',
                    keylabel: '链接URL',
                    deleteable: false,
                    valuetype: "script",
                    keyreadonly: true,
                    initValueModel: 'function',
                    showable: attr => attr['isLink']
                },
            ]
        }
    },
    clazz: class Text extends BaseFormItem {
        constructor(editor) {
            super(editor);
            this.name = 'text';
            this.type = 'eleItem';
            this.attrs = {
                hasLabel: true,
                label: 'label',
                computed: "",
                isLink: false,
                linkUrl: ''
            }
            /* this.layoutAttrs.w = 2*/
        }

        setValue(value) {
            //debugger
            /*if (!this.attrs.code) {
                console.error(`${this.attrs.label} code是空,请维护`)
                return;
            }
            this.value = value;
            let form = this.getComponentById(this.formItemStatusAttrs.formID)
            if (form) {
                form.setFormFieldValue(this.attrs.code, value)
            }*/

        }


        recoverSnapshoot(snapshoot) {
            super.recoverSnapshoot(snapshoot)
            this.hasLabel = snapshoot.attrs.hasLabel;
        }

        render(h) {
            return super.render(h, h => {
                    if (this.attrs.isLink) {
                        return <a href={this.getLinkUrl()} target="_blank">{this.getValue()}</a>
                    } else {
                        return <span>{this.getValue()}</span>;
                    }
                }
            )
        }

        renderEdirtor(h) {
            return super.renderEdirtor(h, h =>
                <div class="form-text">
                </div>
            )
        }

        attrsChange(before, after) {
            this.hasLabel = after.hasLabel;
            return true
        }

        getDataControl() {
            return null;
        }

        getLinkUrl() {
            const computedValue = this.execFunction(this.attrs.linkUrl)
            return computedValue;
        }

    }
}