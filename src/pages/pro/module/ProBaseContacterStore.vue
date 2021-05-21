<template>
    <div>
        <div class="ice-container">
            <el-form :disabled="dialogEditReadonly" :model="editDataForm" :rules="editRules" label-position="right"
                     class="conditon-bar" ref="editForm"
                     style="margin-top: 20px">
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="联系人名称:" label-width="120px" prop="username">
                            <el-input placeholder="联系人名称不得超过32字" v-model="editDataForm.username" maxlength="32"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系方式:" label-width="120px" prop="contact">
                            <el-input placeholder="联系方式不得超过32字" v-model="editDataForm.contact" maxlength="32"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="性别:" label-width="120px" prop="unitType">
                            <ice-select placeholder="性别" map-type-code="SEX"
                                        v-model="editDataForm.sex">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="合作单位:" label-width="120px" prop="customerId">
                            <el-input disabled
                                      placeholder="合作单位"
                                      @change="$nextTick(()=>{$refs.editForm.validateField('customerId',error=>{})})"
                                      v-model="editDataForm.unitname">
                                <i v-if="!dialogEditReadonly && !customerId" style="z-index: 999;cursor: pointer;"
                                   @click="unitChoose" slot="suffix" class="el-input__icon el-icon-edit-outline"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="证件类型:" label-width="120px" prop="certType">
                            <ice-select placeholder="证件类型" map-type-code="PRO_CERT_TYPE"
                                        v-model="editDataForm.certType" @changevalue="certTypeVal">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="证件号:" label-width="120px" prop="certId">
                            <el-input placeholder="证件号不得超过18个字符" v-model="editDataForm.certId" maxlength="18" :showWordLimit="true" :disabled="hasCertType && !isEdit"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="备注:" label-width="120px" prop="remark">
                            <el-input placeholder="备注" type="textarea" :rows="4"
                                      v-model="editDataForm.remark" maxlength="11000" :showWordLimit="true" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <div class="ice-button-bar" v-if="!dialogEditReadonly">
                <el-button type="primary" @click="saveData">保存</el-button>
                <el-button type="info" @click="canel">返回</el-button>
            </div>

        </div>

        <ice-dialog v-dialogDrag
                    title="合作单位选择"
                   :visible.sync="dialogVisibleProBaseCoopUnitChoose"
                    remounted
                   width=600px>
            <pro-base-coop-unit-choose @select-confirm="ProBaseCoopUnitChooseConfirm"
                                       chooseItem="single"
                                       :pagination=false
                                       @select-cannel="ProBaseCoopUnitChooseCannel">
            </pro-base-coop-unit-choose>
        </ice-dialog>
    </div>
</template>

<script>
    import ProBaseCoopUnitChoose from "./ProBaseCoopUnitChoose";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceDialog from "../../../components/common/base/IceDialog";

    export default {
        name: "ProBaseContacterStore.vue",
        props: {
            editData: Object,
            editRules: Object,
            customerId: String,
            dialogEditReadonly: Boolean,
            isEdit:Boolean
        },
        components: {IceDialog, IceSelect, ProBaseCoopUnitChoose},
        data() {
            return {
                editDataForm: {...this.editData},
                dialogVisibleProBaseCoopUnitChoose: false,
                hasCertType:true,//判定证件类型是否有值，如果有，则可编辑，否则不可编辑
            }
        },
        methods: {
            certTypeVal(selectValue){
                this.editDataForm.certId = '';
                if(!selectValue){
                    this.hasCertType = true;
                }else{
                    this.hasCertType = false;
                }
            },
            show() {
                if (this.customerId) {
                    this.editData.customerId = this.customerId;
                }
                this.editDataForm = {...this.editData};
                this.$nextTick(()=>{
                    this.$refs['editForm'].clearValidate();
                });

            },
            unitChoose() {
                this.dialogVisibleProBaseCoopUnitChoose = true;
            },
            ProBaseCoopUnitChooseConfirm(rows) {
                this.dialogVisibleProBaseCoopUnitChoose = false;
                this.editDataForm.customerId = rows[0].oid;
                this.editDataForm.unitname = rows[0].unitname;
            },
            ProBaseCoopUnitChooseCannel() {
                this.dialogVisibleProBaseCoopUnitChoose = false;
            },
            canel() {
                this.$emit("userStoreCannel");
            },
            saveData() {
                this.$refs['editForm'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.$axios.post("/pro/ProBaseContacter/saveOrUpdate", this.editDataForm)
                        .then(result => {
                            console.log(result);
                            this.$message.success("保存成功");
                            this.$emit("userStoreSave");
                        }).catch(error => {
                        console.log(error)
                        this.$message.error(error.msg);
                    });
                });
            }
        }
    }
</script>

<style scoped>

</style>