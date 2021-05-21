<template>
    <ice-dialog v-dialogDrag
                remounted
                center
                :title="title"
                width="60%"
                custom-class="dev-edit-dialog"
                :modal-append-to-body="false"
                :visible.sync="dialogVisible"
                :close-on-press-escape="false"
                :close-on-click-modal="false">
        <el-form :model="formData" ref="form" label-width="120px" :rules="rules" :disabled="!isEdit">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="受控部位名称" prop="name">
                        <el-input v-model="formData.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="受控类型" prop="type">
                        <el-cascader :options="POSITION_ENUMS.TYPE.properties"
                                     v-model="formData.type" expand-trigger="hover"></el-cascader>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="责任部门" prop="deptName">
                        <ice-dept-selector choose-item="single"
                                           :mode="MODE"
                                           v-model="formData.deptName"
                                           @select-confirm="deptSelect"></ice-dept-selector>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="责任单位">
                        <el-input v-model="formData.unitName" :readonly="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="是否启用" prop="isStart">
                        <el-select placeholder="请选择" clearable v-model="formData.isStart">
                            <el-option
                                    v-for="item in POSITION_ENUMS.YES_NO.properties"
                                    :label="item.name"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否要害部位" prop="isCrucial">
                        <el-select placeholder="请选择" clearable v-model="formData.isCrucial">
                            <el-option
                                    v-for="item in POSITION_ENUMS.YES_NO.properties"
                                    :label="item.name"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col>
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="formData.remark" :rows="3" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="ice-button-bar">
            <el-button type="primary" @click="saveClickHandler" v-if="isEdit">保存</el-button>
            <el-button type="info" @click="closeClickHandler">关闭</el-button>
        </div>
    </ice-dialog>
</template>

<script>
    import IceDeptSelector from "../../../../components/common/biz/IceDeptSelector";
    import bizComm from "@/pages/biz/js/comm";
    import positionComm from "./positionComm";
    import IceDialog from "../../../../components/common/base/IceDialog";

    export default {
        name: "positionEdit",
        components: {IceDialog, IceDeptSelector},
        mixins: [bizComm, positionComm],
        props: {
            title: {
                type: String,
                default: "要害部位编辑页面"
            },
            isEdit: {
                type: Boolean,
                default: true
            },
            oid: {
                type: String,
                default: ""
            },
            onCloseHandler: {
                type: Function,
                default: () => {
                    return Promise.resolve();
                }
            }
        },
        data() {
            return {
                formData: {
                    name: "",//要害部位名称
                    type: "",//要害部位类型
                    dept: "",//责任部门code,
                    deptName: "",//责任部门
                    unit: "",//责任单位code
                    unitName: "",//责任单位
                    isStart: "1",//是否启用
                    isCrucial: "1",//是否要害部位
                    remark: "",//备注
                },
                rules: {
                    name: {required: true, message: '请输入受控部位名称', trigger: 'change'},
                    type: {required: true, message: '请选择受控部位类型', trigger: 'change'},
                    deptName: {required: true, message: '请选择责任部门', trigger: 'change'},
                    isStart: {required: true, message: '请选择是否启用', trigger: 'change'},
                    isCrucial: {required: true, message: '请选择是否要害部位', trigger: 'change'}
                },
                //部门选择以及人员选择mode
                MODE: "onlySelect",
                //页面显示状态
                dialogVisible: false,
            }
        },
        methods: {
            /**
             * 单位选择事件后触发
             * @param data
             */
            deptSelect(data) {
                this.formData.dept = data[0].deptCode;
                this.formData.deptName = data[0].deptName;
                this.formData.unitName = data[0].orgName;
                this.formData.unit = data[0].orgCode;
            },
            /**
             * 打开窗口
             */
            openDialog() {
                this.dialogVisible = true;
            },
            /**
             * 关闭窗口
             */
            closeDialog() {
                this.onCloseHandler().then(() => {
                    this.dialogVisible = false;
                });
            },
            /**
             * 保存按钮响应事件
             */
            saveClickHandler() {
                let _this = this;
                this.validateFormData().then(res => {
                    _this.formData.type = _this.formData.type.toString();
                    console.log(JSON.stringify(_this.formData));
                    _this.axios(_this.POSITION_ENUMS.ACTIONS.SAVE, _this.formData, [res => {
                        _this.closeDialog();
                    }]);
                }).catch(() => {
                    _this.$message.warning("页面数据校验失败");
                });
            },
            /**
             * 关闭按钮响应事件
             */
            closeClickHandler() {
                this.closeDialog();
            },
            /**
             * 初始化页面数据
             */
            initData() {
                let _this = this;
                if (!!this.oid && this.oid != "") {
                    this.axios(this.POSITION_ENUMS.ACTIONS.SEARCH_BY_ID, {id: this.oid}, [res => {
                        Object.assign(_this.formData, res.data);
                        _this.formData.type = _this.formData.type.split(",");
                    }]);
                }
            },
            /**
             * 校验页面数据
             * @return {*}
             */
            validateFormData() {
                return this.$refs.form.validate();
            }
        },
        mounted() {
            this.initData();
        }
    }
</script>

<style scoped>

</style>