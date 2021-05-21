import XEUtils from "xe-utils";
import render from '../render'
import Vue from "vue";

export default async function beforeQuery({$grid, options, page, sort, filters},
                                          evt,
                                          quickQueryConfig,
                                          addition) {
    // page 如果有，读取当前分页的对象
    // sort 如果有，读取当前排序的条件
    // filters 如果有，读取当前筛选的条件

    let additionConditions = [], additionParams = null, remoteExport = false;


    if (addition) {
        additionConditions = addition.additionConditions || []
        additionParams = addition.additionParams
        remoteExport = addition.remoteExport || false
    }


    let {quickQuery, quickQueryValue} = {quickQuery: false, quickQueryValue: ''}
    if (quickQueryConfig) {
        quickQuery = quickQueryConfig.quickQuery
        quickQueryValue = quickQueryConfig.quickQueryValue
    }


    options = Object.assign({url: '', method: 'get', sendColumns: true}, options)
    try {
        let result = null;
        //自定义请求
        if (options.request) {
            result = await
                options.request({$grid, options, page, sort, filters}, evt, {quickQuery, quickQueryValue})
        } else if (options.url) {

            const params = {};
            //分页信息
            if (!XEUtils.isEmpty(page)) {
                params["size"] = page.pageSize
                params["current"] = page.currentPage
            }
            //排序信息
            if (!XEUtils.isEmpty(sort) && sort.order) {
                console.log(sort)
                params['sortOrder'] = sort.order;
                params['sortColumn'] = sort.prop;
            }

            //网格列信息
            if (options.sendColumns) {
                const {fullColumn} = $grid.getTableColumn()
                if (fullColumn) {
                    const fields = fullColumn.map(item => item.own)
                        .filter(item => item.virtual !== true)
                        .filter(item => item.field)
                        .map(item => item.field)
                    params['columns'] = fields;
                }
            }

            //处理查询条件

            //快速查询
            if (quickQuery) {
                params["conditionLink"] = "OR"
                params.conditions = []
                const {fullColumn} = $grid.getTableColumn()
                //console.log(fullColumn.map(item => item.own).filter(column => column.quickQuery))
                fullColumn.map(item => item.own).filter(column => column.quickQuery).forEach(column => {
                    params.conditions.push({column: column.field, exp: 'like', value: quickQueryValue})
                })

            } else {//网格头部过滤器
                if (filters && filters.length) {
                    params["conditionLink"] = "AND"
                    params.conditions = params.conditions || []
                    filters.forEach(filter => {
                        const data = filter.datas[0]
                        if (!data) {
                            return
                        }
                        const field = filter.field;
                        const filterRender = filter.column.filterRender
                        const filterName = filterRender.name
                        const resolveFilter = render[filterName]//获取相应的filter解析函数

                        const conditions = resolveFilter({data, filterRender, field})
                        if (conditions && conditions.length) {
                            params.conditions.push(...conditions);
                        }

                    })
                }

                if (additionConditions && additionConditions.length) {
                    params["conditionLink"] = "AND"
                    params.conditions = params.conditions || []
                    params.conditions.push(...additionConditions);
                }

                if (additionParams && XEUtils.isObject(additionParams)) {
                    params["conditionLink"] = "AND"
                    params.conditions = params.conditions || []
                    params.conditions.push(...additionConditions);
                    Object.assign(params, additionParams)
                }
            }


            if (remoteExport) {
                this.$axios.request({
                    url: options.url,
                    method: options.method,
                    params,
                    headers: {'Accept': 'application/ice-xls;q=1,*/*;q=0.5'},
                    responseType: 'blob'
                })
                return {data: {records: $grid.getTableData().fullData, total: $grid.getTableData().fullData.length}}
            } else {
                result = await
                    this.$axios.request({
                        url: options.url,
                        method: options.method,
                        params
                    })
            }


        }

        if (options.then) {
            result = await
                options.then(result) || result
        }
        return result;

    } catch (e) {
        if (options.catch) {
            await
                options.catch(e)
        } else {
            console.error(e)
            Vue.prototype.$message.error(e.msg || e.message || "出错啦")
        }
        throw e;
    }
}
