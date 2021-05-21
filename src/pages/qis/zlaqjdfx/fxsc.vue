<template>
    <div class="ice-container">
        <ice-query-grid
                data-url="/pms/QisFxsc/list"
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
        <fxsc-detail ref="detail" :to-flow="view"></fxsc-detail>

    </div>
</template>

<script>

    import moment from 'moment';
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import XM_SELECT from "../../pms/common/XM_SELECT";
    import ATTACHMENT from "../../pms/common/ATTACHMENT";
    import { SBZT, SPZT} from "../../../utils/constant";
    import  fxscDetail from './details/fxscDetail'


    export default {
        components: {ATTACHMENT, XM_SELECT, IceQueryGrid, fxscDetail},
        data() {
            return {

                loading: false,
                visible: false,
                activeName: 'first',
                attaTableData: [],

                visibleProject: false,
                editPageUrl: '/qis/zlaqjdfx/fxsc_flow',

                query: [
                    {type: 'input', code: 'scbg', label: '审查报告', value: ""},
                    {type: 'input', code: 'scnr', label: '审查内容', value: ""},
                    {type: 'input', code: 'bzdw', label: '编制单位', value: ""},
                    {type: 'input', code: 'bzr', label: '编制人', value: ""},
                    {type: 'input', code: 'bzsj', label: '编制时间', value: ""},
                    {type: 'select', code: 'dataSecretLevcode', label: '密级',  value: '', mapTypeCode: 'DATA_SECRET_LEVEL'},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'jhzc', hidden: true},
                    {code: 'sbzt', hidden: true},
                    {code: 'spzt', hidden: true},
                    {label: '审查报告', code: 'scbg', width: 240},
                    {label: '审查内容', code: 'scnr'},
                    {label: '编制单位', code: 'bzdw', width: 150, hidden: true},
                    {label: '编制单位', code: 'bzdwCode', width: 150, cusMapTypeCode: 'DEPT'},
                    {label: '编制人', code: 'bzr', width: 150},
                    {label: '编制时间', code: 'bzsj', width: 130, sortable: true, formatter(row) {
                            return moment(row.bzsj).format('YYYY-MM-DD');
                        }},
                    {label: '密级', code: 'dataSecretLevcode', mapTypeCode: 'DATA_SECRET_LEVEL', width: 100},
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
                rules: {
                    bjdw: [
                        {required: true, whitespace: true, message: '请选择被检单位', trigger: 'blur'}
                    ],
                },
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "BBJ", isShow(row){if(row.sbzt == SBZT.WSB){return true;}else{return false;}}},
                    {name: '删除', callback: this.delete, ctrlCode: "BSC", isShow(row){if(row.sbzt == SBZT.WSB){return true;}else{return false;}}},
                    {name: '查看', callback: this.showDetail, ctrlCode: "BCK"},
                    {name: '附件', callback: this.atta, ctrlCode: "BFJ"},
                ],
            }
        },
        methods: {
            // 刷新
            refreshGrid () {
                this.$refs.grid.refresh();
            },
            addItem() {
                this.$router.push({ path: this.editPageUrl});
            },

            edit(row) {
                this.$router.push({ path: this.editPageUrl, query: { dataId: row.oid }});
            }
            ,

            delete(row) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/pms/QisFxsc/del", {params: {id: row.oid}})
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
            view(row){
                this.$router.push({ path: this.editPageUrl, query: { dataId: row.oid }});
            },
            // 查看
            showDetail (row) {
                this.$refs.detail.getDetail(row.oid)
            },
            atta(row){
                this.visible = true;
                this.getXtFjData(row.oid)
            },
            // 获取系统附件数据
            getXtFjData(boid){
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