import VXETable from "vxe-table";
import IceFilterDate, {defaultConfig} from './components/IceFilterDate'
import Vue from "vue";
import IceFilterUtil from "./util/IceFilterUtil";
import BaseIceGridItem from "./BaseIceGridItem";
import XEUtils from "xe-utils";

Vue.component(IceFilterDate.name, IceFilterDate)

VXETable.renderer.add("IceDate", {
    autofocus: 'input.el-input__inner',
    renderFilter(h, renderOpts, params, context) {
        return [
            <ice-filter-date render-opts={renderOpts} params={params} context={context}></ice-filter-date>
        ]
    },
    filterMethod({option, row, column}) {
        return IceFilterUtil.filterMethod({option, row, column}, resolveFilter)
    },
    renderEdit(h, renderOpts, params) {
        const input = new GridDate(renderOpts, params)
        return [
            <ice-date-picker  {...input.getBindAttrs()}>
            </ice-date-picker>
        ]
    },
    renderCell(h, renderOpts, params) {
        const input = new GridDate(renderOpts, params)
        return [<span>{input.getValue(true)}</span>]
    },
    renderDefault: (h, renderOpts, params) => {
        const input = new GridDate(renderOpts, params)
        return [<span>{input.getValue(true)}</span>]
    }
})

class GridDate extends BaseIceGridItem {

    _resolveRenderOpts() {
        super._resolveRenderOpts()
        this.type = this.props.type || 'date'
    }


    getValue(toString = false) {
        const value = super.getValue()
        if (toString) {
            if (XEUtils.isDate(value)) {
                return XEUtils.toDateString(value, this.getFormatter())
            } else {
                return XEUtils.toDateString(XEUtils.toStringDate(value), this.getFormatter());
            }
        }
        return value
    }

    getProps() {
        const props = super.getProps()
        props.scope = this.row
        return props
    }


    getFormatter() {
        switch (this.type) {
            case "date":
                return "yyyy-MM-dd"
            case "datetime":
                return "yyyy-MM-dd HH:mm:ss"
            default:
                return "yyyy-MM-dd"
        }
    }

}

export default function resolveFilter({field, data, filterRender}) {

    if (!filterRender) {
        return []
    }

    filterRender = Object.assign({}, defaultConfig, filterRender)

    if (filterRender.type == 'dateRange') {
        const conditions = [];
        if (data.input1) {
            conditions.push({column: field, exp: ">=", value: data.input1})
        }
        if (data.input2) {
            conditions.push({column: field, exp: "<=", value: data.input2})
        }
        return conditions
    } else {
        if (!data.input1) {
            return []
        }
        return [{column: field, exp: filterRender.exp, value: data.input1}]
    }

}
