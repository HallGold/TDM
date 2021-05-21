<template>
    <div>
        <el-dialog v-dialogDrag
                   title="默认隔离策略配置"
                   custom-class="ice-dialog"
                   center
                   :visible.sync="dialogVisible"
                   width="800px"
                   append-to-body
                   :before-close="closeDialog"
                   :close-on-click-modal="false">
            <el-table :data="tableData"
                      :height="500"
                      ref="privGrid"
                      @select="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55"></el-table-column>
                <el-table-column prop="privtypeName"
                                 label="策略分组"></el-table-column>
                <el-table-column prop="privilegeName"
                                 label="隔离策略"></el-table-column>
                <el-table-column prop="paramCfg"
                                 label="参数值">
                    <template slot-scope="scope">
                        <el-button type="text" style="margin-right: 5px" @click="paramsConfig(scope.$index,scope.row)"
                                   v-if="scope.row.paramCfg.inputType!='10'">配置
                        </el-button>
                        <el-popover trigger="hover" placement="right">
                            <el-input type="textarea" rows="3" v-model="scope.row.paramValue" readonly></el-input>
                            <div slot="reference">
                                <el-button type="text" size="medium">查看</el-button>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="privilegeDesc"
                                 label="策略描述"></el-table-column>
            </el-table>
            <div class="ice-center-button-bar">
                <el-button type="primary" @click="save" unauth>确定</el-button>
                <el-button type="info" @click="closeDialog" unauth>取消</el-button>
            </div>
        </el-dialog>
        <params-select ref="paramsSelect" @chooseItem="chooseValue" unauth></params-select>
    </div>

</template>

<script>
    import ParamsSelect from "../comm/paramsSelect";

    export default {
        name: "serviceConfigurationEdit",
        components: {ParamsSelect},
        props: {
            isSuccess: Function
        },
        data() {
            return {
                dialogVisible: false,//弹窗的开关属性
                tableData: [],       //table列表数据
                tableObj: {},
                checkData: [],
                tableDataIndex: 0,                //策略配置下标
                tableDataType: '',                //策略配置的参数类型
                tableDataValue: '',              //策略配置的参数的值范围
                tableDataIsTrue: false,          //策略配置的参数是否可多选
            }
        },
        methods: {
            /**
             * 参数配置
             */
            paramsConfig(index, data) {
                let obj = {...data.paramCfg};
                obj.paramValue = data.paramValue;
                this.$refs.paramsSelect.openDialog(obj);
                this.tableDataIndex = index;
                this.tableDataType = data.paramCfg.inputType;
                this.tableDataValue = data.paramCfg.valueType;
                this.tableDataIsTrue = data.paramCfg.isMulti == 'Y' ? true : false
            },
            chooseValue(data) {
                let tblDataArr = [];
                Object.assign(tblDataArr, this.tableData);
                let str = '';
                if (this.tableDataType == '20' && this.tableDataIsTrue) {//判定参数是否为弹出框，并且为多选
                    let arr = [];
                    if (this.tableDataValue == '10') {//判定参数是否为选择部门
                        data.forEach(item => {
                            arr.push(item.deptLevCode);
                        });
                        str = arr.join(',');
                    } else if (this.tableDataValue == '20') {//判定参数是否为选择单位
                        data.forEach(item => {
                            arr.push(item.deptLevCode);//接口未定义，暂时取部门的值
                        });
                        str = arr.join(',');
                    } else {
                        str = data;
                    }
                } else if (this.tableDataType == '20' && !this.tableDataIsTrue) {//判定参数是否为弹出框，并且为单选
                    if (this.tableDataValue == '10') {//判定参数是否为选择部门
                        str = data[0].deptLevCode;
                    } else if (this.tableDataValue == '20') {//判定参数是否为选择单位
                        str = data[0].deptLevCode;//接口未定义，暂时取部门的值
                    } else {
                        str = data;
                    }
                } else {
                    str = data;
                }
                this.tableData.paramValue = str;
                tblDataArr[this.tableDataIndex].paramValue = str;
                this.tableData = tblDataArr;
                this.setSelectedRows();
            },
            /**
             * 弹窗关闭
             */
            closeDialog() {
                this.dialogVisible = false;
            },
            /**
             * 打开弹窗
             */
            openDialog(row) {
                this.dialogVisible = true;
                this.tableData = row.servDefaultPrivList;
                this.tableObj = row;
                this.$nextTick(() => {
                    this.tableData.forEach(val => {
                        this.$refs.privGrid.toggleRowSelection(val, val.checked)
                    })
                })
            },
            handleSelectionChange(rows) {
                this.checkData = rows;
                rows.forEach(row => {
                    row.checked = true;
                })
            },
            setSelectedRows() {
                this.$nextTick(()=>{
                    this.checkData = [];
                    this.tableData.forEach(row => {
                        if (row.checked) {
                            this.checkData.push(row)
                        }
                        this.$refs.privGrid.toggleRowSelection(row, row.checked)
                    })
                })
            },
            changeStatus(arr, list) {
                for (let i = 0; i < list.length; i++) {
                    if (arr.indexOf(list[i]) != -1) {
                        arr[arr.indexOf(list[i])].checked = true;
                    }
                }
            },
            /**
             * 保存
             */
            save() {
                //参数值的是否可选--根据当条是否勾选
                let obj = {};
                Object.assign(obj, this.tableObj);
                this.tableData.forEach(item => {
                    item.checked = false;
                });
                this.changeStatus(this.tableData, this.checkData);
                obj.servDefaultPrivList = this.tableData;
                this.$axios.post("/permission/res/service/outer/save_tblrel_defpriv", obj).then(success => {
                    this.$message.success("保存成功");
                    this.closeDialog();
                    this.isSuccess();
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                })
            }
        }
    }
</script>

<style scoped>

</style>
