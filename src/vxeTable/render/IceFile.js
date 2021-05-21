import VXETable from "vxe-table";
import IceFilterInput, {defaultConfig} from './components/IceFilterInput'
import Vue from "vue";
import IceFilterUtil from './util/IceFilterUtil'
import XEUtils from "xe-utils";
import BaseIceGridItem from "./BaseIceGridItem";


VXETable.renderer.add("IceFile", {
    autofocus: 'input.el-input__inner',
    /*renderFilter(h, renderOpts, params, context) {
        return [
            <ice-filter-input render-opts={renderOpts} params={params} context={context}></ice-filter-input>
        ]
    },*/
    /*filterMethod({option, row, column}) {
        return IceFilterUtil.filterMethod({option, row, column}, resolveFilter)
    },*/
    renderEdit(h, renderOpts, params) {
        const input = new GridFile(renderOpts, params)
        return [
            <ice-single-upload {...input.getBindAttrs()}>
            </ice-single-upload>
        ]
    },
    renderCell(h, renderOpts, params) {
        const input = new GridFile(renderOpts, params)
        return [<ice-single-upload style="height:32px" {...input.getBindAttrs()} priorDisabled={true}>
        </ice-single-upload>]
    },
    renderDefault: (h, renderOpts, params) => {
        const input = new GridFile(renderOpts, params)
        return [<ice-single-upload style="height:32px" {...input.getBindAttrs()} priorDisabled={true}>
        </ice-single-upload>]
    }
})

function uploadSuccess(fileid, filename, filesecret) {
    console.log(fileid, filename, filesecret)
}


class GridFile extends BaseIceGridItem {
    getInitProps() {
        return {
            styleType: 'input'
        }
    }

    getListeners() {
        const on = super.getListeners()

        on.change = uploadSuccess

    }
}


export default function resolveFilter({field, data, filterRender}) {

    return []
    /*if (!filterRender) {
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
    }*/

}
