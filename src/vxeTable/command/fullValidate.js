import VXETable from "vxe-table";


const fullValidEvent = async $table => {
    const errMap = await $table.fullValidate().catch(errMap => errMap)
    if (errMap) {
        let msgList = []
        Object.values(errMap).forEach(errList => {
            errList.forEach(params => {
                let {rowIndex, column, rules} = params
                rules.forEach(rule => {
                    msgList.push(`第 ${rowIndex} 行 ${column.title} 校验错误：${rule.message}`)
                })
            })
        })
        return msgList
    } else {
        return true
    }
}


/**
 * 数据完整性校验，并返回数据集
 */
VXETable.commands.add('full_validate', async (params, event) => {
    let {$table, $grid, code, button} = params

    const result = await fullValidEvent($table)

    const {callback, fullRecords} = button
    if (callback) {

        if (result === true) {
            if (fullRecords === true) {
                callback({
                    error: null,
                    fullRecords: $table.getTableData().fullData,
                })
            } else {
                callback({
                    error: null,
                    insertRecords: $table.getInsertRecords(),
                    removeRecords: $table.getRemoveRecords(),
                    updateRecords: $table.getUpdateRecords(),
                })
            }

        } else {
            callback({
                error: result
            })
        }

    }

})
