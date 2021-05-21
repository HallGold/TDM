import XEUtils from "xe-utils";
import common from '@/utils/common'

/**
 * 网格表单基本元素，包括计算值、方法统一处理、事件监听等
 */
export default class BaseIceGridItem {

    constructor(renderOpts, params) {
        this.editor = null
        this.renderOpts = renderOpts
        this.params = params
        try {
            this.row = params.row
        } catch (e) {
            // debugger
        }

        this.column = params.column
        this._resolveRenderOpts()
    }

    getInitProps() {
        return {}
    }

    _resolveRenderOpts() {
        this.name = this.renderOpts.name
        this.computed = this.renderOpts.computed
        this.disabled = this.renderOpts.disabled
        this.readonly = this.renderOpts.readonly
        this.on = this.renderOpts.on
        this.props = this.renderOpts.props || {}
    }


    getBindAttrs() {
        return {
            model: {
                value: this.getValue(),
                callback: value => {
                    this.setValue(value)
                }
            },
            props: this.getProps(),
            attrs: this.getProps(),
            on: this.getListeners()
        }
    }


    getValue() {
        if (this.computed) {
            const computedValue = this.execFunction(this.computed)
            this.setValue(computedValue)
            return computedValue;
        } else {
            return XEUtils.get(this.row, this.column.property, "")
        }

    }

    setValue(value) {
        XEUtils.set(this.row, this.column.property, value)
    }


    getProps() {
        const props = {...this.getInitProps(), ...this.renderOpts.props || {}}//防止以下计算数据的时候修改到源数据
        if (this.computed) {
            props.readonly = true
        }
        for (let key in props) {
            props[key] = this.execFunction(props[key])
        }
        return props
    }


    getListeners() {
        const on = {...this.on || {}}//防止以下计算数据的时候修改到源数据
        for (let key in on) {
            on[key] = this.getFunction(on[key])
        }
        return on
    }

    //执行计算函数
    execFunction(iceScript, ...params) {
        return common.execFunctionOrGetValue(iceScript, this.getScriptContext(), ...params)
    }

    getFunction(iceScript) {
        return common.getFuncValue(iceScript)
    }

    //获取自定义执行脚本上下文数据
    getScriptContext() {
        const context = {
            row: this.row,
            data: this.params.data,
            $table: this.params.$table
        }
        if (this.params.$table && this.params.$table.pageEditor) {
            return {
                ...this.params.$table.pageEditor.getScriptContext(),
                ...context
            }
        } else {
            return context
        }
    }
}
