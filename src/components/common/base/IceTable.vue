<script>

    import grid from 'vxe-table/lib/grid'
    import VXETable from 'vxe-table'
    import XEUtils from "xe-utils";
    import IcePagination from '@/components/common/base/IcePagination'
    import CommonUtil from '@/utils/common'
    import {UtilTools, Buttons, DomTools} from "vxe-table/lib/tools";
    import emitter from 'element-ui/src/mixins/emitter';

    const methods = {}
    const propKeys = Object.keys(grid.props)

    // console.log("methods", grid.methods)
    Object.keys(grid.methods).forEach(name => {
        methods[name] = function () {
            //console.log("context", this.$refs.iceTable)
            return this.$refs.vxeGrid[name].apply(this.$refs.vxeGrid[name], arguments)
        }
    })

    //扩展属性
    export const expandProps = {
        maxPagerSize: [Boolean, Number],//最大分页查询，表示网格本身不分页但是调用分页接口数据，默认10W
        printRefProp: String
    }

    //扩展方法
    export const expandMethods = ['getLabelData']

    export default {
        name: "IceTable",
        mixins: [emitter],
        props: {
            ...grid.props,
            ...expandProps
        },
        data() {
            return {
                quickQueryValue: ""
            }
        },
        methods: {
            ...methods,
            renderPager(h) {
                if (this.maxPagerSize) {
                    return null
                }
                let {pagerProps} = this.$refs.vxeGrid || {}
                return h("div", {class: "pagination", style: 'margin:0;'}, [
                    h('ice-pagination', {
                            props: pagerProps,
                            on: {
                                'size-change': this.icePaginationSizeChange,
                                'current-change': this.icePaginationCurrentChange
                            },
                            ref: 'pager'
                        }
                    )]
                )
            },
            renderButtons({$grid, $table}) {
                const {buttons = []} = $grid.toolbar
                return buttons.map(item => {


                    const visible = CommonUtil.getFuncValueOrDefault(item.visible, true, $grid)
                    if (visible == false) {
                        return null;
                    }


                    if (item.dropdowns && item.dropdowns.length) {

                        return <el-dropdown placement="bottom">
                            <el-button  {...{
                                props: {
                                    ...item,
                                    type: item.type ? item.type : "primary",
                                    disabled: CommonUtil.getFuncValueOrDefault(item.disabled, false, $grid),
                                    loading: CommonUtil.getFuncValueOrDefault(item.loading, false, $grid)
                                }
                            }}> {UtilTools.getFuncText(item.name)}<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                {
                                    item.dropdowns.filter(dropdown => CommonUtil.getFuncValueOrDefault(dropdown.visible, true, $grid) !== false).map(dropdown => {
                                        return <el-dropdown-item {...{
                                            nativeOn: {
                                                click: evnt => this.btnEvent(evnt, dropdown)
                                            }
                                        }} command={dropdown.code}>{UtilTools.getFuncText(dropdown.name)}</el-dropdown-item>
                                    })
                                }
                            </el-dropdown-menu>
                        </el-dropdown>

                    } else {
                        return <el-button {...{
                            on: {
                                click: evnt => this.btnEvent(evnt, item)
                            },
                            props: {
                                ...item,
                                type: item.type ? item.type : 'primary',
                                disabled: CommonUtil.getFuncValueOrDefault(item.disabled, false, $grid),
                                loading: CommonUtil.getFuncValueOrDefault(item.loading, false, $grid)
                            },
                        }}>{UtilTools.getFuncText(item.name)}</el-button>
                    }
                })
            },
            btnEvent(evnt, item) {
                let $grid = this.$refs.vxeGrid
                let $table = this.$refs.vxeGrid.$refs.xTable
                let {code, click} = item
                if (click && typeof click == 'function') {
                    click(item, evnt)
                } else {
                    $grid.triggerToolbarBtnEvent(item, evnt)
                }

            },
            renderRightTools(h) {
                return this.showQuickQuery ? h("el-input", {
                    nativeOn: {
                        keyup: arg => arg.keyCode === 13 && this.doQuickQuery(arg)
                    },
                    attrs: {
                        placeholder: "关键字快速搜索"
                    },
                    model: {
                        value: this.quickQueryValue,
                        callback: value => {
                            this.quickQueryValue = value
                        }
                    }
                }, [<i onClick={this.doQuickQuery} slot="suffix"
                       class="el-input__icon el-icon-search"></i>]) : null
            },
            doQuickQuery(evt) {
                let $grid = this.$refs.vxeGrid
                if (XEUtils.isString(this.quickQueryValue)) {
                    $grid.commitProxy("query", evt, {
                        quickQuery: true,
                        quickQueryValue: this.quickQueryValue.trim()
                    })
                }
            },
            icePaginationSizeChange(pageSize) {
                let {tablePage} = this.$refs.vxeGrid
                this.pageChangeEvent({type: 'page-change', currentPage: tablePage.currentPage, pageSize})
            }
            ,
            icePaginationCurrentChange(pageNum) {
                let {tablePage} = this.$refs.vxeGrid
                this.pageChangeEvent({type: 'current-change', currentPage: pageNum, pageSize: tablePage.pageSize})
            },
            getLabelData(columns = []) {

                const $grid = this.$refs.vxeGrid
                const $xetable = $grid.$refs.xTable
                const datas = $grid.getTableData().fullData
                const {scrollXLoad, scrollYLoad} = $xetable
                const tableFullColumns = $grid.getColumns();
                columns = columns && columns.length ? tableFullColumns.filter(item => columns.indexOf(item.property) > -1) : tableFullColumns


                columns = columns.filter(item => item.title).filter(item => item.own._type != 'button')

                return {
                    head: columns.map(item => {
                        return {
                            prop: item.property,
                            title: item.title
                        }
                    }),
                    data: datas.map((row, rowIndex) => {
                        const item = {}
                        columns.forEach((column, columnIndex) => {
                            let cellValue = ''

                            switch (column.type) {
                                // v3.0 废弃 type=index
                                case 'seq':
                                case 'index':
                                    cellValue = rowIndex + 1
                                    break
                                case 'selection':
                                case 'checkbox':
                                    cellValue = $xetable.isCheckedByCheckboxRow(row)
                                    break
                                case 'radio':
                                    cellValue = $xetable.isCheckedByRadioRow(row)
                                    break
                                default:
                                    if (scrollXLoad || scrollYLoad) {
                                        // 如果是虚拟滚动
                                        const {cellRender, editRender} = column
                                        let exportLabelMethod
                                        if (editRender && editRender.name) {
                                            const compConf = VXETable.renderer.get(editRender.name)
                                            if (compConf) {
                                                exportLabelMethod = compConf.editCellExportMethod
                                            }
                                        } else if (cellRender && cellRender.name) {
                                            const compConf = VXETable.renderer.get(cellRender.name)
                                            if (compConf) {
                                                exportLabelMethod = compConf.cellExportMethod
                                            }
                                        }
                                        cellValue = exportLabelMethod ? exportLabelMethod({
                                            $table: $xetable,
                                            row,
                                            column
                                        }) : UtilTools.getCellLabel(row, column, {$table: $xetable})
                                    } else {
                                        const cell = DomTools.getCell($xetable, {row, column})
                                        cellValue = cell ? cell.innerText.trim() : UtilTools.getCellLabel(row, column, {$table: $xetable})
                                    }
                            }


                            item[column.property] = XEUtils.toString(cellValue)
                        })
                        return item
                    })
                }
            }
        },
        mounted() {
            //解决refs引用，修复bug动态计算高度
            this.$refs.vxeGrid.$refs.pager = this.$refs.pager
            this.dispatch("IceFlowForm", 'printFormItemRegist', {key: this.prop, ref: this})
        }
        ,
        render(h) {
            return h("vxe-grid", {
                ref: "vxeGrid",
                on: this.$listeners,
                scopedSlots: {
                    ...this.$scopedSlots,
                    pager: _ => this.renderPager(h),
                    buttons: this.renderButtons,
                    tools: _ => this.renderRightTools(h),
                },
                props: {
                    ...this.$props,
                    columns: this.$props.columns.map(column => {
                        if (column.type === 'seq') {
                            column.headerClassName = "ice-index-header"
                            column.className = "ice-index-header"
                            column.width = 36
                        } else if (column.type === 'checkbox') {
                            column.headerClassName = "ice-checkbox-header"
                            column.className = "ice-checkbox-header"
                            column.width = 30
                        }
                        return column
                    })
                }
            })
        }
        ,
        computed: {
            tableExtendProps() {
                let rest = {}
                propKeys.forEach(key => {
                    rest[key] = this[key]
                })
                //console.log(propKeys, rest)
                return rest
            }
            ,
            showQuickQuery() {
                const hasQuickQueryColumn = this.columns.find(column => column.quickQuery)
                return !!hasQuickQueryColumn
                // return true;
            }
        }
        ,
        components: {
            IcePagination
        }
    }


</script>

