<template>
    <el-dialog
            custom-class="ice-dialog"
            title="常量管理"
            :visible.sync="dialogVisible"
            :append-to-body="true"
            :close-on-click-modal="false"
            width="80%"
            center>
        <div class="ice-grid-button-bar">
            <el-button type="primary" icon="el-icon-plus" @click="addItem">新增</el-button>
        </div>
        <div class="grid-bar" style="max-height: 500px;overflow: auto;">
            <ice-editable-table :data="constantGridData" :rules="constantRules" ref="constantTable">
                <el-table-column :width="50"
                                 label="序号">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <!-- <ice-editable-table-column prop="oid"
                                            :width="0"
                                            label="id"
                                            input-type="input">

                 </ice-editable-table-column>-->
                <ice-editable-table-column prop="name"
                                           :width="240"
                                           label="名称"
                                           input-type="input">

                </ice-editable-table-column>
                <ice-editable-table-column prop="code"
                                           label="编码"
                                           :width="140"
                                           input-type="input">

                </ice-editable-table-column>
                <ice-editable-table-column prop="value"
                                           :width="500"
                                           label="值"
                                           input-type="input">

                </ice-editable-table-column>
                <ice-editable-table-column prop="remark"
                                           label="备注"
                                           :width="200"
                                           input-type="input">

                </ice-editable-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   size="small" @click="changeStatus(scope.row)">
                            {{getEnumName(ENABLED_ENUM,!scope.row.isEnabled?ENABLED_ENUM.ENABLED:ENABLED_ENUM.DISABLED)}}
                        </el-button>

                        <el-button type="text"
                                   size="small" @click="removeItem(scope)">删除
                        </el-button>
                        <el-button type="text" v-if="scope.$index!=0"
                                   size="small" @click="moveUp(scope.$index)">上移
                        </el-button>
                        <el-button type="text" v-if="scope.$index!=constantGridData.length-1"
                                   size="small" @click="moveDown(scope.$index)">下移
                        </el-button>
                    </template>
                </el-table-column>
            </ice-editable-table>
        </div>
        <div class="ice-button-bar ">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="info" @click="close">返回</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import OrgComm from "@/pages/system/comm/OrgComm";
    import IceEditableTable from '@/components/common/base/IceEditableTable.vue';
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";

    export default {
        name: "ConstantManage",
        mixins: [OrgComm],
        components: {
            IceEditableTable,
            IceEditableTableColumn
        },
        watch: {},
        data() {
            return {
                appCode: "",
                dialogVisible: false,
                constantGridData: [],
                constantRules: {
                    code: {required: true, message: '请输入值编码', repeatable: false},
                    name: {required: true, message: '请输入值名称'},
                },
                enabledNames: []
            }
        },
        methods: {
            open(_appCode) {
                this.appCode = _appCode;
                let _this = this;
                this.loadData(_appCode).then((res) => {
                    _this.constantGridData = res.data
                    //Object.assign(_this.constantGridData, res.data);
                    if (_this.constantGridData.length == 0) {
                        _this.addItem();
                    }
                    _this.dialogVisible = true;
                });
            },
            close() {
                /*this.$emit("beforeClose", null);*/
                this.dialogVisible = false;
            },
            initControls() {
                this.assembleEnabledLabel();
            },
            assembleEnabledLabel() {
                if (this.enabledNames.length == 0) {
                    for (let i in this.ENABLED_ENUM.properties) {
                        this.enabledNames.push(this.ENABLED_ENUM.properties[i].name);
                    }
                }
                return this.enabledNames;
            },
            loadData(appCode) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    this.axios(this.ACTIONS_ENUM.CONSTANT.LOAD_LIST, {appCode: appCode}, [res => {
                        resolve(res);
                    }, res => {
                        reject(res);
                    }, res => {
                        reject(res);
                    }]);
                });
            },
            addItem() {
                this.constantGridData.push({
                    appCode: this.appCode,
                    code: '',
                    name: '',
                    isEnabled: this.ENABLED_ENUM.ENABLED,
                    remark: '',
                },)
            },
            changeStatus(_row) {
                let newEnabled = _row.isEnabled == this.ENABLED_ENUM.ENABLED ? this.ENABLED_ENUM.DISABLED : this.ENABLED_ENUM.ENABLED;
                if (!!_row.oid) {
                    this.axios(this.ACTIONS_ENUM.CONSTANT.CHANGE_STATUS, {
                        ids: _row.oid,
                        isEnabled: newEnabled
                    }, [res => {
                        _row.isEnabled = newEnabled;
                    }, res => {
                        this.$message.error("状态切换失败! errorCode = " + res.code)
                    }, res => {
                        this.$message.error("状态切换失败! errorCode = " + res.code)
                    }]);
                } else {
                    _row.isEnabled = newEnabled;
                }
            },
            removeItem(scope) {
                let record = scope.row;
                let index = scope.$index;
                if (record.oid) {
                    this.axios(this.ACTIONS_ENUM.CONSTANT.REMOVE_SINGLE, {oid: record.oid}, [res => {
                        this.constantGridData.splice(index, 1);
                    }, res => {
                        this.$message.error("删除失败!");
                    }, res => {
                        this.$message.error("删除失败!");
                    }]);
                }

            },
            save() {
                let _this = this;
                this.constantGridData.forEach((obj, index) => {
                    obj.sequencing = index;
                });
                this.$refs.constantTable.validateAll((valid) => {
                    _this.axios(this.ACTIONS_ENUM.CONSTANT.SAVE_LIST, {appDataConstantVoList: this.constantGridData}, [res => {
                        _this.close();
                    }, res => {
                        this.$message.error("保存失败");
                    }, res => {
                        this.$message.error("保存失败");
                    }]);
                });
            },
            swapArray(arr, index1, index2) {
                arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                return arr;
            },
            moveUp(index) {
                if (index != 0) {
                    this.constantGridData = this.swapArray(this.constantGridData, index, index - 1);
                }
            },
            moveDown(index) {
                if (index + 1 != this.constantGridData.length) {
                    this.constantGridData = this.swapArray(this.constantGridData, index, index + 1);
                }
            },
        },
        mounted() {
            this.initControls();
        }
    }
</script>

<style scoped>

</style>