<template>

    <ice-pop-selector
            load-url="/permission/res/table/outer/load_tblgrp_tree"
            label-prop="tblgroupName"
            value-prop="oid"
            :lazy="false"
            :data-url="'/permission/res/table/outer/search_tbl_baseinfo?groupId='+groupId"
            textProp="tableName"
            codeProp="tableCode"
            ref="select"
            mode="hidden"
            :gridIndex="false"
            @node-click="dataTree"
            @select-confirm="selectConfirm"
            :selections="selections"
            :query="query"
            :columns="columns"
            dialog-width="1100px">
    </ice-pop-selector>
</template>

<script>
    import IcePopSelector from "../../../components/common/base/IcePopSelector";

    export default {
        name: "serviceTableSelector",
        model: {
            prop: 'value',
            event: 'serviceTableSelectorChange'
        },
        props: {
            value: String,
            valueProp: {
                type: String,
                default: 'code'
            },
            selectedPersion: {
                type: Array,
                default: () => []
            },
            isSuccess:Function,
            serviceId:String,
        },
        data() {
            return {
                groupId:'',
                tableIds:'',
                innerValue: '',
                selections: [],

                query: [
                    {type: 'input', label: '表名', code: 'tableCode', value: '', exp: 'like'},
                    {type: 'input', label: '表名称', code: 'tableName', value: '', exp: 'like'},
                ],
                columns:[
                    {code:'tableCode',label:'表名',width:200, align:'left'},
                    {code:'tableName',label:'表名称',width:240, align:'left'},
                    {code:'remark',label:'备注',width:240, align:'left'},
                ]
            }
        },
        methods: {
            /**
             * 保存
             * @param rows
             */
            selectConfirm(rows){
                this.tableData = rows;
                this.tableIds = '';
                let arr = [];
                rows.forEach(item=>{
                    arr.push(item.oid);
                });
                if(arr.length>0){
                    this.tableIds = arr.join(',');
                }
                this.$axios.post("/permission/res/service/outer/add_serv_rel_tbls",{serviceId:this.serviceId,tableIds:this.tableIds}).then(success=>{
                    this.$message.success("保存成功");
                    this.isSuccess();
                }).catch(error=>{
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            },
            /**
             * 点击树节点返回相应的值
             * @param data
             */
            dataTree(data){
                this.groupId = data;
            },
            /**
             * 关闭窗口
             */
            selectCannel() {
                this.$refs.select.selectCannel();
                this.selectedPersion = [];
            },
            /**
             * 打开窗口
             */
            openDialog() {
                this.$refs.select.openDialog();
                /*this.$nextTick(()=>{
                    this.$refs.select.$refs.queryTreeGridPop.$refs.queryGrid.refresh();
                });*/
            },
            cleanColumnSelect() {
                this.$refs.select.cleanColumnSelect();
            },
            loadSectionsList() {
                if (this.selectedPersion && this.selectedPersion.length > 0) {
                    let codes = this.selectedPersion.map(item => {
                        if (typeof item == 'string') {
                            return item
                        } else {
                            return item.tableCode
                        }
                    }).join(",");
                    this.$axios.get("/permission/res/service/outer/get_rel_tblandprivs", {params: {serviceId: this.serviceId}})
                        .then(result => {
                            if (result.data) {
                                let selections = result.data.map(item => {
                                    return {
                                        tableCode: item.tableCode,
                                        tableName: item.tableName,
                                        remark: item.remark,
                                    }
                                });
                                this.selections = selections;
                                this.$nextTick(() => {
                                    this.$refs.select.reDoSelection();
                                })
                            }
                        })

                } else {
                    this.selections = [];
                }
            }
        },
        computed: {},
        watch: {
            value() {
                this.innerValue = this.value;
            },
            innerValue() {
                this.$emit("serviceTableSelectorChange", this.innerValue);
            },
            selectedPersion() {
                this.loadSectionsList()
            }
        },
        created() {
            this.loadSectionsList()
        },
        mounted() {
            this.innerValue = this.value;
        },
        components: {IcePopSelector}
    }

</script>


<style scoped>

</style>
