import VXETable from 'vxe-table'
import beforeDelete from '../ajaxHandler/deleteHandler'
import beforeSave from '../ajaxHandler/saveHandler'
import XEUtils from "xe-utils";
import GlobalConfig from "vxe-table/lib/conf/index";

VXETable.commands.add('save_row', (params, event, row) => {
    let {$table, $grid, code, button} = params
    // debugger
    const saveOptions = XEUtils.get($grid, "proxyConfig.ajax.save", {})

    let isMsg = $grid.isMsg;
    let updateRecords = $grid.getUpdateRecords() || []
    let insertRecords = $grid.getInsertRecords() || []
    //updatedRecords


    if (updateRecords.indexOf(row) != -1) {
        updateRecords = [row]
    }
    if (insertRecords.indexOf(row) != -1) {
        insertRecords = [row]
    }


    return new Promise(resolve => {
        $table.validate([row], vaild => {
            if (vaild) {
                if (insertRecords.length || updateRecords.length) {


                    $grid.tableLoading = true
                    resolve(beforeSave.apply($grid, [{
                        $grid: $grid,
                        options: saveOptions,
                        body: {insertRecords, updateRecords, removeRecords: [], pendingRecords: []}
                    }]).then(result => {
                        //$grid.tableLoading = false
                    }).catch(e => {
                        $grid.tableLoading = false
                        throw e
                    }).then(() => $table.reloadRow(row, null, null)))
                } else {
                    if (isMsg) {
                        VXETable.$modal.message({
                            id: code,
                            message: GlobalConfig.i18n('vxe.grid.dataUnchanged'),
                            status: 'info'
                        })
                    }
                    resolve()
                }

            }
        })
    })


    //console.log(params, event)
})
