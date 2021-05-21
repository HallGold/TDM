<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <el-dialog v-dialogDrag title="策略配置" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="1100px" append-to-body :close-on-click-modal="false" >
            <div class="ice-container">
                <el-form :model="mainDataForm"
                         label-position="right"

                         class="conditon-bar"
                         ref="form"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="策略编码:" label-width="100px" prop="code">
                                <el-input placeholder="策略编码" v-model="mainDataForm.code"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="策略名称:" label-width="100px" prop="codename">
                                <el-input placeholder="策略名称" v-model="mainDataForm.codename"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item label="适用操作:" label-width="100px" prop="name">
                               <!-- <el-checkbox-group v-model="mainDataForm.name">-->
                                    <el-checkbox :true-label=1 :false-label=0 label="查询" v-model="mainDataForm.validSelect"></el-checkbox>
                                    <el-checkbox :true-label=1 :false-label=0 label="修改" v-model="mainDataForm.validUpdate"></el-checkbox>
                                    <el-checkbox :true-label=1 :false-label=0 label="删除" v-model="mainDataForm.validDelete"></el-checkbox>
                               <!-- </el-checkbox-group>-->
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="优先级:" label-width="100px" prop="datapolicyPirority">
                                <el-select placeholder="优先级" v-model="mainDataForm.datapolicyPirority">
                                    <el-option label="一般" value="10"></el-option>
                                    <el-option label="强制" value="20"></el-option>
                                    <el-option label="系统强制" value="99"></el-option>
                                </el-select>
                            </el-form-item>

                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="合并模式:" label-width="100px" prop="datapolicyOperator">
                                <el-select placeholder="合并模式" v-model="mainDataForm.datapolicyOperator">
                                    <el-option label="模式一" value="or"></el-option>
                                    <el-option label="模式二" value="and"></el-option>
                                </el-select>
                            </el-form-item>

                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="表名:" label-width="100px" prop="tabname">
                                <el-input placeholder="表名" v-model="mainDataForm.tabname"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="表中文名:" label-width="100px" prop="zwcode">
                                <el-input placeholder="表中文名" v-model="mainDataForm.zwcode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-form>
                <div class="ice-button-bar ">
                    <el-button type="primary" @click="save">保存策略库</el-button>
                    <el-button type="info" @click="celue">套用策略库策略</el-button>
                </div>
                <div class="ice-streak"></div>
                <div><el-button type="text" icon="el-icon-menu">条件表达式</el-button></div>
                <div class="ice-grid-button-bar">

                    <el-button type="primary" icon="el-icon-plus" @click="addField">添加字段</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="addExpression">新增表达式</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="emptyColumn(detailGridData)">清空列表</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="expressionVaild">表达式效验</el-button>
                </div>
                <div class="grid-bar">

                    <ice-editable-table :data="detailGridData" :rules="detailRules" ref="detailtable">
                        <el-table-column :width="50"
                                         prop="sort"
                                         label="序号">
                            <template slot-scope="scope">
                                {{scope.sort}}
                            </template>
                        </el-table-column>

                        <ice-editable-table-column prop="a"
                                                   label="类型"
                                                   width="110"
                                                   input-type="select"
                                                   map-type-code="globalVarType">
                        </ice-editable-table-column>

                        <ice-editable-table-column prop="exprLpthesis"
                                                   label="左括号"
                                                   width="110"
                                                   input-type="select"
                                                   map-type-code="aleft">
                        </ice-editable-table-column>

                        <el-table-column prop="fieldCode"
                                         width="110"
                                         label="字段">
                            <template slot-scope="scope">
                                <el-select placeholder="请选择" v-model="scope.row.fieldCode">
                                    <el-option v-for="item in scope.row.optionField"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>

                        <ice-editable-table-column prop="operator"
                                                   label="操作符"
                                                   width="110"
                                                   input-type="select"
                                                   map-type-code="caozuo">
                        </ice-editable-table-column>

                        <el-table-column prop="param"
                                         width="170"
                                         label="参数值">
                            <template slot-scope="scope">
                                <el-input placeholder="参数值" v-model="scope.row.param" >
                                    <el-dropdown slot="append" placement="bottom-end">
                                        <el-button type="primary">
                                            <i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item ><el-button @click="globalVar" style="border: 0">全局变量选择</el-button></el-dropdown-item>
                                            <el-dropdown-item ><el-button @click="dept" style="border: 0">部门选择</el-button></el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </el-input>
                            </template>
                        </el-table-column>

                        <ice-editable-table-column prop="exprRpthesis"
                                                   width="110"
                                                   label="右括号"
                                                   input-type="select"
                                                   map-type-code="aright">
                        </ice-editable-table-column>

                        <el-table-column prop="datapolicyOperator"
                                         label="逻辑操作符">
                            <template slot-scope="scope">
                                <el-select placeholder="请选择" v-model="scope.row.datapolicyOperator">
                                    <el-option label="NULL" value=""></el-option>
                                    <el-option label="AND" value="AND"></el-option>
                                    <el-option label="OR" value="OR"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" width="180">
                            <template slot-scope="scope">
                                <el-button type="text"
                                           size="small" @click="del(scope.$index,scope.row)">删除
                                </el-button>
                                <el-button type="text" v-if="scope.$index!=0"
                                           size="small" @click="moveup(scope.$index)">上移
                                </el-button>
                                <el-button type="text" v-if="scope.$index!=detailGridData.length-1"
                                           size="small" @click="movedown(scope.$index)">下移
                                </el-button>
                            </template>
                        </el-table-column>
                    </ice-editable-table>
                </div><br/>

                <div class="ice-container">
                    <el-row >
                        <el-col :span="24">
                            <el-input placeholder="表达式效验" type="textarea" :rows="4"
                                      v-model="detailGridDataText" ref="yy"></el-input>
                        </el-col>
                    </el-row>
                </div><br/>
                <div class="ice-button-bar ">
                    <el-button type="info" @click="retFiled">返回</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog v-dialogDrag title="全局变量选择" custom-class="ice-dialog" center :visible.sync="dialogVisibleChoose"
                   width="1100px" append-to-body :close-on-click-modal="false">
            <TsysFieldLibChoose @select-confirm="selectConfirm"
                                chooseItem="multiple"
                                :pagination=false
                                tableId="a76649ea5ee941518a6a625fe85ea3ca"
                                @select-cannel="selectCannel"></TsysFieldLibChoose>
        </el-dialog>
        <el-dialog v-dialogDrag title="全局变量选择" custom-class="ice-dialog"
                   center :visible.sync="dialogVisibleGlobalVal"
                   width="1100px"
                   append-to-body
                   :extend-prop="sort"
                   :close-on-click-modal="false">
            <TsysCfgGlobalValChoose chooseItem="multiple"></TsysCfgGlobalValChoose>
        </el-dialog>
       <el-dialog v-dialogDrag title="保存到策略库" custom-class="ice-dialog" center :visible.sync="dialogVisibleStrategy"
                   width="1100px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :model="mainDataFormStrategy"
                         label-position="right"
                         class="conditon-bar"
                         ref="form"
                         :rules="formRulesStrategy"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="数据策略编码" label-width="100px" prop="datapolicyCode">
                                <el-input placeholder="数据策略编码" v-model="mainDataFormStrategy.datapolicyCode">
                                    <template slot="prepend">{{a}}</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item  label="数据策略名称" label-width="100px" prop="datapolicyName">
                                <el-input placeholder="数据策略名称" v-model="mainDataFormStrategy.datapolicyName">
                                    <template slot="prepend">{{b}}</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="数据策略分类" label-width="100px" prop="datapolicyClass">
                                <el-select placeholder="数据策略分类" v-model="mainDataFormStrategy.datapolicyClass">
                                    <el-option v-for="item in optionStrategy"
                                               :key="item.value"
                                               :label="item.label"
                                               :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="ice-button-bar ">
                    <el-button type="primary" @click="saveStrategy">保存</el-button>
                    <el-button type="info" @click="retStrategy">返回</el-button>
                </div>
            </div>
        </el-dialog>
    </div>

</template>

<script>

    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";
    import IceSelect from "../../../components/common/base/IceSelect";
    import TsysFieldLibChoose from "../../../pages/datamanage/tsys/TsysFieldLibChoose.vue";
    import TsysCfgGlobalValChoose from "../../../pages/datamanage/tsys/global/TsysCfgGlobalValChoose.vue";
    export default {
        name: "configStrategy",
        data(){
            return{
                dialogVisible:true,
                dialogVisibleChoose:false,
                dialogVisibleGlobalVal:false,
                dialogVisibleStrategy:false,
                condexprs:'',
                mainDataForm:{
                    code:'',
                    codename:'',
                    validSelect:0,
                    validUpdate:0,
                    validDelete:0,
                    datapolicyPirority:'',
                    datapolicyOperator:'',
                    tabname:'',
                    zwcode:''
                },
                detailRules:{},
                detailGridData:[],
                detailGridDataText:'',
                optionField:[],
                mainDataFormStrategy:{
                    datapolicyCode:"",
                    datapolicyName:"",
                    datapolicyClass:""
                },
                formRulesStrategy:{
                    datapolicyCode: {required: true, message: '请输入编码', repeatable: false},
                    datapolicyName: {required: true, message: '请输入名称'},
                    datapolicyClass: {required: true, message: '请输入类型'},
                },
                optionStrategy:[
                    {
                        label:"系统内置",
                        value:"1"
                    },
                    {
                        label:"台账类",
                        value:"2"
                    },
                    {
                        label:"工单类",
                        value:"3"
                    }
                ]
            }
        },

        watch:{
            detailGridData: {
                handler(newName, oldName) {
                    this.detailGridDataText="";
                   this.detailGridData.forEach(item=>{
                       for(let i in item) {
                           if(i!="a"){
                               if(item[i]&&i!="optionField"){
                                   this.detailGridDataText+=item[i]+" ";
                               }else if(i=="optionField"){
                                   this.detailGridDataText+=item[i][0].value+" ";
                               }
                           }
                       }
                    })
                   /*将字符串转为json*/
                    /*this.detailGridDataText=JSON.stringify(this.detailGridData);*/
                },
                immediate: true,
                deep: true
            }
        },
        methods:{
            /*添加字段*/
            addField(){
                this.dialogVisibleChoose=true;
            },

            /*保存策略库按钮--弹出保存到策略库界面*/
            save(){
                this.dialogVisibleStrategy=true;
            },
            /*保存策略库按钮*/
            saveStrategy(){
                let that = this;

                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let newData = {
                            condexprs:that.detailGridData
                        };

                        Object.assign(newData, that.mainDataFormStrategy,that.mainDataForm);
                        // console.log(newData);
                        debugger

                        let a=that.mainDataFormStrategy
                        let obj ="";
                        let gridData = Object.assign([], this.detailGridData);
                        /*类型作为判断条件，不需要传入，所以将他去除掉*/
                        for(let i=0;i<gridData.length;i++){
                            delete  gridData[i].a;
                        }


                        obj=JSON.stringify(gridData);
                        // console.log(obj);

                        this.$axios.post('/datamanage/TsysLibDatapolicy/saveOrUpdate', obj).then(result => {
                            this.$message.success("操作成功");
                            this.dialogVisible = false;
                            this.$refs.grid.refresh();
                        }).catch(error => {
                            this.$message.error("出错啦")
                        })
                    } else {
                        return false;
                    }
                });
            },
            /*保存到到策略库的返回按钮*/
            retStrategy(){
                this.dialogVisibleStrategy=false;
            },

            /*新增表达式*/
            addExpression(){
                this.detailGridData.push({a: '', exprLpthesis: '', fieldCode:'',operator: '',param:'',exprRpthesis:'', datapolicyOperator:'',});
            },
            /*清空列表*/
            emptyColumn(detailGridData){
                let a= [];
                this.detailGridData=a;
            },

            /*表达式校验*/
            expressionVaild(){

            },
            /*添加字段下的选择按钮*/
            selectConfirm(rows){
                for(let i=0;i<rows.length;i++){
                    let obj={};
                    obj.label=rows[i].columnName;
                    obj.value=rows[i].columnCode;
                    let optionField=[];
                    optionField.push(obj);
                    /*scope.row.param +=obj.value=rows[i].columnCode+",";*/

                    this.detailGridData.push({a: '', exprLpthesis: '', fieldCode:rows[i].columnCode,operator: '',param:'',exprRpthesis:'', datapolicyOperator:'',optionField:optionField});
                    /*console.log(optionField[0].label)*/
                }

                this.selectCannel();

            },
            /*添加字段下的取消按钮*/
            selectCannel(){
                this.dialogVisibleChoose=false;
            },

            /*选择全局变量*/
            globalVar(){
                this.dialogVisibleGlobalVal = true;
            },

            /*选择部门*/
            dept(){

            },
            /*替换函数，可实现换位*/
            swapArray(arr, index1, index2){
                arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                return arr;
            },

            /*删除当前行*/
            del(index){
                this.detailGridData.splice(index,1);
            },

            /*上移*/
            moveup(index){
                if (index != 0) {
                    this.detailGridData = this.swapArray(this.detailGridData, index, index - 1);
                }
            },

            /*下移*/
            movedown(index){
                if (index + 1 != this.detailGridData.length) {
                    this.detailGridData = this.swapArray(this.detailGridData, index, index + 1);
                }
            }

        },
        components: {IceSelect, IceEditableTableColumn, IceEditableTable, IceGridLayout,TsysFieldLibChoose,TsysCfgGlobalValChoose}
    }
</script>

<style scoped>

</style>
