import VXETable from "vxe-table";
import IceFilterNumber, {defaultConfig} from './components/IceFilterNumber'
import Vue from "vue";
import IceFilterUtil from "./IceFilterUtil";

Vue.component(IceFilterNumber.name, IceFilterNumber)

VXETable.renderer.add("IceFilterNumber", {
    renderFilter(h, renderOpts, params, context) {
        return [
            <ice-filter-number render-opts={renderOpts} params={params} context={context}></ice-filter-number>
        ]
    },
    filterMethod({option, row, column}) {
        return IceFilterUtil.filterMethod({option, row, column}, resolveFilter)
    }
})


export default function resolveFilter({field, data, filterRender}) {

    if (!filterRender) {
        return []
    }

    filterRender = Object.assign({}, defaultConfig, filterRender)

    if (filterRender.type == 'numberRange') {
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
