<template>
    <el-dialog v-dialog-drag
               :title="title"
               custom-class="ice-dialog"
               center
               :visible.sync="dialogVisible"
               width="60%"
               append-to-body
               :before-close="closeDialog"
               :close-on-click-modal="false">
        <el-form :model="mainDataForm" :rules="formRules" label-width="100px" ref="form">
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item label="字段名" prop="columnCode">
                        <el-input v-model="mainDataForm.columnCode"
                                  :disabled="isEdit"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="中文名" prop="columnName">
                        <el-input v-model="mainDataForm.columnName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item label="是否主键" prop="isPriKey">
                        <el-checkbox true-label="1" false-label="0" v-model="mainDataForm.isPriKey"></el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="可否为空" prop="Nullable">
                        <el-checkbox true-label="1" false-label="0" v-model="mainDataForm.nullable"></el-checkbox>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item label="字段类型" prop="datatype">
                        <el-select placeholder="请选择" v-model="mainDataForm.datatype">
                            <el-option label="String" value="String"></el-option>
                            <el-option label="Short" value="Short"></el-option>
                            <el-option label="Int" value="Int"></el-option>
                            <el-option label="Long" value="Long"></el-option>
                            <el-option label="Price" value="Price"></el-option>
                            <el-option label="Sum" value="Sum"></el-option>
                            <el-option label="Date" value="Date"></el-option>
                            <el-option label="Time" value="Time"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="字段长度" prop="columnLenth">
                        <el-input v-model="mainDataForm.columnLenth"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item label="精度" prop="precision">
                        <el-input v-model="mainDataForm.precision"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="默认值" prop="defaultValue">
                        <el-input v-model="mainDataForm.defaultValue"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item label="最小值" prop="minValue">
                        <el-input v-model="mainDataForm.minValue"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="最大值" prop="maxValue">
                        <el-input v-model="mainDataForm.maxValue"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item label="列类型" prop="columnType">
                        <el-select placeholder="请选择" v-model="mainDataForm.columnType">
                            <el-option label="业务字段" value="_BIZ_"></el-option>
                            <el-option label="部门ID" value="DeptId"></el-option>
                            <el-option label="部门编码" value="DeptCode"></el-option>
                            <el-option label="部门层级码" value="DeptLevCode"></el-option>
                            <el-option label="单位ID" value="CompanyId"></el-option>
                            <el-option label="单位编码" value="CompanyCode"></el-option>
                            <el-option label="单位层级码" value="CompanyLevCode"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="字段描述" prop="remark">
                        <el-input v-model="mainDataForm.remark" type="textarea" rows="3"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="info" @click="closeDialog">取消</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        name: "filedEdit",
        props: {
            title: String,
            isSuccess: Function,
            isEdit: {
                type: Boolean
            }
        },
        data() {
            return {
                mainDataForm: {//表单对象
                    columnCode: '',
                    columnName: '',
                    isPriKey: '0',
                    nullable: '0',
                    datatype: '',
                    columnLenth: '',
                    precision: '',
                    defaultValue: '',
                    minValue: '',
                    columnCls: '',
                    remark: '',
                    tableId: ''
                },
                formRules: {//表单字段规则
                    columnCode: [{required: true, whitespace: true, message: '请输入字段名', trigger: 'blur'}],
                    columnName: [{required: true, whitespace: true, message: '请输入中文名', trigger: 'blur'}],
                    datatype: [{required: true, whitespace: true, message: '请选择字段类型', trigger: 'blur'}]
                    /*columnLenth:[{required: true,whitespace: true, message: '请输入名称', trigger: 'blur'}],
                    precision:[{required: true,whitespace: true, message: '请输入名称', trigger: 'blur'}],
                    defaultValue:[{required: true,whitespace: true, message: '请输入名称', trigger: 'blur'}],
                    minValue:[{required: true,whitespace: true, message: '请输入名称', trigger: 'blur'}],
                    columnCls:[{required: true,whitespace: true, message: '请输入名称', trigger: 'blur'}],*/
                },
                dialogVisible: false
            }
        },
        methods: {
            /**
             * 保存
             */
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$axios.post("/permission/res/table/outer/save_col_info", this.mainDataForm).then(success => {
                            this.$message.success("保存成功")
                            this.isSuccess();
                            this.closeDialog();
                        }).catch(error => {
                            this.$message.error(error.msg ? error.msg : '操作出错了');
                        })
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
            openDialog(tableId, row) {
                console.log('tableId : %o, row : %o', tableId, row)
                if (row) {
                    Object.assign(this.mainDataForm, row);
                    if(this.mainDataForm.isPriKey === 1){
                        this.mainDataForm.isPriKey = '1';
                    }
                    else{
                        this.mainDataForm.isPriKey = '0';
                    }
                    if(this.mainDataForm.nullable === 1){
                        this.mainDataForm.nullable = '1';
                    }
                    else{
                        this.mainDataForm.nullable = '0';
                    }
                } else {
                    this.mainDataForm = {
                        isPriKey: '0',
                        nullable: '0',
                        tableId:tableId
                    }
                }
                this.dialogVisible = true;
            },
            resetForm() {
                this.$refs.form.resetFields();
            }
        }
    }
</script>

<style scoped>

</style>
