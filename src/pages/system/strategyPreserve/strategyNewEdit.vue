<template>
    <div>
        <ice-dialog v-dialogDrag
                    title="数据隔离策略配置"
                    :visible.sync="dialogVisible"
                    width="1000px"
                    :before-close="closeDialog">
            <el-form :model="mainDataForm"
                     :rules="formRules"
                     ref="form"
                     label-width="100px">
                <ice-grid-layout name="基础信息" :columns=1 gutter="0px" :expandable=false>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="策略编码" label-width="120px" prop="privilegeCode">
                                <el-input v-model="mainDataForm.privilegeCode" maxlength="20"
                                          :disabled="isEdit || disableAll"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="策略名称" label-width="120px" prop="privilegeName">
                                <el-input v-model="mainDataForm.privilegeName" maxlength="20"
                                          :disabled="disableAll"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="分组间连接方式" label-width="120px">
                                <el-select v-model="mainDataForm.privilegeConfig.grpMergeType" disabled>
                                    <el-option label="AND" value="AND"></el-option>
                                    <el-option label="OR" value="OR"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="分组内合并方式" label-width="120px" prop="privilegeConfig.privMergeType">
                                <el-select v-model="mainDataForm.privilegeConfig.privMergeType" :disabled="disableAll">
                                    <el-option label="AND" value="AND"></el-option>
                                    <el-option label="OR" value="OR"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </ice-grid-layout>
                <ice-grid-layout name="条件定义" :columns=1 gutter="0px" :expandable=false>
                    <el-row :gutter="40">
                        <el-col :span="24">
                            <div style="margin-bottom: 2px">
                                <el-button @click="addItem" type="primary">新增</el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="24">
                            <ice-query-grid :gridData="gridData"
                                            :operations="operations"
                                            :pagination="false"
                                            :columns="columns"></ice-query-grid>
                        </el-col>
                    </el-row>
                </ice-grid-layout>
            </el-form>
            <div class="ice-button-bar" slot="footer">
                <el-button type="primary" size="medium" @click="detailItem" ctrlCode="bccl">查看配置</el-button>
                <el-button type="primary" size="medium" @click="save" ctrlCode="bccl">保存</el-button>
                <el-button type="info" size="medium" @click="closeDialog" unauth="true">取消</el-button>
            </div>
        </ice-dialog>
        <ice-dialog v-dialogDrag
                    title="隔离策略条件维护"
                    :visible.sync="dialogVisibleEdit"
                    width="800px"
                    remounted>
            <el-form :model="mainData"
                     :rules="formEditRules"
                     ref="formEdit"
                     label-width="100px">
                <ice-grid-layout name="条件维护" :columns=1 gutter="0px" :expandable=false>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="字段类型编码" label-width="120px"
                                          prop="privilegeConfig.conditions.fieldTypeCode">
                                <el-select v-model="mainData.privilegeConfig.conditions.fieldTypeCode"
                                           @change="fieldTypeChanged" :disabled="disableAll">
                                    <el-option v-for="item in fieldArr"
                                               :key="item.globalfieldCode"
                                               :label="item.globalfieldName"
                                               :value="item.globalfieldCode"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="默认字段名称" label-width="120px"
                                          prop="privilegeConfig.conditions.defaultFieldName">
                                <el-input v-model="mainData.privilegeConfig.conditions.defaultFieldName"
                                          :disabled="disableAll"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="参数输入方式" label-width="120px"
                                          prop="privilegeConfig.conditions.parameter.inputType">
                                <el-select v-model="mainData.privilegeConfig.conditions.parameter.inputType"
                                           @change="typeOpChange" :disabled="disableAll">
                                    <el-option label="全局变量" value="10"></el-option>
                                    <el-option label="弹出选择" value="20"></el-option>
                                    <el-option label="自定义输入" value="90"></el-option>
                                    <el-option label="自定义常量" value="99"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="参数运算符" label-width="120px" prop="privilegeConfig.conditions.binaryOp">
                                <el-select v-model="mainData.privilegeConfig.conditions.binaryOp" @change="typeOpChange"
                                           :disabled="disableAll">
                                    <el-option label="=" value="="></el-option>
                                    <el-option label="<=" value="<="></el-option>
                                    <el-option label=">=" value=">="></el-option>
                                    <el-option label="<>" value="<>"></el-option>
                                    <el-option label="IN" value="IN"></el-option>
                                    <el-option label="右匹配" value="LIKE"></el-option>
                                    <el-option label="包含" value="ILIKE"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12" v-if="mainData.privilegeConfig.conditions.parameter.inputType=='20'">
                            <el-form-item label="选择数据类型" label-width="120px"
                                          prop="privilegeConfig.conditions.parameter.valueType">
                                <el-select v-model="mainData.privilegeConfig.conditions.parameter.valueType"
                                           :disabled="disableAll">
                                    <el-option label="部门" value="11"></el-option>
                                    <el-option label="部门层级码" value="10"></el-option>
                                    <el-option label="单位" value="21"></el-option>
                                    <el-option label="单位层级码" value="20"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="mainData.privilegeConfig.conditions.parameter.inputType=='10'">
                            <el-form-item label="值" label-width="120px" prop="privilegeConfig.conditions.parameter.value">
                                <el-select v-model="mainData.privilegeConfig.conditions.parameter.value"
                                           @change="$nextTick(()=>{$refs.formEdit.clearValidate(['privilegeConfig.conditions.parameter.value'])})"
                                           :disabled="disableAll">
                                    <el-option v-for="item in gVarAttr"
                                               :key="item.globalvarCode"
                                               :label="item.globalvarName"
                                               :value="item.globalvarCode"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="mainData.privilegeConfig.conditions.parameter.inputType=='99'">
                            <el-form-item label="常量值" label-width="120px" prop="privilegeConfig.conditions.parameter.value">
                                <el-input v-model="mainData.privilegeConfig.conditions.parameter.value"
                                          :disabled="disableAll">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </ice-grid-layout>
            </el-form>
            <div class="ice-button-bar" slot="footer">
                <el-button type="primary" size="medium" @click="itemSave" ctrlCode="bccl">确定</el-button>
                <el-button type="info" size="medium" @click="dialogVisibleEdit = false" unauth="true">取消</el-button>
            </div>
        </ice-dialog>
        <ice-dialog v-dialogDrag
                    title="配置信息"
                    :visible.sync="dialogVisibleDetails"
                    width="800px"
                    remounted>
            <ice-grid-layout name="配置信息" :columns=1 gutter="0px" :expandable=false>
                <el-row :gutter="40">
                    <el-col :span="24">
                        <el-input v-model="privilegeConfigString"
                                  disabled
                                  type="textarea" rows="20"
                                  resize="none"
                                  maxlength="2000"></el-input>
                    </el-col>
                </el-row>
            </ice-grid-layout>
        </ice-dialog>
    </div>

</template>

<script>
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "strategyNewEdit",
        components: {IceQueryGrid, IceGridLayout},
        props: {
            mainDataForm: Object,
            isSuccess: Function,
            isEdit: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                columns:[
                    {label:'字段类型编码',code:'fieldTypeCode',align:'left',formatter:(row)=>{
                        return row.privilegeConfig?this.getGlobalfieldName(row.privilegeConfig.conditions.fieldTypeCode):'';
                        }},
                    {label:'默认字段名称',align:'left',formatter:(row)=>{
                            return row.privilegeConfig?row.privilegeConfig.conditions.defaultFieldName:''
                        }},
                    {label:'策略配置信息',code:'privilegeConfig',align:'left',formatter:(row)=>{
                            return JSON.stringify(row.privilegeConfig)
                        }},
                ],
                operations:[
                    {name:'编辑',callback:this.updateItem},
                    {name:'删除',callback:this.delItem},
                ],
                gridData:[],
                formRules:{
                    privilegeCode: [{required: true, whitespace: true, message: '请输入策略编码', trigger: 'blur'}],
                    privilegeName: [{required: true, whitespace: true, message: '请输入策略名称', trigger: 'blur'}],
                    'privilegeConfig.privMergeType': [{required: true, message: '请选择分组内合并方式', trigger: 'change'}],
                },
                formEditRules: {
                    'privilegeConfig.conditions.defaultFieldName': [{
                        required: true,
                        whitespace:true,
                        message: '请输入默认字段名称',
                        trigger: 'change'
                    }],
                    'privilegeConfig.conditions.parameter.inputType': [{
                        required: true,
                        message: '请选择参数输入方式',
                        trigger: 'change'
                    }],
                    'privilegeConfig.conditions.binaryOp': [{required: true, message: '请选择参数运算符', trigger: 'change'}],
                },
                dialogVisible: false,    //弹窗的开关属性
                gVarAttr: [],//值数据
                fieldArr: [],//字段类型编码数据
                privilegeConfigString: '',
                disableAll: false,//是否自定义
                dialogVisibleEdit:false,//条件定义弹窗开关属性
                isAdd:false,
                index:0,//记录条件定义列表当前操作数据的下标
                mainData:{//策略配置
                    privilegeCode: '',
                    privilegeName: '',
                    privilegeConfig: {
                        privType: '10',//根据左边的数据带出
                        grpMergeType: 'AND',//根据左边的列表数据带出
                        privMergeType: 'OR',//下拉选，默认OR
                        condMergeType: 'OR',//下拉选，默认OR

                        conditions: {
                            fieldTypeCode: 'DeptLevCode',//选择框
                            defaultFieldName: 'DATA_DEPT_LEVCODE_',//根据上面的选择自动带出数据，可修改
                            binaryOp: 'IN',//可选值=/in，默认=
                            parameter: {
                                inputType: '20',
                                valueType: '10',
                                value: '',
                                isMulti: 'Y'
                            }
                        }
                    }
                },
                dialogVisibleDetails:false,//查看配置弹窗开关属性
            }
        },
        methods: {

            /**
             * 保存
             */
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        delete this.mainDataForm.frameDataPrivType;
                        delete this.mainDataForm.dataPrivilegeConfig;
                        if (!this.isEdit) {
                            delete this.mainDataForm.oid;
                        }
                        if(this.gridData.length === 0){
                            this.$message.warning("请至少添加一条条件定义");
                            return false;
                        }
                        let obj = this.formatData();
                        obj.privilegeConfig = JSON.stringify(obj.privilegeConfig);
                        this.$axios.post("/permission/datapriv/outer/save/privdef_info", obj).then(success => {
                            this.$message.success("保存成功");
                            this.closeDialog();
                            this.isSuccess();
                        }).catch(error => {
                            this.$message.error(error.msg ? error.msg : '操作出错了');
                        });
                    }
                });
            },
            /**
             * 取消
             */
            closeDialog() {
                this.resetForm();
                this.dialogVisible = false;
            },
            /**
             * 打开弹窗
             */
            openDialog(curSelectGroup) {
                this.disableAll = false;
                this.gridData = [];
                if (curSelectGroup) {
                    this.mainDataForm.privilegeConfig.privType = curSelectGroup.privtypeCode;
                    this.mainDataForm.privilegeConfig.grpMergeType = curSelectGroup.mergeType;
                }
                this.dialogVisible = true;
                let t = this;
                this.$nextTick(() => {
                    this.privilegeConfigString = JSON.stringify(this.mainDataForm.privilegeConfig);
                    console.log(t.mainDataForm.gridData, 't.mainDataForm.gridData')
                    t.mainDataForm.gridData.forEach(item=>{
                        let clone = require('clone');
                        let obj = clone(this.mainDataForm);
                        obj.privilegeConfig.conditions = item;
                        console.log(obj, 'obj')
                        t.gridData.push(obj)
                    })
                    let tid = setTimeout(()=>{
                        console.log(this.gridData, 'gridData')
                    }, 1000)

                });
                this.opFormRlues();

            },
            resetForm() {
                this.$refs.form.resetFields();
            },
            /**
             * 字段类型编码change事件
             * @param val
             */
            fieldTypeChanged(val) {
                if (!val) {
                    this.mainData.privilegeConfig.conditions.defaultFieldName = '';
                    this.mainData.privilegeConfig.conditions.displayName = '自定义字段';
                    return;
                }
                let thiz = this;
                this.fieldArr.forEach((v, i) => {
                    if (v.globalfieldCode == val) {
                        thiz.mainData.privilegeConfig.conditions.defaultFieldName = v.defaultfieldName;
                        thiz.mainData.privilegeConfig.conditions.displayName = v.globalfieldName;
                        return false;
                    }
                })
            },
            /**
             * 参数运算符change事件
             */
            typeOpChange() {

                //当参数运算符为--‘IN’与参数输入方式为--弹窗类型时为多选
                if (this.mainData.privilegeConfig.conditions.binaryOp == 'IN'
                    && this.mainData.privilegeConfig.conditions.parameter.inputType == '20') {
                    this.mainData.privilegeConfig.conditions.parameter.isMulti = 'Y';
                } else {
                    this.mainData.privilegeConfig.conditions.parameter.isMulti = 'N';
                }
                //当参数输入方式不为--弹窗框类型时清空--选择数据类型
                if (this.mainData.privilegeConfig.conditions.parameter.inputType != '20') {
                    this.mainData.privilegeConfig.conditions.parameter.valueType = '0';
                } else {
                    this.mainData.privilegeConfig.conditions.parameter.valueType = '20';
                }
                //当参数输入方式不为--全局变量时清空--值
                if (this.mainData.privilegeConfig.conditions.parameter.inputType != '10'
                    || this.mainData.privilegeConfig.conditions.parameter.inputType != '99') {
                    this.mainData.privilegeConfig.conditions.parameter.value = '';
                } else {
                    this.mainData.privilegeConfig.conditions.parameter.valueType = '0';
                }
                this.opFormRlues();
                this.$nextTick(() => {
                    this.$refs.formEdit.clearValidate(['privilegeConfig.conditions.parameter.value']);
                })
            },
            /**
             * 参数输入方式改变后对应的验证改变
             */
            opFormRlues() {
                if (this.mainData.privilegeConfig.conditions.parameter.inputType == '10') {
                    //类型为全局变量
                    this.formEditRules['privilegeConfig.conditions.parameter.value'] = [{
                        required: true,
                        message: '请选择值',
                        trigger: 'change'
                    }]
                } else if (this.mainData.privilegeConfig.conditions.parameter.inputType == '20') {
                    //类型为弹窗
                    this.formEditRules['privilegeConfig.conditions.parameter.valueType'] = [{
                        required: true,
                        message: '请选择数据类型',
                        trigger: 'change'
                    }]
                } else {
                    //类型为自定义
                    delete this.formEditRules['privilegeConfig.conditions.parameter.value'];
                    delete this.formEditRules['privilegeConfig.conditions.parameter.valueType'];
                }
            },
            getBaseData() {
                //获取值
                this.$axios.get("/permission/datapriv/outer/get_global_vars").then(res => {
                    this.gVarAttr = res.data;
                }).catch(e => {
                    if (e.msg) {
                        this.$message.error(e.msg);
                    } else {
                        this.$message.error(e);
                    }
                });
                //获取字段类型编码
                this.$axios.get("/permission/datapriv/outer/get_global_tblfield_info").then(res => {
                    this.fieldArr = [{
                        globalfieldCode: '',
                        globalfieldName: '自定义字段',
                        defaultfieldName: ''
                    }];
                    this.fieldArr.push(...res.data);

                }).catch(e => {
                    if (e.msg) {
                        this.$message.error(e.msg);
                    } else {
                        this.$message.error(e);
                    }
                });
            },
            /**
             * 自定义
             */
            definitionItem() {
                if (this.disableAll) {
                    this.disableAll = false;
                } else {
                    this.disableAll = true;
                }
            },
            /**
             * 条件定义--新增
             */
            addItem(){
                this.isAdd = true;
                let clone = require('clone');
                this.mainData = clone(this.mainDataForm);//克隆带过来的数据，给与默认值
                this.dialogVisibleEdit = true;
            },
            /**
             * 条件定义--编辑
             * @param row
             */
            updateItem(row){
                this.isAdd = false;
                this.index = this.getIndex(row);
                let clone = require('clone');
                this.mainData = clone(row);//克隆当行的数据，给与默认值
                this.dialogVisibleEdit = true;
            },
            /**
             * 条件定义--删除
             * @param row
             */
            delItem(row){
                let index = this.getIndex(row);
                this.gridData.splice(index,1);
            },
            /**
             * 条件定义--新增弹窗--确定
             */
            itemSave(){
                this.$refs.formEdit.validate((valid) => {
                    if (valid) {
                        if((this.delSame(this.gridData,this.mainData.privilegeConfig.conditions.fieldTypeCode,'fieldTypeCode')||
                            !this.mainData.privilegeConfig.conditions.fieldTypeCode && this.delSame(this.gridData,this.mainData.privilegeConfig.conditions.defaultFieldName,'defaultFieldName')) && this.isAdd){
                            this.gridData.push(this.mainData);
                        }else if(!this.isAdd){
                            this.gridData[this.index] = this.mainData;
                            this.gridData = Object.assign([],this.gridData);
                        }
                        this.dialogVisibleEdit = false;
                    }
                });

            },
            /**
             * 条件定义列表--获取字段类型编码对应的中文名称
             * @param code
             * @returns {string}
             */
            getGlobalfieldName(code){
                for (let i = 0; i < this.fieldArr.length; i++) {
                    if(this.fieldArr[i].globalfieldCode === code){
                        return this.fieldArr[i].globalfieldName
                    }
                }
                return ''
            },
            /**
             * 查看配置
             */
            detailItem(){
                this.privilegeConfigString = JSON.stringify(this.formatData());
                this.dialogVisibleDetails = true;
            },
            /**
             * 去除字段类型编码一样的数据
             * @param list
             * @param val
             * @param code
             * @returns {boolean}
             */
            delSame(list,val,code){
                for (let i = 0; i < list.length; i++) {
                    if(list[i].privilegeConfig.conditions[code] === val){
                        return false
                    }
                }
                return true
            },
            /**
             * 数据格式化
             * @returns {*}
             */
            formatData(){
                let clone = require('clone');
                let obj = clone(this.mainDataForm);
                obj.privilegeConfig.conditions = [];
                this.gridData.forEach(item=>{
                    obj.privilegeConfig.conditions.push(item.privilegeConfig.conditions);
                });
                return obj;
            },
            /**
             * 获取下标
             * @param row
             * @returns {number}
             */
            getIndex(row){
                for (let i = 0; i <this.gridData.length ; i++) {
                    if(this.gridData[i].privilegeConfig.conditions.fieldTypeCode === row.privilegeConfig.conditions.fieldTypeCode){
                        return i
                    }
                }
            }
        },
        mounted() {
            this.getBaseData();
        },
    }
</script>

<style scoped>

</style>
