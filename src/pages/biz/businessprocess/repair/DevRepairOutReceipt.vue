<template>
    <ice-dialog title="设备维修任务表回执"
                :visible.sync="dialogEditVisible"
                width="70%" :close-on-click-modal="false" :before-close="closeItem">
        <div class="form-content" style="max-height: 600px;overflow-y: scroll;overflow-x: hidden">
            <el-form :model="devRepairData" label-position="right"
                     class="conditon-bar" ref="PAGE_ENUM.REFS.FORM.REF">

                <el-form-item label="" label-width="1px" prop="deleteDataCapacity">

                    <el-table
                            :data="editTables"
                            :span-method="arraySpanMethod"
                            border
                            :show-header="false"
                            style="width: 100%">
                        <el-table-column
                                prop="name"
                                label="ID"
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="costOption"
                                label="姓名">
                            <template slot-scope="scope">
                                <div v-if="scope.$index !== 3 && scope.$index !== 4 && scope.$index !== 7 && scope.$index !==8 && scope.$index !== 3">
                                    <span>{{scope.row.costOption}}</span>
                                </div>
                                <el-checkbox-group v-model="devRepairData.repairCategory" v-if="scope.$index === 3">
                                    <el-checkbox v-for="column in PAGE_ENUM.REPAIR_CATEGORY" :label="column.CODE"
                                                 :key="column.CODE">
                                        {{column.LABEL}}
                                    </el-checkbox>
                                </el-checkbox-group>
                                <div v-if="scope.$index === 4">
                                    <!--<el-radio v-model="devRepairData.devSecretLevel" v-for="item in PAGE_ENUM.REPAIR_SECRET_LEVEL"-->
                                               <!--:label="item.CODE">{{item.LABEL}}</el-radio>-->
                                    <el-checkbox-group v-model="devRepairData.devSecretLevel" :max="1">
                                        <el-checkbox v-for="column in PAGE_ENUM.REPAIR_SECRET_LEVEL" :label="column.CODE"
                                                     :key="column.CODE">
                                            {{column.LABEL}}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </div>

                                <div v-if="scope.$index === 7">
                                    <span style="margin-right:10px">(涉密维修时填写此项)是否已告知您安全保密要求</span>
                                    <el-radio v-model="devRepairData.informPrivary" label="1">是</el-radio>
                                    <el-radio v-model="devRepairData.informPrivary" label="0">否</el-radio>
                                </div>

                                <div style="height: 80px;width: 100%" v-if="scope.$index === 8">
                                    <div style="width: 70%;height:100%;float: left"><span style="margin-top: 40%"></span></div>
                                    <div style="width: 30%;height:100%;float: right">
                                        <div style="width: 100%;">
                                            <span style="display: block;padding-top:13%">签字：</span>
                                            <span style="display: block;">完成日期：</span>
                                        </div>
                                    </div>
                                </div>

                                <div style="height: 80px;width: 100%" v-if="scope.$index === 9">

                                </div>

                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="shouldCost"
                                label="数值 1">


                        </el-table-column>
                        <el-table-column
                                prop="realityCost"
                                label="数值 2">
                            <template slot-scope="scope">
                                <div>
                                    <span>{{scope.row.realityCost}}</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>

            </el-form>
        </div>
    </ice-dialog>
</template>

<script>
    // import common from '@/utils/common.js';
    import IceSelect from "@/components/common/base/IceSelect";
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import IceTree from '@/components/common/base/IceTree.vue'
    import IceDialog from "@/components/common/base/IceDialog";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import IceImageUploader from "@/components/common/base/IceImageUpload";

    export default {
        name: "DevRepairOutReceipt",
        components: {
            IceSelect,
            IceGridLayout,
            IceTree,
            IceDialog,
            IceEditableTableColumn,
            IceEditableTable,
            IceImageUploader
        },
        props: {
            outerReceiptData:{
                type: Object
            },
            saveRepairFrom: {//绑定数据前对数据处理
                type: Function,
                default: data => data
            }
        },
        data(){
            return{
                PAGE_ENUM:{
                    REPAIR_CATEGORY:[
                        {CODE:1,LABEL:'硬件维修'},
                        {CODE:2,LABEL:'数据恢复'},
                        {CODE:3,LABEL:'介质消磁'},
                        {CODE:4,LABEL:'信息消除'}
                    ],
                    REPAIR_SECRET_LEVEL:[
                        // 密级,1：未定密；2：公开；3：内部；4：机密；5：绝密
                        {CODE:6,LABEL:'未定密'},
                        {CODE:1,LABEL:'公开'},
                        {CODE:2,LABEL:'内部'},
                        {CODE:3,LABEL:'秘密'},
                        {CODE:4,LABEL:'机密'},
                        {CODE:5,LABEL:'绝密'}
                    ]
                },
                dialogEditVisible:false,
                devRepairData:{
                    repairCategory:[],
                    applyOrgName:'',//送修单位
                    applyUserName:'',//送修人
                    applyPhone:'',//联系电话
                    applyDate:'',//送修日期
                    externalRepairDeptName:'',//维修单位
                    receiveDate:'',//接件日期
                    externalRepairMan:'',//维修人员姓名
                    externalRepairManPhone:'',//维修人员联系方式
                    faultDiagnosis:'',//故障现象及诊断情况
                    devSecretLevel:[]
                },
                editTables:[],
                showInnerSelfRepair:false,//所内自行维修填写项展示
                showMainInnerRepair:false,//质保单位所内维修填写项展示
                showOutRepair:false,//送外维修填写项展示
            }
        },
        methods:{
            opendialog(){

                //送外维修回执表单，如果需要带出默认信息可放开此处
                // Object.assign(this.devRepairData, this.outerReceiptData);

                this.initTable();

                this.dialogEditVisible = true;
            },

            initTable(){
                this.editTables=[
                    {name:'送修单位',costOption:this.devRepairData.applyOrgName,shouldCost:'送修人',realityCost:this.devRepairData.applyUserName},
                    {name:'送修单位',costOption:'',shouldCost:'联系电话',realityCost:this.devRepairData.applyPhone},
                    {name:'送修部门',costOption:this.devRepairData.applyDeptName,shouldCost:'送修日期',realityCost:this.devRepairData.applyDate},
                    {name:'维修类别',costOption:'',shouldCost:'',realityCost:''},
                    {name:'设备密级',costOption:'',shouldCost:'',realityCost:''},
                    {name:'维修单位',costOption:this.devRepairData.externalRepairDeptName,shouldCost:'接件日期',realityCost:this.devRepairData.receiveDate},
                    {name:'维修人员姓名',costOption:this.devRepairData.externalRepairMan,shouldCost:'维修人员联系方式',realityCost:this.devRepairData.externalRepairManPhone},
                    {name:'保密措施监管情况',costOption:'',shouldCost:'',realityCost:''},
                    {name:'故障现象及诊断情况',costOption:this.devRepairData.faultDiagnosis,shouldCost:'',realityCost:''},
                    {name:'备注',costOption:'',shouldCost:'',realityCost:''}

                ]
            },
            closeItem(){
                this.dialogEditVisible = false
            },
            /**
             * 合并单元格
             * 参数：当前行row、当前列column、当前行号rowIndex、当前列号columnIndex四个属性
             * 返回值：[a,b] a为rowspan,b为colspan
             *
             */
            arraySpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    if(rowIndex === 0){
                        return [2,1]
                    }else if(rowIndex === 1){
                        return [0,0]
                    }
                }else if(columnIndex === 1){
                    if(rowIndex === 0){
                        return [2,1]
                    }else if(rowIndex === 1){
                        return [0,0]
                    }else if(rowIndex === 3){
                        return [1,3]
                    }else if(rowIndex === 4){
                        return [1,3]
                    }else if(rowIndex === 7){
                        return [1,3]
                    }else if(rowIndex === 8){
                        return [1,3]
                    }else if(rowIndex === 9){
                        return [1,3]
                    }
                }else if(columnIndex === 2){
                    if(rowIndex === 3){
                        return [0,0]
                    }else if(rowIndex === 4){
                        return [0,0]
                    }else if(rowIndex === 7){
                        return [0,0]
                    }else if(rowIndex === 8){
                        return [0,0]
                    }else if(rowIndex === 9){
                        return [0,0]
                    }
                }else{
                    if(rowIndex === 3){
                        return [0,0]
                    }else if(rowIndex === 4){
                        return [0,0]
                    }else if(rowIndex === 7){
                        return [0,0]
                    }else if(rowIndex === 8){
                        return [0,0]
                    }else if(rowIndex === 9){
                        return [0,0]
                    }
                }
            },
            repairModeChanged(){
                if(this.devRepairData.repairMode === 1){//所内自行维修
                    this.showInnerSelfRepair = true
                    this.showMainInnerRepair = false
                    this.showOutRepair = false
                }else if(this.devRepairData.repairMode === 2){//质保单位所内维修
                    this.showInnerSelfRepair = false
                    this.showMainInnerRepair = true
                    this.showOutRepair = false
                }else {//送外维修
                    this.showInnerSelfRepair = false
                    this.showMainInnerRepair = false
                    this.showOutRepair = true
                }
            },
        },
    }
</script>

<style scoped>

</style>