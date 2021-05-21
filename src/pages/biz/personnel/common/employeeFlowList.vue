<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-tree-grid :treeData="processTypeData"
                       data-url="/biz/bizEmpFlow/listSelf"
                       label-prop="bpmDefName"
                       value-prop="actDefKey"
                       ref="treeGrid"
                       :columns="columns"
                       :operations="operations"
                       :query="query"
                       chooseItem="single"
                       @node-click="treeNodeClickHandler"
                       :buttons="buttons">
        </ice-tree-grid>
    </div>

</template>

<script>
    import IceTreeGrid from "../../../../components/common/base/IceTreeGrid";
    import empComm from "@/pages/biz/personnel/common/empComm";
    export default {
        name: "employeeFlowList",
        components: {IceTreeGrid},
        mixins:[empComm],
        data() {
            return {
                query: [
                    {
                        type: 'static', code: 'flowKey', exp: '=', value: () => {
                            return this.flowKey
                        }
                    },
                    {label: '申请单号', code: 'afNo', type:'input',value:''},
                    {label: '人员名称', code: 'userName',type:'input',value:''},
                    {label: '流程名称', code: 'flowName', type:'input',value:''},
                    {label: '服务单号', code: 'serverNo', type:'input',value:''},
                    {
                        label: '流程状态', code: 'afStatus', options:[
                            {text:'草稿',code:-1},
                            {text:'审批中',code:1},
                            {text:'已完成',code:2},
                            {text:'驳回',code:3},
                            ],type:'select',value:''
                    },
                    {label: '开始时间', code: 'createDate', type:'date',value:'',exp:'>='},
                    {label: '结束时间', code: 'createDate', type:'date',value:'',exp:'<='},
                ],
                columns: [
                    {code:'oid',hidden:true},
                    {label: '申请单号', code: 'afNo', width: 120},
                    {label: '人员名称', code: 'userName', width: 120},
                    {label: '流程名称', code: 'flowName', width: 180},
                    {label: '服务单号', code: 'serverNo', width: 150},
                    {label: '流程ID', code: 'flowId', hidden: true},
                    {label: '人员编号', code: 'userCode', hidden: true},
                    {label: '流程回调url', code: 'flowUrl', hidden: true},
                    {label: '流程实例ID', code: 'FlowInstId', hidden: true},
                    {
                        label: '流程状态', code: 'afStatus', width: 100, formatter: row => {
                            return row.afStatus == -1 ? '草稿' : (row.afStatus == 1 ? '审批中' : (row.afStatus == 2 ? '已完成' : (row.afStatus == 3 ? '驳回' : '')))
                        }
                    },
                    {label: '创建时间', code: 'createDate', width: 160},
                ],
                buttons: [
                    {name: '新增', callback: this.addItem},
                ],
                operations: [
                    {
                        name: '删除', callback: this.deleteItem, isShow: function (row) {
                            return row.afStatus == -1;
                        }
                    },
                    {
                        name: '修改', callback: this.updateItem, isShow: function (row) {
                            return row.afStatus == -1;
                        }
                    },
                    {name: '查看', callback: this.lookItem},
                ],
                //流程类型
                processTypeData: [
                    {
                        actDefKey: 0, bpmDefName: "流程分类", children: []
                    }
                ],
                flowKey: ''
            }
        },
        methods: {
            /**
             * 选中树形节点返回的数据
             * @param data
             * @param node
             */
            treeNodeClickHandler(data, node) {
                this.flowKey = data;
                if(this.flowKey==0){
                    this.$set(this.buttons[0],'disabled',true);
                }else{
                    this.$set(this.buttons[0],'disabled',false);
                }
            },
            /**
             *新增
             */
            async addItem() {
                let arr = await this.getDataMapListData('EMP_PERSONNEL');
                this.$router.push(this.getCode(arr));
            },
            getCode(arr){
                if(arr&&arr.length>0){
                    for(let i=0;i<arr.length;i++){
                        if(arr[i].name == this.flowKey){
                            return arr[i].code
                        }
                    }
                }
            },
            /**
             *修改
             */
            updateItem(row) {
                this.$router.push(row.flowUrl);
            },
            /**
             *删除
             */
            deleteItem(row) {
                this.$confirm('确定变更吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/biz/bizEmpFlow/del",{params:{id:row.oid}}).then(res=>{
                        this.$message.success("删除成功");
                        this.refresh();
                    }).catch(e=>{
                        this.$message.error(e.msg);
                    })
                });
            },
            /**
             *查看
             */
            lookItem(row) {
                this.$router.push(row.flowUrl);
            },
            /**
             * 向服务器请求当前用户的可申请的设备流程分类
             */
            requestProcessType() {
                this.$axios.get('bpm/definition/allowEmpFlow', {"params": {"typeId": "EMP_PROCESS","bpmDefKey":"EMP_FLOW"}}
                ).then(result => {
                    this.processTypeData[0].children = result.data;
                }).catch(error => {
                    this.$message.error("出错啦")
                })
            },
            refresh(){
                this.$refs.treeGrid.$refs.queryGrid.refresh();
            }
        },
        mounted() {
            this.requestProcessType();
            this.initDatamapListTree();
        }
    }
</script>

<style scoped>

</style>