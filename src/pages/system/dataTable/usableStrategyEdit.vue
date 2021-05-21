<template>
    <el-dialog v-dialog-drag
               title="表可用隔离策略选择界面"
               custom-class="ice-dialog"
               center
               :visible.sync="dialogVisible"
               width="800px"
               append-to-body
               :before-close="closeDialog"
               v-if="dialogVisible"
               :close-on-click-modal="false">
        <ice-query-grid :gridData="gridData"
                        :gridAutoRefresh="false"
                        :pagination="false"
                        ref="grid"
                        @selection-change="selectionChange"
                        chooseItem="multiple"
                        :columns="columns"></ice-query-grid>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="info" @click="closeDialog">取消</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "usableStrategyEdit",
        components: {IceQueryGrid},
        data() {
            return {
                dialogVisible: false,
                columns: [],
                tableData: [],       //勾选的数据
                gridData: [],        //组件table列的数据
                useableData: [],
                gridDataTemp: []
            }
        },
        methods: {
            selectionChange(rows) {
                this.tableData = rows;
            },
            /**
             * 保存
             */
            save() {
                this.$emit("get-data", this.tableData);
                this.closeDialog();
            },
            /**
             * 取消
             */
            closeDialog() {
                this.tableData = [];
                this.dialogVisible = false
            },
            /**
             * 打开弹窗
             */
            openDialog(useableData) {
                this.dialogVisible = true;
                this.useableData = useableData;
                this.deletes(this.gridData, this.useableData);
            },
            /**
             * 初始化组件部分
             */
            initComponent() {
                this.columns = [
                    {code: 'privilegeId', hidden: true},
                    {label: '策略分组', code: 'privtypeName', width: 200},
                    {label: '策略名称', code: 'privilegeName', width: 200},
                    {label: '策略描述', code: 'privilegeDesc', width: 200},
                ];
            },
            refresh() {
                this.$axios.get("/permission/datapriv/outer/get_all_priv").then(success => {
                    this.gridData = success.data;
                    this.gridDataTemp = success.data;
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                })
            },
            deletes(list, deleteList) {
                this.gridData = [];
                for (let i = 0; i < this.gridDataTemp.length; i++) {
                    let b = false;
                    for (let j = 0; j < deleteList.length; j++) {
                        if (deleteList[j].privilegeId == this.gridDataTemp[i].privilegeId) {
                            b = true;
                            break;
                        }
                    }
                    if (!b) {
                        this.gridData.push(this.gridDataTemp[i]);
                    }
                }
            }
        },
        mounted() {
            this.initComponent();
            this.refresh();
        }
    }
</script>

<style scoped>

</style>
