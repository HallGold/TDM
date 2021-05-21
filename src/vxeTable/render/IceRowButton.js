import VXETable from "vxe-table";
import Vue from "vue";
import XEUtils from "xe-utils";
import {UtilTools, DomTools, GlobalEvent} from "vxe-table/lib/tools";
import CommonUtil from '@/utils/common'


const btnEvent = function (evnt, item) {
    let {$grid, $table, row} = this
    let {code, click} = item
    if (click && typeof click == 'function') {
        click(item, evnt)
    } else {
        if ($grid) {
            $grid.commitProxy(item, evnt, this.row)
        }
    }

}


const renderButton = function (h, button) {
    return <el-button {...{
        on: {
            click: evnt => btnEvent.call(this, evnt, button)
        },
        props: {
            ...button,
            type: button.type ? button.type : 'text',
            disabled: CommonUtil.getFuncValueOrDefault(button.disabled, false, this.row),
            loading: CommonUtil.getFuncValueOrDefault(button.loading, false, this.row)
        },
    }}>{UtilTools.getFuncText(button.name)}</el-button>
}

const renderButtons = (h, buttons, context) => {

    if (buttons && buttons.length) {
        return buttons
            .filter(item => CommonUtil.getFuncValueOrDefault(item.visible, true, context.row))
            .map(item => renderButton.call(context, h, item))
    }
    return []
}


VXETable.renderer.add("IceRowButton", {
    renderCell(h, renderOpts, params) {
        return renderButtons(h, renderOpts.buttons, {$grid: params.$table.$xegrid, ...params})
    },
    renderDefault: (h, renderOpts, params) => {
        return renderButtons(h, renderOpts.buttons, {$grid: params.$table.$xegrid, ...params})
    }
})


