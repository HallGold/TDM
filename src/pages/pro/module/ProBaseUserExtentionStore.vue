<template>
    <div>
        <div class="ice-container">
            <el-form :disabled="dialogEditReadonly" :model="editDataForm" :rules="editRules" label-position="right"
                     class="conditon-bar" ref="editForm"
                     style="margin-top: 20px">
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="用户名称:" label-width="110px" prop="username">
                            <el-input placeholder="用户名称" v-model="editDataForm.username" maxlength="32"
                                      :showWordLimit="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="性别:" label-width="110px" prop="sex">
                            <ice-select placeholder="性别" map-type-code="SEX"
                                        v-model="editDataForm.sex">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户来源:" label-width="110px" prop="source">
                            <ice-select @change="sourceChange" :disabled="source != -999" placeholder="用户来源"
                                        map-type-code="PRO_USER_SOURCE"
                                        v-model="editDataForm.source">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="用户单位:" label-width="110px" prop="unitName">
                            <el-input :disabled="true" placeholder="用户单位" v-model="editDataForm.unitName">
                                <i v-if="!dialogEditReadonly && source == -999" style="z-index: 999;cursor: pointer;"
                                   @click="unitChoose" slot="suffix" class="el-input__icon el-icon-edit-outline"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户星级:" label-width="110px" prop="userLevel">
                            <el-input-number :max="7" :min="1" placeholder="用户星级"
                                             :precision="0"
                                             v-model="editDataForm.userLevel"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否启用:" label-width="110px" prop="status">
                            <ice-select placeholder="是否启用" map-type-code="enabled"
                                        v-model="editDataForm.status">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="座机:" label-width="110px" prop="telephone">
                            <el-input placeholder="座机" v-model="editDataForm.telephone" maxlength="32" :showWordLimit="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="证件类型:" label-width="110px" prop="certType">
                            <ice-select placeholder="证件类型" map-type-code="PRO_CERT_TYPE"
                                        v-model="editDataForm.certType" @changevalue="certTypeVal">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="证件号:" label-width="110px" prop="certId">
                            <el-input placeholder="证件号" v-model="editDataForm.certId" maxlength="18"
                                      :showWordLimit="true" :disabled="hasCertType"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="手机:" label-width="110px" prop="cellphone">
                            <el-input placeholder="手机" v-model="editDataForm.cellphone" maxlength="32" :showWordLimit="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="电子邮箱:" label-width="110px" prop="email">
                            <el-input placeholder="电子邮箱"  v-model="editDataForm.email" maxlength="32" :showWordLimit="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="备注:" label-width="110px" prop="remark">
                            <el-input placeholder="备注" type="textarea" :rows="4" maxlength="11000" :showWordLimit="true"
                                      v-model="editDataForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="60">
                    <el-col :span="24">

                    </el-col>
                </el-row>

            </el-form>
            <div class="ice-button-bar" v-if="!dialogEditReadonly">
                <el-button type="primary" @click="saveData">保存</el-button>
                <el-button type="info" @click="canel">返回</el-button>
            </div>
        </div>
        <ice-dialog v-dialogDrag title="单位选择" custom-class="ice-dialog" center
                    :visible.sync="dialogVisibleProBaseCustUnitChoose"
                    width=600px append-to-body :close-on-click-modal="false">
            <pro-base-cust-unit-choose @select-confirm="proBaseCustUnitChooseConfirm"
                                       chooseItem="single"
                                       :pagination=false
                                       @select-cannel="proBaseCustUnitChooseCannel">
            </pro-base-cust-unit-choose>
        </ice-dialog>
        <ice-dialog v-dialogDrag title="院内单位选择"
                   :visible.sync="dialogVisibleFrameOrgTreeChoose"
                    remounted
                   width=400px>
            <frame-org-tree-choose
                    @select-confirm="frameOrgTreeChooseConfirm"
                    @select-cannel="frameOrgTreeChooseCannel"
            ></frame-org-tree-choose>
        </ice-dialog>
    </div>
</template>

<script>
    import IceSelect from "../../../components/common/base/IceSelect";
    import ProBaseCustUnitChoose from "../module/ProBaseCustUnitChoose";
    import FrameOrgTreeChoose from "./FrameOrgTreeChoose";
    import IceDialog from "../../../components/common/base/IceDialog";

    export default {
        name: "ProBaseUserExtentionStore.vue",
        props: {
            editData: Object,
            editRules: Object,
            unitName: String,
            unitCode: String,
            source: {
                type: Number,
                default: -999
            },
            dialogEditReadonly: Boolean
        },
        data() {
            return {
                dialogVisibleProBaseCustUnitChoose: false,
                dialogVisibleFrameOrgTreeChoose: false,
                editDataForm: {
                    userLevel: "1",
                    certType:'',
                    certId:''
                },
                hasCertType:true,//判定证件类型是否有值，如果有，则可编辑，否则不可编辑
            }
        },
        methods: {
            /**
             * 当证件类型的值发生变化时，清空原有的证件号
             */
            certTypeVal(selectValue){
                this.editDataForm.certId = '';
                if(!selectValue){
                    this.hasCertType = true;
                }else{
                    this.hasCertType = false;
                }
            },
            show() {
                this.editDataForm = {...this.editData};
                if (this.source != -999) {
                    this.$set(this.editDataForm, "unitName", this.unitName);
                    this.$set(this.editDataForm, "unitCode", this.unitCode);
                    this.$set(this.editDataForm, "source", this.source + '');
                }
                this.$refs['editForm'].clearValidate();
                if(!this.editDataForm.certType){
                    this.hasCertType = true;
                }else{
                    this.hasCertType = false;
                }
            },
            unitChoose() {
                if (!this.editDataForm.source) {
                    this.$message.error("请先选择用户来源。");
                    return;
                }
                if (this.editDataForm.source == 1) {
                    this.dialogVisibleFrameOrgTreeChoose = true;
                } else if (this.editDataForm.source == 2) {
                    this.dialogVisibleProBaseCustUnitChoose = true;
                } else {
                    this.$message.error("暂不支持这个选项的用户来源");
                    return;
                }
            },
            proBaseCustUnitChooseConfirm(rows) {
                this.dialogVisibleProBaseCustUnitChoose = false;
                this.editDataForm.unitName = rows[0].unitname;
                this.editDataForm.unitCode = rows[0].unitcode;
            },
            proBaseCustUnitChooseCannel() {
                this.dialogVisibleProBaseCustUnitChoose = false;
            },
            frameOrgTreeChooseConfirm(data) {
                this.dialogVisibleFrameOrgTreeChoose = false;
                this.editDataForm.unitName = data.name;
                this.editDataForm.unitCode = data.code;
            },
            frameOrgTreeChooseCannel() {
                this.dialogVisibleFrameOrgTreeChoose = false;
            },
            canel() {
                this.$emit("userStoreCannel");
                this.$nextTick(() => {
                    this.$refs.editForm.resetFields();
                });
            },
            canelT() {
                this.$refs.editForm.resetFields();
            },
            saveData() {
                this.$refs['editForm'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.$axios.post("/pro/ProBaseUserExtention/saveOrUpdate", this.editDataForm)
                        .then(result => {
                            console.log(result);
                            this.$message.success("保存成功");
                            this.$nextTick(() => {
                                this.$refs.editForm.resetFields();
                            });
                            this.$emit("userStoreSave");
                        }).catch(error => {
                        console.log(error)
                        this.$message.error(error.msg);
                    });
                });
            },
            sourceChange() {
                this.editDataForm.unitName = '';
                this.editDataForm.unitCode = '';
            }
        },
        watch: {
            "editDataForm.userLevel": function (nowVal) {
                if (nowVal > 0) {
                    this.editDataForm.userLevel = Math.round(nowVal);
                }
            },
            deep: true
        },
        components: {IceDialog, FrameOrgTreeChoose, IceSelect, ProBaseCustUnitChoose}
    }
</script>

<style scoped>

</style>