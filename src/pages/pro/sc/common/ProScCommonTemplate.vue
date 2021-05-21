<template>
    <ice-dialog title='请选择' custom-class="ice-dialog" center
                    :visible.sync="innerVisible"
                    :buttons = 'bathButtons'
                    width="1200px" :close-on-click-modal="false" remounted>
        <div style="width: 100%;height: 100%;background: white">
                <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height: 100%;">
                    <ice-tree-grid
                            :load-url="'/pro/ProScBizCatalog/createTree?areaId='+regionId"
                            label-prop="name"
                            value-prop="areaId"
                            data-url="/pro/ProScBizCatalog/list"
                            :query="query"
                            :columns="columns"
                            ref="mainQueryGrid"
                            :chooseItem="chooseItem"
                            @selection-change="handleSelectionChange"
                            @node-click="nodeTreeSelectedHandler"
                            >
                    </ice-tree-grid>
                </div>
                
        </div>
    </ice-dialog>
</template>

<script>
    import IceTreeGrid from "@/components/common/base/IceTreeGrid";
    import common from '@/utils/common.js';
    import IceSelect from "@/components/common/base/IceSelect";
    import IceDialog from "@/components/common/base/IceDialog";

    export default {
        name: "ProScCommonTemplate",
        components: {IceSelect, IceTreeGrid,IceDialog},
        props: {
            regionId: {
                type: String,
                default: ''
            },
            chooseItem:{
                type:String,
                default: 'single'
            }
            // valueProp: {
            //     type: String,
            //     default: 'deptCode'
            // },
            // selectedDept: {
            //     type: Array,
            //     default: () => []
            // }
        },
        data() {
            let ncolumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: '区域ID', code: 'areaId', hidden: true},
                // {label: '区域名称', code: 'areaName', width: 155},
                // {label: '服务大类', code: 'tendCode', width: 120},
                {label: '服务名称', code: 'categoryName', width: 120},
                {label: '服务级别', code: 'lv', width: 80, mapTypeCode: "SC_LEVEL"},
                {label: '是否使用用户级别', code: 'isUsrLv', width: 80, mapTypeCode: "YES_NO"},
                {label: '主管部门', code: 'deptName', width: 120},
                {label: '服务项', code: 'catalogName', width: 120},
                {label: '有效开始时间', code: 'gmtBegin', width: 100},
                {label: '有效结束时间', code: 'gmtEnd', width: 100},
                {label: '创建人', code: 'createUser', width: 100}];
            return {
                treeId: '0', treeName: '',rootNode:null,
                query: [
                    {type: 'static', value: () => {return ''}, code: 'areaId'},
                    {label: '服务名称', code: 'categoryName', type: 'input'},
                    {label: '服务项', code: 'catalogName', type: 'input'},
                    {
                        type: 'select',
                        label: '是否使用用户级别',
                        code: 'isUsrLv',
                        mapTypeCode: "YES_NO",
                        value: ''
                    },
                    {
                        type: 'select',
                        label: '服务级别',
                        code: 'lv',
                        mapTypeCode: "SC_LEVEL",
                        value: ''
                    },
                    {label: '主管部门', code: 'deptName', type: 'input'},
                    {label: '有效开始时间', code: 'gmtBegin', type: 'date',exp: ">="},
                    {label: '有效结束时间', code: 'gmtEnd', type: 'date',exp: "<="},
                    {label: '创建人', code: 'createUser', type: 'input'},
                ],
                columns: ncolumns,
                tendId: '',
                checked_ids:'',
                loadUrl:'/pro/ProScBizTech/createTree',
                innerVisible:false,
                bathButtons:[
                    {name: '取消', iscannel: true},
                    {name: '保存', iscannel: false,click: this.saveBatchData}
                ],
                checkedRows:[]
            }
        },
        methods: {
            /**
             * 树节点选中事件
             * @param node
             */
            nodeTreeSelectedHandler(data, node) {
                this.treeId = data;
                this.treeName = node.data.name;

                let level1 = {type:'static',value: () => {return node.data.areaId}, code: 'areaId'};
                let level2 = {type:'static',value: () => {return node.data.areaId}, code: 'areaId'};
                let level3 = {type:'static',value: () => {return node.data.oid}, code: 'oid'};
                if(node.level == 1){
                    this.query.splice(0,1,level1) 
                }else if(node.level == 2){
                    this.query.splice(0,1,level2)
                }else if(node.level == 3){
                    this.query.splice(0,1,level3)
                }
            },
            /**
             * 网格选中事件
             * @param rows
             */
            handleSelectionChange(rows) {
                let checked_ids=''
                for (let i = 0; i < rows.length; i++) {
                    
                    checked_ids+=rows[i].oid+','
                }
                this.checked_ids = checked_ids
                this.checkedRows = rows
            },
            opendialog(){
                this.innerVisible = true;
            },
            refresh(){
                this.$nextTick(()=>{
                    this.$refs.mainQueryGrid.$refs.tree.refresh()
                    this.$refs.mainQueryGrid.$refs.queryGrid.refresh()
                })
            },
            saveBatchData(){
                this.$emit('grid-check', this.treeId,this.checkedRows)
                this.innerVisible = false
            }
        },
        mounted(){
        }
    }
</script>

<style scoped>

</style>