<template>
    <div>
        <el-dialog v-dialogDrag
                   title="页面功能维护"
                   custom-class="ice-dialog"
                   center
                   :visible.sync="dialogVisible"
                   width="75%"
                   append-to-body
                   :before-close="closeDialog"
                   :close-on-click-modal="false">
            <div style="margin-bottom: 2px">
                <el-button @click="add" type="primary">新增</el-button>
            </div>
            <div style="height: 500px;position: relative">
                <div class="ice-full-absolute">
                    <el-table
                            class="el-table--scrollable-y"
                            :data="tableData"
                            default-expand-all
                            style="width: 100%;margin-bottom: 20px;"
                            :height="500"
                            row-key="oid">
                        <el-table-column
                                align="left"
                                prop="name"
                                label="菜单名称"
                                width="210">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="smallIconUrl"
                                label="图标"
                                width="80">
                            <template slot-scope="scope">
                                <img :src="$showImage(scope.row.smallIconUrl)" width="22px" height="22px"/>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="left"
                                prop="pageName"
                                label="页面"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                align="left"
                                prop="url"
                                label="URL">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="visible"
                                label="是否可见" width="80px">
                            <template slot-scope="scope">
                                {{scope.row.isVisiblable=='Y'?'可见':'不可见'}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="enabled"
                                label="是否启用" width="80px">
                            <template slot-scope="scope">
                                {{scope.row.enabled=='1'?'是':'否'}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="remark"
                                label="描述">
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                label="操作"
                                width="150">
                            <template slot-scope="scope">
                                <el-button @click="addItem(scope.row)" type="text" size="small">新增</el-button>
                                <el-button @click="editPageFuncItem(scope.row)" type="text" size="small">编辑</el-button>
                                <el-button @click="deleteItem(scope.row)" type="text" size="small"
                                           v-if="scope.row.children.length==0">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <!--            <div class="ice-button-bar">-->
            <!--                <el-button type="info" @click="closeDialog">关闭</el-button>-->
            <!--            </div>-->
        </el-dialog>
        <app-node-edit ref="appNodeEdit" :mainDataForm="mainDataForm" :is-edit="isEdit" :isSuccess="refresh"
                       :title="title"></app-node-edit>
    </div>
</template>


<script>
    import AppNodeEdit from "./appNodeEdit";

    export default {
        name: "appPreserveMoreEdit",
        components: {AppNodeEdit},
        data() {
            return {
                tableData: [],       //列表数据
                dialogVisible: false,
                isEdit: false,       //是否为编辑状态
                menulistId: '',
                title: '',
                appId: '',
                appCode: '',
                mainDataForm: {//表单对象
                    name: '',
                    openType: '',
                    bigIconUrl: '',
                    smallIconUrl: '',
                    pageId: '',
                    url: '',
                    isVisiblable: 'Y',
                    enabled: '1',
                    sequencing: '',
                    pageName: '',
                },
            }
        },
        methods: {
            /**
             * 新增根工能节点
             */
            add() {
                this.isEdit = false;
                this.title = '新增功能节点';
                let parentId = '-1';
                this.$refs.appNodeEdit.openDialog(parentId, this.menulistId, this.appId, this.appCode);
            },
            /**
             * 新增
             */
            addItem(row) {
                this.isEdit = false;
                this.title = '新增功能节点';
                this.$refs.appNodeEdit.openDialog(row.oid, this.menulistId, this.appId, this.appCode);
            },
            /**
             * 编辑
             */
            editPageFuncItem(row) {
                this.isEdit = true;
                this.title = '编辑功能节点';
                let obj = {};
                Object.assign(obj, row);
                this.$refs.appNodeEdit.openDialog(row.oid);
                this.$nextTick(() => {
                    if (!obj.enabled) {
                        obj.enabled = "0";
                    } else {
                        obj.enabled = this.mainDataForm.enabled.toString()
                    }
                    if(!obj.openType){
                       obj.openType = '10'
                    }
                    else{
                        obj.openType = obj.openType.toString()
                    }
                    this.mainDataForm = obj;
                })
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
                    this.$axios.delete("/permission/res/app/outer/delete/appfunc_info", {
                        params: {
                            oid: row.oid,
                            version: row.version
                        }
                    }).then(success => {
                        this.$message.success("删除成功");
                        this.refresh();
                    }).catch(error => {
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                    });
                });
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
            openDialog(menulistId, appId, appCode) {
                this.dialogVisible = true;
                this.appId = appId;
                this.appCode = appCode;
                this.menulistId = menulistId;
                this.$nextTick(() => {
                    this.refresh();
                });
            },
            refresh() {
                this.$axios.get("/permission/res/app/outer/get/appmenu_tree", {params: {menulistId: this.menulistId}}).then(success => {
                    this.tableData = success.data;
                }).catch(error => {
                    this.$message.error(error.msg);
                });
            }
        }
    }
</script>

<style scoped>

</style>
