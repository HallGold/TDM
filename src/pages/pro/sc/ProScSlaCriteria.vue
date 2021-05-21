<template>
    <div style="width: 100%;height: 100%;background: white">
        <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height: 100%;">
            <ice-tree-grid
                    load-url="/pro/ProBaseArea/tree"
                    label-prop="shortname"
                    value-prop="oid"
                    data-url="/pro/ProScSlaCriteria/list"
                    :query="query"
                    :columns="columns"
                    :operations="operations"
                    :operationsWidth=200
                    :buttons="buttons"
                    ref="mainQueryGrid"
                    @node-click="handleNodeClick">
            </ice-tree-grid>
        </div>


        <el-dialog v-dialogDrag :title="`${dialogEditReadonly?'查看':(editData.oid?'编辑':'新增')}SLA指标`"
                   custom-class="ice-dialog" center
                   :visible.sync="dialogEditVisible"
                   width="800px" style="height: 100%;" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :disabled="dialogEditReadonly" :model="editData" :rules="editRules" label-position="right"
                         class="conditon-bar" ref="editForm"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="区域名称:" label-width="120px" prop="unit">
                                <el-input :disabled="true" placeholder="区域名称"
                                          v-model="editData.areaShortname" maxlength="36"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="SLA指标:" label-width="120px" prop="sname">
                                <el-input placeholder="SLA指标"
                                          v-model="editData.sname"
                                          maxlength="36"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="指标分类:" label-width="120px" prop="category">
                                <ice-select placeholder="指标分类" map-type-code="PRO_SLA_CATEGORY"
                                            v-model="editData.category">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                       <!-- <el-col :span="12">
                            <el-form-item label="备注:" label-width="120px" prop="inputTxt">
                                <el-input placeholder="备注" v-model="editData.inputTxt" maxlength="36"></el-input>
                            </el-form-item>
                        </el-col>-->
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="是否响应时间:" label-width="120px" prop="isResponseTime">
                                <ice-select placeholder="是否响应时间" map-type-code="YES_NO"
                                            v-model="editData.isResponseTime">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否处置时间:" label-width="120px" prop="isManageTime">
                                <ice-select placeholder="是否处置时间" map-type-code="YES_NO"
                                            v-model="editData.isManageTime">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="备注:" label-width="120px" prop="inputTxt" layout="3" >
                        <el-input placeholder="备注" type="textarea"  v-model="editData.inputTxt" resize="none" maxlength="36"></el-input>
                    </el-form-item>

                </el-form>
                <div class="ice-button-bar" v-if="!dialogEditReadonly">
                    <el-button type="primary" @click="saveData">保存</el-button>
                    <el-button type="info" @click="dialogEditVisible=false;">返回</el-button>
                </div>

            </div>
        </el-dialog>

    </div>

</template>

<script>
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import common from '@/utils/common.js';
    import IceSelect from "../../../components/common/base/IceSelect";
    import {specialCharacter} from "./common/validator.js"

    export default {
        name: "ProScSlaCriteria",
        components: {IceSelect, IceTreeGrid},
        data() {
            let ncolumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: '区域ID', code: 'areaId', hidden: true},
                {label: '区域名称', code: 'areaname', width: 120, required: true},
                {label: '是否响应时间', code: 'isResponseTime', width: 120, required: true, mapTypeCode: "YES_NO", hidden: true},
                {label: '是否处置时间', code: 'isManageTime', width: 120, required: true, mapTypeCode: "YES_NO", hidden: true},
                {label: 'SLA指标', code: 'sname', width: 120, required: true},
                {label: '指标分类', code: 'category', width: 100, required: true, mapTypeCode: "PRO_SLA_CATEGORY"},
                {label: '创建人', code: 'updateUser', width: 100},
                {label: '创建时间', code: 'updateDate', width: 170, sortable: true},
                {label: '备注', code: 'inputTxt', width: 100},
            ]
            return {
                treeId: '0', treeName: '', rootNode: null,
                query: [{
                    type: 'static', value: () => {
                        return this.treeId == '0' ? null : this.treeId
                    }, code: 'areaId', exp: '=',
                },
                    {label: '区域名称', code: 'areaname', type: 'input', value: '', exp: 'upperLike'},
                    {label: 'SLA指标', code: 'sname', type: 'input', value: '', exp: 'upperLike'},
                    {label: '指标分类', code: 'category', mapTypeCode: "PRO_SLA_CATEGORY", type: 'select', value: ''},
                    {label: '创建人', code: 'updateUser', type: 'input', value: '', exp: 'upperLike',},
                    {label: '创建时间', code: 'updateDate', type: 'date', value: ''}],
                editData: common.toInitData(ncolumns, {
                    category: '1',
                    areaId: this.treeId + '',
                    areaShortname: this.treeName + ''
                }),
                editRules: {
                    sname: [
                        {required: true, whitespace: true, message: '请填写服务名称'},
                        {validator: specialCharacter, trigger: 'blur'}
                    ],
                    category: [
                        {required: true, message: '请选择指标分类', trigger: 'change'},
                    ]
                },
                columns: ncolumns,
                operations: [{name: '详情', callback: this.viewItem},
                    {name: '编辑', callback: this.editItem},
                    {name: '删除', callback: this.delItem}],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addCallback}],
                dialogEditVisible: false,
                dialogEditReadonly: false
            }
        },
        methods: {
            handleNodeClick(data, node) {
                if (this.rootNode == null) {
                    this.rootNode = [];
                    node.childNodes.forEach(item => {
                        this.rootNode[item.data.oid] = item.data.shortname;
                    })
                }
                this.treeId = data;
                this.treeName = node.data.shortname;
            },
            addCallback() {
                if (this.treeId == '0') {
                    this.$message.warning('请选择左侧区域后进行新增');
                    return;
                }
                this.editData = common.toInitData(this.columns, {
                    category: '1',
                    areaId: this.treeId + '',
                    areaShortname: this.treeName + ''
                });
                this.dialogEditVisible = true;
                this.dialogEditReadonly = false;
                this.$nextTick(()=>{
                    this.$refs['editForm'].clearValidate();
                });

            },
            saveData() {
                this.$refs['editForm'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.$axios.post("/pro/ProScSlaCriteria/saveOrUpdate", this.editData)
                        .then(result => {
                            this.$message.success("保存成功");
                            this.dialogEditVisible = false;
                        }).catch(error => {
                        this.$message.error(error.msg);
                    });
                });
            },
            delItem(row) {
                this.$confirm('确定要删除吗？删除后不可恢复，请谨慎操作！！！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/pro/ProScSlaCriteria/del", {"params": {"id": row.oid}})
                        .then(result => {
                            this.$message.success("操作成功");
                            this.$refs.mainQueryGrid.$refs.queryGrid.refresh();
                        }).catch(error => {
                        this.$message.error(error.msg);
                    });
                });
            },
            getAreaName(oid) {
                if (this.rootNode == null) {
                    return '';
                }
                let name = this.rootNode[oid];
                return name ? name : '';
            },
            viewItem(row) {
                this.dialogEditVisible = true;
                this.dialogEditReadonly = true;
                this.editData = Object.assign({}, row);
                this.editData.sort = this.editData.sort + '';
                this.editData.areaShortname = this.getAreaName(this.editData.areaId);
                this.$refs['editForm'].clearValidate();
            },
            editItem(row) {
                this.dialogEditVisible = true;
                this.dialogEditReadonly = false;
                this.editData = Object.assign({}, row);
                this.editData.sort = this.editData.sort + '';
                this.editData.areaShortname = this.getAreaName(this.editData.areaId);
                this.$refs['editForm'].clearValidate();
            },
        },
        watch: {
            dialogEditVisible() {
                try {
                    this.$refs.mainQueryGrid.$refs.queryGrid.refresh();
                } catch (e) {
                }

            }
        },
    }
</script>

