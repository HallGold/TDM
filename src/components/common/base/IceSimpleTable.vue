<script>

    import grid from 'vxe-table/lib/grid'
    import XEUtils from "xe-utils";
    import {expandProps, expandMethods} from "./IceTable";

    const methods = {}
    const propKeys = Object.keys(grid.props)

    // console.log("methods", grid.methods)
    Object.keys(grid.methods).forEach(name => {
        methods[name] = function () {
            //console.log("context", this.$refs.iceTable)
            return this.$refs.iceTable[name].apply(this.$refs.iceTable[name], arguments)
        }
    })


    expandMethods.forEach(name => {
        methods[name] = function () {
            return this.$refs.iceTable[name].apply(this.$refs.iceTable[name], arguments)
        }
    })

    const defaultProxyConfig = {
        sort: true,
        filter: true,
        ajax: {
            // 任何支持 Promise API 的库都可以对接（fetch、jquery、axios、xe-ajax）
            query: {},

        }
    }


    const simpleTableColumnResolver = (column, editable) => {
        let renderName = ''
        column._type = column._type ? column._type : column.type
        switch (column._type) {
            //vxetable自带类型不处理
            case "seq":
            case "checkbox":
            case "radio":
            case "expand":
            case "html":
                return column;
            case "button":
                column.type = null
                column.cellRender = column.cellRender ? column.cellRender : {
                    name: "IceRowButton",
                    buttons: column.buttons
                }
                column.editRender = null
                return column;
            case "input":
                renderName = "IceInput"
                break;
            case "select":
                renderName = "IceSelect"
                break;
            case "number":
                renderName = "IceNumber"
                break;
            case "date":
                renderName = "IceDate"
                break;

            case "file":
                renderName = "IceFile"
                break;
            default:
                renderName = "IceInput"
        }

        if (editable && column.editable !== false) {
            column.editRender = column.editRender ? column.editRender : (column.editable === false ? null : {
                name: renderName,
                ...column.editProps,
                props: {
                    ...column.props,
                    ...XEUtils.get(column, 'editProps.props', {})
                }
            })
        } else {
            column.cellRender = column.cellRender ? column.cellRender : {
                name: renderName,
                ...column.cellProps,
                props: {
                    ...column.props,
                    ...XEUtils.get(column, 'cellProps.props', {})
                }
            }
        }

        if (!column.filterRender) {
            if (column.filterable) {

                if (renderName === 'IceInput' || renderName === 'IceNumber' || renderName === 'IceDate') {
                    column.filters = [{data: {}}]
                } else {
                    column.filters = [{data: ""}]
                }

                column.filterRender = {
                    name: renderName,
                    ...column.filterProps,
                    props: {
                        ...column.props,
                        ...XEUtils.get(column, 'filterProps.props', {})
                    }
                }
            }
        }


        if (column.renderCell) {
            column.slots = {
                // 使用 JSX 渲染函数
                default: (data, h) => {

                    const cell = column.renderCell(h, data);
                    // console.log(cell)
                    if (XEUtils.isArray(cell)) {
                        return cell
                    } else {
                        return [cell]
                    }
                }
            }
        }
        column.type = null
        return column;
    }


    export default {
        name: "IceSimpleTable",
        props: {
            //启用远程查询
            remoteQuery: Boolean,
            //启用远程分页
            remotePager: Boolean,
            //查询URL
            queryUrl: String,
            //表格是否可编辑
            editable: Boolean,
            ...grid.props,
            toolbar: [Boolean, Object, Array],
            ...expandProps,
            autoLoad: {//自动加载数据
                type: Boolean,
                default: true
            },

        },
        data() {
            return {}
        },
        methods: {
            ...methods,
        },
        computed: {
            tableExtendProps() {
                let rest = {}
                propKeys.forEach(key => {
                    rest[key] = this[key]
                })
                rest.maxPagerSize = this.maxPagerSize
                //console.log(propKeys, rest)
                return rest
            },
            defaultSortConfig() {
                let {defaultSort, field} = this.columns.find(item => item.defaultSort)
                if (XEUtils.isBoolean(defaultSort) && defaultSort === true) {
                    return {
                        field,
                        order: 'asc'
                    }
                } else if (XEUtils.isString(defaultSort)) {
                    return {
                        field,
                        order: defaultSort
                    }
                }
            },
            computedPagerConfig() {
                if (this.pagerConfig) {
                    return this.pagerConfig
                }

                if (this.remotePager) {

                    if (XEUtils.isNumber(this.maxPagerSize)) {
                        return {pageSize: this.maxPagerSize}
                    }

                    if (this.maxPagerSize === true) {
                        return {pageSize: 100000}
                    }
                    return {}
                }

                return null
            }
        },
        watch: {},
        mounted() {

        },
        render(h) {
            return h("ice-table", {
                ref: "iceTable",
                class: this.$attrs.class,
                style: this.$attrs.style,
                on: this.$listeners,
                scopedSlots: this.$scopedSlots,
                props: {
                    ...this.tableExtendProps,
                    //排序配置
                    sortConfig: this.sortConfig ? {defaultSort: this.defaultSortConfig, ...this.sortConfig} : this.remoteQuery ? {
                        remote: true,
                        defaultSort: this.defaultSortConfig
                    } : null,
                    //过滤配置
                    filterConfig: this.filterConfig ? this.filterConfig : this.remoteQuery ? {remote: true} : null,
                    //分页配置
                    pagerConfig: this.computedPagerConfig,
                    //数据代理配置
                    proxyConfig: this.proxyConfig ? this.proxyConfig : this.queryUrl ? {
                        ...defaultProxyConfig,
                        autoLoad: this.autoLoad,
                        sort: this.remoteQuery,
                        filter: this.remoteQuery,
                        ajax: {
                            query: {
                                url: this.queryUrl
                            }
                        }
                    } : null,
                    //编辑配置
                    editConfig: this.editConfig ? this.editConfig : this.editable ? {} : null,
                    //toolbar配置
                    toolbar: !XEUtils.isArray(this.toolbar) ? this.toolbar : {
                        buttons: this.toolbar,
                        refresh: true, // 刷新按钮
                        zoom: true, // 最大化按钮
                    },
                    //默认自动
                    resizable: XEUtils.eqNull(this.resizable) ? true : this.resizable,
                    //网格列信息
                    columns: this.columns.map(item => simpleTableColumnResolver(item, this.editable)),
                    //指定主键所在的列
                    rowId: (this.columns.find(item => item.primaryKey) || {}).field
                }
            })
        },
        components: {}
    }

</script>


<style scoped>

</style>
