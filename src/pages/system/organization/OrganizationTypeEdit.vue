<template>
    <div class="grid-container">
        <el-form :model="formData" :rules="detailRules" label-position="right" class="conditon-bar"
                 ref="form" v-loading="loading"
                 style="margin-top: 20px">
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item label="类型名称:" label-width="100px" prop="name">
                        <el-input placeholder="类型名称"
                                  v-model="formData.name"
                                  maxlength="32"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="类型编码:" label-width="100px" prop="code">
                        <el-input placeholder="类型编码" v-model="formData.code" maxlength="32"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item label="机构类型:" label-width="100px" prop="orgType">
                        <el-radio-group v-model="formData.orgType">
                            <el-radio v-for="item in ORG_TYPE_ENUM.properties" :label="item.code">
                                {{item.name}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="启用状态:" label-width="100px" prop="enabled">
                        <el-radio-group v-model="formData.enabled">
                            <el-radio v-for="item in objectValueToArray(ENABLED_ENUM.properties).reverse()"
                                      :label="item.code">
                                {{item.name}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item label="排序:" label-width="100px" prop="sequencing">
                        <el-input placeholder="只能输入1至7位数字哦"
                                  v-model="formData.sequencing"
                                  maxlength="7"
                                  @keyup.native="number"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="ice-center-button-bar">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="info" @click="back">返回</el-button>
        </div>
    </div>
</template>

<script>
    import OrgComm from "@/pages/system/comm/OrgComm";
    import {isLetterAndNumber} from "@/pages/system/comm/Validator";

    export default {
        name: "OrganizationTypeEdit",
        mixins: [OrgComm],
        data() {
            return {
                loading: true,
                obj: null,
                returnValue: null,
                validateSuccess: false,
                formData: {
                    oid: ``,
                    name: ``,
                    code: ``,
                    orgType: 1,
                    enabled: 1,
                    sequencing: ``,
                    desc: ``
                },
                detailRules: {
                    code: [{required: true,whitespace: true, message: '请输入类型编码', trigger: 'blur'}, {
                        validator: isLetterAndNumber,
                        trigger: 'blur'
                    }],
                    name: [{required: true,whitespace: true, message: '请输入类型名称', trigger: 'blur'}]
                },
            }
        }, methods: {
            /**效验排序只能输入数字*/
            number(){
                this.formData.sequencing=this.formData.sequencing.replace(/[^\.\d]/g,'');
                this.formData.sequencing=this.formData.sequencing.replace('.','');
            },
            save() {
                let _this = this;
                this.doValidateData().then(this.doSave()).catch(msg => {
                    _this.$message.error(msg);
                });
            },
            doValidateData() {
                let _this = this;
                return new Promise((resolve, reject) => {
                    _this.$refs['form'].validate(valid => {
                        if (valid) {
                            // //校验通过,执行保存
                            // _this.$emit("close", _this._data.formData);
                            _this.validateSuccess = true;
                            resolve();
                        } else {
                            //校验失败
                            _this.validateSuccess = false;
                            reject("校验失败");
                        }
                    })
                });
            },
            doSave() {
                let _this = this;
                return new Promise((resolve, reject) => {
                    if (_this.validateSuccess) {
                        _this.axios(_this.ACTIONS_ENUM.ORG_TYPE.SAVE_SINGLE, _this.formData, [res => {
                            if (_this.frameAjaxSuccess(res)) {
                                _this.formData = res.data;
                                this.returnValue = _this.formData;
                                _this.back();
                            } else {
                                reject(_this.getErrorNameByCode(res.code));
                            }
                        }]);
                    }
                });
            },
            back() {
                this.$emit("close", this.returnValue);
            },
            reset(_obj) {
                this.$refs.form.resetFields();
                let _this = this;
                if (!!_obj && !!_obj.oid) {
                    //后台加载数据
                    this.axios(this.ACTIONS_ENUM.ORG_TYPE.LOAD_SINGLE, {id: _obj.oid}, [(res) => {
                        _this.endLoading();
                        if (_this.frameAjaxSuccess(res)) {
                            _this.$data.formData = res.data;
                            _this.returnValue = Object.assign({}, res.data);
                        } else {
                            _this.$message.error(_this.getErrorNameByCode(res.code));
                        }
                    }]);
                } else {
                    //复制数据
                    this.$data.formData = _obj;
                    this.endLoading();
                }
            },
            endLoading() {
                this.$data.loading = false;
            }
        }, mounted() {
        }
    }
</script>

<style scoped>

</style>
