import VXETable from "vxe-table";
import XEUtils from "xe-utils";
import beforeDelete from "../ajaxHandler/deleteHandler";


VXETable.commands.add('remove_row', (params, event, row) => {
    let {$table} = params
    $table.remove(row)
})
