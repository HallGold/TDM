<template>
    <el-dialog v-dialogDrag
               title="服务关联表维护"
               custom-class="ice-dialog"
               center
               :visible.sync="dialogVisible"
               width="900px"
               append-to-body
               :before-close="closeDialog"
               :close-on-click-modal="false">
        <!--        :minHeight="500"-->
        <ice-query-grid :data-url="'/permission/res/service/outer/get_rel_tblandprivs?serviceId='+serviceId"
                        :columns="columns"
                        :beforeBindData="beforeBindData"
                        ref="Grid"
                        :pagination="false"
                        :operations="operations"
                        :query="query"
                        :buttons="buttons"></ice-query-grid>
        <service-configuration-edit ref="serviceConfigurationEdit" :isSuccess="refresh"></service-configuration-edit>
        <service-table-selector ref="serviceTableSelector" :isSuccess="refresh" :serviceId="serviceId"
                                :selectedPersion="selectedPersion"></service-table-selector>
        <div class="ice-button-bar ">
            <el-button type="info" @click="closeDialog">关闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import ServiceConfigurationEdit from "./serviceConfigurationEdit";
    import ServiceTableSelector from "../serviceInformation/serviceTableSelector";

    export default {
        name: "serviceCorrelationEdit",
        components: {ServiceTableSelector, ServiceConfigurationEdit, IceQueryGrid},
        data() {
            return {
                dialogVisible: false,//弹框开关属性
                serviceId: '',
                selectedPersion: [],
                arr: [],                     //储存当前列表数据，用于选择表的勾选渲染
                query: [
                    /*{type:'static',code:'serviceId ',exp:'=',value:()=>{
                        return this.id;
                        }}*/
                ],
                columns: [
                    {label: '表名', code: 'tableCode'},
                    {label: '中文名', code: 'tableName'},
                    {
                        label: '启用数据授权', code: 'dataAuthEnabled', width: 110, renderCell(h, data) {
                            return data.row.dataAuthEnabled == 'Y' ? '启用' : '停用'
                        }
                    },
                ],
                buttons: [
                    {name: '新增表', unauth:true, icon: 'el-icon-plus', type: 'primary', callback: this.addTable}
                ],
                operations: [
                    {name: '删除', unauth:true, callback: this.deleteItem},
                    {
                        name: '策略配置', unauth:true, callback: this.configurationItem, isShow: function (row) {
                            if (row.dataAuthEnabled == 'Y') {
                                return true
                            }
                            return false
                        }
                    },
                ]
            }
        },
        methods: {
            /**
             * 弹窗关闭
             */
            closeDialog() {
                this.dialogVisible = false;
            },
            beforeBindData(data) {
                this.arr = data;
                return data;
            },
            /**
             * 打开弹窗
             */
            openDialog(serviceId) {
                this.dialogVisible = true;
                this.serviceId = serviceId;
            },
            /**
             * 删除
             */
            deleteItem(row) {
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    let arr = [];
                    arr.push(row.servtblRelid);
                    let servTlbRelIds = '';
                    if (arr.length > 0) {
                        servTlbRelIds = arr.join(',')
                    }
                    this.$axios.post("/permission/res/service/outer/del_tblrel_byids", {"servTlbRelIds": servTlbRelIds}).then(success => {
                        this.$message.success("刪除成功");
                        this.refresh();
                    }).catch(error => {
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                    });
                });
            },
            /**
             * 策略配置
             */
            configurationItem(row) {
                this.$refs.serviceConfigurationEdit.openDialog(row);
            },
            /**
             * 新增表
             */
            addTable() {
                this.selectedPersion = this.arr.concat();
                this.$refs.serviceTableSelector.openDialog();
            },
            /**
             * 刷新列表
             */
            refresh() {
                this.$nextTick(() => {
                    this.$refs.Grid.refresh();
                });

            }
        }
    }
</script>

<style scoped>

</style>
