import VXETable from "vxe-table";

const selectValidEvent = async $table => {
    let selectRecords = $table.getCheckboxRecords()
    if (selectRecords.length > 0) {
        const errMap = await $table.validate(selectRecords).catch(errMap => errMap)
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
    } else {
        this.$XModal.message({status: 'warning', message: '未选中数据！'})
        return ['未选中数据']
    }
}


/**
 * 数据完整性校验，并返回数据集
 */
VXETable.commands.add('select_validate', async (params, event) => {
    let {$table, $grid, code, button} = params

    const result = await selectValidEvent($table)

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
