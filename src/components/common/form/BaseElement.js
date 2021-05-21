import {Message} from 'element-ui';
import IceScript from '@/components/common/form/others/IceJScript'

export default class BaseElement {

    constructor(editor) {
        this.editor = editor;
        this.id = new Date().getTime() + "";
        this.name = '';
        this.type = '';
        this.style = {};
        this.attrs = {};
        this.basicAttrs = {}
        this.parentId = '';
        this.editor.componentsStore.addComponentById(this.id, this);
    }


    //获取快照信息
    getSnapshot() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            style: this.style,
            attrs: this.attrs,
            basicAttrs: this.basicAttrs,
            parentId: this.parentId
        }
    }

    //恢复快照信息
    recoverSnapshoot(snapshoot) {
        if (snapshoot) {
            //debugger
            if (snapshoot.id) {
                this.editor.componentsStore.removeComponentById(this.id);
                this.id = snapshoot.id;
                this.editor.componentsStore.addComponentById(this.id, this);
            }
            if (snapshoot.attrs && snapshoot.attrs.code) {
                this.editor.componentsStore.removeCompoentCode(snapshoot.attrs.code);
                // this.id = snapshoot.id;
                this.editor.componentsStore.addComponentIdByCode(snapshoot.attrs.code, this.id);
                if (this.hasValue === undefined || this.hasValue === true) {//是否通过code注册value，例如表单组件有code但是没有value，不需要注册
                    this.editor.$set(this.editor.formData, snapshoot.attrs.code, this.value)//snapshoot.value;
                }

                // this.value = snapshoot.value;
            }
            this.name = snapshoot.name;
            this.type = snapshoot.type;
            this.style = snapshoot.style;
            this.attrs = snapshoot.attrs;
            this.basicAttrs = snapshoot.basicAttrs;
            this.parentId = snapshoot.parentId;
        }
    }


    getChildrenIds() {
        return [];
    }


    getDataControl() {
        return null;
    }


    getButtonInfo() {
        return null;
    }


    //设置parentid
    setParentId(parentId) {
        this.parentId = parentId
    }

    //删除本元素
    remove() {
        if (this.parentId == 'pageRoot') {
            this.editor.mainLayout = ''
        } else {
            const parent = this.editor.getComponentById(this.parentId);
            parent.removeChild(this.id);

        }
        this.editor.componentsStore.removeComponentById(this.id);
        this.editor.componentsStore.removeCompoentCode(this.attrs.code);
        this.reRender();
    }

    //获取页面表单数据（全局数据，与表单无关）
    getFormData() {
        return this.editor.formData
    }

    //获取表单字段数据
    getFieldValue(field) {
        return this.editor.getFieldValue(field);
    }

    //重新触发formdata改变事件，
    reChangeFormData() {
        this.editor.formData = {...this.editor.formData}
        if (this.editor.dialogConfig && this.editor.dialogConfig.$propsFun) {
            this.editor.dialogConfig.props = this.editor.dialogConfig.$propsFun();
        }
    }

    $set(item, key, value) {
        this.editor.$set(item, key, value);
    }

    //重新触发render
    reRender() {
        this.reChangeFormData();
        this.editor.$set(this.editor, "reRenderTime", new Date().getTime() + "");
    }

    //获取自定义执行脚本上下文数据
    getScriptContext() {
        return this.editor.getScriptContext()
    }

    //获取脚本中组件元素public作用域，不再直接暴露出原始对象给开发人员
    getPublicScope() {
        return this;
    }


    getComponentsStore() {
        return this.editor.componentsStore
    }

    //获取元素元数据
    getComponentMetaByName(name) {
        return this.editor.getComponentMetaByName(name)
    }

    //获取组件元素
    getComponentById(id) {
        return this.editor.getComponentById(id)
    }

    getComponentClassByName(name) {
        return this.editor.getComponentClassByName(name)
    }

    //获取正在拖拽的元素类型
    getEditorDragingType() {
        return this.editor.dragingType
    }

    //获取正在拖拽
    getEditorDragingName() {
        return this.editor.dragingName
    }

    getEditorDragingComponent() {
        return this.editor.dragingComponent
    }

    setEditorDragingComponent(dragingComponent) {
        this.editor.dragingComponent = dragingComponent
    }

    onDragOver(evt, stop = true) {
        if (stop) {
            evt.stopPropagation()
        }

        this.editor.parentId = this.id;
        const item = this.editor.getComponentMetaByName(this.editor.dragingName)
        if (item) {
            if (item.dragable(this.type, this.name)) {
                if (stop) {
                    evt.preventDefault()
                }
            }
        }
    }

    onDrop(evt) {
        if (this.editor.dragingComponent && this.editor.dragingComponent.parentId) {
            this.getComponentById(this.editor.dragingComponent.parentId).removeChild(this.editor.dragingComponent.id);
            //this.editor.dragingComponent.remove();
        }
        this.editor.dragingComponent.setParentId(this.id)
        evt.stopPropagation()
        evt.preventDefault()
        this.editor.dragingComponent.onClick(evt)
    }

    /**
     * 键盘事件
     * @param evt
     */
    onKeyUp(evt) {
        var keyNum = window.event ? evt.keyCode : evt.which;
        if (keyNum == 46) {
            this.remove();
            this.editor.operateBar = null;
            this.editor.clickedELe = null;
            evt.stopPropagation()

        }
        evt.preventDefault()
    }

    /**
     * 点击事件
     * @param evt
     */
    onClick(evt) {
        this.editor.eleClick(evt, this);
        evt.stopPropagation()
        evt.preventDefault()
    }

    setStyle(style) {
        this.style = style;
    }

    getStyleString(...ignores) {
        let style = this.style;
        let str = "";
        for (let name in style) {
            if (ignores.indexOf(name) == -1) {
                str += `${name}:${style[name]};`
            }
        }
        return str;
    }

    setAttrs(attrs) {
        let before = this.attrs
        let after = attrs
        if (this.attrsChange(before, after)) {
            this.attrs = attrs;
        }
    }

    attrsChange(before, after) {
        if (this.getComponentMetaByName(this.name).attrs().find(item => item.key == "code")) {
            if (before.code != after.code) {

                //检查编码是否已经存在
                if (this.getComponentsStore().checkComponentCode(after.code)) {
                    Message.warning("编码已存在,请检查!")
                    this.attrs.code = before.code;
                    return false
                }


                if (before.code != undefined && before.code != null) {
                    if (this.hasValue === undefined || this.hasValue === true) {//是否通过code注册value，例如表单组件有code但是没有value，不需要注册
                        delete this.editor.formData[before.code]
                    }

                    this.getComponentsStore().removeCompoentCode(before.code)
                }
                this.getComponentsStore().addComponentIdByCode(after.code, this.id);
                if (this.hasValue === undefined || this.hasValue === true) {
                    this.editor.$set(this.editor.formData, after.code, this.value);
                }

            }
            return true
        }
        return true;
    }

    setBasicAttrs(attrs) {
        this.basicAttrs = attrs;
    }

    getBasicAttrs() {
        return this.basicAttrs
    }

    additionAttrsRender(h) {
        return ""
    }

    checkAttrsCode() {
        if (!this.attrs.code) {
            Message.warning("请先输入组件编码！")
            return false
        }
        return true;
    }


    pageReadonly() {
        return this.editor.readonly ? true : false
    }

    getRefName() {
        return this.type + ":" + this.name + ":" + this.id;
    }

    //根据编码获取vue组件
    getVueComponent(code) {
        const comp = this.getComponentsStore().getComponentByCode(code);
        if (comp) {
            return this.editor.$refs[comp.getRefName()]
        }
    }


    //把字符串解析成函数
    resolveFunctionString(item, strfield, funfield) {
        if (!item[strfield]) {
            return
        }
        const script = new IceScript(item[strfield].editExpress, item[strfield].buildExpress)
        const action = script.getFunAction();
        item[funfield] = (...params) => {
            if (action && typeof action == 'function') {
                action.call(this.getScriptContext(), ...params)
            }
        };

    }

    //把字符串解析成表达式
    resolveExpressString(item, strfield, funfield) {
        if (!item[strfield] && item[strfield] !== true) {
            return
        }
        const script = new IceScript(item[strfield].editExpress, item[strfield].buildExpress)
        const express = script.getFunAction();
        item[funfield] = (...params) => {
            if (express && typeof express == 'function') {
                return express.call(this.getScriptContext(), ...params)
            }
        };
    }

    execFunction(iceScript, ...params) {
        if (!iceScript) {
            return null;
        }

        const script = new IceScript(iceScript.editExpress, iceScript.buildExpress)
        const action = script.getFunAction();

        if (action && typeof action == 'function') {
            return action.call(this.getScriptContext(), ...params)
        } else {
            return null
        }


    }

}