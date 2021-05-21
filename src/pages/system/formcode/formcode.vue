<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="序列号管理"
                        data-url="/permission/TV01FormcodeRule/list"
                        :query="query"
                        :columns="columns"
                        :operations="operations"
                        :buttons="buttons" ref="grid">
        </ice-query-grid>

        <el-dialog v-dialogDrag :title="tittle" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="800px" append-to-body :close-on-click-modal="false">
            <div class="grid-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="form"
                         style="margin-top: 20px">

                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="编号:" label-width="100px" prop="formcode">
                                <el-input placeholder="编号" v-model="mainDataForm.formcode"
                                          :disabled="aclKeyReadonly"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="名称:" label-width="100px" prop="formname">
                                <el-input placeholder="名称" v-model="mainDataForm.formname"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="前缀:" label-width="100px" prop="prefix">
                                <el-input placeholder="前缀" v-model="mainDataForm.prefix"
                                          :disabled="aclKeyReadonly"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="循环周期:" label-width="100px" prop="cycle">
                                <ice-select placeholder="循环周期" v-model="mainDataForm.cycle" :disabled="aclKeyReadonly"
                                            mapTypeCode="code_cycle">
                                    <!--<el-option label="按年" value="yyyy"></el-option>
                                    <el-option label="按月" value="yyyymm"></el-option>
                                    <el-option label="按日" value="yyyymmdd"></el-option>-->
                                </ice-select>
                                <!-- <el-input placeholder="循环周期" v-model="mainDataForm.cycle"></el-input>-->
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="流水号位数:" label-width="100px" prop="serialnum">
                                <el-input-number placeholder="流水号位数" v-model="mainDataForm.serialnum"
                                                 :disabled="aclKeyReadonly"
                                                 :min="1" :max="20"></el-input-number>
                                <!--<el-input placeholder="流水号位数" type="number" v-model="mainDataForm.serialnum" :disabled="aclKeyReadonly"></el-input>-->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="当前值:" label-width="100px" prop="currentvalue">
                                <el-input placeholder="当前值" v-model="mainDataForm.currentvalue"
                                          :disabled="aclKeyReadonly"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="业务前缀标识:" label-width="100px" prop="isprefix">
                                <ice-select placeholder="业务前缀标识" v-model="mainDataForm.isprefix"
                                            mapTypeCode="code_isprefix">
                                    <!-- <el-option label="仅使用单据前缀" value="0"></el-option>
                                     <el-option label="在单据前缀附加自定义前缀" value="1"></el-option>
                                     <el-option label="不使用单据前缀" value="2"></el-option>-->
                                </ice-select>
                                <!-- <el-input placeholder="业务前缀标识" v-model="mainDataForm.isprefix" :disabled="aclKeyReadonly"></el-input>-->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="规则类型:" label-width="100px" prop="usecycle">
                                <el-select placeholder="规则类型" v-model="mainDataForm.usecycle"
                                           :disabled="aclKeyReadonly">
                                    <el-option label="不使用循环周期" value="0"></el-option>
                                    <el-option label="使用循环周期" value="1"></el-option>
                                </el-select>
                                <!-- <el-input placeholder="规则类型" v-model="mainDataForm.usecycle"></el-input>-->
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="备注:" label-width="100px" prop="remark">
                                <el-input placeholder="备注" v-model="mainDataForm.remark" :row="3"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>


                </el-form>
                <div class="dialog-footer ice-button-bar">
                    <el-button type="primary" @click="save">确 定</el-button>
                    <el-button type="info" @click="closeDialog">取 消</el-button>
                </div>
            </div>

        </el-dialog>
    </div>
</template>

<script>

    import IceQueryGrid from '../../../components/common/base/IceQueryGrid'
    import IceSelect from '../../../components/common/base/IceSelect'
    import IceGridLayout from '../../../components/common/base/IceGridLayout.vue'
    import {isLetterAndNumber} from "@/pages/system/comm/Validator";

    export default {
        name: 'formcode',
        data() {
            return {
                query: [
                    {type: 'input', label: '编号', code: 'formcode'},
                    {type: 'input', label: '名称', code: 'formname'}
                ],
                columns: [
                    {code: 'formcodeRuleid', hidden: true},

                    {label: '编号', code: 'formcode', width: 100,align:'left'},
                    {label: '名称', code: 'formname', width: 120,align:'left'},
                    {label: '前缀', code: 'prefix', width: 80,align:'left'},
                    {label: '循环周期', code: 'cycle', width: 100, mapTypeCode: "code_cycle"},
                    {label: '流水号位数', code: 'serialnum', width: 100,align:'left'},

                    {label: '当前值', code: 'currentvalue', width: 80,align:'left'},
                    {label: '业务前缀标识', code: 'isprefix', width: 100, mapTypeCode: "code_isprefix",align:'left'},//业务前缀标识  0：仅使用单据前缀， 1：在单据前缀附加自定义前缀  2:不使用单据前缀"
                    {
                        label: '规则类型', code: 'usecycle', width: 120, formatter(row) {

                            if (row.usecycle == 0) {
                                return "不使用循环周期";
                            }
                            return "使用循环周期";
                        },align:'left'
                    },//规则类型 0：不使用循环周期， 1使用循环周期
                    {label: '备注', code: 'remark', width: 100,align:'left'}
                ],
                operations: [
                    {name: '删除', callback: this.deleteAcl},
                    {
                        name: '编辑', callback: (row) => {
                            if (this.$refs.form) {
                                this.$refs.form.resetFields();
                            }

                            let objMain = {};
                            Object.assign(objMain, row);
                            objMain.usecycle = objMain.usecycle + "";
                            objMain.isprefix = objMain.isprefix + "";
                            this.mainDataForm = objMain;
                            /*this.mainDataForm=row;*/
                            this.dialogVisible = true;
                            this.aclKeyReadonly = true;
                            this.tittle = 'ACL编辑'
                        }
                    }
                ],
                buttons: [{
                    name: '新增', icon: 'el-icon-plus', type: 'primary', callback: () => {
                        this.mainDataForm = {usecycle: "0", isprefix: "0", cycle: ""};
                        this.aclKeyReadonly = false;
                        this.dialogVisible = true;
                        this.tittle = '序列号新增'
                    }
                }],
                dialogVisible: false,
                aclKeyReadonly: false,
                mainDataForm: {usecycle: "0", isprefix: "0", cycle: ""},
                mainDataFormval: {},
                formRules: {
                    formcode: [{
                        required: true,
                        validator: isLetterAndNumber,
                        message: '请输入KEY仅由英文字母，数字以及下划线组成',
                        trigger: 'blur'
                    }],
                    formname: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    cycle: [{required: true, message: '请输入循环周期', trigger: 'blur'}],
                    serialnum: [{required: true, message: '请输入位数', trigger: 'blur'}]
                },
                tittle: ''
            }
        },
        methods: {
            editAcl(row, index) {
                this.dialogVisible = true;
            },
            deleteAcl(row) {
                this.delAcl = true;
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete('/permission/TV01FormcodeRule/del', {params: {id: row.formcodeRuleid}}).then(result => {
                        this.$message.success("删除成功")
                        this.$refs.grid.refresh();
                    }).catch(error => {
                        this.$message.error("出错啦")
                    })
                });
            },
            addItem() {
                this.dialogVisible = true;
            },
            save() {
                this.$refs['form'].validate((valid) => {
                    //console.log("form", valid)
                    if (valid) {
                        let obj = this.mainDataForm;
                        this.$axios.post('/permission/TV01FormcodeRule/saveOrUpdate', obj).then(result => {
                            this.$message.success("新增成功");
                            this.dialogVisible = false;
                            this.$refs.grid.refresh();
                        }).catch(error => {
                            this.$message.error("出错啦")
                        })
                    } else {
                        //console.log('error submit!!');
                        return false;
                    }
                });
            },
            closeDialog() {
                this.dialogVisible = false;
            }
        },
        components: {
            IceQueryGrid, IceSelect,
            IceGridLayout
        }
    }

</script>


<style scoped>

</style>
