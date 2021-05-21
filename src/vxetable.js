//vxe�������
import Vue from 'vue'
import 'xe-utils'
import VXEUtils from 'vxe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
import XEUtils from "xe-utils";

Vue.use(VXEUtils, XEUtils)
Vue.use(VXETable, {
    showOverflow: true,
    showHeaderOverflow: true,
    align: "center",
    headerAlign: "center",
    size: 'mini',
    rowId: 'ROW_ID',
    stripe: true,
})
VXETable.use(VXETablePluginElement)


VXETable.renderer.add("mapTypeCode", {
    renderEdit(h, renderOpts, params) {
        let {row, column} = params
        return [
            <ice-select {...{
                model: {
                    value: XEUtils.get(row, column.property, ""),
                    callback(value) {
                        XEUtils.set(row, column.property, value)
                    }
                },
                props: renderOpts
            }}>
            </ice-select>
        ]
    },
    renderCell(h, renderOpts, params) {
        const mapTypeCode = renderOpts.mapTypeCode;
        let {row, column} = params

        return [
            <ice-datamap-translater value={XEUtils.get(row, column.property, "")} mapTypeCode={mapTypeCode}>
            </ice-datamap-translater>
        ]
    },
    renderDefault: (h, renderOpts, params) => {
        const mapTypeCode = renderOpts.mapTypeCode;
        let {row, column} = params

        return [
            <ice-datamap-translater value={XEUtils.get(row, column.property, "")} mapTypeCode={mapTypeCode}>
            </ice-datamap-translater>
        ]
    }
});