<template>
    <div class="ice-container">
        <ice-query-grid
                data-url="/pms/QisCpzlps/list"
                :operations-width="120"
                :columns="columns"
                :buttons="buttons"
                :query="query"
                :operations="operations"
                :operationsWidth=200
                ref="grid">
        </ice-query-grid>
        <ice-dialog title="附件列表" :visible.sync="visible" width="800px">
            <ATTACHMENT :data="attaTableData" :is-handleer="false" ref="attachment"></ATTACHMENT>
            <div class="ice-button-bar">
                <el-button type="info" @click="visible=false">关闭</el-button>
            </div>
        </ice-dialog>
        <ps-detail ref="detail" :to-flow="view"></ps-detail>

    </div>
</template>

<script>

    import moment from 'moment';
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import ATTACHMENT from "../../pms/common/ATTACHMENT";
    import {SBZT, SPZT} from "../../../utils/constant";
    import  psDetail from './details/psDetail'

    export default {
        components: {ATTACHMENT, IceQueryGrid, psDetail},
        data() {
            return {

                visible: false,
                attaTableData: [],

                editPageUrl: '/qis/zlaqjdfx/cpzlsp_flow',

                query: [
                    {type: 'input', code: 'scxmName', label: '生产项目名称', value: ""},
                    {type: 'input', code: 'jhName', label: '计划名称', value: ""},
                    {type: 'input', code: 'jhzc', label: '组次', value: ""},
                    {type: 'input', code: 'scdw', label: '承制单位', value: ""},
                    {type: 'input', code: 'psdd', label: '评审地点', value: ""},
                    {type: 'date', code: 'pssj', label: '评审时间', value: ""},
                    {type: 'select', code: 'pslx', label: '评审类型', mapTypeCode: "PSLX", value: ""},
                    {type: 'input', code: 'sqly', label: '申请理由', value: ""},
                    {type: 'select', code: 'dataSecretLevcode', label: '密级',  value: '', mapTypeCode: 'DATA_SECRET_LEVEL'},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'sbzt', hidden: true},
                    {code: 'spzt', hidden: true},
                    {label: '生产计划组次', code: 'jhzc', width: 300, formatter(row) {
                            return `${row.scxmName}/${row.jhName}/${row.jhzc}`;
                        }},
                    {label: '承制单位', code: 'scdw', width: 200, hidden: true},
                    {label: '承制单位', code: 'scdwCode', width: 200, cusMapTypeCode: 'DEPT'},
                    {label: '评审地点', code: 'psdd', width: 200},
                    {
                        label: '评审时间', code: 'pssj', width: 150, sortable: true, formatter(row) {
                            return row.pssj ? moment(row.pssj).format('YYYY-MM-DD') : '';
                        }
                    },
                    {label: '评审类型', code: 'pslx', width: 100, mapTypeCode: 'PSLX'},
                    {label: '项目名称', code: 'scxmName', width: 100, hidden: true},
                    {label: '计划名称', code: 'jhName', width: 100, hidden: true},
                    {label: '申请理由', code: 'sqly', width: 200},
                    {label: '密级', code: 'dataSecretLevcode', mapTypeCode: 'DATA_SECRET_LEVEL', width: 50},
                ],
                buttons: [
                    {
                        name: '刷新',
                        icon: 'el-icon-refresh',
                        type: 'success',
                        callback: this.refreshGrid
                    },
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem},
                ],
                operations: [
                    {
                        name: '编辑', callback: this.edit, ctrlCode: "BBJ", isShow(row) {
                            if (row.sbzt == SBZT.WSB) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    {
                        name: '删除', callback: this.delete, ctrlCode: "BSC", isShow(row) {
                            if (row.sbzt == SBZT.WSB) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    {
                        name: '查看', callback: this.showDetail, ctrlCode: "BCK"
                    },
                    {name: '附件', callback: this.atta, ctrlCode: "BFJ"},
                ],
            }
        },
        methods: {
            // 刷新
            refreshGrid() {
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
                    this.$axios.delete("/pms/QisCpzlps/del", {params: {id: row.oid}})
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
// 查看
            showDetail (row) {
                this.$refs.detail.getDetail(row.oid)
            },
            atta(row) {
                this.visible = true;
                this.getXtFjData(row.oid)
            },

            // 获取系统附件数据
            getXtFjData(boid) {
                this.attaTableData = [];
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: boid}})
                    .then(result => {
                        result.data.map(d => {
                            this.attaTableData.push(d);
                        });
                    })
                    .catch(error => {
                        this.$message.error("获取系统附件数据失败！")
                    })
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