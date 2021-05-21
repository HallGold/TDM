<template>
    <el-dialog
            custom-class="ice-dialog"
            title="编辑"
            :visible.sync="dialogVisible"
            :append-to-body="true"
            :close-on-click-modal="false"
            @close="close"
            width="40%"
            left>
        <el-form :model="formData" :rules="detailRules" label-position="right" class="conditon-bar"
                 ref="form" style="margin-top: 20px">
            <el-row :gutter="60">
                <el-col :span="8">
                    <el-form-item label="名称" label-width="82px" prop="name">
                        <el-input placeholder="名称" v-model="formData.name"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="编码" label-width="82px" prop="code">
                        <el-input placeholder="编码" v-model="formData.code"
                                  :disabled="!!formData.oid?true:false"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="排序" label-width="82px" prop="sequencing">
                        <el-input placeholder="排序" v-model="formData.sequencing"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="描述" :rows="3" label-width="82px" prop="desp">
                        <el-input placeholder="描述" type="textarea" v-model="formData.desp"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="备注" :rows="3" label-width="82px" prop="remark">
                        <el-input placeholder="备注" type="textarea" v-model="formData.remark"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveClickHandler">保存</el-button>
            <el-button type="info" @click="closeClickHandler">返回</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import OrgComm from "@/pages/system/comm/OrgComm";
    import {isLetterAndNumber} from "@/pages/system/comm/Validator";

    export default {
        name: "WorkPositionEdit",
        mixins: [OrgComm],
        data() {
            return {
                detailRules: {
                    name: [
                        {required: true,whitespace: true, message: '请输入姓名', trigger: 'blur'},
                        {min: 1, max: 32, message: `长度在1-32之间`, trigger: 'blur'}
                    ],
                    code: [
                        {required: true,whitespace: true, message: '请输入编码', trigger: 'blur'},
                        {min: 1, max: 32, message: `编码长度在1-32之间`, trigger: 'blur'},
                        {validator: isLetterAndNumber, trigger: 'blur'}
                    ],
                    desp: [
                        {min: 1, max: 500, message: `长度在1-500之间`, trigger: 'blur'}
                    ],
                    remark: [
                        {min: 1, max: 500, message: `长度在1-500之间`, trigger: 'blur'}
                    ]
                },
                formData: {
                    name: ``,
                    level: ``,
                    desp: ``,
                    typeId: ``,
                    oid: ``,
                    parentCode: ``
                },
                dialogVisible: false
            };
        },
        methods: {
            open(record) {
                let _this = this;
                if (!!record) {
                    this.initControls(record).then(() => {
                        if (!!record.oid) {
                            //编辑
                            _this.loadData(record.oid).then(res => {
                                _this.formData = res.data;
                            });
                        } else {
                            //新增
                            Object.assign(_this.formData, record);
                        }
                        _this.dialogVisible = true;
                    });
                } else {
                    this.$message.error("页面参数为空!")
                }
            },
            initControls(record, handler) {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            },
            loadData(oid) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    this.axios(_this.ACTIONS_ENUM.WORK_POSITION.LOAD_SINGLE, {oid: oid}, [res => {
                        resolve(res);
                    }, res => {
                        reject(res);
                    }, res => {
                        reject(res);
                    }]);
                });
            },
            saveClickHandler() {
                let _this = this;
                this.save().then(res => {
                    //保存完成回调
                    _this.$emit("beforeClose", Object.assign(_this.formData, res.data));
                }).catch(res => {
                    this.$message.error("保存失败!");
                });
            },
            save() {
                let _this = this;
                return new Promise((resolve, reject) => {
                    //避免嵌套parent解析
                    let _parent = null;
                    if (!!_this.formData.parent) {
                        _parent = Object.assign({}, _this.formData.parent);
                        _this.formData.parent = {};
                    }
                    this.axios(_this.ACTIONS_ENUM.WORK_POSITION.SAVE_SINGLE, _this.formData, [res => {
                        if (!!_parent) {
                            Object.assign(_this.formData.parent, _parent);
                        }
                        resolve(res);
                    }, res => {
                        reject(res);
                    }, res => {
                        reject(res);
                    }]);
                });
            },
            closeClickHandler() {
                this.close();
            },
            close() {
                this.formData = {
                    name: ``,
                    level: ``,
                    desp: ``,
                    typeId: ``,
                    oid: ``,
                    parentCode: ``
                };
                this.dialogVisible = false;
            },
        }
    }
</script>

<style scoped>

</style>