<template>
    <el-dialog v-dialogDrag
               title="页面选择"
               v-if="isDialog"
               custom-class="ice-dialog"
               center
               :visible.sync="dialogVisible"
               width="1500px"
               append-to-body
               :before-close="closeDialog"
               :close-on-click-modal="false">
        <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height: 500px">
            <ice-tree-grid load-url="/permission/res/page/outer/get_project_tree"
                           ref="iceGrid"
                           label-prop="name"
                           value-prop="oid"
                           :lazy="false"
                           data-url="/permission/res/page/outer/search_res_page"
                           :pagination="true"
                           :query="query"
                           :columns="columns"
                           :chooseItem="chooseItem"
                           @selection-change="handleSelectionChange"
                           @node-click="dataTree">
            </ice-tree-grid>
        </div>
        <div class="ice-button-bar ">
            <el-button type="primary" @click="save" :disabled="tableList.length==0">确定</el-button>
            <el-button type="info" @click="closeDialog">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import InformationPreserveManage from "./informationPreserveManage";
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";

    export default {
        name: "pageEdit",
        components: {IceTreeGrid, InformationPreserveManage},
        props: {
            isSuccess: Function,
            typeItem: {
                type: String,
                default: '',         //page代表之前页面用到的,
            },
            selectedHanlder: {
                type: Function,
                default: undefined
            }
        },
        data() {
            return {
                pageOrServiceId: '',
                dataParentKey: '',
                itemType: '',
                projectId: '',
                modelId: '',
                subModelId: '',
                pageGroup:'',
                tableList: [],
                chooseItem: 'single',      //是否多选
                isDialog: false,             //是否是弹窗展示
                dialogVisible: false,        //弹窗的开关属性
                query: [//组件查询
                    {type: 'input', label: '页面名称', code: 'pageName', value: ''},
                    {type: 'input', label: '页面编码', code: 'pageCode', value: ''},
                    {
                        type: 'static', code: 'PROJECT_ID', exp: '=', value: () => {
                            return this.projectId;
                        }
                    },
                    {
                        type: 'static', code: 'MODEL_ID', exp: '=', value: () => {
                            return this.modelId;
                        }
                    },
                    {
                        type: 'static', code: 'subModelId', exp: '=', value: () => {
                            return this.subModelId;
                        }
                    },
                    {
                        type: 'static', code: 'pageGroup', exp: '=', value: () => {
                            return this.pageGroup;
                        }
                    }
                ],
                columns: [//组件table列
                    {code: 'oid', hidden: true},
                    {label: '页面名称', code: 'pageName', width: 120},
                    {label: '页面编码', code: 'pageCode', width: 120},
                    {
                        label: '页面分组', code: 'pageGroup', width: 120, renderCell(h, data) {
                            return data.row.pageGroup == '10' ? '功能分组' : (data.row.pageGroup == '20' ? '流程分组' : '');
                        }
                    },
                    {
                        label: '授权模式', code: 'funcAuthMode', width: 120, renderCell(h, data) {
                            return data.row.funcAuthMode == 'A' ? '整体授权' : (data.row.funcAuthMode == 'P' ? '非整体授权' : '');
                        }
                    },
                    {
                        label: '数据隔离', code: 'dataAuthEnabled', width: 120, renderCell(h, data) {
                            return data.row.dataAuthEnabled == 'Y' ? '需要授权' : (data.row.dataAuthEnabled == 'N' ? '无需授权' : '');
                        }
                    },
                    {
                        label: '页面类型', code: 'pageType', width: 100, renderCell(h, data) {
                            return data.row.pageType == 'A10' ? '一般页面' : (data.row.pageType == 'A20' ? '对话框页面' : (data.row.pageType == 'A30' ? 'portlet页面' : ''));
                        }
                    },
                    {
                        label: '状态', code: 'isEnabled', width: 120, renderCell(h, data) {
                            return data.row.isEnabled == 'Y' ? '启用' : '停用'
                        }
                    },
                    {label: '页面Url', code: 'pageUrl', width: 150},
                    {label: '页面描述', code: 'pageDesc', width: 200},
                ],
            }
        },
        methods: {
            setPageType(val){//设置页面的类型
                this.pageGroup=val;
            },
            /**
             * table列选择的数据
             * @param rows
             */
            handleSelectionChange(rows) {
                this.tableList = rows;
                this.pageOrServiceId = rows[0].oid;
            },
            /**
             * 保存
             */
            save() {
                if (this.typeItem == 'page') {
                    this.savePage();
                } else {
                    if (this.selectedHanlder && typeof this.selectedHanlder == 'function') {
                        this.selectedHanlder(this.tableList);
                        this.closeDialog();
                    }
                }
            },
            savePage() {
                if (this.pageOrServiceId) {
                    this.$axios.post("/permission/res/page/outer/save/func_subpage_rel", {
                        pageOrServiceId: this.pageOrServiceId,
                        dataParentKey: this.dataParentKey,
                        itemType: this.itemType
                    }).then(success => {
                        this.$message.success("保存成功");
                        this.isSuccess();
                        this.closeDialog();
                    }).catch(error => {
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                    });
                } else {
                    this.$message.warning("请选择需要添加的页面");
                }
            },
            /**
             * 取消
             */
            closeDialog() {
                this.dialogVisible = false;
                this.tableList = [];
                this.$nextTick(() => {
                    this.isDialog = false;
                });

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
            },
            /**
             * 点击树节点，获取节点信息
             */
            dataTree(data, node) {
                if (node.data.type == 0) {
                    this.projectId = node.data.oid;
                    this.modelId = "";
                    this.subModelId = "";
                } else if (node.data.type == 1) {
                    this.modelId = node.data.oid;
                    this.subModelId = "";
                } else if (node.data.type == 2) {
                    this.modelId = "";
                    this.subModelId = node.data.oid;
                }
            },
        }
    }
</script>

<style scoped>

</style>
