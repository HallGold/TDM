<template>
    <div>
        <el-dialog v-dialog-drag
                   :title="title"
                   custom-class="ice-dialog"
                   center
                   :visible.sync="dialogVisible"
                   width="65%"
                   append-to-body
                   v-if="dialogVisible"
                   :before-close="closeDialog"
                   :close-on-click-modal="false">
            <div style="overflow-x: hidden;max-height: 500px;background-color: #ffffff">
                <el-form :model="mainDataForm" :rules="formRules" label-width="100px" ref="form">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="表名" prop="tableCode">
                                <el-input v-model="mainDataForm.tableCode" :disabled="isEdit" maxlength="32"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="表中文名" prop="tableName">
                                <el-input v-model="mainDataForm.tableName" maxlength="64"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="表类型" prop="tableType">
                                <ice-select v-model="mainDataForm.tableType"
                                            map-type-code="TABLE_TYPE"
                                            @change="$nextTick(()=>{$refs.form.validateField('tableType',error=>{})})">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="表分类" prop="tableClazz">
                                <ice-select v-model="mainDataForm.tableClazz"
                                            map-type-code="TABLE_CLASS"
                                            @change="$nextTick(()=>{$refs.form.validateField('tableClazz',error=>{})})">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="是否启用数据隔离" label-width="130px" prop="dataAuthEnabled">
                                <el-checkbox true-label="Y" false-label="N"
                                             v-model="mainDataForm.dataAuthEnabled"></el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="描述" prop="tableDesc">
                                <el-input type="textarea" v-model="mainDataForm.tableDesc" rows="3"
                                          maxlength="500"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-tabs v-if="mainDataForm.dataAuthEnabled=='Y'">
                    <el-tab-pane label="默认隔离策略配置">
                        <!--<ice-query-grid :gridData="defaultData"
                                        ref="defaultPrivGrid"
                                        chooseItem="multiple"
                                        :pagination="false"
                                        @selection-change="selectDefault"
                                        :columns="columnsQ"
                                        :buttons="buttonsQ"></ice-query-grid>-->
                        <div style="margin-bottom: 6px;margin-left: 9px;margin-top: 6px;">
                            <el-button @click="addDefaultItem" type="primary">新增默认策略</el-button>
                            <el-button @click="deleteDefaultItem" type="primary">删除</el-button>
                        </div>
                        <el-table :data="defaultData"
                                  ref="tbl"
                                  style="width: 100%"
                                  :height="350"
                                  @select-all="selectDefaultAll"
                                  @select="selectDefault">
                            <el-table-column type="selection">
                            </el-table-column>
                            <el-table-column prop="privtypeName"
                                             label="策略分组">
                            </el-table-column>
                            <el-table-column prop="privilegeName"
                                             label="隔离策略">
                            </el-table-column>
                            <el-table-column prop="isDefault"
                                             label="默认策略">
                            </el-table-column>
                            <el-table-column prop="paramCfg"
                                             label="参数值">
                                <template slot-scope="scope">
                                    <el-button type="text" style="margin-right: 5px"
                                               @click="paramsConfig(scope.$index,scope.row)"
                                               v-if="scope.row.paramCfg.inputType!='10'">配置
                                    </el-button>
                                    <el-popover trigger="hover" placement="right">
                                        <el-input type="textarea" rows="3" v-model="scope.row.paramValue"
                                                  readonly></el-input>
                                        <div slot="reference">
                                            <el-button type="text" size="medium">查看</el-button>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column prop="privilegeDesc"
                                             label="策略描述">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="可用隔离策略配置">
                        <ice-query-grid :gridData="usableData"
                                        chooseItem="multiple"
                                        ref="usablePrivGrid"
                                        :pagination="false"
                                        :columns="columns"
                                        @selection-change="selectUsable"
                                        :buttons="buttons"></ice-query-grid>
                    </el-tab-pane>

                </el-tabs>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="info" @click="closeDialog">取消</el-button>
        </span>
        </el-dialog>
        <usable-strategy-edit ref="usableStrategyEdit" @get-data="useableGetData"></usable-strategy-edit>
        <default-strategy-edit ref="defaultStrategyEdit" @get-data="defaultGetData"></default-strategy-edit>
        <params-select ref="paramsSelect" @chooseItem="chooseValue"></params-select>
    </div>

</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import UsableStrategyEdit from "./usableStrategyEdit";
    import DefaultStrategyEdit from "./defaultStrategyEdit";
    import IceSelect from "../../../components/common/base/IceSelect";
    import ParamsSelect from "../comm/paramsSelect";

    export default {
        name: "dataTableEdit",
        components: {ParamsSelect, IceSelect, DefaultStrategyEdit, UsableStrategyEdit, IceQueryGrid},
        props: {
            title: String,
            isEdit: {
                type: Boolean,
                default: false
            },
            isSuccess: Function
        },
        data() {
            return {
                columns: [
                    {label: '策略分组', code: 'privtypeName', width: 200},
                    {label: '策略名称', code: 'privilegeName', width: 200},
                    {label: '策略描述', code: 'privilegeDesc', width: 200},

                ],     //组件table列展示--可用
                buttons: [],     //组件按钮--可用
                columnsQ: [],     //组件table列展示--默认
                buttonsQ: [],     //组件按钮--默认
                defaultDataIndex: 0,                //策略配置下标
                defaultDataType: '',                //策略配置的参数类型
                defaultDataValue: '',              //策略配置的参数的值范围
                defaultDataIsTrue: false,          //策略配置的参数是否可多选
                usableData: [],                 //可用策略数据
                usableList: [],
                defaultList: [],
                defaultData: [],                //默认策略数据
                dialogVisible: false,
                mainDataForm: {//表单对象
                    tableCode: '',
                    tableName: '',
                    tableType: '',
                    tableClazz: '',
                    dataAuthEnabled: '',
                    tableDesc: ''
                },
                formRules: {//表单字段规则
                    tableType: [{required: true, message: '请选择表类型', trigger: 'change'}],
                    tableClazz: [{required: true, message: '请选择表分类', trigger: 'change'}],
                    tableCode: [
                        {required: true, whitespace: true, message: '请输入表名', trigger: 'blur'},
                        {
                            pattern: /^[A-Z][A-Z,0-9,_,\-]+$/,
                            message: '只能输入大写字母、数字、减号、下划线，且以大写字母开头',
                            trigger: 'blur'
                        },],
                    tableName: [{required: true, whitespace: true, message: '请输入表中文名', trigger: 'blur'}],
                },
                tblgroupId: '',
            }
        },
        methods: {
            /**
             * 参数配置
             */
            paramsConfig(index, data) {
                let obj = {...data.paramCfg};
                this.$refs.paramsSelect.openDialog(obj);
                this.defaultDataIndex = index;
                this.defaultDataType = data.paramCfg.inputType;
                this.defaultDataValue = data.paramCfg.valueType;
                this.defaultDataIsTrue = data.paramCfg.isMulti == 'Y' ? true : false
            },
            chooseValue(data) {
                let tblDataArr = [];
                Object.assign(tblDataArr, this.defaultData);
                let str = '';
                if (this.defaultDataType == '20' && this.defaultDataIsTrue) {//判定参数是否为弹出框，并且为多选
                    let arr = [];
                    if (this.defaultDataValue == '10') {//判定参数是否为选择部门
                        data.forEach(item => {
                            arr.push(item.deptLevCode);
                        });
                        str = arr.join(',');
                    } else if (this.defaultDataValue == '20') {//判定参数是否为选择单位
                        data.forEach(item => {
                            arr.push(item.deptLevCode);//接口未定义，暂时取部门的值
                        });
                        str = arr.join(',');
                    } else {
                        str = data;
                    }
                } else if (this.defaultDataType == '20' && !this.defaultDataIsTrue) {//判定参数是否为弹出框，并且为单选
                    if (this.defaultDataValue == '10') {//判定参数是否为选择部门
                        str = data[0].deptLevCode;
                    } else if (this.defaultDataValue == '20') {//判定参数是否为选择单位
                        str = data[0].deptLevCode;//接口未定义，暂时取部门的值
                    } else {
                        str = data;
                    }
                } else {
                    str = data;
                }
                //this.tableData.paramValue = str;
                tblDataArr[this.defaultDataIndex].paramValue = str;
                this.defaultData = tblDataArr;
                this.setSelectedRows();

            },
            setSelectedRows() {
                this.$nextTick(() => {
                    this.checkData = [];
                    if (this.tableData) {
                        this.tableData.forEach(row => {
                            if (row.checked) {
                                this.checkData.push(row)
                            }
                            this.$refs.privGrid.toggleRowSelection(row, row.checked)
                        })
                    }
                })
            },
            /**
             * 初始化组件部分
             */
            initComponent() {
                this.buttons = [
                    {name: '新增可用策略', callback: this.addUsableItem},
                    {name: '删除', callback: this.deleteUsableItem},
                ];
            },
            selectUsable(rows) {
                this.usableList = rows;
            },
            selectDefaultAll(rows) {
                this.defaultList = rows;
                rows.forEach(row => {
                    row.checked = true;
                })
            },
            selectDefault(rows) {
                this.defaultList = rows;
                rows.forEach(row => {
                    row.checked = true;
                })
            },
            deletes(list, deleteList) {
                for (let i = 0; i < deleteList.length; i++) {
                    list.splice(list.indexOf(deleteList[i]), 1);
                }
                return list;
            },
            /**
             * 新增可用策略
             */
            addUsableItem() {
                this.$refs.usableStrategyEdit.openDialog(this.usableData);
            },
            /**
             * 删除--可用
             */
            deleteUsableItem() {
                this.usableData = this.deletes(this.usableData, this.usableList);
            },
            /**
             * 新增默认策略
             */
            addDefaultItem() {
                this.$refs.defaultStrategyEdit.openDialog(this.defaultData);
            },
            /**
             * 删除--默认
             */
            deleteDefaultItem() {
                this.defaultData = this.deletes(this.defaultData, this.defaultList);

            },
            /**
             * 保存
             */
            save() {
                this.$refs.form.validate((valid) => {//frameDefaultPrivilegeList---frameDbTblprivilegeRelList
                    if (valid) {
                        let obj = {};
                        obj = this.mainDataForm;
                        obj.frameDbTblprivilegeRelList = this.usableData;
                        obj.frameDefaultPrivilegeList = this.defaultData;
                        obj.tblgroupId = this.tblgroupId;
                        this.$axios.post("/permission/res/table/outer/save_table_info", obj).then(success => {
                            this.$message.success("保存成功");
                            this.closeDialog();
                            this.isSuccess();
                        }).catch(error => {
                            this.$message.error(error.msg ? error.msg : '操作出错了');
                        });
                    }
                });
            },
            /**
             * 取消
             */
            closeDialog() {
                this.resetForm();
                this.usableData = [];
                this.defaultData = [];
                this.dialogVisible = false;
            },
            resetForm() {
                this.$refs.form.resetFields();
            },
            /**
             * 打开弹窗
             */
            openDialog(tblgroupId) {
                this.dialogVisible = true;
                this.$nextTick(() => {
                    if (this.isEdit) {
                        this.getData(tblgroupId);
                    } else {
                        this.mainDataForm.oid = '';
                        this.tblgroupId = tblgroupId
                    }
                    this.resetForm();
                })
            },
            getData(tableId) {
                this.$axios.get("/permission/res/table/outer/get_by_id", {params: {"tableId": tableId}}).then(success => {
                    this.usableData = success.data.frameDbTblprivilegeRelList;
                    this.defaultData = success.data.frameDefaultPrivilegeList;
                    this.mainDataForm = success.data;
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            },
            defaultGetData(data) {
                this.defaultData.push(...data);
            },
            useableGetData(data) {
                this.usableData.push(...data);
            }
        },
        mounted() {
            this.initComponent();
        }
    }
</script>

<style scoped>

</style>
