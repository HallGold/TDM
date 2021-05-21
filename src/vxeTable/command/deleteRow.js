import VXETable from "vxe-table";
import XEUtils from "xe-utils";
import beforeDelete from "../ajaxHandler/deleteHandler";


VXETable.commands.add('delete_row', (params, event, row) => {
    let {$table, $grid, code, button} = params

    const deleteOptions = XEUtils.get($grid, "proxyConfig.ajax.delete", {})

    $grid.tableLoading = true
    beforeDelete.apply($grid, [{
        $grid: $grid,
        options: deleteOptions,
        body: {removeRecords: [row]}
    }]).then(result => {
        //$grid.tableLoading = false
    }).catch(e => {
        $grid.tableLoading = false
        throw e
    }).then(() => $grid.commitProxy('query'))

})
