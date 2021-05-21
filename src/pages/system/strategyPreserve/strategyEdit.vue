<template>
    <ice-dialog v-dialogDrag
                title="数据隔离策略配置"
                center
                :visible.sync="dialogVisible"
                width="800px"
                append-to-body
                :before-close="closeDialog"
                :close-on-click-modal="false">
        <el-form :model="mainDataForm"
                 :rules="formRules"
                 ref="form"
                 label-width="100px">
            <ice-grid-layout name="隔离策略配置信息" :columns=1 gutter="0px" :expandable=false>
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
                    <!--<el-col :span="12">
                        <el-form-item label="表达式合并方式" label-width="120px" prop="privilegeConfig.condMergeType">
                            <el-select v-model="mainDataForm.privilegeConfig.condMergeType">
                                <el-option label="AND" value="AND"></el-option>
                                <el-option label="OR" value="OR"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>-->
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
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item label="字段类型编码" label-width="120px"
                                      prop="privilegeConfig.conditions.fieldTypeCode">
                            <el-select v-model="mainDataForm.privilegeConfig.conditions.fieldTypeCode"
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
                            <el-input v-model="mainDataForm.privilegeConfig.conditions.defaultFieldName"
                                      :disabled="disableAll"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item label="参数输入方式" label-width="120px"
                                      prop="privilegeConfig.conditions.parameter.inputType">
                            <el-select v-model="mainDataForm.privilegeConfig.conditions.parameter.inputType"
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
                            <el-select v-model="mainDataForm.privilegeConfig.conditions.binaryOp" @change="typeOpChange"
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
                    <el-col :span="12" v-if="mainDataForm.privilegeConfig.conditions.parameter.inputType=='20'">
                        <el-form-item label="选择数据类型" label-width="120px"
                                      prop="privilegeConfig.conditions.parameter.valueType">
                            <el-select v-model="mainDataForm.privilegeConfig.conditions.parameter.valueType"
                                       :disabled="disableAll">
                                <el-option label="部门" value="11"></el-option>
                                <el-option label="部门层级码" value="10"></el-option>
                                <el-option label="单位" value="21"></el-option>
                                <el-option label="单位层级码" value="20"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="mainDataForm.privilegeConfig.conditions.parameter.inputType=='10'">
                        <el-form-item label="值" label-width="120px" prop="privilegeConfig.conditions.parameter.value">
                            <el-select v-model="mainDataForm.privilegeConfig.conditions.parameter.value"
                                       :disabled="disableAll">
                                <el-option v-for="item in gVarAttr"
                                           :key="item.globalvarCode"
                                           :label="item.globalvarName"
                                           :value="item.globalvarCode"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="mainDataForm.privilegeConfig.conditions.parameter.inputType=='99'">
                        <el-form-item label="常量值" label-width="120px" prop="privilegeConfig.conditions.parameter.value">
                            <el-input v-model="mainDataForm.privilegeConfig.conditions.parameter.value"
                                      :disabled="disableAll">
                                <el-option v-for="item in gVarAttr"
                                           :key="item.globalvarCode"
                                           :label="item.globalvarName"
                                           :value="item.globalvarCode"></el-option>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="40">
                    <el-col :span="24" v-show="!disableAll">
                        <el-form-item label="策略配置信息" label-width="120px">
                            <el-input :value="JSON.stringify(mainDataForm.privilegeConfig)"
                                      type="textarea" rows="8"
                                      disabled
                                      resize="none"
                                      maxlength="2000"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-show="disableAll">
                        <el-form-item label="策略配置信息" label-width="120px">
                            <el-input v-model="privilegeConfigString"
                                      type="textarea" rows="8"
                                      resize="none"
                                      maxlength="2000"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </ice-grid-layout>
        </el-form>
        <div class="ice-button-bar" slot="footer">
            <el-button type="primary" size="medium" @click="definitionItem" ctrlCode="bccl">
                {{disableAll?'取消自定义':'自定义'}}
            </el-button>
            <el-button type="primary" size="medium" @click="save" ctrlCode="bccl">保存</el-button>
            <el-button type="info" size="medium" @click="closeDialog" unauth="true">取消</el-button>
        </div>
    </ice-dialog>
</template>

<script>
    import IceGridLayout from "../../../components/common/base/IceGridLayout";

    export default {
        name: "strategyEdit",
        components: {IceGridLayout},
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
                formRules: {
                    privilegeCode: [{required: true, whitespace: true, message: '请输入策略编码', trigger: 'blur'}],
                    privilegeName: [{required: true, whitespace: true, message: '请输入策略名称', trigger: 'blur'}],
                    'privilegeConfig.privMergeType': [{required: true, message: '请选择分组内合并方式', trigger: 'change'}],
                    'privilegeConfig.condMergeType': [{required: true, message: '请选择表达式合并方式', trigger: 'change'}],
                    'privilegeConfig.conditions.defaultFieldName': [{
                        required: true,
                        whitespace: true,
                        message: '请输入默认字段名称',
                        trigger: 'blur'
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
                        let clone = require('clone');
                        let obj = clone(this.mainDataForm);
                        obj.privilegeConfig = this.disableAll ? this.privilegeConfigString : JSON.stringify(obj.privilegeConfig);
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
            openDialog(privTypeId, curSelectGroup) {
                debugger
                console.log('curSelectGroup : %o', curSelectGroup);
                this.disableAll = false;
                this.mainDataForm.privilegetypeId = privTypeId;
                if (curSelectGroup) {
                    this.mainDataForm.privilegeConfig.privType = curSelectGroup.privtypeCode;
                    this.mainDataForm.privilegeConfig.grpMergeType = curSelectGroup.mergeType;
                }
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.privilegeConfigString = JSON.stringify(this.mainDataForm.privilegeConfig);
                });
                this.opFormRlues();
            },
            resetForm() {
                this.$refs.form.resetFields();
            },
            fieldTypeChanged(val) {
                if (!val) {
                    this.mainDataForm.privilegeConfig.conditions.defaultFieldName = '';
                    this.mainDataForm.privilegeConfig.conditions.displayName = '自定义字段';
                    return;
                }
                let thiz = this;
                this.fieldArr.forEach((v, i) => {
                    if (v.globalfieldCode == val) {
                        thiz.mainDataForm.privilegeConfig.conditions.defaultFieldName = v.defaultfieldName;
                        thiz.mainDataForm.privilegeConfig.conditions.displayName = v.globalfieldName;
                        return false;
                    }
                })
            },
            typeOpChange() {

                //当参数运算符为--‘IN’与参数输入方式为--弹窗类型时为多选
                if (this.mainDataForm.privilegeConfig.conditions.binaryOp == 'IN'
                    && this.mainDataForm.privilegeConfig.conditions.parameter.inputType == '20') {
                    this.mainDataForm.privilegeConfig.conditions.parameter.isMulti = 'Y';
                } else {
                    this.mainDataForm.privilegeConfig.conditions.parameter.isMulti = 'N';
                }
                //当参数输入方式不为--弹窗框类型时清空--选择数据类型
                if (this.mainDataForm.privilegeConfig.conditions.parameter.inputType != '20') {
                    this.mainDataForm.privilegeConfig.conditions.parameter.valueType = '0';
                } else {
                    this.mainDataForm.privilegeConfig.conditions.parameter.valueType = '20';
                }
                //当参数输入方式不为--全局变量时清空--值
                if (this.mainDataForm.privilegeConfig.conditions.parameter.inputType != '10'
                    || this.mainDataForm.privilegeConfig.conditions.parameter.inputType != '99') {
                    this.mainDataForm.privilegeConfig.conditions.parameter.value = '';
                } else {
                    this.mainDataForm.privilegeConfig.conditions.parameter.valueType = '0';
                }
                this.opFormRlues();
                this.$nextTick(() => {
                    this.$refs.form.clearValidate(['privilegeConfig.conditions.parameter.value']);
                })
            },
            opFormRlues() {
                if (this.mainDataForm.privilegeConfig.conditions.parameter.inputType == '10') {
                    //类型为全局变量
                    this.formRules['privilegeConfig.conditions.parameter.value'] = [{
                        required: true,
                        message: '请选择值',
                        trigger: 'change'
                    }]
                } else if (this.mainDataForm.privilegeConfig.conditions.parameter.inputType == '20') {
                    //类型为弹窗
                    this.formRules['privilegeConfig.conditions.parameter.valueType'] = [{
                        required: true,
                        message: '请选择数据类型',
                        trigger: 'change'
                    }]
                } else {
                    //类型为自定义
                    delete this.formRules['privilegeConfig.conditions.parameter.value'];
                    delete this.formRules['privilegeConfig.conditions.parameter.valueType'];
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
            }
        },
        mounted() {
            this.getBaseData();
        },
    }
</script>

<style scoped>

</style>
