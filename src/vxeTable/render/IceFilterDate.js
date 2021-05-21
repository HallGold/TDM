import VXETable from "vxe-table";
import IceFilterDate, {defaultConfig} from './components/IceFilterDate'
import Vue from "vue";
import IceFilterUtil from "./IceFilterUtil";

Vue.component(IceFilterDate.name, IceFilterDate)

VXETable.renderer.add("IceFilterDate", {
    renderFilter(h, renderOpts, params, context) {
        return [
            <ice-filter-date render-opts={renderOpts} params={params} context={context}></ice-filter-date>
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
