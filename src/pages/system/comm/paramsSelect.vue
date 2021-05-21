<template>
    <div>
        <el-dialog v-dialog-drag
                   title="参数配置"
                   custom-class="ice-dialog"
                   center
                   :visible.sync="dialogVisible"
                   width="800px"
                   append-to-body
                   :before-close="closeDialog"
                   :close-on-click-modal="false">
            <el-input v-model="textValue" v-if="isInput" :placeholder="placeholderItem"></el-input>
            <ice-select v-model="selectValue"
                        v-if="isSelect"
                        map-type-code="DATA_SECRET_LEVEL">
            </ice-select>
            <div class="ice-button-bar">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button type="info" @click="closeDialog">取消</el-button>
            </div>
        </el-dialog>
        <!--<ice-dept-selector  @select-confirm="selectDeptConfirm"
                            :chooseItem="chooseItem"
                            ref="iceDept"
                            mode="hidden">
        </ice-dept-selector>-->
        <select-dept @select-confirm="selectDeptConfirm"
                     :chooseItem="chooseItem"
                     :selectionsArr="selectedCodes"
                     :valueProp="valueProp"
                     ref="iceDept"
                     mode="hidden"></select-dept>
        <select-org ref="selectOrg"
                    :selectionsArr="selectedCodes"
                    :valueProp="valueProp"
                    :chooseItem="chooseItem"
                    @select-confirm="selectDeptConfirm">
        </select-org>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import SelectOrg from "./selectOrg";
    import IceSelect from "../../../components/common/base/IceSelect";
    import SelectDept from "./selectDept";
    export default {
        name: "paramsSelect",
        components: {SelectDept, IceSelect, SelectOrg, IceDeptSelector, IceQueryGrid},
        data(){
            return{
                dialogVisible:false,            //弹框的开关属性
                textValue:'',                   //类型为自定义输入---手动输入的值
                selectArr:[],                   //类型为下拉选---下拉选的数据集合
                selectValue:'',                 //类型为下拉选---下拉选的值
                dialogValue:[],                 //类型为弹窗---列表勾选的值
                selectedCodes:[],
                valueProp:'deptCode',
                columns:[
                    {code:'oid',hidden:true},
                    {label:'单位名称',code:'orgName'},
                    {label:'单位编码',code:'orgCode'}
                ],                     //table列表的表头内容
                chooseItem:'single',            //是否为多选
                isInput:false,
                isDialog:false,
                isSelect:false,
                placeholderItem:'',
            }
        },
        methods:{
            selectDeptConfirm(data){
                this.dialogValue =data;
                this.$emit("chooseItem",this.dialogValue);
                //TODO 暂时不支持选择单位，后续需要修改
                // if(this.$refs.selectOrg){
                //     this.$refs.selectOrg.$refs.select.$refs.queryTreeGridPop.$refs.queryGrid.cleanColumnSelect();
                // }
            },
            dialogChoose(){
                this.isInput = false;
                this.isDialog = true;
                this.isSelect = false;
            },
            inputChoose(){
                this.dialogVisible = true;
                this.isInput = true;
                this.isDialog = false;
                this.isSelect = false;
            },
            selectChoose(){
                this.dialogVisible = true;
                this.isInput = false;
                this.isDialog = false;
                this.isSelect = true;
            },
            openDialog(obj,data){
                if(obj.inputType == '90' && obj.valueType== '10'){//自定义输入--部门
                    this.placeholderItem = '请输入部门';
                    this.inputChoose();
                }
                if(obj.inputType == '90' && obj.valueType== '20'){//自定义输入--单位
                    this.placeholderItem = '请输入单位';
                    this.inputChoose();
                }
                if(obj.inputType == '90' && obj.valueType== '30'){//自定义输入--密级
                    this.placeholderItem = '请输入密级';
                    this.inputChoose();
                }
                if(obj.inputType == '20' && (obj.valueType== '10'||obj.valueType== '11')){//弹出table--部门
                    this.dialogChoose();
                    this.showItem(obj.isMulti,obj.valueType,data.authParamValue);
                    this.$refs.iceDept.openDialog();
                }
                if(obj.inputType == '20' && (obj.valueType== '20'||obj.valueType== '21')){//弹出table--单位
                    this.dialogChoose();
                    this.showItem(obj.isMulti,obj.valueType,data.authParamValue);
                    this.$refs.selectOrg.openDialog();
                }
                if(obj.inputType == '20' && obj.valueType== '30'){//下拉选--密级
                    this.selectChoose();
                }
            },

            /**
             * 点击行选择数据
             */
            selectionChange(rows){
                this.dialogValue = rows;

            },
            showItem(isMulti,valueType,authParamValue){//回显
                if(isMulti == 'Y'){
                    this.chooseItem = 'multiple';
                }else{
                    this.chooseItem = 'single';
                }
                if(valueType == '10' || valueType == '20'){
                    this.valueProp = 'deptLevCode'
                }else{
                    this.valueProp = 'deptCode'
                }
                this.selectedCodes = authParamValue?authParamValue.split(','):[];
            },

            /**
             * 保存
             */
            save(){
                if(this.isInput){
                    this.$emit("chooseItem",this.textValue);
                    this.closeDialog()
                    this.$nextTick(()=>{
                        this.textValue = '';
                    })
                }else if(this.isDialog){
                    this.$emit("chooseItem",this.dialogValue);
                    this.closeDialog();
                }else if(this.isSelect){
                    this.$emit("chooseItem",this.selectValue);
                    this.closeDialog();
                    this.$nextTick(()=>{
                        this.selectValue = '';
                    })
                }
            },

            /**
             * 取消
             */
            closeDialog(){
                this.dialogVisible = false;
            },

            /**
             * 获取部门的数据
             */
            getDeptData(){
                let url='';
                let obj = {params:{}};
                this.getData(url,obj);
            },

            /**
             * 获取单位的数据
             */
            getOrgData(){
                let url='';
                let obj = {params:{}};
                this.getData(url,obj);
            },

            /**
             * 获取密级的数据
             */
            getClassificationData(){
                let url='';
                let obj = {params:{}};
                this.getData(url,obj);
            },
            getData(url,obj){
                this.$axios.get(url,obj).then(success=>{
                    this.gridData = success.data;
                }).catch(error=>{
                    this.$message.error(error.msg);
                })
            }
        },
        mounted(){
            /*this.$refs.iceDept.openDialog();*/
            /*this.$refs.selectOrg.openDialog();*/
        }
    }
</script>

<style scoped>
    .outer{
        display: flex;
    }
    .inner_left{
        width: 85%;
    }
    .inner_left_cls{
        width: 100%;
    }
    .inner_right{
        width: 15%;
        background-color: #ffffff;
    }
    .look{
        display: flex;
        flex-direction: column;
        max-height: 326px;
        overflow-x: hidden;
    }
</style>
