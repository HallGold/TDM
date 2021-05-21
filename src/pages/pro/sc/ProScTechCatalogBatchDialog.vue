<template>
    <ice-dialog title="选择服务项"
                :visible.sync="dialogVisibleBatchProScBizCatalog"
                :buttons="bathButtons"
                :before-close="closeDialog"
                width="1000px">
        <div class="ice-container" style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height:400px">
            <div style="flex-grow: 1;display: flex;flex-direction: row;width: 100%">
                <ice-tree load-url="/pro/ProScTechCatalogTemplate/createTree?parentId="
                          label-prop="name"
                          value-prop="parentId"
                          :showTreeCheckbox="true"
                          :default-expanded-keys="['']"
                          @node-check="checkedNodesClick"
                          ref="tree"
                          style="width:25%">
                    <slot name="prefix" slot="prefix"></slot>
                </ice-tree>
                <div class="editableArea">
                    <el-form :model="editData" :rules="editRules" label-position="right"
                             class="conditon-bar" ref="editFormDialog"
                             style="margin-top: 20px">
                        <el-row :gutter="60">
                            <el-col :span="8">
                                <el-form-item label="区域:" label-width="140px" prop="areaId">
                                    <el-select placeholder="请选择" v-model="editData.areaId">
                                        <el-option v-for="item in regionList"
                                                   :key="item.oid"
                                                   :label="item.shortname"
                                                   :value="item.oid"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="60">
                            <el-col :span="8">
                                <el-form-item label="担当岗位:" label-width="140px" prop="roleId">
                                    <el-input v-model="editData.roleId" maxlength="36"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="第三方技术支持:" label-width="140px" prop="thirdparty">
                                    <el-select placeholder="请选择" v-model="editData.thirdparty">
                                        <el-option v-for="item in thirdPartyList"
                                                   :key="item.oid"
                                                   :label="item.unitname"
                                                   :value="item.unitname"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="60">
                            <el-col :span="8">
                                <el-form-item label="贡献值:" label-width="140px" prop="score">
                                    <el-input-number v-model="editData.score"
                                                     controls-position="right"
                                                     :precision="2"
                                                     style="width:100%"
                                                     :min="0">

                                    </el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="难度系数:" label-width="140px" prop="difficuty">
                                    <el-input-number v-model="editData.difficuty"
                                                     controls-position="right"
                                                     style="width:100%"
                                                     :min="0">

                                    </el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="60">
                            <el-col :span="8">
                                <el-form-item label="有效开始时间:" label-width="140px" prop="gmtBegin">
                                    <el-date-picker
                                            v-model="editData.gmtBegin"
                                            type="date"
                                            @change="changeGmtBegin"
                                            placeholder="选择日期" format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="有效结束时间:" label-width="140px" prop="gmtEnd">
                                    <el-date-picker
                                            v-model="editData.gmtEnd"
                                            type="date"
                                            :picker-options="{disabledDate(time) {return timeFilter(time)}}"
                                            placeholder="选择日期" format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="60">
                            <el-col :span="24">
                                <el-form-item label="技术手册:" label-width="140px" prop="manual">
                                    <el-input
                                            type="textarea"
                                            :rows="4"
                                            placeholder="请输入内容"
                                            maxlength="256"
                                            v-model="editData.manual">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
        </div>
    </ice-dialog>

</template>

<script>
    import IceTree from '@/components/common/base/IceTree.vue'
    import IceSelect from "../../../components/common/base/IceSelect";
    import common from '@/utils/common.js';
    import IceDialog from "../../../components/common/base/IceDialog";

    export default {
        name: "ProScTechCatalogBatchDialog",
        components: {IceDialog, IceSelect, IceTree},
        data() {
            return {
                treeId: '0',
                treeName: '',
                rootNode: null,
                editData: {
                    score: 0,
                    difficuty: 0,
                    manual: '',
                    gmtEnd: '',
                    gmtBegin: '',
                    areaId: '',
                    roleId: '',
                    thirdparty: '',
                },
                //页面校验规则
                editRules: {
                    areaId: [{required: true, message: '请选择区域', trigger: 'change'}],
                    profession: [{required: true, whitespace: true, message: '请填写担当岗位', trigger: 'blur'}],
                    thirdparty: [{required: true, message: '请选择第三方技术支持', trigger: 'change'}]
                },
                checkedTreeKeys: [],
                regionList: [],
                thirdPartyList: [],
                list: [],            //存放勾选的树形节点，
                bathButtons: [
                    {name: '保存', iscannel: false, click: this.saveServeBatch},
                    {name: '取消', iscannel: true, click: this.closeDialog},
                ],
                dialogVisibleBatchProScBizCatalog: false,    //批量新增弹窗的开关属性
            }
        },
        methods: {
            closeDialog() {
                this.$refs.editFormDialog.resetFields();
                this.$refs.tree.clearSearch();
                this.dialogVisibleBatchProScBizCatalog = false;
            },
            /**
             * 打开批量新增弹窗
             */
            openDialog() {
                this.dialogVisibleBatchProScBizCatalog = true;
                this.$nextTick(() => {
                    this.resetForm();
                    this.$refs.tree.refresh();
                })
            },
            /**时间过滤*/
            timeFilter(time) {
                if (time < new Date(this.editData.gmtBegin)) {
                    return true
                }
                return false;
            },
            changeGmtBegin() {
                if (new Date(this.editData.gmtBegin) > new Date(this.editData.gmtEnd)) {
                    this.editData.gmtEnd = '';
                }
            },
            /**
             * 批量新增--保存
             */
            async saveServeBatch() {
                if (this.list.length > 0) {
                    try {
                        await this.$refs.editFormDialog.validate();
                    } catch (e) {
                        return false;
                    }
                    this.list.forEach(item => {
                        item.templateId = item.oid;
                        delete item.oid;
                        Object.assign(item, this.editData);
                    });
                    await this.$axios.post("pro/ProScTechCatalog/allSave", {list: JSON.stringify(this.list)});
                    this.$message.success("保存成功");
                    this.$emit('closeBatchDialog');
                    return true;

                } else {
                    this.$message.warning('请选择需要操作的服务项！');
                    return false;
                }
            },
            /**
             * 是否为最后一个节点
             * @param arr
             */
            isLastNode(arr) {
                arr.forEach(item => {
                    if (item.children && item.children.length > 0) {
                        this.isLastNode(item.children);
                    } else {
                        if (item.oid && this.list.indexOf(item) === -1) {
                            this.list.push(item);
                        }
                    }
                })
            },
            checkedNodesClick(currentCheckedNode, nodeStatus) {
                this.list = [];
                this.isLastNode(nodeStatus.checkedNodes);
                /*this.checkedTreeKeys = nodeStatus.checkedKeys;*/
            },
            initSelectData() {
                //获取技术服务区域
                this.$axios.get('/pro/ProScBizCatalog/areaAll')
                    .then(result => {
                        this.regionList = result.data
                        // this.$message.success("操作成功");
                        // this.$refs.mainQueryGrid.refresh();
                    }).catch(error => {
                    this.$message.error(error.msg);
                });

                //获取第三方技术支持方信息
                this.$axios.get('/pro/ProScTechCatalog/allThirdparty')
                    .then(result => {
                        this.thirdPartyList = result.data
                    }).catch(error => {
                    this.$message.error(error.msg);
                });
            },
            resetForm() {
                this.$refs.editFormDialog.resetFields();
            }
        },
        mounted() {
            this.initSelectData()
        },

    }
</script>

<style lang="less" scoped>


    .editableArea {
        flex-grow: 1;
        padding-left: 10px;
        display: flex;
        flex-direction: column;
        padding: 5px;
        background: white;
        margin-left: 5px;

        .operation-bar {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 40px;
            flex-shrink: 0;
            padding: 5px 10px;
            background: #ffffff;
        }

        .grid-bar {
            flex-grow: 1;
            flex-shrink: 1;
            position: relative;
        }
    }
</style>