<template>
    <div>
        <el-dialog v-dialogDrag
                   title="页面功能维护"
                   custom-class="ice-dialog"
                   center
                   :visible.sync="dialogVisible"
                   width="1100px"
                   append-to-body
                   :before-close="closeDialog"
                   :close-on-click-modal="false">
           <!-- <div>
                <ice-form-group :columns="3">
                    <div class="inner">
                        <span style="white-space: nowrap;">模块:</span>
                        <el-tooltip placement="top" effect="light">
                            <div slot="content">
                                {{modeItem}}
                            </div>
                            <a class="cls">{{modeItem.length>10?(modeItem.substring(0,11)+'...'):modeItem}}</a>
                        </el-tooltip>
                    </div>
                    <div class="inner">
                        <span style="white-space: nowrap;">子模块:</span>
                        <el-tooltip placement="top" effect="light">
                            <div slot="content">
                                {{childModeItem}}
                            </div>
                            <a class="cls">{{childModeItem.length>10?(childModeItem.substring(0,11)+'...'):childModeItem}}</a>
                        </el-tooltip>
                    </div>
                    <div class="inner">
                        <span style="white-space: nowrap;">页面类型:</span>
                        <el-tooltip placement="top" effect="light">
                            <div slot="content">
                                {{pageTypeItem}}
                            </div>
                            <a class="cls">{{pageTypeItem.length>10?(pageTypeItem.substring(0,11)+'...'):pageTypeItem}}</a>
                        </el-tooltip>
                    </div>
                </ice-form-group>
            </div>-->
            <div style="height: 500px;position: relative">
                <div class="ice-full-absolute">
                    <el-table :data="tableData"
                              :default-expand-all="true"
                              style="width: 100%;margin-bottom: 20px;"
                              :height="500"
                              row-key="dataKey">
                        <el-table-column
                                align="left"
                                prop="name"
                                label="名称"
                                width="250">
                            <template slot-scope="scope">
                                <div v-html="scope.row.name"></div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="code"
                                label="编码"
                                width="150">
                            <template slot-scope="scope">
                                <el-tooltip placement="top">
                                    <div slot="content">
                                        {{scope.row.code}}
                                    </div>
                                    <span>
                                        {{scope.row.code.length>10?scope.row.code.substring(0,11)+'...':scope.row.code}}
                                    </span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="itemTypeName"
                                label="类型"
                                width="100">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="funcAuthEnabled"
                                width="80"
                                label="功能授权">
                            <template slot-scope="scope">
                                {{scope.row.funcAuthEnabled == 'Y'?'启用':'停用'}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="dataAuthEnabled"
                                width="80"
                                label="数据隔离">
                            <template slot-scope="scope">
                                {{scope.row.dataAuthEnabled == 'Y'?'启用':'停用'}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="url"
                                label="URL">
                            <template slot-scope="scope">
                                <el-tooltip placement="top">
                                    <div slot="content">
                                        {{scope.row.url}}
                                    </div>
                                    <span>
                                        {{scope.row.url.length>15?scope.row.url.substring(0,16)+'...':scope.row.url}}
                                    </span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                label="操作"
                                width="200">
                            <template slot-scope="scope">
                                <el-button v-if="scope.row.showAddFun" @click="addPageFuncItem(scope.row)"
                                           type="text" size="small">新增功能
                                </el-button>
                                <el-button v-if="scope.row.showAddWF" @click="flowItem(scope.row)"
                                           type="text" size="small">流程配置
                                </el-button>
                                <el-button v-if="scope.row.showAddPage" @click="addSubPageItem(scope.row)"
                                           type="text" size="small">新增页面
                                </el-button>
                                <el-button v-if="scope.row.showAddService" @click="addServiceItem(scope.row)"
                                           type="text" size="small">新增服务
                                </el-button>
                                <el-button v-if="scope.row.showEdit" @click="editPageFuncItem(scope.row)"
                                           type="text" size="small">修改
                                </el-button>
                                <el-button v-if="scope.row.showDel" @click="deleteItem(scope.row)"
                                           type="text" size="small">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="ice-button-bar">
                <el-button type="info" @click="closeDialog">关闭</el-button>
            </div>
        </el-dialog>
        <function-edit ref="functionEdit" :title="title" :isSuccess="isSuccess" :is-edit="isEdit"></function-edit>
        <service-edit ref="serviceEdit" :isSuccess="isSuccess" loadAll="N"></service-edit>
        <page-edit ref="pageEdit" :isSuccess="isSuccess" :typeItem="page"></page-edit>
    </div>
</template>

<script>
    import IceFormGroup from "../../../components/common/base/IceFormGroup";
    import FunctionEdit from "./functionEdit";
    import ServiceEdit from "./serviceEdit";
    import PageEdit from "./pageEdit";

    export default {
        name: "pageFunctionEdit",
        components: {PageEdit, ServiceEdit, FunctionEdit, IceFormGroup},
        data() {
            return {
                dialogVisible: false,
                tableData: [],
                modeItem: '',                //模块
                childModeItem: '',           //子模块
                pageTypeItem: '',            //页面类型
                title: '',
                rowItem: {},                 //打开弹窗带过来的参数
                isEdit: false,
                page: 'page'
            }
        },
        methods: {
            /**
             * 取消
             */
            closeDialog() {
                this.dialogVisible = false;
            },
            /**
             * 新增页面功能点
             */
            addPageFuncItem(row) {
                this.isEdit = false;
                this.$nextTick(() => {
                    this.title = '新增页面功能点';
                    this.$refs.functionEdit.openDialog(row);
                })
            },
            /**
             * 修改
             */
            editPageFuncItem(row) {
                this.isEdit = true;
                this.$nextTick(() => {
                    this.title = '页面功能点维护';
                    this.$refs.functionEdit.openDialog(row);
                })

            },
            /**
             * 流程配置
             */
            flowItem() {

            },
            /**
             * 新增页面
             */
            addSubPageItem(row) {
                let itemType = 'page';
                this.$refs.pageEdit.openDialog(itemType, row.dataKey);
            },
            /**
             * 新增服务
             */
            addServiceItem(row) {
                let itemType = 'service';
                this.$refs.serviceEdit.openDialog(itemType, row.dataKey);
            },

            /**
             * 删除
             */
            deleteItem(row) {
                let pageId = this.tableData[0].dataKey;
                if (row.itemType == 'button') {
                    this.$axios.delete("/permission/res/page/outer/delete/pagefunc_byid", {
                        "params": {
                            pageId: pageId,
                            pageFuncId: row.dataKey
                        }
                    }).then(success => {
                        this.$message.success("删除成功");
                        this.refresh();
                    }).catch(error => {
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                    });
                } else if (row.itemType == 'subpage') {
                    this.$axios.delete("/permission/res/page/outer/delete/refpage_by_id", {
                        "params": {
                            pageId: pageId,
                            funcRefPageId: row.dataKey
                        }
                    }).then(success => {
                        this.$message.success("删除成功");
                        this.refresh();
                    }).catch(error => {
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                    });
                } else if (row.itemType == 'service') {
                    this.$axios.delete("/permission/res/page/outer/delete/funcservrel_by_id", {
                        "params": {
                            pageId: pageId,
                            funcServRelId: row.dataKey
                        }
                    }).then(success => {
                        this.$message.success("删除成功");
                        this.refresh();
                    }).catch(error => {
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                    });
                }
            },
            openDialog(row) {
                this.dialogVisible = true;
                this.rowItem = row;
                this.$nextTick(() => {
                    this.refresh();
                });
            },
            refresh() {
                this.$axios.get("/permission/res/page/outer/get/page_detl_cfg", {params: {pageId: this.rowItem.oid}}).then(success => {
                    success.data.forEach(row => {
                        row.showAddFun = true;
                        row.showAddWF = true;
                        row.showDel = false;
                        row.showEdit = false;
                        for (let i = 0; i < row.children.length; i++) {
                            let child = row.children[i];
                            child.showDel = true;
                            child.showEdit = true;
                            if (child.children.length > 0) {
                                child.showAddPage = false;
                                child.showAddService = false;
                                for (let j = 0; j < child.children.length; j++) {
                                    let cc = child.children[j];
                                    if (cc.itemType == 'subpage') {
                                        child.showAddPage = true;
                                        break;
                                    } else if (cc.itemType == 'service') {
                                        child.showAddService = true;
                                        break;
                                    }
                                }
                            } else {
                                child.showAddPage = true;
                                child.showAddService = true;
                            }
                            child.children.forEach(x => {
                                x.showDel = true;
                            })
                        }
                    });
                    this.tableData = success.data;
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            },
            /**
             * 成功后的回调
             */
            isSuccess() {
                this.refresh();
            }
        }
    }
</script>
<style scoped>


    .inner {
        width: 33%;
        overflow: hidden;
    }

    .cls {
        white-space: nowrap;
    }
</style>
