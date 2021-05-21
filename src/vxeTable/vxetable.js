//vxe表格组件
import Vue from 'vue'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
/*import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'
import VXETablePluginExportPDF from 'vxe-table-plugin-export-pdf'*/

import XEUtils from "xe-utils";
import VXEUtils from 'vxe-utils'
import zhCN from 'vxe-table/lib/locale/lang/zh-CN'
import VueI18n from 'vue-i18n'
import ajaxHandler from "./ajaxHandler"

Vue.use(VueI18n)
const messages = {
    zh_CN: {
        ...zhCN
    }
}

const i18n = new VueI18n({
    locale: 'zh_CN',
    messages,
})
Vue.use(VXEUtils, XEUtils)
Vue.use(VXETable, {
    showOverflow: true,
    showHeaderOverflow: true,
    align: "center",
    headerAlign: "center",
    size: 'mini',
    rowId: 'ROW_ID',
    stripe: true,
    i18n: key => i18n.t(key),
    tooltipConfig: {
        theme: 'light',
        enterable: true
    },
    sortConfig: {
        trigger: 'cell'
    },
    keepSource: true,
    editConfig: {
        trigger: 'click',
        mode: 'row',
        showStatus: true
    },
    grid: {
        proxyConfig: {
            autoLoad: true,
            message: true,
            seq: true, // 启用动态序号代理
            props: {
                list: null,
                result: 'data.records',
                total: 'data.total'
            },
            ...ajaxHandler
        },
        pagerConfig: {
            pageSize: 20,
        }
    }
})
VXETable.use(VXETablePluginElement)
/*VXETable.use(VXETablePluginExportPDF)
VXETable.use(VXETablePluginExportXLSX)*/
import "./render"
import "./command"


