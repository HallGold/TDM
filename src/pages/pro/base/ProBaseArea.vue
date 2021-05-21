<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title=""
                        data-url="/pro//ProBaseArea/list"
                        :query="query"
                        :columns="columns"
                        :operationsWidth=100
                        :operations="operations"
                        ref="mainQueryGrid"
                        :buttons="buttons">
        </ice-query-grid>

        <ice-dialog v-dialogDrag :title="`${dialogEditReadonly?'查看':(editData.oid?'编辑':'新增')}区域维护`" center
                    :visible.sync="dialogEditVisible" remounted
                    width="800px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :disabled="dialogEditReadonly" :model="editData" :rules="editRules" label-position="right"
                         class="conditon-bar" ref="editForm"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="单位名称:" label-width="100px" prop="unitName">
                                <el-input :disabled="true" placeholder="单位名称"
                                          v-model="editData.unitName">
                                    <i v-if="!dialogEditReadonly && !editData.oid" style="z-index: 999;cursor: pointer;"
                                       @click="unitChoose(1)" slot="suffix"
                                       class="el-input__icon el-icon-edit-outline"></i>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="网络类型:" label-width="100px" prop="network">
                                <ice-select @change="networkChange" ref="$network"
                                            placeholder="网络类型"
                                            map-type-code="PRO_NETWORK" v-model="editData.network"
                                            :text.sync="proNetworkName">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="区域简称:" label-width="100px" prop="shortname">
                                <el-input placeholder="请输入16字以下的区域简称" v-model="editData.shortname"
                                          maxlength="16"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="区域代码:" label-width="100px" prop="code">
                                <el-input placeholder="区域代码尽量勿改" maxlength="16" :showWordLimit="true"
                                          v-model="editData.code">
                                    <el-button slot="append"
                                               icon="el-icon-warning"
                                               style="color:#ebb563"
                                               title="请不要修改我哦"></el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="运维责任单位:" label-width="100px" prop="revolveUnitName">
                                <ice-dept-selector choose-item="single"
                                                   mode="onlySelect"
                                                   :allDept="true"
                                                   :text.sync="editData.revolveUnitCode"
                                                   v-model="editData.revolveUnitName"></ice-dept-selector>
                                <!--<el-input readonly placeholder="运维责任单位"
                                          v-model="editData.revolveUnitName">
                                    &lt;!&ndash;       <el-button slot="append"
                                                      icon="el-icon-delete"
                                              style="z-index: 999;cursor: pointer;" @click="delMsg(1)"></el-button>&ndash;&gt;
                                    <i slot="suffix"
                                       v-show="appendMake"
                                       v-if="editData.revolveUnitName !== ''"
                                       class="el-icon-delete  el-input__icon"
                                       style="z-index: 999;cursor: pointer;" @click="delMsg(1)"></i>
                                    <i style="z-index: 999;cursor: pointer;"
                                       v-show="appendMake"
                                       @click="unitChoose(2)" slot="suffix"
                                       class="el-input__icon el-icon-edit-outline"></i>
                                </el-input>-->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="信息管理部门:" label-width="100px" prop="informatizationDeptName">
                                <ice-dept-selector choose-item="single"
                                                   mode="onlySelect"
                                                   :text.sync="editData.informatizationDeptCode"
                                                   :allDept="true"
                                                   v-model="editData.informatizationDeptName"></ice-dept-selector>
                                <!--<el-input readonly placeholder="信息管理部门"
                                          v-model="editData.informatizationDeptName">
                                    <i slot="suffix"
                                       v-show="appendMake"
                                       v-if="editData.informatizationDeptName !== ''"
                                       class="el-icon-delete  el-input__icon"
                                       style="z-index: 999;cursor: pointer;" @click="delMsg(2)"></i>
                                    <i style="z-index: 999;cursor: pointer;"
                                       v-show="appendMake"
                                       @click="unitChoose(3)" slot="suffix"
                                       class="el-input__icon el-icon-edit-outline"></i>
                                </el-input>-->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备管理部门:" label-width="100px" prop="devDeptName">
                                <ice-dept-selector choose-item="single"
                                                   mode="onlySelect"
                                                   :allDept="true"
                                                   :text.sync="editData.devDeptCode"
                                                   v-model="editData.devDeptName"></ice-dept-selector>
                                <!--<el-input readonly placeholder="设备管理部门"
                                          v-model="editData.devDeptName">
                                    <i slot="suffix"
                                       v-show="appendMake"
                                       v-if="editData.devDeptName !== ''"
                                       class="el-icon-delete  el-input__icon"
                                       style="z-index: 999;cursor: pointer;" @click="delMsg(3)"></i>
                                    <i style="z-index: 999;cursor: pointer;"
                                       v-show="appendMake"
                                       @click="unitChoose(4)" slot="suffix"
                                       class="el-input__icon el-icon-edit-outline"></i>
                                </el-input>-->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="保密管理部门:" label-width="100px" prop="secrecyDeptName">
                                <ice-dept-selector choose-item="single"
                                                   mode="onlySelect"
                                                   :allDept="true"
                                                   :text.sync="editData.secrecyDeptCode"
                                                   v-model="editData.secrecyDeptName"></ice-dept-selector>
                                <!--<el-input readonly placeholder="保密管理部门"
                                          v-model="editData.secrecyDeptName">
                                    <i slot="suffix"
                                       v-show="appendMake"
                                       v-if="editData.secrecyDeptName !== ''"
                                       class="el-icon-delete  el-input__icon"
                                       style="z-index: 999;cursor: pointer;" @click="delMsg(4)"></i>
                                    <i style="z-index: 999;cursor: pointer;"
                                       v-show="appendMake"
                                       @click="unitChoose(5)" slot="suffix"
                                       class="el-input__icon el-icon-edit-outline"></i>
                                </el-input>-->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="显示顺序:" label-width="100px" prop="sort">
                                <el-input-number placeholder="1"
                                                 :min="1"
                                                 :max="99"
                                                 :precision="0"
                                                 v-model="editData.sort" @change="sortVal"></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="是否涉密:" label-width="100px" prop="isSecret">
                                <el-checkbox true-label="1" false-label="0" label=""
                                             v-model="editData.isSecret"></el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="是否禁用:" label-width="100px" prop="isDisabled">
                                <el-checkbox true-label="1" false-label="0" label=""
                                             v-model="editData.isDisabled"></el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="备注:" label-width="100px" prop="remark">
                                <el-input placeholder="备注" type="textarea" :rows="4"
                                          v-model="editData.remark" maxlength="11000" :showWordLimit="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="ice-button-bar" v-if="!dialogEditReadonly">
                    <el-button type="primary" @click="saveData">保存</el-button>
                    <el-button type="info" @click="dialogEditVisible=false;">返回</el-button>
                </div>

            </div>
        </ice-dialog>

        <ice-dialog v-dialogDrag title="选择单位" custom-class="ice-dialog" center
                    :visible.sync="dialogVisibleFrameOrgCustChoose" remounted
                    width="600px" append-to-body :close-on-click-modal="false">
            <frame-org-cust-choose
                    style="height: 500px;"
                    @select-confirm="frameOrgCustChooseConfirm"
                    @select-cannel="frameOrgCustChooseCannel"></frame-org-cust-choose>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import common from '@/utils/common.js';
    import IceSelect from "../../../components/common/base/IceSelect";
    import IcePopSelector from "@/components/common/base/IcePopSelector";
    import FrameOrgCustChoose from "../module/FrameOrgCustChoose";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";

    export default {
        name: "ProBaseArea",
        data() {
            let ncolumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: '备注', code: 'remark', hidden: true},
                {label: '运维责任code', code: 'revolveUnitCode', hidden: true},
                {label: '信息化管理部门CODE', code: 'informatizationDeptCode', hidden: true},
                {label: '设备管理部门CODE', code: 'devDeptCode', hidden: true},
                {label: '保密管理部门CODE', code: 'secrecyDeptCode', hidden: true},
                {label: '区域简称', code: 'shortname', width: 100, required: true, sortable: true},
                {label: '区域单位', code: 'unit', hidden: true, required: true},
                {label: '单位名称', code: 'unitName', width: 120, required: true, sortable: true},
                {
                    label: '网络类型',
                    code: 'network',
                    width: 100,
                    mapTypeCode: "PRO_NETWORK",
                    required: true,
                    sortable: true
                },
                {label: '区域代码', code: 'code', width: 120, required: true, sortable: true},
                {label: '运维责任单位', code: 'revolveUnitName', width: 140, required: true, sortable: true},
                {label: '信息管理部门', code: 'informatizationDeptName', width: 140, required: true, sortable: true},
                {label: '设备管理部门', code: 'devDeptName', width: 140, required: true, sortable: true},
                {label: '保密管理部门', code: 'secrecyDeptName', width: 140, required: true, sortable: true},
                {label: '是否涉密', code: 'isSecret', width: 100, mapTypeCode: "YES_NO", sortable: true},
                {label: '是否禁用', code: 'isDisabled', width: 100, mapTypeCode: "YES_NO", sortable: true},
                {label: '显示顺序', code: 'sort', width: 100, sortable: true},
                {label: '创建人', code: 'createUser', width: 120, sortable: true},
                {label: '创建时间', code: 'createDate', width: 120, sortable: true},
                {label: '修改时间', code: 'updateDate', width: 120, sortable: true}];

            return {
                deptCode:'',
                query: [
                    {label: '区域简称', code: 'shortname', type: 'input'},
                    {label: '单位名称', code: 'unitName', type: 'input'},
                    {label: '网络类型', code: 'network', type: 'select', mapTypeCode: "PRO_NETWORK"},
                    {label: '区域代码', code: 'code', type: 'input'},
                    {label: '运维责任单位', code: 'revolveUnitName', type: 'input'},
                    {label: '信息管理部门', code: 'informatizationDeptName', type: 'input'},
                    {label: '设备管理部门', code: 'devDeptName', type: 'input'},
                    {label: '保密管理部门', code: 'secrecyDeptName', type: 'input'},
                    {
                        type: 'date', exp: '>=', code: 'createDate', label: '创建时间'
                    }, {
                        type: 'date', exp: '>=', code: 'updateDate', label: '修改时间'
                    }],
                columns: ncolumns,
                operations: [{name: '详情', callback: this.viewItem}, {name: '编辑', callback: this.editItem},
                    {
                        name: '删除',
                        callback: this.delItem,
                        isShow: function () {
                            return false;
                        }
                    }],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addCallback}],
                dialogEditVisible: false,
                dialogEditReadonly: false,
                editData: common.toInitData(ncolumns, {
                    isSecret: 0, isDisabled: 0,sort:'1'
                }),
                editRules: {
                    shortname: [{required: true, whitespace: true, message: '请填写区域简称', trigger: 'change'}],
                    code: [{required: true, whitespace: true, message: '请填写区域代码', trigger: 'change'}],
                    unitName: [{required: true, message: '请选择区域单位', trigger: 'change'}],
                    network: [{required: true, message: '请选择网络类型', trigger: 'change'}],
                },
                dialogVisibleFrameOrgCustChoose: false,
                proNetworkName: '',
                name: "",
                appendMake: false,
                unitName:'',
            }
        },
       /* watch:{
            unitName(){
                this.editData.revolveUnitCode = '';
                this.editData.revolveUnitName = '';
                this.editData.informatizationDeptCode = '';
                this.editData.informatizationDeptName = '';
                this.editData.devDeptCode = '';
                this.editData.devDeptName = '';
                this.editData.secrecyDeptCode = '';
                this.editData.secrecyDeptName = '';
            }
        },*/
        methods: {
            sortVal(){
                if(!this.editData.sort){
                    this.editData.sort = 1;
                }
            },
            delMsg(data) {
                if (data == 1) {
                    this.editData.revolveUnitName = "";
                } else if (data == 2) {
                    this.editData.informatizationDeptName = "";
                } else if (data == 3) {
                    this.editData.devDeptName = "";
                } else if (data == 4) {
                    this.editData.secrecyDeptName = "";
                }
            },
            unitChoose(data) {
                if (data == 1) {
                    this.name = 1
                } else if (data == 2) {
                    this.name = 2
                } else if (data == 3) {
                    this.name = 3
                } else if (data == 4) {
                    this.name = 4
                } else if (data == 5) {
                    this.name = 5
                }
                this.dialogVisibleFrameOrgCustChoose = true;
            },
            refreshPro() {
                console.log(this.editData.unit + ',' + this.editData.unitName + ',' + this.editData.network + ',' + this.proNetworkName)
                if (this.editData.unit && this.editData.unitName && this.editData.network && this.proNetworkName) {
                    this.editData.shortname = this.editData.unitName + '' + this.proNetworkName;
                    this.editData.code = this.editData.unit + '' + this.editData.network;
                }
            },
            networkChange(v) {
                this.refreshPro();
            },
            frameOrgCustChooseConfirm(data) {
                console.log(data);
                this.dialogVisibleFrameOrgCustChoose = false;
                if (this.name == 1) {
                    /*this.deptCode = data.code;*/
                    this.editData.unit = data.code + '';
                    this.editData.unitName = data.name + '';
                    this.unitName = data.name;
                } else if (this.name == 2) {
                    this.editData.revolveUnitCode = data.code + '';
                    this.editData.revolveUnitName = data.name + '';
                } else if (this.name == 3) {
                    this.editData.informatizationDeptCode = data.code + '';
                    this.editData.informatizationDeptName = data.name + '';
                } else if (this.name == 4) {
                    this.editData.devDeptCode = data.code + '';
                    this.editData.devDeptName = data.name + '';
                } else if (this.name == 5) {
                    this.editData.secrecyDeptCode = data.code + '';
                    this.editData.secrecyDeptName = data.name + '';
                }
                this.refreshPro();
                this.name = "";
            },
            frameOrgCustChooseCannel() {
                this.dialogVisibleFrameOrgCustChoose = false;
            },
            addCallback() {
                this.editData = common.toInitData(this.columns, {
                    isSecret: 0, isDisabled: 0
                });
                this.dialogEditVisible = true;
                this.dialogEditReadonly = false;
                this.$nextTick(() => {
                    this.$refs.editForm.resetFields();
                });
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
                    this.$axios.delete("/pro/ProBaseArea/del", {"params": {"id": row.oid}})
                        .then(result => {
                            console.log(result);
                            this.$message.success("操作成功");
                            this.dialogEditVisible = false;
                            this.$refs.mainQueryGrid.refresh();
                        }).catch(error => {
                        this.$message.error(error.msg);
                    });
                });
            },
            saveData() {
                this.$refs['editForm'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.$axios.post("/pro/ProBaseArea/saveOrUpdate", this.editData)
                        .then(result => {
                            this.$message.success(result.data == null ? "保存成功" : result.data);
                            this.dialogEditVisible = false;
                            this.$refs.mainQueryGrid.refresh();
                        }).catch(error => {
                        this.$message.error(error.msg)
                    });
                });
            },
        },
        beforeUpdate() {
            if (this.dialogEditReadonly == true) {
                this.appendMake = false;
            } else {
                this.appendMake = true;
            }
        },
        components: {IceDeptSelector, IceDialog, FrameOrgCustChoose, IceSelect, IceQueryGrid, IcePopSelector}
    }
</script>

<style scoped>

</style>