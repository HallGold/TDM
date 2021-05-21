<template>
    <div style="width: 100%;height: 100%;background: white">
        <el-tabs v-model="activeName" type="card" class="full-content" @tab-click="tabClick">
            <el-tab-pane label="运维组织管理" name="first" style="width: 100%;height: 100%;">
                <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height: 100%;">
                    <ice-tree-grid
                            load-url="/pro/ProBaseArea/tree"
                            label-prop="shortname"
                            value-prop="oid"
                            data-url="/pro/ProBaseMaintainGroup/list"
                            :query="query"
                            :columns="columns"
                            :operations="operations"
                            :operationsWidth=230
                            :buttons="buttons"
                            ref="mainQueryGrid"
                            @node-click="handleNodeClick">
                    </ice-tree-grid>
                </div>
            </el-tab-pane>
            <el-tab-pane label="转岗记录" name="second" style="width: 100%;height: 100%;">
                <pro-base-post-shift ref="$shift" style="width: 100%;height: 100%;"></pro-base-post-shift>
            </el-tab-pane>
        </el-tabs>

        <ice-dialog v-dialogDrag :title="`${dialogEditReadonly?'查看':(editData.oid?'编辑':'新增')}运维组织`"
                    custom-class="ice-dialog" center remounted
                    :visible.sync="dialogEditVisible"
                    width="800px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :disabled="dialogEditReadonly" :model="editData" :rules="editRules" label-position="right"
                         class="conditon-bar" ref="editForm"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="区域名称:" label-width="120px" prop="unit">
                                <el-input :disabled="true" placeholder="区域名称"
                                          v-model="editData.areaShortname"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="运维工程师:" label-width="120px" prop="tendName">
                                <ice-select v-model="editData.tendCode" map-type-code="YWGCS"
                                            :text.sync="editData.tendName"></ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="工程师编码:" label-width="120px" prop="tendCode">
                                <el-input placeholder="由运维工程师带出" v-model="editData.tendCode" maxlength="36"
                                          disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否有合作商:" label-width="120px" prop="isFactorychoosed">
                                <ice-select placeholder="是否有合作商" map-type-code="YES_NO"
                                            v-model="editData.isFactorychoosed">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="是否启用:" label-width="120px" prop="isDisabled">
                                <ice-select placeholder="是否启用" map-type-code="enabled" v-model="editData.isDisabled">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="显示顺序:" label-width="120px" prop="sort">
                                <el-input-number placeholder="1"
                                                 v-model="editData.sort"
                                                 :max="99"
                                                 :precision="0"
                                                 :min="1" @change="sortVal"></el-input-number>
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

        <ice-dialog title="成员管理"
                   :visible.sync="dialogVisibleProBaseMaintainMember"
                    remounted
                   width="1000px">
            <pro-base-maintain-member ref="$member" :tendId="tendId"></pro-base-maintain-member>
        </ice-dialog>

        <el-dialog v-dialogDrag title="转岗记录" custom-class="ice-dialog" center
                   :visible.sync="dialogVisibleProBasePostShift"
                   width="1100px" append-to-body :close-on-click-modal="false">
            <pro-base-post-shift ref="$postShift" :tendId="tendId"></pro-base-post-shift>
        </el-dialog>

        <ice-dialog :visible.sync="visibleDialog" title="请选择" width="500px" remounted>
            <div class="ice-container outer">
                <div class="inner">
                    <ice-tree load-url="/pro/ProBaseArea/tree"
                              label-prop="shortname"
                              value-prop="oid"
                              @node-click="nodesClick"
                              style="width:100%"></ice-tree>
                </div>
            </div>
            <div class="ice-button-bar">
                <el-button type="primary" @click="saveCopy">确定</el-button>
                <el-button type="info" @click="closeCopyDialog">取消</el-button>
            </div>
        </ice-dialog>

    </div>

</template>

<script>
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import common from '@/utils/common.js';
    import IceSelect from "../../../components/common/base/IceSelect";
    import ProBasePostShift from "./ProBasePostShift";
    import ProBaseMaintainMember from "../module/ProBaseMaintainMember";
    import IceTree from "../../../components/common/base/IceTree";
    import IceDialog from "../../../components/common/base/IceDialog";

    export default {
        name: "ProBaseMaintainGroup",
        components: {IceDialog, IceTree, ProBaseMaintainMember, ProBasePostShift, IceSelect, IceTreeGrid},
        data() {
            let ncolumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: '区域ID', code: 'areaId', hidden: true},
                {label: '运维组织名称', code: 'tendName', width: 120, required: true},
                {label: '运维组编码', code: 'tendCode', width: 100, required: true},
                {label: '是否有合作商', code: 'isFactorychoosed', width: 100, mapTypeCode: "YES_NO"},
                {label: '是否启用', code: 'isDisabled', width: 100, mapTypeCode: "enabled", sortable: true},
                {label: '显示顺序', code: 'sort', width: 80, sortable: true},
                {label: '创建人', code: 'createUser', width: 150},
                {label: '创建时间', code: 'createDate', width: 150, sortable: true},
                {label: '修改人', code: 'updateUser', width: 150},
                {label: '修改时间', code: 'updateDate', width: 150, sortable: true}];
            return {
                treeId: '0', treeName: '', rootNode: null,
                activeName: 'first',
                query: [
                    {label: '运维组织名称', code: 'tendName', value: '', type: 'input'},
                    {label: '运维组编码', code: 'tendCode', value: '', type: 'input'},
                    {label: '是否有合作商', code: 'isFactorychoosed', mapTypeCode: "YES_NO", value: '', type: 'select'},
                    {label: '是否启用', code: 'isDisabled', mapTypeCode: "enabled", value: '', type: 'select'},
                    {label: '显示顺序', code: 'sort', value: '', type: 'input'},
                    {
                        type: 'static', value: () => {
                            return this.treeId == '0' ? null : this.treeId
                        }, code: 'areaId'
                    }, {
                        type: 'date', exp: '>=', code: 'createDate', label: '创建时间'
                    }, {
                        type: 'date', exp: '>=', code: 'updateDate', label: '修改时间'
                    }],
                editData: common.toInitData(ncolumns, {
                    sort: '0',
                    isFactorychoosed: '0',
                    isDisabled: '0',
                    areaId: this.treeId + '',
                    areaShortname: this.treeName + ''
                }),
                editRules: common.toFormRules(ncolumns),
                columns: [],
                operations: [{name: '详情', callback: this.viewItem},
                    {name: '编辑', callback: this.editItem},
                    {name: '成员管理', callback: this.userItem},
                    {name: '转岗记录', callback: this.shiftItem},
                    {name: '复制', callback: this.copyItem}
                ],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addCallback}],
                dialogEditVisible: false,
                dialogEditReadonly: false,
                dialogVisibleProBaseMaintainMember: false,
                tendId: '',
                dialogVisibleProBasePostShift: false,
                areaArr: [],
                visibleDialog: false,//复制功能打开的弹窗的开关属性
                copyList: [],//复制功能获取当条成员管理的数据
                copyObj: {},//复制功能获获取当条数据
                copyTendId: '',
                copyAreaId: '',
            }
        },
        methods: {
            sortVal(){
                if(!this.editData.sort){
                    this.editData.sort = 1;
                }
            },
            /**
             * 刷新
             */
            refresh() {
                this.$refs.mainQueryGrid.$refs.queryGrid.refresh();
            },
            /**
             * 点击树节点获取node的key值
             */
            nodesClick(data) {
                this.copyAreaId = data;
            },
            /**
             * 复制--取消
             */
            closeCopyDialog() {
                this.visibleDialog = false;
            },
            /**
             * 复制--确定
             */
            async saveCopy() {
                this.copyObj.areaId = this.copyAreaId;

                let isTrueObj = true;
                let isTrueList = true;
                await this.$axios.post("/pro/ProBaseMaintainGroup/saveOrUpdate", this.copyObj).then(res => {
                    this.copyTendId = res.data;
                }).catch(e => {
                    isTrueObj = false;
                    if (e.msg) {
                        this.$message.error(e.msg);
                    } else {
                        this.$message.error(e);
                    }
                });
                let arr = [];
                if (isTrueObj) {
                    this.copyList.forEach(item => {
                        arr.push({
                            tendId: this.copyTendId,
                            username: item.username,
                            usercode: item.usercode,
                            unitname: item.unitname,
                            unitcode: item.unitcode,
                            isCoop: 0
                        })
                    });
                    if (this.copyList.length > 0) {
                        await this.$axios.post("/pro/ProBaseMaintainMember/saveList", {list: JSON.stringify(arr)}).then(res => {
                        }).catch(e => {
                            isTrueList = true;
                            if (e.msg) {
                                this.$message.error(e.msg);
                            } else {
                                this.$message.error(e);
                            }
                        });
                    }
                }

                if (isTrueObj && isTrueList) {
                    this.$message.success("复制成功");
                    this.refresh();
                    this.closeCopyDialog();
                }
            },
            /**
             * 复制
             */
            copyItem(row) {
                this.visibleDialog = true;
                this.copyObj = {};
                this.copyList = [];
                Object.assign(this.copyObj, row);
                delete this.copyObj.createDate;
                delete this.copyObj.oid;
                delete this.copyObj.createUser;
                delete this.copyObj.updateUser;
                delete this.copyObj.updateDate;
                this.$axios.get("/pro/ProBaseMaintainMember/allList", {params: {tendId: row.oid}}).then(res => {
                    if (res.data && res.data.length > 0) {
                        this.copyList = res.data
                    }
                }).catch(e => {
                    this.$message.error(e.msg);
                })
            },
            tabClick(tab) {
                if (this.activeName == 'first') {
                    this.$refs.mainQueryGrid.refresh();
                    return;
                }
                this.$refs.$shift.refresh();
            },
            handleNodeClick(data, node) {
                if (this.rootNode == null) {
                    this.rootNode = [];
                    node.childNodes.forEach(item => {
                        this.rootNode[item.data.oid] = item.data.shortname;
                    })
                }
                this.treeId = data;
                this.treeName = node.data.shortname;

                //该类型是否可编辑
                if (this.treeId == '0') {
                    this.$set(this.buttons[0], 'disabled', true);
                } else {
                    this.$set(this.buttons[0], 'disabled', false);
                }
            },
            addCallback() {
                this.editData = common.toInitData(this.columns, {
                    sort: '0',
                    isFactorychoosed: '0',
                    isDisabled: '0',
                    areaId: this.treeId + '',
                    areaShortname: this.treeName + ''
                });
                this.dialogEditVisible = true;
                this.dialogEditReadonly = false;
                this.$nextTick(() => {
                    this.$refs['editForm'].resetFields();
                });

            },
            saveData() {
                this.$refs['editForm'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.$axios.post("/pro/ProBaseMaintainGroup/saveOrUpdate", this.editData)
                        .then(result => {
                            console.log(result);
                            this.$message.success("保存成功");
                            this.dialogEditVisible = false;
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
                this.$nextTick(()=>{
                    this.$refs['editForm'].clearValidate();
                });

            },
            editItem(row) {
                this.dialogEditVisible = true;
                this.dialogEditReadonly = false;
                this.editData = Object.assign({}, row);
                this.editData.sort = this.editData.sort + '';
                this.editData.areaShortname = this.getAreaName(this.editData.areaId);
                this.$nextTick(()=>{
                    this.$refs['editForm'].clearValidate();
                });

            },
            userItem(row) {
                this.tendId = row.oid + '';
                this.dialogVisibleProBaseMaintainMember = true;
                this.$nextTick(() => {
                    this.$refs.$member.show();
                })

            },
            shiftItem(row) {
                this.tendId = row.oid + '';
                this.dialogVisibleProBasePostShift = true;
                this.$nextTick(() => {
                    this.$refs.$postShift.show();
                })
            },
            /**
             * 获取区域名称
             */
            getAreaIdName(id) {
                for (let i = 0; i < this.areaArr.length; i++) {
                    if (this.areaArr[i].oid == id) {
                        return this.areaArr[i].shortname;
                    }
                }
                return '';
            },
            /**
             * 初始化表格列
             * */
            initColums() {
                let _this = this;
                this.columns = [
                    {label: 'oid', code: 'oid', hidden: true},
                    {
                        label: '区域名称', code: 'areaId', width: 120,align:'left',showTips:true, renderCell(h, data) {
                            return <a title={_this.getAreaIdName(data.row.areaId)}>{_this.getAreaIdName(data.row.areaId)}</a>;
                        }
                    },
                    {label: '运维组织名称', code: 'tendName', width: 120},
                    {label: '运维组编码', code: 'tendCode', width: 100},
                    {label: '是否有合作商', code: 'isFactorychoosed', width: 100, mapTypeCode: "YES_NO"},
                    {label: '是否启用', code: 'isDisabled', width: 100, mapTypeCode: "enabled", sortable: true},
                    {label: '显示顺序', code: 'sort', width: 100, sortable: true},
                    {label: '创建人', code: 'createUser', width: 150},
                    {label: '创建时间', code: 'createDate', width: 150, sortable: true},
                    {label: '修改人', code: 'updateUser', width: 150},
                    {label: '修改时间', code: 'updateDate', width: 150, sortable: true}];
            },
        },
        watch: {
            dialogEditVisible() {
                try {
                    this.$refs.mainQueryGrid.$refs.queryGrid.refresh();
                } catch (e) {
                }
            },
            "editData.sort": function (newVal) {
                this.editData.sort = Math.ceil(newVal);
            }
        },
        mounted() {
            this.$axios.get("/pro/ProBaseArea/tree").then(res => {
                this.areaArr = res.data[0].children.length > 0 ? res.data[0].children : [];
            }).catch(e => {
                this.$message.error(e.error);
            });
            this.initColums();

        }
    }
</script>

<style scoped>
    .outer {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 400px
    }

    .inner {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        width: 100%
    }
</style>