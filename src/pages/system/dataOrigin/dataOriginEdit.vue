<template>
    <el-dialog v-dialog-drag
               :title="title"
               custom-class="ice-dialog"
               center
               :visible.sync="dialogVisible"
               width="800px"
               append-to-body
               :before-close="closeDialog"
               :close-on-click-modal="false">
        <el-form :model="mainDataForm" :rules="formRules" label-width="110px" ref="form">
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item label="数据源编码" prop="dsCode">
                        <el-input v-model="mainDataForm.dsCode" :disabled="isEdit"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="数据源名称" prop="dsName">
                        <el-input v-model="mainDataForm.dsName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <!--<el-col :span="12">
                    <el-form-item label="所属项目" prop="projectId">
                        <el-select placeholder="请选择" v-model="mainDataForm.projectId">
                            <el-option label="项目一" value="1"></el-option>
                            <el-option label="项目二" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>-->
                <el-col :span="12">
                    <el-form-item label="数据库类型" prop="dsDbtype">
                        <ice-select v-model="mainDataForm.dsDbtype"
                                    map-type-code="DATABASE_TYPE"
                                    @change="$nextTick(()=>{$refs.form.validateField('dsDbtype',error=>{})})">
                        </ice-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="描述" prop="remark">
                        <el-input v-model="mainDataForm.remark" type="textarea" rows="3" maxlength="200"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item label="用户名" prop="dsUsercode">
                        <el-input v-model="mainDataForm.dsUsercode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="密码" prop="dsPassword">
                        <el-input v-model="mainDataForm.dsPassword" type="password" v-if="!isLook">
                            <i slot="suffix" class="el-icon-s-tools" @click="isLookItem"></i>
                        </el-input>
                        <el-input v-model="mainDataForm.dsPassword" v-if="isLook">
                            <i slot="suffix" class="el-icon-s-tools" @click="isLookItem"></i>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="数据库连接地址" prop="dsUrl">
                        <el-input v-model="mainDataForm.dsUrl" type="textarea" rows="3"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="ice-button-bar ">
            <el-button type="primary" size="medium"  @click="textItem">测试连接</el-button>
            <el-button type="primary" size="medium"  @click="save">保存</el-button>
            <el-button type="info" size="medium"  @click="closeDialog">取消</el-button>
        </div>
    </el-dialog>

</template>

<script>
    import IceSelect from "../../../components/common/base/IceSelect";

    export default {
        name: "dataOriginEdit",
        components: {IceSelect},
        props: {
            isSuccess: Function,
            title: String,
            mainDataForm: {},
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isLook: false,
                dialogVisible: false,        //弹框开关属性
                formRules: {//表单字段规则
                    dsCode: [{required: true, whitespace: true, message: '请输入数据源编码', trigger: 'blur'}],
                    dsName: [{required: true, whitespace: true, message: '请输入数据源名称', trigger: 'blur'}],
                    dsUsercode: [{required: true, whitespace: true, message: '请输入用户名', trigger: 'blur'}],
                    dsPassword: [{required: true, whitespace: true, message: '请输入密码', trigger: 'blur'}],
                    dsUrl: [{required: true, whitespace: true, message: '请输入数据库连接地址', trigger: 'blur'}],
                    dsDbtype: [{required: true, message: '请选择数据库类型', trigger: 'change'}],
                }
            }
        },
        methods: {
            /**
             * 测试连接
             */
            textItem() {
                let password = this.mainDataForm.dsPassword;
                let url = this.mainDataForm.dsUrl;
                let user = this.mainDataForm.dsUsercode;
                if (password && url && user) {
                    this.$axios.delete("/permission/res/ds/outer/test_connect",
                        {params: {password: password, url: url, user: user}}).then(success => {
                        this.$message.success("连接成功");
                    }).catch(error => {
                        this.$message.error("连接失败");
                    })
                } else {
                    this.$message.warning("【用户名】，【密码】，【连接地址】三者都不能为空");
                }

            },
            /**
             * 保存
             */
            save() {
                //dataSourceInfo（参数必填），数据源信息。类型String,待确认
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$axios.post("permission/res/ds/outer/save/ds_config_info", this.mainDataForm).then(success => {
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
             * 切换密码显示状态
             */
            isLookItem() {
                if (this.isLook) {
                    this.isLook = false;
                } else {
                    this.isLook = true;
                }
            },
            /**
             * 取消
             */
            closeDialog() {
                this.resetForm();
                this.dialogVisible = false;
            },
            /**
             * 打开弹框
             */
            openDialog() {
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
