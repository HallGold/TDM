<template>
    <div style="width: 100%;">
        <div class="top">
            <el-button type="primary" class="buttons" icon="el-icon-plus" @click="addNew()">新增</el-button>
            <el-button type="primary" class="buttons" icon="el-icon-close" @click="delMeeage()">删除</el-button>
            <el-button type="primary" class="buttons" icon="el-icon-plus" @click="selectOld()">历史记录</el-button>
        </div>
        <ice-editable-table
                :rules="accessRules"
                @selection-change="selectMessage"
                @row-click="selectThis"
                :height="400"
                :fit="true"
                :width="null"
                :data="BizCrucialPointEnthetics"
                ref="accessForm">
            <el-table-column type="selection"></el-table-column>
            <ice-editable-table-column
                    :readonly="true"
                    prop="name"
                    :width="150"
                    input-type="button"
                    @add-Message="add"
                    label="姓名">
            </ice-editable-table-column>
            <ice-editable-table-column
                    :disabled="true"
                    prop="unit"
                    :width="150"
                    label="单位">
            </ice-editable-table-column>
            <ice-editable-table-column
                    prop="denseLv"
                    input-type="select"
                    map-type-code="OR_SECRET_LEVEL"
                    :width="90"
                    label="涉密等级">
            </ice-editable-table-column>
            <ice-editable-table-column
                    prop="papersName"
                    map-type-code="papersName"
                    :width="100"
                    input-type="select"
                    label="证件类型">
            </ice-editable-table-column>
            <ice-editable-table-column
                    prop="papersNum"
                    input-type="input"
                    maxlength="21"
                    :width="180"
                    label="证件号码">
            </ice-editable-table-column>
            <ice-editable-table-column
                    prop="targetId"
                    :width="null"
                    label="证件信息">
                <template slot-scope="scope">
                    <ice-single-upload styleType="input"
                                       v-model="scope.row.targetId"
                                       ref="uploadMsg"
                    ></ice-single-upload>
                </template>
            </ice-editable-table-column>
        </ice-editable-table>
        <!--进入人员信息新增人物-->
        <ice-persion-selector
                choose-item="single"
                ref="persionPop"
                mode="hidden"
                :all-dept="true"
                @select-confirm="selectUserConfirm"
        ></ice-persion-selector>
        <!--历史记录-->
        <ice-pop-selector
                data-url="biz/enthetic/searchByTypePage"
                :columns=historyData
                mode="hidden"
                :query=historyQuery
                @select-confirm="history"
                choose-item="single"
                ref="historyList"
        ></ice-pop-selector>
    </div>
</template>

<script>
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../../components/common/base/IceEditableTableColumn";
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload";
    import IceSingleUpload from "../../../../components/common/base/IceSingleUpload";
    import IcePopSelector from "../../../../components/common/base/IcePopSelector";

    export default {
        name: "accessPop",
        components: {
            IcePopSelector,
            IceSingleUpload, IceMultipleUpload, IceEditableTableColumn, IceEditableTable, IcePersionSelector
        },
        props: {
            BizCrucialPointEnthetics: Array
        },
        data() {
            return {
                distinguish: false,
                optfor: [],
                targetId: "",
                isTrueValue: "",
                historyData: [
                    {label: '申请编号', code: 'applyNum', width: 140},
                    {label: '进入人员名称', code: 'name', width: 140},
                    {label: '进入人员code', code: 'code', hidden: true},
                    {label: '单位', code: 'unit', width: 120},
                    {label: '涉密等级', code: 'denseLv', width: 120, mapTypeCode: "OR_SECRET_LEVEL"},
                    {label: '证件类型', code: 'papersName', width: 120, mapTypeCode: "papersName"},
                    {label: '证件号码', code: 'papersNum', width: 120},
                ],
                historyQuery: [
                    {type: 'input', label: '申请编号', code: 'applyNum', value: '',},
                    {type: 'input', label: '进入人员名称', code: 'name', value: '',},
                    {type: 'input', label: '单位', code: 'unit', value: '',},
                    {type: 'input', label: '涉密等级', code: 'denseLv', value: '',},
                ],
                accessRules: {
                    'name': [{required: true, message: '请输入姓名', trigger: 'change'}],
                    'denseLv': [{required: true, message: '请输入涉密等级', trigger: 'blur'}],
                    'papersName': [{required: true, message: '请选择身份证类型', trigger: 'blur'}],
                    'papersNum': [{required: true, message: '请输入证件号码', trigger: 'blur'}],
                },
            }
        },
        methods: {
            isCan() {
                this.$refs.accessForm.validateAll((valid) => {
                    if (valid) {
                        this.isTrueValue = true;
                        return true
                    } else {
                        this.isTrueValue = false;
                        return false
                    }
                });
            },
            isCanR() {
                this.isCan();
                return this.isTrueValue;
            },
            history(data) {
                let newObj = {
                    name: data[0].name,
                    unit: data[0].unit,
                    code: data[0].code,
                    denseLv: data[0].denseLv,
                    papersName: data[0].papersName,
                    papersNum: data[0].papersNum,
                    targetId: data[0].targetId
                };
                this.BizCrucialPointEnthetics.push(newObj);
            },
            selectThis(row) {
                this.popData = row;
            },
            selectUserConfirm(data) {
                this.distinguish = true;
                this.popData.name = data[0].name;
                this.popData.code = data[0].code;
                this.popData.unit = data[0].deptShortName;
                this.popData.dataOrgCode = data[0].deptCode;
                this.popData.denseLv = data[0].securityLevel;
                this.$refs['accessForm'].clearValidate("name");
            },
            add() {
                this.$refs.persionPop.openDialog();
            },
            selectMessage(data) {
                this.optFor = data;
            },
            /**新增*/
            addNew() {
                let newObj = {
                    name: "",
                    unit: "",
                    denseLv: "",
                    papersName: "",
                    papersNum: "",
                    targetId: ""
                };
                this.BizCrucialPointEnthetics.push(newObj);
            },
            /**删除*/
            delMeeage() {
                let m = 0;
                if (this.optFor != undefined) {
                    for (let i = 0; i < this.BizCrucialPointEnthetics.length; i++) {
                        for (let j = 0; j < this.optFor.length; j++) {
                            m++;
                            if (this.BizCrucialPointEnthetics[i].papersNum == this.optFor[j].papersNum) {
                                this.BizCrucialPointEnthetics.splice(i, 1);
                                if (this.optFor.length == m) {
                                    this.$message.success("删除成功");
                                }
                            }
                        }
                    }
                } else {
                    this.$confirm("请选择要删除的信息!", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }
            },
            /**添加历史记录*/
            selectOld() {
                this.$refs.historyList.openDialog();
            }
        }
    }
</script>

<style scoped>
    .buttons {
        margin-bottom: 9px;
    }

    .top {
        padding-left: 15px;
    }

    .ice-upload {
        width: 100%;
        line-height: 32px;
    }
</style>