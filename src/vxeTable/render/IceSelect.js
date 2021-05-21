import VXETable from "vxe-table";
import IceFilterSelect, {defaultConfig} from './components/IceFilterSelect'
import Vue from "vue";
import XEUtils from "xe-utils";
import IceFilterUtil from "./util/IceFilterUtil";
import BaseIceGridItem from "./BaseIceGridItem";
import store from "@/store"

import {UtilTools} from 'vxe-table/lib/tools'

Vue.component(IceFilterSelect.name, IceFilterSelect)

function getCacheKey(props) {
    let params = {}
    if (props.parentProp) {
        params[props.parentProp] = props.parentValue
    }
    return `${props.dataUrl}:${JSON.stringify(params)}`
}


VXETable.renderer.add("IceSelect", {
    renderFilter(h, renderOpts, params, context) {
        return [
            <ice-filter-select render-opts={renderOpts} params={params} context={context}></ice-filter-select>
        ]
    },
    filterMethod({option, row, column}) {
        return IceFilterUtil.filterMethod({option, row, column}, resolveFilter)
    },
    renderEdit(h, renderOpts, params) {
        const select = new GridSelect(renderOpts, params)
        return [
            <ice-select {...select.getBindAttrs()}>
            </ice-select>
        ]
    },
    renderCell(h, renderOpts, params) {
        const select = new GridSelect(renderOpts, params)
        return [
            <ice-select {...select.getBindAttrs(true)} >
            </ice-select>
        ]
    },
    renderDefault: (h, renderOpts, params) => {
        const select = new GridSelect(renderOpts, params)

        return [
            <ice-select {...select.getBindAttrs(true)} >
            </ice-select>
        ]
    },
    cellExportMethod: (params) => {
        //const select = new GridSelect(null, params)
        const {row, column} = params
        if (column.own.props) {
            const props = column.own.props
            let list = []
            if (props.mapTypeCode) {
                const getDataMap = store.getters["datamapStore/getDataMap"]
                return getDataMap(props.mapTypeCode)[UtilTools.getCellValue(row, column)]
            } else if (props.dataUrl) {
                const getCacheByKey = store.getters["cacheStore/getCacheByKey"]
                list = getCacheByKey(getCacheKey(props))
            } else if (props.options) {
                list = props.options.map(item => {
                    return {value: item[props.codeProp || 'code'], label: item[props.textProp || 'label']}
                })
            }

            const item = list.find(item => item.value == UtilTools.getCellValue(row, column))

            if (item) {
                return item.label
            } else {
                return UtilTools.getCellLabel(row, column, params)
            }
        } else {
            return UtilTools.getCellLabel(row, column, params)
        }


    }
})

class GridSelect extends BaseIceGridItem {
    getBindAttrs(onlyShow = false) {
        const attrs = super.getBindAttrs();
        attrs.props.onlyShow = onlyShow
        return attrs
    }
}

export default function resolveFilter({field, data, filterRender}) {

    if (!filterRender) {
        return []
    }

    filterRender = Object.assign({}, defaultConfig, filterRender)

    if (XEUtils.eqNull(data) || data === '') {
        return []
    }
    return [{column: field, exp: filterRender.multiple ? 'in' : '=', value: data}]

}
