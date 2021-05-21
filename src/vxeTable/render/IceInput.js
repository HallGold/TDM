import VXETable from "vxe-table";
import IceFilterInput, {defaultConfig} from './components/IceFilterInput'
import Vue from "vue";
import IceFilterUtil from './util/IceFilterUtil'
import XEUtils from "xe-utils";
import BaseIceGridItem from "./BaseIceGridItem";

Vue.component(IceFilterInput.name, IceFilterInput)

VXETable.renderer.add("IceInput", {
    autofocus: 'input.el-input__inner',
    renderFilter(h, renderOpts, params, context) {
        return [
            <ice-filter-input render-opts={renderOpts} params={params} context={context}></ice-filter-input>
        ]
    },
    filterMethod({option, row, column}) {
        return IceFilterUtil.filterMethod({option, row, column}, resolveFilter)
    },
    renderEdit(h, renderOpts, params) {
        const input = new GridInput(renderOpts, params)
        return [
            <el-input {...input.getBindAttrs()}>
            </el-input>
        ]
    },
    renderCell(h, renderOpts, params) {
        const input = new GridInput(renderOpts, params)
        return [<span>{input.getValue()}</span>]
    },
    renderDefault: (h, renderOpts, params) => {
        const input = new GridInput(renderOpts, params)
        return [<span>{input.getValue()}</span>]
    }
})


class GridInput extends BaseIceGridItem {

}


export default function resolveFilter({field, data, filterRender}) {

    if (!filterRender) {
        return []
    }

    filterRender = Object.assign({}, defaultConfig, filterRender)

    if (filterRender.type == 'textRange') {
        const conditions = [];
        if (data.input1) {
            conditions.push({column: field, exp: ">=", value: data.input1.trim()})
        }
        if (data.input2) {
            conditions.push({column: field, exp: "<=", value: data.input2.trim()})
        }
        return conditions
    } else {
        if (!data.input1) {
            return []
        }
        let exp = 'like'
        if (filterRender.ignoreCase) {
            exp = 'upperLike'
        } else {
            exp = filterRender.exp
        }
        return [{column: field, exp, value: data.input1.trim()}]
    }

}
