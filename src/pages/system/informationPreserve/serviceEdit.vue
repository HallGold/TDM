<template>
    <el-dialog v-dialogDrag
               title="后台服务选择"
               custom-class="ice-dialog"
               center
               :visible.sync="dialogVisible"
               width="1200px"
               append-to-body
               :loadAll="loadAll"
               :before-close="closeDialog"
               :close-on-click-modal="false">
        <service-manage :choose-item="chooseItem"
                        :isDialog="isDialog"
                        :loadAll="loadAll"
                        @selection-change="handleSelectionChange"></service-manage>
        <div class="ice-button-bar">
            <el-button type="primary" @click="save">确定</el-button>
            <el-button type="info" @click="closeDialog">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import ServiceManage from "../serviceInformation/serviceManage";

    export default {
        name: "serviceEdit",
        components: {ServiceManage},
        props: {
            isSuccess: Function,
            loadAll: {
                type: String,
                default: "N"
            }

        },
        data() {
            return {
                dataParentKey: '',
                itemType: '',
                dialogVisible: false,
                chooseItem: 'single',
                isDialog: true
            }
        },
        methods: {
            /**
             * table列选择的数据
             * @param rows
             */
            handleSelectionChange(rows) {
                this.pageOrServiceId = rows[0].oid;
            },
            /**
             * 保存
             */
            save() {
                if (this.pageOrServiceId) {
                    this.$axios.post("/permission/res/page/outer/save/func_serv_rel", {
                        pageOrServiceId: this.pageOrServiceId,
                        dataParentKey: this.dataParentKey,
                        itemType: this.itemType
                    }).then(success => {
                        this.$message.success("保存成功");
                        this.closeDialog();
                        this.isSuccess();
                    }).catch(error => {
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                    });
                } else {
                    this.$message.warning("请选择需要添加的服务");
                }

            },
            /**
             * 取消
             */
            closeDialog() {
                this.dialogVisible = false;
                this.$nextTick(() => {
                    this.isDialog = false;
                })
            },
            /**
             * 打开弹窗
             */
            openDialog(itemType, dataParentKey) {
                this.isDialog = true;
                this.dataParentKey = dataParentKey;
                this.itemType = itemType;
                this.$nextTick(() => {
                    this.dialogVisible = true;
                });
            }
        }
    }
</script>

<style scoped>

</style>
