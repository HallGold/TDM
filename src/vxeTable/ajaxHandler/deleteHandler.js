import XEUtils from "xe-utils";
import render from '../render'
import Vue from "vue";

export default async function beforeDelete({$grid, options, body: {removeRecords}}) {
    // body 编辑对象
   // console.log( $grid.toolbarOpts.buttons)
    options = Object.assign({url: '', method: 'delete'}, options)
    let columns = $grid.columns;

    let primaryKey = options.primaryKey
    if (!primaryKey) {
        const primaryKeyColumn = columns.find(item => item.primaryKey)
        if (primaryKeyColumn) {
            primaryKey = primaryKeyColumn.field
        }
    }

    try {
        let result = null;
        //自定义请求
        if (options.request) {
            result = await options.request({$grid, options, body})
        } else if (options.url) {
            if (!primaryKey) {
                throw "未找到primaryKey,请维护"
            }
            const params = {}
            //console.log(primaryKey)
            //console.log(removeRecords.map(item => item))

            params[primaryKey] = removeRecords.map(item => item[primaryKey]).join(",");
            //console.log(params)
            result = await this.$axios.request({url: options.url, method: options.method, params})
        } else {
            throw "未找到删除相关配置信息"
        }

        if (options.then) {
            result = await
                options.then(result) || result
        }
        return result;

    } catch (e) {
        if (options.catch) {
            await options.catch(e)
        } else {
            console.error(e)
            Vue.prototype.$message.error(e.msg || e.message || "出错啦")
        }
        throw e;
    }
}
