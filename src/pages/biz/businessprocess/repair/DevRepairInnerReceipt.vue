<template>
    <ice-dialog title="设备维修任务表回执" center
                :visible.sync="dialogEditVisible"
                width="70%" :close-on-click-modal="false" :before-close="closeItem">
        <div class="form-content" style="max-height: 800px;overflow-y: scroll;overflow-x: hidden">
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
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="costOption"
                                label="姓名">
                            <template slot-scope="scope">
                                <div v-if="scope.$index == 15">
                                    <div>
                                        <el-checkbox v-model="confirmAndReceiptDev">确认维修结果并接收设备</el-checkbox>
                                    </div>
                                    <div>
                                        <span>签字：</span>
                                    </div>
                                </div>
                                <div v-else>
                                    <span>{{scope.row.costOption}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="shouldCost"
                                label="数值 1">
                            <template slot-scope="scope">
                                <div v-if="scope.$index >=3 && scope.$index <=14" style="width: 100%">
                                    <div style="float: left;width: 95%">
                                        <span>{{scope.row.shouldCost}}</span>
                                    </div>
                                    <div style="float: right;width: 5%">
                                        <span>元</span>
                                    </div>
                                </div>
                                <div v-else>
                                    <span>{{scope.row.shouldCost}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="realityCost"
                                label="数值 2">
                            <template slot-scope="scope">
                                <div v-if="scope.$index >=3 && scope.$index <=14" style="width: 100%">
                                    <div style="float: left;width: 95%">
                                        <span>{{scope.row.realityCost}}</span>
                                    </div>
                                    <div style="float: right;width: 5%">
                                        <span>元</span>
                                    </div>
                                </div>
                                <div v-else>
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
        name: "DevRepairInnerReceipt",
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
            innerReceiptData:{
                type: Object
            }
        },
        data(){
            return{
                dialogEditVisible:false,
                devRepairData:{
                    repairCategory:[],

                },
                editTables:[],
                confirmAndReceiptDev:false
            }
        },
        methods:{
            opendialog(){

                Object.assign(this.devRepairData, this.innerReceiptData);
                console.log(this.devRepairData)
                this.initTableData()

                this.dialogEditVisible = true;
            },
            initTableData(){

                this.editTables=[
                    {name:'送修单位',costOption:this.devRepairData.applyOrgName,shouldCost:'送修人',realityCost:this.devRepairData.applyUserName},
                    {name:'',costOption:'',shouldCost:'联系电话',realityCost:this.devRepairData.applyPhone},
                    {name:'设备维修',costOption:'费用',shouldCost:'应收',realityCost:'实收'},
                    {name:'设备维修',costOption:'硬件故障诊断',shouldCost:this.devRepairData.costHardwarePhenExpect,realityCost:this.devRepairData.costHardwarePhenActual},
                    {name:'设备维修',costOption:'硬件故障维修',shouldCost:this.devRepairData.costHardwareRepairExpect,realityCost:this.devRepairData.costHardwareRepairActual},
                    {name:'设备维修',costOption:'维修材料费',shouldCost:this.devRepairData.costRepairMaterialExpect,realityCost:this.devRepairData.costRepairMaterialActual},
                    {name:'设备维修',costOption:'维修材料管理费',shouldCost:this.devRepairData.costRepairMaterialMExpect,realityCost:this.devRepairData.costRepairMaterialMActual},
                    {name:'设备维修',costOption:'差旅费',shouldCost:this.devRepairData.costTravelExpect,realityCost:this.devRepairData.costTravelActual},


                    {name:'数据恢复',costOption:'基本费',shouldCost:this.devRepairData.costDataBaseExpect,realityCost:this.devRepairData.costDataBaseActual},
                    {name:'数据恢复',costOption:'开盘费',shouldCost:this.devRepairData.costDataDiskExpect,realityCost:this.devRepairData.costDataDiskActual},
                    {name:'数据恢复',costOption:'阵列组合修复费',shouldCost:this.devRepairData.costDataArrayExpect,realityCost:this.devRepairData.costDataArrayActual},
                    {name:'数据恢复',costOption:'恢复费',shouldCost:this.devRepairData.costDataRecoverExpect,realityCost:this.devRepairData.costDataRecoverActual},

                    {name:'数据粉碎',costOption:'信息消除费用',shouldCost:this.devRepairData.costMsgDeleteExpect,realityCost:this.devRepairData.costMsgDeleteActual},
                    {name:'数据粉碎',costOption:'介质消除费用',shouldCost:this.devRepairData.costMediumDeleteExpect,realityCost:this.devRepairData.costMediumDeleteActual},

                    {name:'合计',costOption:'',shouldCost:this.devRepairData.costTotalExpect,realityCost:this.devRepairData.costTotalActual},

                    {name:'用户签字',costOption:'',shouldCost:'取件日期',realityCost:this.devRepairData.backDate},

                    {name:'备注',costOption:this.devRepairData.remark,shouldCost:'',realityCost:''}

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
                    }else if(rowIndex === 2){
                        return [6,1]
                    }else if(rowIndex === 8){
                        return [4,1]
                    }else if(rowIndex === 12){
                        return [2,1]
                    }else if(rowIndex === 14){
                        return [1,2]
                    }else if(rowIndex === 15){
                        return [1,1]
                    }else if(rowIndex === 16){
                        return [1,1]
                    }else{
                        return [0,0]
                    }
                }else if(columnIndex === 1){
                    if(rowIndex === 0){
                        return [2,1]
                    }else if(rowIndex === 1){
                        return [0,0]
                    }else if(rowIndex === 14){
                        return [0,0]
                    }else if(rowIndex === 16){
                        return [1,3]
                    }
                }else if(columnIndex === 2){
                    if(rowIndex === 16){
                        return [0,0]
                    }
                }else{
                    if(rowIndex === 16){
                        return [0,0]
                    }
                }
            },
        },
        mounted() {
        }
    }
</script>

<style scoped>

</style>