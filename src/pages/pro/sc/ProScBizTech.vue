<template>
    <div style="width: 100%;height: 100%;background: white">
        <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height:100%">

            <div style="flex-grow: 1;display: flex;flex-direction: row;width: 100%">
                <ice-tree :load-url='"/pro/ProScBizTech/createTree?areaId="+areaIdA'
                          label-prop='name'
                          value-prop="name"
                          @node-click="nodeTreeSelectedHandler"
                          ref="tree">
                    <slot name="prefix" slot="prefix"></slot>
                </ice-tree>
                <div class="editableArea">
                    <ice-query-grid data-url="/pro/ProScBizTech/list"
                                    :query="query"
                                    :columns="columns"
                                    :beforeBindData="beforeBindData"
                                    :operationsWidth=100
                                    ref="mainQueryGrid"
                                    chooseItem="multiple"
                                    @selection-change="handleSelectionChange"
                                    :buttons="buttons">
                    </ice-query-grid>
                    <slot name="bottom"></slot>
                </div>
            </div>
        </div>

        <pro-sc-tech-tree :regionId="areaId" ref="$tree" :isSuccess="isSuccess"></pro-sc-tech-tree>
    </div>

</template>

<script>
    import IceTreeGrid from "@/components/common/base/IceTreeGrid";
    import common from '@/utils/common.js';
    import IceDialog from "@/components/common/base/IceDialog";
    import IceTree from '@/components/common/base/IceTree.vue'
    import IceQueryGrid from '@/components/common/base/IceQueryGrid.vue'
    import ProScTechTree from "./ProScTechTree";

    export default {
        name: "ProScBizCatalogTemplate",
        components: {IceTreeGrid, IceDialog, IceTree, IceQueryGrid, ProScTechTree},
        data() {
            let ncolumns = [
                {label: '区域ID', code: 'areaId', hidden: true},
                {label: '区域', code: 'areaName', width: 130},
                {label: '服务大类', code: 'techBigCategoryName', width: 130},
                {label: '服务名称', code: 'techCategoryName', width: 150},
                {label: '服务项', code: 'techCatalogName', width: 120},
                {label: '有效开始时间', code: 'startTime', width: 140,sortable:true},
                {label: '有效结束时间', code: 'endTime', width: 140,sortable:true}]

            return {
                query: [
                    {
                        type: 'static', value: () => {
                            return this.areaId
                        }, code: 'BIZAREA_ID'
                    },
                    {
                        type: 'static', value: () => {
                            return this.catalogId
                        }, code: 'BIZCATALOG_ID'
                    },
                    {label: '区域', code: 'areaName', type: 'input' ,exp: 'upperLike',value:''},
                    {label: '服务大类', code: 'techBigCategoryName', exp: 'upperLike',value:'', type: 'input'},
                    {label: '服务名称', code: 'techCategoryName', exp: 'upperLike',value:'', type: 'input'},
                    {label: '服务项', code: 'techCatalogName', type: 'input', exp: 'upperLike',value:''},
                    {label: '有效开始时间', code: 'startTime', type: 'date', exp: ">="},
                    {label: '有效结束时间', code: 'endTime', type: 'date', exp: "<="}
                ],
                columns: ncolumns,
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addCallback}
                    , {name: '删除', icon: 'el-icon-delete', type: 'primary', callback: this.deleteCallback}],
                dialogEditVisible: false,
                areaId: '',
                checked_ids: '',
                fobidAdd: true,
                catalogId: '',
                areaIdA:'',//树形查询条件--为空查询全部
            }
        },
        methods: {
            /**
             * table刷新
             */
            refresh() {
                this.$refs.mainQueryGrid.refresh();
            },
            /**
             * 树形刷新
             */
            refreshTree() {
                this.$refs.tree.refresh();
            },
            /**
             * 新增
             */
            addCallback() {
                if (this.fobidAdd) {
                    this.$message.warning('请先选择服务项再进行操作！');
                    return;
                }
                this.$refs.$tree.openDialog(this.catalogId);
            },
            /**
             * 删除
             */
            deleteCallback() {
                if(!this.checked_ids){
                    this.$message.warning("请选中数据后进行删除！！！");
                    return ;
                }
                this.$confirm('确定要删除吗？删除后不可恢复，请谨慎操作！！！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/pro/ProScBizTech/dels", {"params": {"ids": this.checked_ids}})
                        .then(result => {
                            this.$message.success("操作成功");
                            this.refresh();
                        }).catch(error => {
                        this.$message.error(error.msg);
                    });
                });
            },
            /**
             * 树节点选中事件
             * @param node
             */
            nodeTreeSelectedHandler(data, node) {
                if (node) {
                    //当前节点是否可新增
                    if (node.level == 4) {
                        this.$set(this.buttons[0], 'disabled', false);
                    } else {
                        this.$set(this.buttons[0], 'disabled', true);
                    }
                    //是否叶子节点
                    if (node.isLeaf) {
                        this.fobidAdd = false;
                        this.areaId = this.cycleFun(node);
                        this.catalogId = node.data.catalogId;
                        this.refresh();
                    } else {
                        this.fobidAdd = true;
                    }
                    this.treeId = data;
                }

            },
            /**
             * 网格选中事件
             * @param rows
             */
            handleSelectionChange(rows) {
                let checked_ids = '';
                for (let i = 0; i < rows.length; i++) {
                    checked_ids += rows[i].oid + ','
                }
                this.checked_ids = checked_ids

            },
            cycleFun(node) {
                if (node.level == 2) {
                    return node.data.areaId;
                } else {
                    return this.cycleFun(node.parent)
                }
            },
            /**
             *新增成功后的回调
             */
            isSuccess() {
                this.refresh();
            },
            beforeBindData(data) {
                if (this.treeId) {
                    return data
                } else {
                    return []
                }
            }
        },
        mounted() {

        },
    }
</script>


<style lang="less" scoped>


    .editableArea {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        padding: 5px;
        background: white;
        margin-left: 5px;

        .operation-bar {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 40px;
            flex-shrink: 0;
            padding: 5px 10px;
            background: #ffffff;
        }

        .grid-bar {
            flex-grow: 1;
            flex-shrink: 1;
            position: relative;
        }
    }
</style>