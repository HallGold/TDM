<template>
    <ice-dialog title="涉密计算机硬件与外部设备维修收费价格表"
                :visible.sync="dialogEditVisible"
                style="font-weight: bolder"
                width="70%" :close-on-click-modal="false">
        <div class="form-content" style="max-height: 600px;overflow-y: scroll;overflow-x: hidden">
            <el-table
                    :data="editTables"
                    :span-method="arraySpanMethod"
                    border
                    :show-header="false"
                    style="width: 100%;font-size: 15px">
                <el-table-column
                        prop="category"
                        label="类别"
                        width="150">
                    <template slot-scope="scope">
                        <div v-if="scope.$index == 0">
                            <span style="font-size: 18px;">{{scope.row.category}}</span>

                        </div>
                        <div v-else-if="scope.$index == 13" style="width: 100%">
                            <div>
                                <span>计费公式:</span>
                            </div>
                            <div style="padding-left: 6%">
                                <span>涉密计算机维修服务费 = 维修费 + 差旅费;</span>
                            </div>
                            <div style="padding-left: 6%;padding-top: 2%">
                                <span>维修费 = 硬件故障诊断费 + 硬件故障维修费 + 维修材料费 + 维修材料管理费;</span>
                            </div>
                            <div style="padding-left: 6%;padding-top: 2%">
                                <span>维修材料管理费 = 维修材料费 × 15%;</span>
                            </div>
                        </div>
                        <div v-else-if="scope.$index == 14" style="width: 100%">
                            <div>
                                <span>备注:</span>
                            </div>
                            <div style="padding-left: 6%">
                                <span>故障诊断及故障维修费不包含维修过程中发生的耗材费、零部件等材料费用，维修材料费根据购买的零部件材料费据实收取;</span>
                            </div>
                            <div style="padding-left: 6%;padding-top: 2%">
                                <span>只诊断故障但不处理的或已检查出故障,但因零部件材料价格原因或其他原因双方无法达成一致的,用户决定它处另行维修的照
                                    常收取硬件故障诊断费;</span>
                            </div>
                            <div style="padding-left: 6%;padding-top: 2%">
                                <span>上门服务仅限市区以内,如是市区以外开展的维修项目,还需据实测算所需的差旅费。省外测算标准按照0.2万/人·天执行,省内
                                    测算标准按照0.1万/人·天执行;</span>
                            </div>
                            <div style="padding-left: 6%;padding-top: 2%">
                                <span>非密计算机硬件与外部设备维修费在此计价基础上7折计价。</span>
                            </div>
                        </div>
                        <div v-else>
                            {{scope.row.category}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="devType"
                        label="计价项1">
                    <template slot-scope="scope">
                        <div v-if="scope.$index == 0">
                            <span style="font-size: 18px;">{{scope.row.devType}}</span>
                        </div>
                        <div v-else>
                            {{scope.row.devType}}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column
                        prop="serviceType"
                        label="计价项2">

                </el-table-column>

                <el-table-column
                        prop="calcUnit"
                        label="计价单位">
                    <template slot-scope="scope">
                        <div v-if="scope.$index == 0">
                            <span style="font-size: 18px;">{{scope.row.calcUnit}}</span>

                        </div>
                        <div v-else>
                            {{scope.row.calcUnit}}
                        </div>
                    </template>

                </el-table-column>
                <el-table-column
                        prop="unitPrice"
                        label="单价(元)">
                    <template slot-scope="scope">
                        <div v-if="scope.$index == 0">
                            <span style="font-size: 18px;">{{scope.row.unitPrice}}</span>

                        </div>
                        <div v-else>
                            {{scope.row.unitPrice}}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </ice-dialog>
</template>

<script>
    import IceDialog from "../../../../components/common/base/IceDialog";
    import devComm from "../../dev/js/comm/devComm"
    export default {
        name: "DevRepairPriceByHw",
        components: {IceDialog},
        mixins: [devComm],
        data(){
            return{
                editTables:[],
                dialogEditVisible:false,
                PAGE_DATA:{
                    PC_SEND_TO_SERVICE:'',//台式-送修服务价格
                    PC_DOOR_TO_SERVICE:'',//台式-上门服务价格
                    LAPTOP_SEND_TO_SERVICE:'',//笔记本-送修服务价格
                    LAPTOP_DOOR_TO_SERVICE:'',//笔记本-上门服务价格
                    GK_SEND_TO_SERVICE:'',//工控机-送修服务价格
                    GK_DOOR_TO_SERVICE:'',//工控机-上门服务价格
                    FW_SEND_TO_SERVICE:'',//服务器-送修服务价格
                    FW_DOOR_TO_SERVICE:'',//服务器-上门服务价格
                    WS_SEND_TO_SERVICE:'',//计算机外设-送修服务价格
                    WS_DOOR_TO_SERVICE:'',//计算机外设-上门服务价格
                    INTERNAL_COMPANY:'',//院内单位-维修费用/每工时
                    EXTERNAL_COMPANY:'',//院外单位-维修费用/每工时
                },
            }
        },
        methods:{
            initTables(){
                this.transformDictionaryToPageData();
                this.editTables=[
                    {category:'类别',devType:'计价项',serviceType:'',calcUnit:'计价单位',unitPrice:'单价'},
                    {category:'故障诊断',devType:'台式电脑',serviceType:'送修服务',calcUnit:'台',unitPrice:this.PAGE_DATA.PC_SEND_TO_SERVICE},
                    {category:'',devType:'',serviceType:'上门服务',calcUnit:'台',unitPrice:this.PAGE_DATA.PC_DOOR_TO_SERVICE},
                    {category:'',devType:'笔记本',serviceType:'送修服务',calcUnit:'台',unitPrice:this.PAGE_DATA.LAPTOP_SEND_TO_SERVICE},
                    {category:'',devType:'',serviceType:'上门服务',calcUnit:'台',unitPrice:this.PAGE_DATA.LAPTOP_DOOR_TO_SERVICE},
                    {category:'',devType:'工控机',serviceType:'送修服务',calcUnit:'台',unitPrice:this.PAGE_DATA.GK_SEND_TO_SERVICE},
                    {category:'',devType:'',serviceType:'上门服务',calcUnit:'台',unitPrice:this.PAGE_DATA.GK_DOOR_TO_SERVICE},
                    {category:'',devType:'服务器(含工作站)',serviceType:'送修服务',calcUnit:'台',unitPrice:this.PAGE_DATA.FW_SEND_TO_SERVICE},
                    {category:'',devType:'',serviceType:'上门服务',calcUnit:'台',unitPrice:this.PAGE_DATA.FW_DOOR_TO_SERVICE},
                    {category:'',devType:'计算机外设',serviceType:'送修服务',calcUnit:'台',unitPrice:this.PAGE_DATA.WS_SEND_TO_SERVICE},
                    {category:'',devType:'',serviceType:'上门服务',calcUnit:'台',unitPrice:this.PAGE_DATA.WS_DOOR_TO_SERVICE},

                    {category:'硬件故障维修',devType:'院内单位',serviceType:'',calcUnit:'每工时',unitPrice:this.PAGE_DATA.INTERNAL_COMPANY},
                    {category:'',devType:'院外单位',serviceType:'',calcUnit:'每工时',unitPrice:this.PAGE_DATA.EXTERNAL_COMPANY},

                    {category:'',devType:'',serviceType:'',calcUnit:'',unitPrice:''},
                    {category:'',devType:'',serviceType:'',calcUnit:'',unitPrice:''}
                ]
            },
            /** 数据字典值转换为页面展示数据*/
            transformDictionaryToPageData(){
                this.ENUMS.DEV_REPAIR_PRICE_REF_DATA.forEach(item =>{
                    for(let it in this.PAGE_DATA){
                        if(item.code == it){
                            this.PAGE_DATA[it] = item.name
                        }
                    }
                })

            },
            opendialog(){
                this.initTables()
                //送外维修回执表单，如果需要带出默认信息可放开此处
                // Object.assign(this.devRepairData, this.outerReceiptData);
                this.dialogEditVisible = true;
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
                        return [1,1]
                    }else if(rowIndex === 1){
                        return [10,1]
                    }else if(rowIndex === 11){
                        return [2,1]
                    }else if(rowIndex === 13){
                        return [1,5]
                    }else if(rowIndex === 14){
                        return [1,5]
                    }else{
                        return [0,0]
                    }
                }else if(columnIndex === 1){
                    if(rowIndex === 0){
                        return [1,2]
                    }else if(rowIndex === 1){
                        return [2,1]
                    }else if(rowIndex === 3){
                        return [2,1]
                    }else if(rowIndex === 5){
                        return [2,1]
                    }else if(rowIndex === 7){
                        return [2,1]
                    }else if(rowIndex === 9){
                        return [2,1]
                    }else if(rowIndex === 11){
                        return [1,2]
                    }else if(rowIndex === 12){
                        return [1,2]
                    }else{
                        return [0,0]
                    }
                }else if(columnIndex === 2){
                    if(rowIndex === 0){
                        return [0,0]
                    }else if(rowIndex === 11){
                        return [0,0]
                    }else if(rowIndex === 12){
                        return [0,0]
                    }
                }else if(columnIndex === 3){
                    if(rowIndex === 0){
                        return [1,1]
                    }else if(rowIndex === 1){
                        return [2,1]
                    }else if(rowIndex === 3){
                        return [2,1]
                    }else if(rowIndex === 5){
                        return [2,1]
                    }else if(rowIndex === 7){
                        return [2,1]
                    }else if(rowIndex === 9){
                        return [2,1]
                    }else if(rowIndex === 11){
                        return [1,1]
                    }else if(rowIndex === 12){
                        return [1,1]
                    }else{
                        return [0,0]
                    }
                }else{
                    if(rowIndex === 13){
                        return [0,0]
                    }else if(rowIndex === 14){
                        return [0,0]
                    }
                }
            },
        },
        mounted() {
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.DEV_REPAIR_PRICE_REFERENCE.CODE),
            ];
            Promise.all(prepareTaskChain).then();
        }
    }
</script>

<style lang="less" scoped>
    /*.el-table td{*/
        /*padding: 0px 0!important;*/
        /*.cell{*/
            /*line-height: 40px;*/
        /*}*/
        /*.cell span{*/
            /*border-right: 1px solid #EBEEF5;*/
            /*padding: 10px 7px;*/
            /*width: 100px;*/
            /*display: inline-block;*/
        /*}*/
        /*.cell span:nth-child(2){*/
            /*border: none;*/
        /*}*/
    /*}*/

    .el-table tr:nth-child(2){

            background-color: #EBEEF5;

    }

</style>