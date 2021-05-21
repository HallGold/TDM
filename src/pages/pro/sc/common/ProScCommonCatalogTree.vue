<template>
    <ice-dialog title='请选择'  center
                width="400px"
                :buttons="bathButtons"
                :visible.sync="innerVisible" :close-on-click-modal="false" >
        <div class="ice-container" style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height:400px">

            <div style="flex-grow: 1;display: flex;flex-direction: row;width: 100%">
                <ice-tree
                        :treeData="serveData"
                        label-prop="name"
                        value-prop="name"
                        :showTreeCheckbox="true"
                        @node-check="checkedNodesClick"
                        ref="tree"
                        style="width:100%">
                    <slot name="prefix" slot="prefix"></slot>
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
        name: "ProScCommonCatalogTree",
        props:{
            regionId:{
                type: String,
                default: ''
            }
        },
        components: {IceTree,IceDialog},
        data(){
            return {
                bathButtons:[
                    {name: '返回', iscannel: true},
                    {name: '保存', iscannel: false,click: this.saveBatchData}
                ],
                innerVisible:false,
                serveData:[]
                // selectedNode:{},
                // checkedTreeKeys:[],
            }
        },
        methods:{
            opendialog(){
                this.innerVisible = true;
                this.$axios.get('/pro/ProScBizCatalog/createTree', {"params": {"areaId": this.regionId}}).then(result => {
                    let childData = result.data[0].children.filter(item => item.children && item.children.length>0)
                    result.data[0].children = childData
                    this.serveData = result.data

                }).catch(error => {
                    this.$message.error("出错啦")
                })
            },
            refresh() {
                this.$nextTick(()=>{
                    this.$refs.tree.refresh();
                })
            },
            saveBatchData(){
                this.$emit("tree-check",this.currentCheckedNode,this.nodeStatus)
                this.innerVisible = false;
            },
            checkedNodesClick(currentCheckedNode, nodeStatus){
                this.currentCheckedNode = currentCheckedNode
                this.nodeStatus = nodeStatus
            },
        },
        mounted(){
        },
        watch:{
            innerVisible() {
                try {
                    this.$refs.tree.refresh();
                }catch (e) {
                }
            },
        }
    }
</script>

<style lang="less" scoped>


    .editableArea {
        flex-grow: 1;
        padding-left: 10px;
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