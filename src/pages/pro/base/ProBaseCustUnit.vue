<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title=""
                        data-url="/pro/ProBaseCustUnit/list"
                        :query="query"
                        :columns="columns"
                        :operationsWidth=200
                        :operations="operations"
                        ref="mainQueryGrid"
                        :buttons="buttons">
        </ice-query-grid>

        <el-dialog v-dialogDrag :title="`${dialogEditReadonly?'查看':(editData.oid?'编辑':'新增')}客户单位信息`"
                   custom-class="ice-dialog" center
                   :visible.sync="dialogEditVisible"
                   width="1000px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :disabled="dialogEditReadonly" :model="editData" :rules="editRules" label-position="right"
                         class="conditon-bar" ref="editForm"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item label="客户单位名称:" label-width="120px" prop="unitname">
                                <el-input placeholder="客户单位名称" v-model="editData.unitname" maxlength="128"
                                          :showWordLimit="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="组织机构代码:" label-width="120px" prop="unitcode">
                                <el-input :disabled="editData.oid?true:false" placeholder="组织机构代码"
                                          v-model="editData.unitcode" maxlength="32" :showWordLimit="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="分类:" label-width="120px" prop="unitType">
                                <ice-select placeholder="分类" map-type-code="PRO_UNIT_TYPE"
                                            v-model="editData.unitType">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item label="企业性质:" label-width="120px" prop="quality">
                                <ice-select placeholder="企业性质" map-type-code="PRO_QUALITY" v-model="editData.quality">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="邮政编码:" label-width="120px" prop="postcode">
                                <el-input placeholder="邮政编码" v-model="editData.postcode" maxlength="6"
                                          :showWordLimit="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="电子邮件:" label-width="120px" prop="email">
                                <el-input placeholder="电子邮件" v-model="editData.email" maxlength="32"
                                          :showWordLimit="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item label="企业法人:" label-width="120px" prop="incor">
                                <el-input placeholder="企业法人" v-model="editData.incor" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="注册资金币种:" label-width="120px" prop="fundtype">
                                <el-input placeholder="注册资金币种" v-model="editData.fundtype" maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="注册资金(万):" label-width="120px" prop="fund">
                                <el-input-number placeholder="1"
                                                 :max="100000000"
                                                 :min="0"
                                                 v-model="editData.fund" @change="fundVal"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item label="开户银行:" label-width="120px" prop="bank">
                                <el-input placeholder="开户银行" v-model="editData.bank" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="开户账号:" label-width="120px" prop="acccount">
                                <el-input placeholder="开户账号" v-model="editData.acccount" maxlength="19"
                                          :showWordLimit="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item label="资质:" label-width="120px" prop="aptitude">
                                <el-input placeholder="资质" v-model="editData.aptitude" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="传真:" label-width="120px" prop="fax">
                                <el-input placeholder="传真" v-model="editData.fax" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item label="企业地址:" label-width="120px" prop="unitAddress">
                                <el-input placeholder="企业地址" v-model="editData.unitAddress" maxlength="45"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="企业网址:" label-width="120px" prop="url">
                                <el-input placeholder="企业网址" v-model="editData.url" maxlength="45"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="企业简介:" label-width="120px" prop="intro">
                                <el-input placeholder="企业简介" type="textarea" :rows="4"
                                          v-model="editData.intro" maxlength="11000" :showWordLimit="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="备注:" label-width="120px" prop="remark">
                                <el-input placeholder="备注" type="textarea" :rows="4"
                                          v-model="editData.remark" maxlength="11000" :showWordLimit="true"></el-input>
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
                    <el-button type="info" @click="dialogEditVisible=false;">返回</el-button>
                </div>

            </div>
        </el-dialog>

        <el-dialog v-dialogDrag title="客户代表管理" custom-class="ice-dialog" center :visible.sync="dialogUserVisible"
                   width="1000px" append-to-body :close-on-click-modal="false">
            <pro-base-user-extention ref="$userExtention" :unitCode="unitCode" :unitName="unitName"
                                     :source="2"></pro-base-user-extention>
        </el-dialog>

    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import common from '@/utils/common.js';
    import IceSelect from "../../../components/common/base/IceSelect";
    import ProBaseUserExtention from "./ProBaseUserExtention";
    import {validateEMail, validateURL,} from "./Validator.js"

    export default {
        name: "ProBaseCustUnit",
        data() {
            let ncolumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: '备注', code: 'remark', hidden: true},
                {label: '邮政编码', code: 'postcode', hidden: true,},
                {label: '电子邮件', code: 'email', hidden: true,},
                {label: '注册资金(万)', code: 'fund', hidden: true},
                {label: '注册资金币种', code: 'fundtype', hidden: true},
                {label: '开户银行', code: 'bank', hidden: true},
                {label: '开户账号', code: 'acccount', hidden: true,},
                {label: '资质', code: 'aptitude', hidden: true},
                {label: '传真', code: 'fax', hidden: true},
                {label: '企业简介', code: 'intro', hidden: true},


                {label: '客户单位名称', code: 'unitname', width: 200, required: true},
                {label: '分类', code: 'unitType', width: 200, mapTypeCode: "PRO_UNIT_TYPE", required: true},
                {label: '企业性质', code: 'quality', width: 120, mapTypeCode: "PRO_QUALITY", required: true},
                {label: '企业法人', code: 'incor', width: 120},
                {label: '组织代码', code: 'unitcode', width: 140, required: true},
                {label: '企业网址', code: 'url', width: 140,},
                {label: '企业地址', code: 'unitAddress', width: 190}];
            return {
                query: common.toQuery(ncolumns),
                columns: ncolumns,
                operations: [{name: '详情', callback: this.viewItem},
                    {name: '客户代表', callback: this.userItem},
                    {name: '编辑', callback: this.editItem},
                    {name: '删除', callback: this.delItem}],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addCallback}],
                dialogEditVisible: false,
                dialogEditReadonly: false,
                editData: common.toInitData(ncolumns, {fund: 0}),
                dialogUserVisible: false,
                unitCode: '', unitName: '',
                editRules: common.toFormRules(ncolumns)
            }
        },
        methods: {
            fundVal(){
                if(!this.editData.fund){
                    this.editData.fund = '0';
                }

            },
            addCallback() {
                this.editData = common.toInitData(this.columns, {fund: 0});
                this.dialogEditVisible = true;
                this.dialogEditReadonly = false;
                this.$nextTick(() => {
                    this.$refs['editForm'].clearValidate();
                });
            },
            saveData() {
                this.$refs['editForm'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.$axios.post("/pro/ProBaseCustUnit/saveOrUpdate", this.editData)
                        .then(result => {
                            console.log(result);
                            this.$message.success("保存成功");
                            this.dialogEditVisible = false;
                        }).catch(error => {
                        this.$message.error(error.msg);
                    });
                });
            },
            userItem(row) {
                this.unitCode = row.unitcode;
                this.unitName = row.unitname;
                this.dialogUserVisible = true;
                this.$nextTick(() => {
                    this.$refs.$userExtention.refreshGrid();
                })
            },
            viewItem(row) {
                this.dialogEditVisible = true;
                this.dialogEditReadonly = true;
                this.editData = Object.assign({}, row);
                this.$nextTick(()=>{
                    this.$refs['editForm'].clearValidate();
                });

            },
            editItem(row) {
                this.dialogEditVisible = true;
                this.dialogEditReadonly = false;
                this.editData = Object.assign({}, row);
                this.$nextTick(()=>{
                    this.$refs['editForm'].clearValidate();
                });
            },
            delItem(row) {
                this.$confirm('确定要删除吗？删除后不可恢复，请谨慎操作！！！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/pro/ProBaseCustUnit/del", {"params": {"id": row.oid}})
                        .then(result => {
                            console.log(result);
                            this.$message.success("操作成功");
                            this.$refs.mainQueryGrid.refresh();
                        }).catch(error => {
                        this.$message.error(error.msg);
                    });
                });
            }

        },
        watch: {
            dialogEditVisible() {
                this.$refs.mainQueryGrid.refresh();
                this.$nextTick(() => {
                    this.$refs['editForm'].clearValidate();
                })
            }
        },
        components: {ProBaseUserExtention, IceSelect, IceQueryGrid}
    }
</script>

<style scoped>

</style>