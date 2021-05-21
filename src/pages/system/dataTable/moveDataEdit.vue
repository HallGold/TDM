<template>
    <el-dialog v-dialogDrag
               title="目标分类"
               custom-class="ice-dialog"
               center
               :visible.sync="dialogVisible"
               width="600px"
               append-to-body
               :before-close="closeDialog"
               :close-on-click-modal="false">
        <el-tree :props="defaultProps"
                 :data="treeData"
                 :default-expand-all="true"
                 @node-click="checkDada"
                 node-key="oid"
                 ref="treeItem">
        </el-tree>
        <div class="ice-button-bar ">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="info" @click="closeDialog">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "moveDataEdit",
        props:{
            isSuccess:Function
        },
        data() {
            return {
                defaultProps: {//树形属性
                    label: 'tblgroupName',
                    children: 'children'
                },
                treeData: [],                    //树形节点
                treeSelect: [],                  //属性默认展开与勾选的节点
                dialogVisible: false,            //弹窗开关属性
                tblGrpId: '',                    //原表分组Id
                distTblGrpId: '',                    //目标表分组Id
                tableIds: '',                    //待移动的表Id列表
            }
        },
        methods: {
            save() {
                if (this.distTblGrpId == '-1') {
                    this.$message.warning("不能选择根节点");
                    return;
                }

                if (!this.distTblGrpId || this.distTblGrpId == '') {
                    this.$message.warning("请选择目标表分组");
                    return;
                }
                if (this.distTblGrpId == this.tblGrpId) {
                    this.$message.warning("目标表分组不能与原分组相同");
                    return;
                }

                this.$axios.post("/permission/res/table/outer/change_tbl_grp", {
                    tableIds: this.tableIds,
                    tblGrpId: this.distTblGrpId
                }).then(success => {
                    this.$message.success("保存成功");
                    this.closeDialog();
                    this.isSuccess();
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            },
            checkDada(checkNode) {
                this.distTblGrpId = checkNode.oid;
            },
            /**
             * 取消
             */
            closeDialog() {
                this.dialogVisible = false;
            },
            /**
             * 打开弹窗
             */
            openDialog(tableIds, tblGrpId) {
                this.tableIds = tableIds;
                this.tblGrpId = tblGrpId;
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$axios.get("/permission/res/table/outer/load_tblgrp_tree").then(success => {
                        this.treeData = success.data;
                    }).catch(error => {
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                    });
                });
            }
        }
    }
</script>

<style scoped>

</style>
