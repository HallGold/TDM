<template>
    <el-dialog
            custom-class="ice-dialog"
            title="编辑"
            :visible.sync="dialogVisible"
            :append-to-body="true"
            :close-on-click-modal="false"
            width="60%"
            @close="close"
            left>
        <el-tabs type="border-card">
            <el-tab-pane label="账号属性">
                <el-form :model="formData.userBaseVo" :rules="detailRules" label-position="right" class="conditon-bar"
                         ref="form" style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item label="姓名" label-width="82px" prop="name">
                                <el-input placeholder="姓名" v-model="formData.userBaseVo.name"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="账号" label-width="82px" prop="code">
                                <el-input placeholder="账号" v-model="formData.userBaseVo.code"
                                          :disabled="!!formData.userBaseVo.oid?true:false"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="排序" label-width="82px" prop="sequencing">
                                <el-input placeholder="排序" v-model="formData.userBaseVo.sequencing"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item label="启用状态" label-width="82px" prop="enabled">
                                <el-radio-group v-model="formData.userBaseVo.enabled">
                                    <el-radio v-for="item in objectValueToArray(ENABLED_ENUM.properties).reverse()"
                                              :label="item.code" :key="item.code">
                                        {{item.name}}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="是否兼职" label-width="82px">
                                <el-radio-group v-model="formData.userBaseVo.partTimeWorker" disabled>
                                    <el-radio v-for="item in objectValueToArray(YES_NO_ENUM.properties).reverse()"
                                              :label="item.code" :key="item.code">
                                        {{item.name}}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="主账号" label-width="82px"
                                          v-show="formData.userBaseVo.partTimeWorker == YES_NO_ENUM.YES">
                                <el-input placeholder="账号" v-model="formData.userBaseVo.mainUserCode"
                                          disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="备注" :rows="2" label-width="82px" prop="remark">
                                <el-input placeholder="备注" type="textarea" v-model="formData.userBaseVo.remark"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <el-tabs type="border-card" style="margin-top: 10px;">
            <el-tab-pane label="详细属性">
                <el-form :model="formData.userEmployeeVo" :rules="detailRules" label-position="right"
                         class="conditon-bar"
                         ref="form" style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <!--<el-form-item label="oid" label-width="82px">-->
                            <!--<el-input placeholder="oid" v-model="formData.userEmployeeVo.test"-->
                            <!--&gt;</el-input>-->
                            <!--</el-form-item>-->
                        </el-col>
                    </el-row>
                </el-form>
            </el-tab-pane>
        </el-tabs>
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
        name: "UserEdit",
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
                    remark: [
                        {min: 1, max: 500, message: `长度在1-500之间`, trigger: 'blur'}
                    ]
                },
                formData: {
                    userBaseVo: {
                        oid: null,
                        name: ``,
                        code: ``,
                        sequencing: ``,
                        enabled: true,
                        partTimeWorker: false,
                        mainUserCode: ``,
                        remark: ``
                    },
                    userEmployeeVo: {}
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
                            _this.loadData(record.code).then(res => {
                                this.formData = res.data;
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
                // Promise.all([this.loadOrgTypeList(record)]).then(res => {
                //     if (typeof handler == "function") {
                //         handler();
                //     }
                // });
            },
            objectValueToArray(_obj) {
                //对象转数组
                let arr = [];
                let i = 0;
                for (let item in _obj) {
                    arr[i] = _obj[item];
                    i++;
                }
                return arr;
            },
            loadData(userCode) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    this.axios(this.ACTIONS_ENUM.USER.LOAD_SINGLE, {userCode: userCode}, [res => {
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
                    debugger;
                });
            },
            save() {
                let _this = this;
                return new Promise((resolve, reject) => {
                    this.axios(_this.ACTIONS_ENUM.USER.SAVE_SINGLE, _this.formData, [res => {
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
                this.dialogVisible = false;
                this.formData = {
                    userBaseVo: {
                        oid: null,
                        name: ``,
                        code: ``,
                        sequencing: ``,
                        enabled: true,
                        partTimeWorker: false,
                        mainUserCode: ``,
                        remark: ``
                    },
                    userEmployeeVo: {}
                }

            },
        }
    }
</script>

<style scoped>

</style>