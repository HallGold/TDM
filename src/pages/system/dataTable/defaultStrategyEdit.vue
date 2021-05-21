<template>
    <el-dialog v-dialog-drag
               title="表默认隔离策略配置"
               custom-class="ice-dialog"
               center
               :visible.sync="dialogVisible"
               width="800px"
               append-to-body
               v-if="dialogVisible"
               :before-close="closeDialog"
               :close-on-click-modal="false">
        <ice-query-grid :gridData="gridData"
                        :gridAutoRefresh="false"
                        :pagination="false"
                        ref="grid"
                        chooseItem="multiple"
                        @selection-change="selectionChange"
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
        name: "defaultStrategyEdit",
        components: {IceQueryGrid},
        data() {
            return {
                dialogVisible: false,
                columns: [
                    {label: '策略分组', code: 'privtypeName', width: 200},
                    {label: '策略名称', code: 'privilegeName', width: 200},
                    {label: '策略描述', code: 'privilegeDesc', width: 200},
                ],
                defaultData: [],             //接受传过来的值
                gridData: [],                //组件数据
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
                /*if(this.tableData.length>0){//此处传参需要修改，待确认
                    this.$axios.post("/permission/res/table/outer/save_table_info",this.tableData).then(success=>{
                        this.$message.success("保存成功");

                    }).catch(error=>{
                        this.$message.error(error.msg);
                    });
                }else{
                    this.$message.warning("请选择数据");
                }*/
            },
            /**
             * 取消
             */
            closeDialog() {
                this.tableData = [];
                this.dialogVisible = false;
            },
            /**
             * 初始化组件部分
             */
            initComponent() {

            },
            /**
             * 打开弹窗
             */
            openDialog(defaultData) {
                this.dialogVisible = true;
                this.defaultData = defaultData;
                this.deletes(this.gridData, this.defaultData);
            },
            paramsItem() {
                alert(123);
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
