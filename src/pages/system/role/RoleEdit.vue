<template>
    <el-dialog
            custom-class="ice-dialog"
            title="编辑"
            :visible.sync="dialogVisible"
            :append-to-body="true"
            :close-on-click-modal="false"
            :before-close="close"
            width="60%"
            left>
        <el-form :model="formData" :rules="detailRules" label-position="right" class="conditon-bar"
                 ref="form" style="margin-top: 20px">
            <el-row :gutter="60">
                <el-col :span="8">
                    <el-form-item label="角色名" label-width="72px" prop="name">
                        <el-input placeholder="不超过20个字" v-model="formData.name" maxlength="20"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="编码" label-width="72px" prop="code">
                        <el-input placeholder="由英文数字下划线组成"
                                  v-model="formData.code"
                                  @keyup.native="codeItem"
                                  maxlength="30"
                                  @blur="func"
                                  :disabled="!!formData.oid?true:false"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="排序" label-width="72px" prop="sequencing">
                        <el-input placeholder="只能输入1至7位数字" v-model="formData.sequencing" maxlength="7" @keyup.native="number"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="描述" :rows="2" label-width="72px" prop="desp">
                        <el-input placeholder="描述"
                                  type="textarea"
                                  maxlength="256"
                                  v-model="formData.desp"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="备注" :rows="2" label-width="72px" prop="remark">
                        <el-input placeholder="备注"
                                  type="textarea"
                                  maxlength="256"
                                  v-model="formData.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="info" @click="close">返回</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import OrgComm from "@/pages/system/comm/OrgComm";
    import {isLetterAndNumber} from "@/pages/system/comm/Validator";

    export default {
        name: "RoleEdit",
        mixins: [OrgComm],
        data() {
            return {
                formData: {
                    oid: ``,
                    name: ``,
                    code: ``,
                    desp: ``,
                    remark: ``,
                    type: ``,
                },
                detailRules: {
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    code: [
                        {required: true, message: '请输入编码', trigger: 'blur'},
                        /*{min: 1, max: 16, message: `编码长度在1-16之间`, trigger: 'blur'},
                        {validator: isLetterAndNumber, trigger: 'blur'}*/
                    ],
                    desp: [{min: 1, max: 256, message: `编码长度在1-256之间`, trigger: 'blur'},],
                    remark: [{min: 1, max: 256, message: `编码长度在1-256之间`, trigger: 'blur'},]
                },
                dialogVisible: false,
            }
        },
        methods: {
            /**校验编码只能由数字，下划线，英文字母组成*/
            codeItem(){
                this.formData.code = this.formData.code.replace(/[^\w||_]+$/,'');
            },
            /**效验排序只能输入数字*/
            number(){
                this.formData.sequencing=this.formData.sequencing.replace(/[^\.\d]/g,'');
                this.formData.sequencing=this.formData.sequencing.replace('.','');
            },
            /**校验编码是否重复*/
            func(){
                if(this.formData.code){
                    this.$axios.get("/permission/frame_role/unique",{"params":{"roleCode":this.formData.code}}).then(success=>{
                        if(this.formData.code.trim()==''){
                            this.$message.warning("账号不能为空");
                            this.formData.code = '';
                        }
                        if(success.data){
                            this.$message.warning("账号已存在，请换一个");
                            this.formData.code = '';
                        }
                    }).catch(error=>{
                        this.$message({
                            type:'error',
                            message:error.msg ? error.msg : '操作出错了'
                        })
                    });
                }
            },
            open(row) {
                let _this = this;
                if (!!row) {
                    Object.assign(this.formData, row);
                    if (!!row.oid) {
                        //编辑
                        _this.loadData(row.oid).then(() => {
                            Object.assign(_this.formData, res.data);
                        });
                    } else {
                        //新增
                        Object.assign(_this.formData, row);
                    }
                    _this.dialogVisible = true;

                } else {
                    this.$message.error("页面参数为空!")
                }
            },
            loadData(oid) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    this.axios(this.ACTIONS_ENUM.ROLE.LOAD_SINGLE, {oid: oid}, [res => {

                        resolve();
                    }, res => {
                        reject(res);
                    }, res => {
                        reject(res);
                    }]);
                });
            },
            close() {
                this.formData = {
                    oid: ``,
                    name: ``,
                    code: ``,
                    desp: ``,
                    remark: ``,
                    type: ``,
                };
                this.$refs.form.clearValidate();
                this.dialogVisible = false;
            },
            save() {
                //能够编辑的一定是非系统角色
                this.formData.type = this.ROLE_TYPE_ENUM.NON_SYSTEM;
                this.axios(this.ACTIONS_ENUM.ROLE.SAVE_SINGLE, this.formData, [res => {
                    this.$emit("beforeClose", Object.assign(this.formData, res.data));
                }]);
            },
        },
        mounted() {
        },
    }
</script>

<style scoped>

</style>