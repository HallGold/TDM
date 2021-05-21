<template>
    <ice-dialog :visible.sync="visibleDialog" :width="width" :title="title" remounted>
        <ice-tree-grid :load-url="'/pro/ProScBizCatalog/createTree?areaId='+areaId"
                       label-prop="name"
                       value-prop="name"
                       data-url="/pro/ProScBizCatalog/list"
                       :query="query"
                       :columns="columnsDef"
                       :chooseItem="chooseItem"
                       ref="grid"
                       @selection-change="handleSelectionChange"
                       @node-click="nodeTreeSelectedHandler">
        </ice-tree-grid>
        <div class="ice-button-bar">
            <el-button type="primary" @click="save" :disabled="listData.length==0">保存</el-button>
            <el-button type="info" @click="closeDialog">取消</el-button>
        </div>
    </ice-dialog>


</template>

<script>
    import IceTreeGrid from "../../../../components/common/base/IceTreeGrid";
    import IceDialog from "../../../../components/common/base/IceDialog";

    export default {
        name: "ProScCommonBizCatalog",
        components: {IceDialog, IceTreeGrid},
        props: {
            chooseItem: {//是否多选，提供两个参数single和multiple，默认单选single，设置为multiple则为多选
                type: String,
                default: 'single'
            },

            columns: { //需要显示的列
                type: Array
            },

            width: {//弹窗的宽度
                type: String || Number,
                default: "900px"
            },

            title: {//弹窗标题
                type: String,
                default: "请选择"
            },

            areaId: {//区域ID，如果传区域ID，树形则显示该区域，如果不传，则显示所有区域
                type: String,
                default: ''
            }

        },
        data() {
            return {
                visibleDialog: false,//弹窗的开关属性
                query: [],//查询参数
                queryObj: [
                    {label: '区域名称', code: 'areaName', type: 'input', exp: 'upperLike', value: ''},
                    {label: '服务名称', code: 'categoryName', type: 'input', exp: 'upperLike', value: ''},
                    {label: '服务项', code: 'catalogName', type: 'input', exp: 'upperLike', value: ''},
                ],
                columnsDef: [],
                listData: [],//选择table列的数据
            }
        },
        methods: {
            /**
             * 点击table列表行返回的数据
             * @param rows
             */
            handleSelectionChange(rows) {
                this.listData = rows;

            },
            /**
             * 打开弹窗
             */
            openDialog() {
                this.visibleDialog = true;
                this.listData = [];
                this.$nextTick(() => {
                    this.$refs.grid.$refs.queryGrid.refresh();
                })
            },
            /**
             * 树节点选中事件
             * @param node
             */
            nodeTreeSelectedHandler(data, node) {
                let level1 = [
                    {
                        type: 'static', value: () => {
                            return this.areaId
                        }, code: 'areaId'
                    }
                ];
                let level2 = [
                    {
                        type: 'static', value: () => {
                            return node.data.areaId
                        }, code: 'areaId'
                    }
                ];
                let level3 = [
                    {
                        type: 'static', value: () => {
                            return node.data.categoryId
                        }, code: 'categoryId'
                    },
                    {
                        type: 'static', value: () => {
                            return node.data.areaId
                        }, code: 'areaId'
                    }
                ];
                if (node.level == 1) {
                    this.dynamicQuery(level1);
                } else if (node.level == 2) {
                    this.dynamicQuery(level2)
                } else if (node.level == 3) {
                    this.dynamicQuery(level3);
                }

            },
            /**
             * 切换查询条件
             */
            dynamicQuery(arr) {
                this.query = [];
                this.query = arr;
                this.query.push(...this.queryObj);
            },
            /**
             * 初始化组件table列
             */
            initColumns() {
                let columns = [
                    {label: 'oid', code: 'oid', hidden: true},
                    {label: '区域ID', code: 'areaId', hidden: true},
                    {label: '服务ID', code: 'categoryId', hidden: true},
                    {label: '服务项ID', code: 'templateId', hidden: true},
                    {label: '区域名称', code: 'areaName', width: 160},
                    {label: '服务名称', code: 'categoryName', width: 160},
                    {label: '服务项', code: 'catalogName', width: 160},
                ];
                if (!!this.columns) {
                    this.columnsDef = this.columns;
                } else {
                    this.columnsDef = columns;
                }
            },
            /**
             * 保存
             */
            save() {
                this.$emit("selection-change", this.listData);
                this.closeDialog();
            },
            /**
             * 取消
             */
            closeDialog() {
                this.visibleDialog = false;
            }
        },
        mounted() {
            this.initColumns();
        }

    }
</script>

<style scoped>

</style>