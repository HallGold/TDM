<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%" id="$pageManameMain$">
        <ice-tree-grid load-url="/permission/res/page/outer/get_project_tree"
                       ref="iceGrid"
                       label-prop="name"
                       value-prop="oid"
                       :lazy="false"
                       data-url="/permission/res/page/outer/search_res_page"
                       :pagination="true"
                       :query="query"
                       :columns="columns"
                       :operations="operations"
                       :buttons="buttons"
                       :chooseItem="chooseItem"
                       @node-click="dataTree"
                       :operations-width="180">
        </ice-tree-grid>
        <add-edit :mainDataForm="mainDataForm" ref="addEdit" :title="title" :isEdit="isEdit"
                  :isSuccess="isSuccess"></add-edit>
        <page-function-edit ref="pageFunctionEdit"></page-function-edit>
    </div>
</template>

<script>
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import AddEdit from "./addEdit";
    import PageFunctionEdit from "./pageFunctionEdit";
    import {Loading} from 'element-ui';

    export default {
        name: "informationPreserveManage",
        components: {PageFunctionEdit, AddEdit, IceTreeGrid},
        props: {
            chooseItem: {
                type: String,
                default: 'single'
            },
            isDialog: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                projectId: '',
                modelId: '',
                subModelId: '',
                title: '',
                isEdit: false,
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
                ],
                columns: [//组件table列
                    {code: 'oid', hidden: true},
                    {label: '模块', code: 'modelName', width: 180, showTips:true, align:'left'},
                    {label: '子模块', code: 'submodelName', width: 180, showTips:true, align:'left'},
                    {label: '页面名称', code: 'pageName', width: 200, align:'left'},
                    {label: '页面编码', code: 'pageCode', width: 120, align:'left'},
                    {
                        label: '页面分组', code: 'pageGroup', width: 90, mapTypeCode: "PAGE_GROUP"
                    },
                    {
                        label: '授权模式', code: 'funcAuthMode', width: 80, mapTypeCode: "funcAuthMode"
                    },
                    {
                        label: '数据隔离', code: 'dataAuthEnabled', width: 80, renderCell(h, data) {
                            return data.row.dataAuthEnabled == 'Y' ? '需要授权' : (data.row.dataAuthEnabled == 'N' ? '无需授权' : '');
                        }
                    },
                    {
                        label: '页面类型', code: 'pageType', width: 95, mapTypeCode: "PAGE_TYPE"
                    },
                    {
                        label: '状态', code: 'isEnabled', width: 75, renderCell(h, data) {
                            return data.row.isEnabled == 'Y' ? '启用' : '停用'
                        }
                    },
                    {label: '页面Url', code: 'pageUrl', width: 300, align:'left'},
                    {label: '页面描述', code: 'pageDesc', width: 300, align:'left'},
                ],
                submodelId: '',
                operations: [],  //组件table列操作按钮
                buttons: [],    //组件页面按钮
                mainDataForm: {//表单对象a：所属模块，从左边的树结构中读取
                    submodelId: '',
                    pageCode: '',
                    pageName: '',
                    pageGroup: '',
                    pageType: '',
                    pageUrl: '',
                    pageDesc: '',
                    funcAuthMode: '',
                    dataAuthEnabled: ''
                },
                pageId: '',                      //要清除缓存的页面ID
            }
        },
        methods: {
            isSuccess() {
                this.$refs.iceGrid.$refs.queryGrid.refresh();
            },
            /**
             * 点击树节点，获取节点信息
             */
            dataTree(data, node) {
                this.submodelId = '';
                let isTrue = true;
                let level = node.level;
                let rootNode = node;
                while (level>1) {
                    rootNode = rootNode.parent;
                    level = level-1;
                }
                if (node.level>1) {
                    this.projectId = rootNode.data.oid;
                    this.modelId = "";
                    this.subModelId = "";
                }
                if (node.data.type == 0) {
                    this.projectId = node.data.oid;
                    this.modelId = "";
                    this.subModelId = "";
                    isTrue = true;
                } else if (node.data.type == 1) {
                    this.modelId = node.data.oid;
                    this.subModelId = "";
                    this.$set(this.buttons[0], 'disabled', true)
                } else if (node.data.type == 2) {
                    this.modelId = "";
                    this.subModelId = node.data.oid;
                    this.submodelId = data;
                    isTrue = false;
                }
                this.$set(this.buttons[0], 'disabled', isTrue);
            },
            /**
             * 新增
             */
            add() {
                this.isEdit = false;
                this.title = '新增页面';
                this.$refs.addEdit.openDialog();
                this.mainDataForm.submodelId = this.submodelId;
            },
            update(row) {
                this.isEdit = true;
                this.title = '页面编辑';
                let obj = {};
                Object.assign(obj, row);
                this.$refs.addEdit.openDialog();
                this.$nextTick(() => {
                    this.mainDataForm = obj;
                });
            },
            /**
             * 重置页面缓存
             */
            refreshCache() {
                let loading = Loading.service({target: document.getElementById('$pageManameMain$'), lock: true});
                this.$axios.delete("/permission/res/page/outer/reset_cache_byid", {params: this.pageId}).then(success => {
                    this.$message.success("重置页面缓存成功");
                    loading.close();
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                    loading.close();
                });
            },
            /**
             * 功能维护
             */
            editPageFuncItem(row) {
                this.$refs.pageFunctionEdit.openDialog(row);
            },
            /**
             * 停用或启用
             */
            enabledOrDisabled(row) {
                let message = '是否确定启用该页面？';
                if (row.isEnabled == 'Y') {
                    let message = '是否确定停用该页面？';
                }
                this.$confirm(message, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    let loading = Loading.service({target: document.getElementById('$pageManameMain$'), lock: true});
                    this.$axios.post("/permission/res/page/outer/set_page_enabled", {
                        pageId: row.oid,
                        isEnabled: row.isEnabled == 'N' ? 'Y' : 'N'
                    }).then(success => {
                        loading.close();
                        this.$message.success("操作成功");
                        this.isSuccess();
                    }).catch(error => {
                        loading.close();
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                    });
                });
            },
            /**
             * 删除页面信息
             */
            deleteItem(row) {
                this.$confirm('确定要删除吗？删除后不可恢复，请谨慎操作！！！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    let loading = Loading.service({target: document.getElementById('$pageManameMain$'), lock: true});
                    this.$axios.delete("/permission/res/page/outer/delete/page_by_id", {params: {pageId: row.oid}}).then(success => {
                        this.$message.success("删除成功");
                        loading.close();
                        this.isSuccess();
                    }).catch(error => {
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                        loading.close();
                    });
                });
            },
            initDialog() {
                let _this = this;
                if (!this.isDialog) {
                    _this.operations = [
                        {name: '功能维护', callback: this.editPageFuncItem},
                        {name: '编辑', callback: this.update},
                        {
                            name: '启用', callback: this.enabledOrDisabled, isShow: function (row) {
                                if (row.isEnabled == 'N') {
                                    return true;
                                }
                                return false;
                            }
                        },
                        {
                            name: '停用', callback: this.enabledOrDisabled, isShow: function (row) {
                                if (row.isEnabled == 'Y') {
                                    return true;
                                }
                                return false;
                            }
                        },
                        {name: '删除', callback: this.deleteItem},
                    ];
                    _this.buttons = [
                        {name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.add},
                        {name: '重置页面缓存', icon: 'el-icon-plus', type: 'primary', callback: this.refreshCache},
                    ];
                }
            }
        },
        mounted() {
            this.initDialog();
        }
    }
</script>

<style scoped>

</style>
