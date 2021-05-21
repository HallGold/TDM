import Vue from "vue";
import XEUtils from "xe-utils";

export default async function beforeSave({$grid, options, body: {insertRecords = [], removeRecords = [], updateRecords = [], pendingRecords = []}}) {
    // body 编辑对象

    options = Object.assign({url: '', method: 'post'}, options)


    try {
        let result = null;
        //自定义请求
        if (options.request) {
            result = await options.request({$grid, options, body})
        } else if (options.url) {
            const data = {
                insertRecords,
                removeRecords,
                updateRecords,
            }

            result = await this.$axios.request({url: options.url, method: options.method, data})
        } else {
            throw "未找到保存相关配置信息"
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
