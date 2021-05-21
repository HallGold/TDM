<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="流程实例监控"
                        data-url="/bpm/pro/all"
                        :query="query"
                        :columns="columns"
                        :operations="operations"
                        :buttons="buttons" ref="grid">
        </ice-query-grid>
        <!--<ice-grid-layouts :columns="4" gutter="20px">-->

        <!--</ice-grid-layouts>-->
    </div>
</template>


<script>

    import IceQueryGrid from '../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../components/common/base/IceGridLayout.vue'

    export default {
        name: 'ProcessInstanceMonitor',
        data() {
            return {
                query: [
                    {
                        type: 'tab',
                        label: '状态',
                        code: 'afStatus',
                        value: '1',
                        tablist: [{label: '全部', value: 'all'},{label: '草稿', value: '-1'}, {label: '运行中', value: '1'}
                            , {label: '已完成', value: '2'}, {label: '驳回', value: '3'}]
                    },
                   // {type: 'input', label: '流程KEY', code: 'actDefKey'},
                    {type: 'input', label: '流程名称', code: 'bpmDefName', value: ''},
                   // {type: 'input', label: '标题', code: 'subject'},
                    {type: 'select', label: '流程状态', code: 'afStatus',mapTypeCode:"flow_af_status", value: ''},

                    {type: 'date', label: '发起时间从', code: 'beginTime', value: '', exp: '>='},
                    {type: 'date', label: '至', code: 'beginTime', value: '', exp: '<='},

                    {type: 'input', label: '当前环节名称', code: 'currentNodeName', value: ''},
                    {type: 'input', label: '发起人', code: 'createrName', value: ''},
                    {type: 'input', label: '当前处理人', code: 'nodeAssignerName', value: ''},
                    {type: 'input', label: '业务单号', code: 'bizInfo', value: ''}
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'formId', hidden: true},
                    {code: 'actInstId', hidden: true},
                    {code: 'actDefId', hidden: true},
                    {code: 'dataId', hidden: true},

                   // {label: '流程KEY', code: 'actDefKey', width: 100,sortable: true},
                    {label: '业务单号', code: 'bizInfo', width: 180},
                    {label: '流程名称', code: 'bpmDefName', width: 180,sortable: true,align:'left'},
                    //{label: '标题', code: 'subject', width: 250},
                    {label: '状态', code: 'afStatus', width: 80,mapTypeCode:"flow_af_status",sortable: true},
                    {label: '发起时间', code: 'beginTime', width: 150,sortable: true,align:'left'},
                    {label: '发起人', code: 'createrName', width: 90,sortable: true,align:'left'},
                    {label: '发起人部门', code: 'createrDeptName', width: 120,sortable: true,align:'left'},
                    //{label: '当前环节ID', code: 'currentNodeId', width: 100},
                    {label: '当前环节', code: 'currentNodeName', width: 100,sortable: true,align:'left'},
                    {label: '当前环节处理人', code: 'nodeAssignerName', width: 100,align:'left'},
                    {label: '当前环节开始时间', code: 'nodeBeginTime', width: 140,sortable: true,align:'left'},
                    {label: '结束时间', code: 'endTime', width: 140,sortable: true},

                    ],
                operations: [
                    {name: '查看', callback: this.showItem},
                    {name: '删除', callback: this.deleteItem}
                ],
                buttons: [
                    //{name: '删除', icon: 'el-icon-plus', type: 'primary', callback: this.deleteItem},
                    {name: '导出', icon: 'el-icon-plus', type: 'export'}]
            }
        },
        methods: {
            export(item) {
                this.$router.push("/bpm/")
            },
            showItem(item) {
                //this.$router.push(item.formId);
                this.$openFlow(item.formId);
            },
            deleteItem(row) {
                //alert(JSON.stringify(row));
                this.$confirm('删除后不可恢复,确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.post('/bpm/pro/run', {
                        bizData: JSON.stringify({}), flowContext: {
                            actInstId: row.actInstId,
                            actDefId: row.actDefId,
                            dataId: row.dataId,
                            nodeId: row.currentNodeId,
                            operateType: "destroy"
                        }
                    }).then(result => {
                        this.$message.success("删除成功")
                        this.$refs.grid.refresh();
                    }).catch(error => {
                        this.$message.error(error.msg)
                    })
                });
            }
        },
        components: {
            IceQueryGrid,
            IceGridLayout
        }
    }

</script>


<style scoped>

</style>
<!--<template>-->
    <!--<div class="" style="width: 100%">-->
        <!--<el-container >-->
            <!--<div class="container">-->
                <!--<template>-->
                    <!--<div>-->
                        <!--<el-row>-->
                            <!--<el-col :span="17">-->
                                <!--<div class="grid-content ">-->
                                    <!--<el-button type="danger" plain  @click="delVisible = true">删除</el-button>-->
                                    <!--<el-button type="primary" plain>导出</el-button>-->
                                <!--</div>-->
                            <!--</el-col>-->
                            <!--<el-col :span="4">-->
                                <!--<div class="grid-content ">-->
                                    <!--<el-input-->
                                            <!--placeholder="请输入内容"-->
                                            <!--v-model="input21">-->
                                        <!--<i slot="prefix" class="el-input__icon el-icon-search"></i>-->
                                    <!--</el-input>-->
                                <!--</div>-->
                            <!--</el-col>-->
                            <!--<el-col :span="3">-->
                                <!--<div class="grid-content">-->
                                    <!--<el-button type="primary" plain>高级</el-button>-->
                                    <!--<el-button type="primary" plain>重置</el-button>-->
                                <!--</div>-->
                            <!--</el-col>-->
                        <!--</el-row>-->
                    <!--</div>-->
                    <!--<el-table ref="multipleTable"-->
                              <!--:data="tableData"-->
                              <!--:show-header="true"-->
                              <!--tooltip-effect="dark"-->
                              <!--style="width: 100%"-->
                              <!--@selection-change="handleSelectionChange">-->
                        <!--<el-table-column-->
                                <!--fixed="left"-->
                                <!--type="selection"-->
                                <!--width="40"-->
                                <!--@click="toggleSelection(tableData)">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--prop="actDefKey"-->
                                <!--label="流程定义KEY"-->
                                <!--width="100"-->
                        <!--&gt;-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--prop="bpmDefName"-->
                                <!--label="流程名称"-->
                                <!--width="100">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--prop="subject"-->
                                <!--label="标题">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--prop="afStatus"-->
                                <!--label="状态">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--prop="beginTime"-->
                                <!--label="发起时间">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--prop="endTime"-->
                                <!--label="结束时间">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--prop="createrName"-->
                                <!--label="发起人姓名">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--prop="createrDeptName"-->
                                <!--label="发起人部门">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--prop="currentNodeId"-->
                                <!--label="当前环节ID">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--prop="currentNodeName"-->
                                <!--label="当前环节名称">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--prop="nodeBeginTime"-->
                                <!--label="当前环节开始时间">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--prop="nodeAssignerName"-->
                                <!--label="当前环节处理人">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--prop="bizInfo"-->
                                <!--label="业务单号">-->
                        <!--</el-table-column>-->
                        <!--&lt;!&ndash;<el-table-column&ndash;&gt;-->
                                <!--&lt;!&ndash;fixed="right"&ndash;&gt;-->
                                <!--&lt;!&ndash;label="操作"&ndash;&gt;-->
                                <!--&lt;!&ndash;width="60">&ndash;&gt;-->
                            <!--&lt;!&ndash;<template slot-scope="scope">&ndash;&gt;-->
                                <!--&lt;!&ndash;<el-button type="text" size="small" @click="edit(scope.$index, scope.row)">修改</el-button>&ndash;&gt;-->
                            <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->
                    <!--</el-table>-->
                <!--</template>-->
                <!--&lt;!&ndash; 编辑弹出框 &ndash;&gt;-->
                <!--<el-dialog :title="titleMap[dialogTittle]" :visible.sync="editVisible" width="30%">-->
                    <!--<el-form ref="form" :model="form" label-width="50px">-->
                        <!--<el-form-item label="日期">-->
                            <!--<el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="姓名">-->
                            <!--<el-input v-model="form.name"></el-input>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="地址">-->
                            <!--<el-input v-model="form.address"></el-input>-->
                        <!--</el-form-item>-->

                    <!--</el-form>-->
                    <!--<span slot="footer" class="dialog-footer">-->
                    <!--<el-button @click="editVisible = false">取 消</el-button>-->
                    <!--<el-button type="primary" @click="saveEdit">确 定</el-button>-->
                <!--</span>-->
                <!--</el-dialog>-->

                <!--&lt;!&ndash; 删除提示框 &ndash;&gt;-->
                <!--<el-dialog title="提示" :visible.sync="delVisible" width="300px" center>-->
                    <!--<div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>-->
                    <!--<span slot="footer" class="dialog-footer">-->
                    <!--<el-button @click="delVisible = false">取 消</el-button>-->
                    <!--<el-button type="primary" @click="deleteRow">确 定</el-button>-->
                <!--</span>-->
                <!--</el-dialog>-->
            <!--</div>-->
        <!--</el-container>-->
    <!--</div>-->
<!--</template>-->

<!--<script>-->
    <!--export default {-->
        <!--name: 'processInstanceMonitor',-->
        <!--data() {-->
            <!--return {-->
                <!--input21:'',-->
                <!--showHeader: true,-->
                <!--editVisible: false,-->
                <!--delVisible: false,-->
                <!--multipleSelection: [],-->
                <!--form: {-->
                    <!--name: '',-->
                    <!--date: '',-->
                    <!--address: ''-->
                <!--},-->
                <!--titleMap: {-->
                    <!--add:'新增',-->
                    <!--edit:'修改'-->
                <!--},-->
                <!--idx: -1,-->
                <!--dialogTittle:'',-->
                <!--tableData:[]-->
            <!--}-->
        <!--},-->
        <!--methods: {-->
            <!--handleEdit(index, row) {-->
                <!--this.idx = index;-->
                <!--const item = this.tableData[index];-->
                <!--this.form = {-->
                    <!--name: item.name,-->
                    <!--date: item.date,-->
                    <!--address: item.address-->
                <!--}-->
                <!--this.editVisible = true;-->
            <!--},-->
            <!--// 保存编辑-->
            <!--saveEdit() {-->
                <!--debugger;-->
                <!--const dialogTittle = this.dialogTittle;-->
                <!--if(dialogTittle=="add"){-->
                    <!--this.tableData.push(this.form);-->
                    <!--this.editVisible = false;-->
                    <!--this.$message.success(`新增成功`);-->
                    <!--this.form={};-->
                <!--}else if(dialogTittle=="edit"){-->
                    <!--this.$set(this.tableData, this.idx, this.form);-->
                    <!--this.editVisible = false;-->
                    <!--this.$message.success(`修改第 ${this.idx+1} 行成功`);-->
                    <!--this.form={};-->
                <!--}-->
            <!--},-->
            <!--// 确定删除-->
            <!--deleteRow(){-->
                <!--this.tableData.splice(this.idx,1);-->
                <!--this.delVisible=false;-->
            <!--},-->
            <!--toggleSelection(rows) {-->
                <!--if (rows) {-->
                    <!--rows.forEach(row => {-->
                        <!--this.$refs.multipleTable.toggleRowSelection(row);-->
                    <!--});-->
                <!--} else {-->
                    <!--this.$refs.multipleTable.clearSelection();-->
                <!--}-->
            <!--},-->
            <!--handleSelectionChange(val) {-->
                <!--this.multipleSelection = val;-->
            <!--},-->
            <!--add() {-->
                <!--this.form={};-->
                <!--//显示弹框-->
                <!--this.editVisible = true;-->
                <!--//新增弹框标题-->
                <!--this.dialogTittle = "add";-->
            <!--},-->
            <!--edit(index,row) {-->
                <!--//显示弹框-->
                <!--this.editVisible = true;-->
                <!--this.idx = index;-->
                <!--//修改弹框标题-->
                <!--this.dialogTittle = "edit";-->
                <!--const item = this.tableData[index];-->
                <!--this.form={-->
                    <!--name: item.name,-->
                    <!--date: item.date,-->
                    <!--address: item.address-->
                <!--};-->
            <!--}-->
        <!--},-->
        <!--mounted() {-->
            <!--//流程实例监控-->
            <!--this.$axios.get("/bpm/bpm/pro/apply", {params: {userCode: 'tianding',current:1,size:5,status:1}})-->
                <!--.then(result => {-->
                    <!--let data = result.data;-->
                    <!--this.tableData=data;-->
                <!--})-->
        <!--},-->
        <!--computed: {-->
        <!--}-->
    <!--}-->
<!--</script>-->

<!--<style scoped>-->
    <!--.container{-->
        <!--width: 95.4%;-->
    <!--}-->
    <!--/*-->
    <!--.el-row {-->
        <!--margin-bottom: 20px;-->
        <!--&:last-child {-->
             <!--margin-bottom: 0;-->
         <!--}-->
    <!--}-->
    <!--.el-col {-->
        <!--border-radius: 4px;-->
    <!--}-->
    <!--.bg-purple-dark {-->
        <!--background: #99a9bf;-->
    <!--}-->

    <!--.bg-purple {-->
        <!--background: #d3dce6;-->
    <!--}-->
     <!--*/-->
    <!--.bg-purple-light {-->
        <!--background: #e5e9f2;-->
    <!--}-->
    <!--.grid-content {-->
        <!--border-radius: 4px;-->
        <!--min-height: 36px;-->
    <!--}-->
    <!--.row-bg {-->
        <!--padding: 10px 0;-->
        <!--background-color: #f9fafc;-->
    <!--}-->
<!--</style>-->
