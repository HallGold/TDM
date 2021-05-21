import BaseEleItem from "./BaseEleItem";
import "./BaseFormItem.less"
import IceJScript from '@/components/common/form/others/IceJScript'

export const formItemAttrs = [
    {key: 'code', keylabel: '控件编码', deleteable: false, keyreadonly: true},
    {key: 'label', keylabel: '控件label', deleteable: false, keyreadonly: true, realtime: true},
    /* {key: 'readonly', keylabel: '是否只读', deleteable: false, valuetype: "checkbox", keyreadonly: true},*/
    {key: 'required', keylabel: '是否必填', deleteable: false, valuetype: "checkbox", keyreadonly: true},
]

export const formItemScript = [
    {
        key: 'showable',
        keylabel: '控件显示规则',
        deleteable: false,
        valuetype: "script",
        keyreadonly: true,
        initValueModel: 'function'
    },
    {
        key: 'disabled',
        keylabel: '控件禁用规则',
        deleteable: false,
        valuetype: "script",
        keyreadonly: true,
        initValueModel: 'function'
    },
    {
        key: 'computed',
        keylabel: '动态计算规则',
        deleteable: false,
        valuetype: "script",
        keyreadonly: true,
        initValueModel: 'function'
    },
    {
        key: 'change',
        keylabel: 'change事件',
        deleteable: false,
        valuetype: "script",
        keyreadonly: true,
        initValueModel: 'function'
    },
    {
        key: 'blur',
        keylabel: 'blur事件',
        deleteable: false,
        valuetype: "script",
        keyreadonly: true,
        initValueModel: 'function'
    },
]


export default class BaseFormItem extends BaseEleItem {

    constructor(editor) {
        super(editor)
        this.layoutAttrs = {
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            maxW: Infinity,
            maxH: Infinity,
            i: this.id
        }
        this.attrs = {
            code: '',
            label: 'label',
            /*readonly: false,*/
            required: false,
            showable: true,
            disabled: false,
            computed: "",
            change: "",
            blur: ''
        }
        this.formItemStatusAttrs = {
            withCtrl: false,
            withAlt: false,
            formID: ''
        }
        this.value = '';
        this.validateEvent = 'change';//触发校验的事件
        this.hasLabel = true;
        //this.editor.formData[this.attrs.code] ? this.editor.formData[this.attrs.code] : '';
        //this.getComponentsStore().addComponentIdByCode(this.attrs.code, this.id);
    }


    getSnapshot() {
        return {
            ...super.getSnapshot(),
            layoutAttrs: this.layoutAttrs,
            formItemStatusAttrs: this.formItemStatusAttrs,
        };
    }

    recoverSnapshoot(snapshoot) {
        super.recoverSnapshoot(snapshoot)
        this.layoutAttrs['x'] = snapshoot.layoutAttrs['x']
        this.layoutAttrs['y'] = snapshoot.layoutAttrs['y']
        this.layoutAttrs['w'] = snapshoot.layoutAttrs['w']
        this.layoutAttrs['h'] = snapshoot.layoutAttrs['h']
        this.layoutAttrs['i'] = snapshoot.layoutAttrs['i']
        this.formItemStatusAttrs = snapshoot.formItemStatusAttrs
        //this.value = snapshoot.value
    }


    getValue() {
        if (this.attrs.computed) {
            const computedValue = this.execFunction(this.attrs.computed)
            this.setValue(computedValue)
            return computedValue;
        } else {
            // debugger
            let form = this.getComponentById(this.formItemStatusAttrs.formID)
            this.value = form.getFormFieldValue(this.attrs.code);
            return this.value;
        }

    }


    //触发change事件
    change(value) {
        if (this.attrs.change) {
            this.execFunction(this.attrs.change)
            this.reChangeFormData();
        }
    }

    //触发blur事件
    blur(value) {
        if (this.attrs.blur) {
            this.execFunction(this.attrs.blur)
            this.reChangeFormData();
        }
    }


    setValue(value) {
        //debugger
        if (!this.attrs.code) {
            console.error(`${this.attrs.label} code是空,请维护`)
            return;
        }
        this.value = value;
        let form = this.getComponentById(this.formItemStatusAttrs.formID)
        if (form) {
            form.setFormFieldValue(this.attrs.code, value)
        }

    }

    getRefName() {
        return this.type + ":" + this.name + ":" + this.attrs.code;
    }


    getDataControl() {
        return {name: this.attrs.label, code: this.attrs.code};
    }


    setLayoutAttrs(attrs) {
        Object.assign(this.layoutAttrs, attrs);
    }

    copyEleItem() {
        let item = new this.constructor(this.editor);
        //Object.assign(item.attrs, this.attrs);

        return item;
    }


    render(h, formItemRender) {
        if (typeof this.isShow === 'function' && !this.isShow()) {
            return '';
        }
        if (!this.hasLabel) {

            return <div class="form-label-bar" style={this.getStyleString()}>
                <div class="item-content">
                    {formItemRender ? formItemRender(h) : <div></div>}
                </div>
            </div>
        }
        if (this.getComponentById(this.parentId).formAttrs.validate) {
            return (<el-form-item label={this.attrs.label + ':'} prop={this.attrs.code} label-width="100px">
                {formItemRender ? formItemRender(h) : <div></div>}
            </el-form-item>)
        } else {
            return (
                <div class="form-label-bar"
                     style={this.getStyleString()}>
                    <div class="label">
                        {this.attrs.label}:
                    </div>
                    <div class="item-content">
                        {formItemRender ? formItemRender(h) : <div></div>}
                    </div>
                </div>
            )
        }


    }


    renderEdirtor(h, formItemRender) {
        return (
            <div class="form-label-bar"
                 style={this.getStyleString()}
                 tabIndex="1"
                 on-click={
                     evt => {
                         this.onClick(evt)
                     }
                 }
                 on-keyup={
                     evt => {
                         this.onKeyUp(evt)
                     }
                 }>
                {this.hasLabel ?
                    <div class="label">
                        {this.attrs.required ? (<span style="color:red">*</span>) : ''}{this.attrs.label}:
                    </div>
                    : ''}
                <div class="item-content">
                    {formItemRender ? formItemRender(h) : <div></div>}
                </div>
            </div>
        )
    }


    isDisabled() {
        if (this.pageReadonly()) {
            return true
        }


        if (typeof this.attrs.disabled === 'boolean') {
            return this.attrs.disabled
        }

        if (typeof this.attrs.disabled === 'object') {
            return this.execFunction(this.attrs.disabled);
        }

        return false
    }

    isShow() {

        /*if (this.attrs.showable) {
            return true
        }*/

        if (typeof this.attrs.showable === 'boolean') {
            return this.attrs.showable
        }


        if (typeof this.attrs.showable === 'object') {
            return this.execFunction(this.attrs.showable);
        }

        return true

    }


    focus() {
        const vueComp = this.getVueComponent(this.attrs.code);
        if (vueComp && vueComp.focus && typeof vueComp.focus == 'function') {
            vueComp.focus()
        }
    }

}