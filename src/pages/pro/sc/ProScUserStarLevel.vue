<template>
    <div style="width: 100%;height: 100%;background: white">
        <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height:100%">
            <div style="flex-grow: 1;display: flex;flex-direction: row;width: 100%">
                <ice-tree load-url='/pro/ProBaseArea/tree'
                          label-prop='shortname'
                          value-prop="oid"
                          @node-click="handleNodeClick"
                          ref="tree">
                    <slot name="prefix" slot="prefix"></slot>
                </ice-tree>
                <div class="editableArea">
                    <ice-query-grid title=""
                                    data-url="/pro/ProScSlaLevel/list"
                                    :query="query"
                                    :columns="columns"
                                    :operations="operations"
                                    :operationsWidth=100
                                    ref="mainQueryGrid"
                                    :beforeBindData="beforeBindData"
                                    :buttons="buttons">
                    </ice-query-grid>
                    <slot name="bottom"></slot>
                </div>
            </div>
        </div>

        <ice-dialog :title="Change"
                    remounted
                    :buttons="addButtons"
                    :visible.sync="dialogEditVisible"
                    width="825px" :close-on-click-modal="false" :before-close="closeSLAItem">
            <div class="form-content" style="max-height: 500px;overflow-y: scroll;overflow-x: hidden">
                <ice-grid-layout name="SLA名称" :columns="1">
                    <div style="margin-bottom: 2px;">
                        SLA指标:
                        <el-select placeholder="请选择"
                                   v-model="slaTarget"
                                   :disabled="!isAddFlag">
                            <el-option v-for="item in SLAList"
                                       :key="item.oid"
                                       :label="item.sname"
                                       :value="item.oid"></el-option>
                        </el-select>
                    </div>
                </ice-grid-layout>
                <ice-form-group name="参考指标" v-if="lv !=0">
                    <div class="grid-bar" style="width: 100%;" v-if="isAddFlag">
                        <ice-editable-table :data="mainData.editTables"
                                            style="width: 100%"
                                            v-model="mainData.editTables"
                                            :rules="tableRules"
                                            ref="editTable">
                            <el-table-column :width="150" label="序号">
                                <template slot-scope="scope">
                                    {{scope.$index+1}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="lv"
                                             label="级别"
                                             :width="150">
                            </el-table-column>
                            <ice-editable-table-column prop="op"
                                                       label="操作符"
                                                       :width="150"
                                                       input-type="select"
                                                       map-type-code="SC_OPTION">
                            </ice-editable-table-column>
                            <ice-editable-table-column prop="target"
                                                       label="级别目标值"
                                                       :width="150"
                                                       :min="0"
                                                       :max="99"
                                                       :precision="0"
                                                       input-type="number">
                            </ice-editable-table-column>
                            <ice-editable-table-column prop="unit"
                                                       label="单位"
                                                       :width="150"
                                                       input-type="select"
                                                       map-type-code="SC_TIME">

                            </ice-editable-table-column>
                        </ice-editable-table>
                    </div>
                </ice-form-group>
            </div>
        </ice-dialog>

        <pro-sc-level ref="proScLevel" @isSuccess="isSuccess"></pro-sc-level>

    </div>
</template>

<script>
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceQueryGrid from '@/components/common/base/IceQueryGrid.vue'
    import IceTree from '@/components/common/base/IceTree.vue'
    import IceDialog from "@/components/common/base/IceDialog";
    import IceFormGroup from "@/components/common/base/IceFormGroup";
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import ProScLevel from "./common/ProScLevel";

    export default {
        name: "ProScUserStarLevel",
        components: {
            ProScLevel,
            IceSelect,
            IceTreeGrid,
            IceQueryGrid,
            IceTree,
            IceDialog,
            IceGridLayout,
            IceFormGroup,
            IceEditableTableColumn,
            IceEditableTable
        },
        data() {
            let ncolumns = [
                {label: '主键id', code: 'loid', hidden: true, width: 125},
                {label: '区域', code: 'areaName', width: 125},
                {label: 'SLA指标', code: 'sname', width: 125},
                {label: '等级1', code: 'lv1', width: 125},
                {label: '等级2', code: 'lv2', width: 125},
                {label: '等级3', code: 'lv3', width: 125},
                {label: '等级4', code: 'lv4', width: 125},
                {label: '等级5', code: 'lv5', width: 125},
                {label: '等级6', code: 'lv6', width: 125},
                {label: '等级7', code: 'lv7', width: 125},
            ]
            return {
                tableRules: {//参考指标字段的验证规则
                    op: {required: true, message: '请选择操作符', trigger: 'change'},
                    target: {
                        required: true, type: 'number', whitespace: true, message: '请填写级别目标值', trigger: 'blur'
                    },
                    unit: {required: true, message: '请选择单位', trigger: 'change'},
                },
                slaTarget: '',       //指标ID
                areaId: '',          //指标的区域ID
                treeId: '',
                treeName: '',
                rootNode: null,
                query:
                    [
                        {
                            type: 'static', value: () => {
                                return this.treeId == '0' ? null : this.treeId
                            }, code: 'areaId'
                        },
                        {type: 'static', value: '3', code: 'lvType', exp: '='},
                        {label: 'SLA指标名称', code: 'sname', type: 'input',exp:'upperLike',value:''}
                    ],
                columns: [],
                Change:"",
                operations:
                    [
                        {name: '编辑', callback: this.editItem},
                        {name: '删除', callback: this.delItem}
                    ],
                buttons:
                    [
                        {name: '新增指标', icon: 'el-icon-plus', type: 'primary', callback: this.addTargetCallback},
                        {name: '新增级别', icon: 'el-icon-plus', type: 'primary', callback: this.addCallback},
                    ],
                addButtons:
                    [
                        {name: '保存', click: this.saveLvData},
                        {name: '取消', iscannel: true},
                    ],
                dialogEditVisible: false,
                mainData:
                    {
                        slaTarget: '',
                        editTables: []
                    }
                ,
                SLAList: [],                //SLA指标数据集合
                isAddFlag: false,
                lv:1,                       //等级初始为1级
            }
        },
        methods: {
            /**
             * 拿取当前数据的等级
             * @param data
             * @returns {*}
             */
            beforeBindData(data) {
                let obj = data[0]?data[0]:{};
                this.lv = this.getLv(obj);
                if(data.length==0 || this.lv >= 7){
                    this.$set(this.buttons[1],'disabled',true);
                }else{
                    this.$set(this.buttons[1],'disabled',false);
                }
                this.initTemplate();
                return data;
            },
            /**
             * 初始化模板
             */
            initTemplate(){
                let arr = [
                    {label: '等级2', code: 'lv2', width: 100},
                    {label: '等级3', code: 'lv3', width: 100},
                    {label: '等级4', code: 'lv4', width: 100},
                    {label: '等级5', code: 'lv5', width: 100},
                    {label: '等级6', code: 'lv6', width: 100},
                    {label: '等级7', code: 'lv7', width: 100},
                ];
                this.columns = [
                    {label: '主键id', code: 'loid', hidden: true},
                    {code:'criteriaId',hidden:true},
                    {label: '区域', code: 'areaName', width: 125},
                    {label: 'SLA指标', code: 'sname', width: 125},
                    {label: '等级1', code: 'lv1', width: 100},
                ];
                for(let i=0;i<this.lv-1;i++){
                    this.columns.push(arr[i]);
                }
            },
            isSuccess(){
                this.refresh();
            },
            getAreaId(val) {
                let _this = this;
                this.SLAList.forEach(item => {
                    if (item.oid == val) {
                        _this.areaId = item.areaId;
                    }
                })
            },
            handleNodeClick(data, node) {
                if (node) {
                    this.treeId = data;
                    this.treeName = node.data.shortName;
                    this.refresh();
                }
            },
            addCallback() {
                let url = "/pro/ProScSlaLevel/all?current=1&size=10000&lvType=3";
                this.$refs.proScLevel.openDialog(url,3);
            },
            addTargetCallback() {
                this.initEditTables();
                this.isAddFlag = true;
                this.dialogEditVisible = true;
                this.Change = "新增指标信息"
            },
            saveData() {
                this.$refs.editForm.validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.$axios.post("/pro/ProScSlaCriteria/saveOrUpdate", this.editData)///pro/ProScSlaLevel/allSave
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
                    this.$axios.delete("/pro/ProScSlaLevel/del", {"params": {"id": row.oid}})
                        .then(result => {
                            this.$message.success("操作成功");
                            this.refresh();
                        }).catch(error => {
                        this.$message.error(error.msg);
                    });
                });
            },
            editItem(row) {
                this.$axios.get("pro/ProScSlaLevel/get", {
                    params: {
                        id: row.oid,
                        areaId: row.areaId,
                        lvType: 3
                    }
                }).then(success => {
                    this.mainData.editTables = success.data;
                }).catch(error => {
                    this.$message.error(error.msg);
                });
                this.isAddFlag = true;
                this.areaId = row.areaId;
                this.slaTarget = row.oid;
                this.dialogEditVisible = true;
                this.Change = "编辑指标信息"
            },
            closeSLAItem() {
                this.isAddFlag = false
                this.dialogEditVisible = false;
            },

            async saveLvData() {
                try {
                    let isTrue = await this.$refs.editTable.validateAll();
                    if(!isTrue){
                        return false;
                    }
                } catch (e) {
                    return false;
                }
                if(!this.slaTarget){
                    this.$message.warning("请选择SLA指标");
                    return false;
                }
                this.mainData.editTables.forEach(item => {
                    item.criteriaId = this.slaTarget;
                    item.areaId = this.areaId;
                });
                await this.$axios.post('/pro/ProScSlaLevel/allSave', {"list": JSON.stringify(this.mainData.editTables)});
                this.$message.success("保存成功");
                this.refresh();
                return true;
            },
            initSLASelect() {
                //获取服务项信息
                this.$axios.get('/pro/ProScSlaLevel/allCriteria')
                    .then(result => {
                        this.SLAList = result.data
                    }).catch(error => {
                    this.$message.error(error.msg);
                });
            },
            /**
             * 初始化参考指标
             */
            initEditTables() {
                this.slaTarget = '';
                this.mainData.editTables = [];
                for (let i = 0; i < this.lv; i++) {
                    this.mainData.editTables.push({lv: i + 1, op: '', target: '', unit: '', lvType: 3});
                }
            },
            /**
             * 获取当前数据的等级
             */
            getLv(item) {
                if (item.lv7) {
                    return 7
                } else if (item.lv6) {
                    return 6;
                } else if (item.lv5) {
                    return 5;
                }else if (item.lv4) {
                    return 4;
                }else if (item.lv3) {
                    return 3;
                }else if (item.lv2) {
                    return 2;
                }else {
                    return 1;
                }
            },
            /**删除下拉的值*/
            deleteDetailItem(index) {
                this.mainData.editTables.splice(index, 1);
            },
            /**
             * 刷新
             */
            refresh() {
                this.$refs.mainQueryGrid.refresh();
            }
        },
        mounted() {
            this.initSLASelect();
        },
        watch: {
            slaTarget(newValue, oldValue) {
                this.getAreaId(newValue);
            }
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

    .dev-container {
        width: 94%;
        background-color: #FFFFFF;
        overflow-y: auto;
        height: 400px;
        max-height: 400px;
    }

    .required-star {
        color: red;
    }

    .tableBtn {
        margin-bottom: 8px;
        margin-left: 8px;
    }

    .form-content {
        width: 100%;
    }
</style>
