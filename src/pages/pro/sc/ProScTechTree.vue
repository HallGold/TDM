<template>
    <ice-dialog title='请选择'
                width="500px"
                :buttons="bathButtons"
                remounted
                :visible.sync="innerVisible">
        <div class="ice-container outer">
            <div class="inner">
                <ice-tree :load-url="'/pro/ProScBizTech/tree?areaId='+regionId"
                          label-prop="name"
                          value-prop="name"
                          :default-expanded-keys="['全部']"
                          :showTreeCheckbox="true"
                          @node-check="checkedNodesClick"
                          ref="tree"
                          style="width:100%">
                </ice-tree>
            </div>
        </div>
    </ice-dialog>
</template>

<script>
    import IceTree from '@/components/common/base/IceTree.vue'
    import common from '@/utils/common.js';
    import IceDialog from "@/components/common/base/IceDialog";

    export default {
        name: "ProScTechTree",
        props: {
            regionId: {//主页面的选择节点的区域ID
                type: String,
                default: ''
            },

            isSuccess: Function,//成功后的回调

            isCallback: {//是否返回选择的值
                type: Boolean,
                default: false
            },

            btnName: {//保存按钮的名字，可按需求修改名字
                type: String,
                default: '保存'
            }
        },
        components: {IceTree, IceDialog},
        data() {
            return {
                bathButtons: [
                    {name: this.btnName, iscannel: false, click: this.saveBatchData},
                    {name: '返回', iscannel: true},
                ],
                innerVisible: false,
                list: [],    //需要提交数据的集合
                catalogId: '',//业务服务项id
            }
        },
        methods: {
            /**
             * 是否为最后一个节点
             * @param arr
             */
            isLastNode(arr) {
                arr.forEach(item => {
                    if (item.children && item.children.length > 0) {
                        this.isLastNode(item.children);
                    } else {
                        if (item.catalogId && this.list.indexOf(item) === -1) {
                            this.list.push(item);
                        }
                    }
                })
            },
            /**
             * 打开弹窗
             * @param catalogId
             */
            openDialog(catalogId) {
                this.catalogId = catalogId;
                this.innerVisible = true;
            },
            /**
             * 树形刷新
             */
            refresh() {
                this.$nextTick(() => {
                    this.$refs.tree.refresh();
                })
            },
            async saveBatchData() {
                let list = [];
                try {
                    if (this.list.length == 0) {
                        this.$message.warning("请选择子节点数据");
                        return false;
                    }
                    if (this.isCallback) {
                        this.$emit("getData", this.list);
                        return true;
                    } else {
                        this.list.forEach(item => {
                            let obj = {};
                            obj.bizCatalogId = this.catalogId;
                            obj.techCatalogId = item.catalogId;
                            obj.bizareaId = item.areaId;
                            list.push(obj);
                        });
                        await this.$axios.post("pro/ProScBizTech/allSave", {"list": JSON.stringify(list)});
                        this.$message.success("保存成功");
                        this.isSuccess();
                        return true;
                    }
                } catch (e) {
                    this.$message.error(e.msg);
                }
                return false;
            },
            checkedNodesClick(currentCheckedNode, nodeStatus) {
                this.list = [];
                this.isLastNode(nodeStatus.checkedNodes);
            },
        },
        mounted() {
        },
    }
</script>

<style lang="less" scoped>
    .outer {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 400px
    }

    .inner {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        width: 100%
    }
</style>