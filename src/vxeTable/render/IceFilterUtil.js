import XEUtils from "xe-utils";

export default {

    filterMethod({option, row, column}, resolveFilter) {
        const data = option.data
        const field = column.property;
        const filterRender = column.filterRender
        const conditions = resolveFilter({field, data, filterRender})
        if (conditions && conditions.length) {
            for (let i = 0; i < conditions.length; i++) {
                const condition = conditions[i];
                const value = row[field]
                const matched = this.resolveColumnFilter(condition.exp, condition.value, value)
                if (!matched) {
                    return false;
                }
            }
        }
        return true;
    },


    resolveColumnFilter(exp, inputData, fieldData) {

        if (XEUtils.eqNull(fieldData) || fieldData == '') {
            return false
        }

        if (XEUtils.eqNull(inputData) || inputData == '') {
            return true
        }

        if (exp === '=') {
            return fieldData == inputData
        }

        if (exp === '>') {
            return fieldData > inputData
        }

        if (exp === '>=') {
            return fieldData >= inputData
        }

        if (exp === '<') {
            return fieldData >= inputData
        }

        if (exp === '<=') {
            return fieldData <= inputData
        }

        if (exp === 'like') {
            return fieldData.indexOf(inputData) != -1
        }

        if (exp === 'upperLike') {
            return fieldData.toUpperCase().indexOf(inputData.toUpperCase()) != -1
        }

        if (exp === 'in') {
            return inputData.split(",").indexOf(fieldData) != -1
        }
    }




}
