<template>
    <div class="ice-container">
        <ice-query-grid
                data-url="/pms/PmsHtinfo/list"
                exportUrl="/pms/PmsHtinfo/listExport"
                exportTitle="合同信息登记"
                :operations-width="120"
                :columns="columns"
                :buttons="buttons"
                :query="query"
                :operations="operations"
                ref="grid">
        </ice-query-grid>
        <ht-detail ref="htdetail" :to-flow="view"></ht-detail>
    </div>
</template>

<script>

    import moment from 'moment';
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import {SBZT} from "../../../utils/constant";
    import htDetail from "../detail/htDetail"

    export default {
        components: {IceQueryGrid, htDetail},
        data() {
            return {
                editPageUrl: '/pms/htgl/htdj_flow',

                query: [
                    {type: 'input', code: 'htname', label: '合同名称', value: ''},
                    {type: 'input', code: 'htcode', label: '合同编号', value: ''},
                    {type: 'input', code: 'htjf', label: '甲方', value: ''},
                    {type: 'input', code: 'htyf', label: '乙方', value: ''},
                    // {type: 'input', code: 'htje', label: '合同金额', value: ''},
                    // {type: 'input', code: 'htNum', label: '份数', value: ''},
                    {type: 'input', code: 'htrw', label: '合同概要', value: ''},
                    {type: 'date', code: 'dateCreate', label: '合同签订日期', exp: '='},
                    {type: 'date', code: 'dateStart', label: '合同生效日期', exp: '='},
                    {type: 'date', code: 'dateEnd', label: '合同终止日期', exp: '='},
                    {type: 'select', code: 'htlx', label: '合同类型', mapTypeCode: 'HTLX'},
                    {type: 'select', code: 'htzt', label: '合同状态', mapTypeCode: 'HTZT'},
                    {
                        type: 'select',
                        code: 'dataSecretLevcode',
                        label: '密级',
                        value: '',
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                    {type: 'select', code: 'sbzt', label: '上报状态', value: '', mapTypeCode: 'SBZT'},
                    {type: 'select', code: 'spzt', label: '审批状态', value: '', mapTypeCode: 'SPZT'},

                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'dateRemark', hidden: true},
                    {label: '合同名称', code: 'htname', width: 160},
                    {label: '合同编号', code: 'htcode', width: 140},
                    {label: '甲方', code: 'htjf', width: 120},
                    {label: '乙方', code: 'htyf', width: 120},
                    {label: '合同金额（元）', code: 'htje', width: 120},
                    {
                        label: '合同签订日期', code: 'dateCreate', width: 130, sortable: true, formatter(row) {
                            return moment(row.dateCreate).format('YYYY-MM-DD');
                        }
                    },
                    {
                        label: '合同生效日期', code: 'dateStart', width: 130, sortable: true, formatter(row) {
                            return moment(row.dateStart).format('YYYY-MM-DD');
                        }
                    },
                    {
                        label: '合同终止日期', code: 'dateEnd', width: 130, sortable: true, formatter(row) {
                            return moment(row.dateEnd).format('YYYY-MM-DD');
                        }
                    },
                    {label: '合同类型', code: 'htlx', width: 100, mapTypeCode: 'HTLX'},
                    {label: '份数', code: 'htNum', width: 80},
                    {label: '合同概要', code: 'htrw', width: 100},
                    {label: '登记部门', code: 'htdept', width: 120, hidden: true},
                    {label: "登记部门", code: "htdeptCode", width: 130, sortable: true, cusMapTypeCode: "DEPT"},
                    {label: '密级', code: 'dataSecretLevcode', mapTypeCode: 'DATA_SECRET_LEVEL', width: 100},
                    {label: '合同状态', code: 'htzt', width: 120, mapTypeCode: 'HTZT'},
                    {label: '上报状态', code: 'sbzt', width: 120, mapTypeCode: 'SBZT'},
                    {label: '审批状态', code: 'spzt', width: 120, mapTypeCode: 'SPZT'},
                ],
                buttons: [
                    {
                        name: '刷新',
                        icon: 'el-icon-refresh',
                        type: 'success',
                        callback: this.refresh
                    },
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem},
                    {name: '导出', ctrlCode: "BDC", type: 'export'},
                ],
                operations: [
                    {
                        name: '编辑', callback: this.edit, ctrlCode: "BBJ", isShow(row) {
                            if (row.sbzt == SBZT.YSB) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    },
                    {
                        name: '删除', callback: this.delete, ctrlCode: "BSC", isShow(row) {
                            if (row.sbzt == SBZT.YSB) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    },
                    // {
                    //     name: '流程', callback: this.view, ctrlCode: "BCK", isShow(row) {
                    //         if (row.sbzt == SBZT.WSB) {
                    //             return false;
                    //         } else {
                    //             return true;
                    //         }
                    //     }
                    // },
                    {
                        name: '查看', callback: this.showDetail, ctrlCode: "BCK",

                    },
                ],
            }
        },
        methods: {
            // 查看
            showDetail (row) {
                this.$refs.htdetail.getDetail(row.oid)
            },
            // 刷新
            refresh() {
                this.$refs.grid.refresh();
            },
            addItem() {
                this.$router.push({path: this.editPageUrl});
            },

            edit(row) {
                this.$router.push({path: this.editPageUrl, query: {dataId: row.oid}});
            }
            ,
            delete(row) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/pms/PmsHtinfo/del", {params: {id: row.oid}})
                        .then(result => {
                            this.$message.success("删除成功")
                            this.$refs.grid.refresh();
                        })
                        .catch(error => {
                            this.$message.error("删除失败")
                        })
                }).catch(_ => {

                })
            },
            view(row) {
                this.$router.push({path: this.editPageUrl, query: {dataId: row.oid}});
            },
        }
        ,
        computed: {}
        ,
        watch: {}
        ,
        mounted() {

        }
        ,
    }
</script>


<style scoped>

</style>
