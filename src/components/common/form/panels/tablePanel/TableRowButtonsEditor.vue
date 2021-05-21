<template>
    <ice-dialog title="网格行按钮编辑"
                :visible.sync="selfDialogVisible"
                :buttons="dialogButtons"
                height="500px"
                width="900px">
        <div class="ice-container">
            <ice-query-grid
                    :grid-data="gridData"
                    :pagination="false"
                    :buttons="buttons"
                    :operations-width="160"
                    :operations="operations"
                    :columns="columns">
            </ice-query-grid>

            <ice-dialog title="网格行按钮属性编辑" :visible.sync="dialogVisible" width="800px">
                <el-form :model="formData" :rules="rules" label-position="right" class="editor-form"
                         ref="form" style="">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="按钮名称:" label-width="100px" prop="buttonName">
                                <el-input placeholder="请输入按钮名称" v-model="formData.buttonName"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="按钮编码:" label-width="100px" prop="buttonCode">
                                <el-input placeholder="请输入按钮编码" v-model="formData.buttonCode"></el-input>
                            </el-form-item>
                        </el-col>

                        <!-- <el-col :span="12">
                             <el-form-item label="按钮风格:" label-width="100px" prop="buttonStyle">
                                 &lt;!&ndash;<el-input placeholder="请输入按钮风格" v-model="formData.buttonStyle"></el-input>&ndash;&gt;
                                 &lt;!&ndash;<el-form-item label="按钮风格:" label-width="100px" prop="buttonType">&ndash;&gt;
                                 <ice-select :options="buttonStyleList" placeholder="请选择按钮风格"
                                             v-model="formData.buttonStyle"></ice-select>
                                 &lt;!&ndash;</el-form-item>&ndash;&gt;
                             </el-form-item>
                         </el-col>-->

                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="isShow表达式:" label-width="130px" prop="showExpress">
                                <script-editor v-model="formData.showExpress"></script-editor>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">


                        <el-col :span="12">
                            <el-form-item label="按钮类型:" label-width="100px" prop="buttonType">
                                <ice-select :options="buttonTypeList" placeholder="请选择按钮类型"
                                            v-model="formData.buttonType" @change="buttonTypeChange"></ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="自定义脚本:" label-width="130px" prop="buttonAction">
                                <script-editor v-model="formData.buttonAction"></script-editor>
                            </el-form-item>
                        </el-col>
                        <!--        <el-col :span="12">
                                    <el-form-item label="列宽度(px):" label-width="100px" prop="columnWidth">
                                        <el-input-number v-model="formData.columnWidth"></el-input-number>
                                    </el-form-item>
                                </el-col>-->
                    </el-row>


                </el-form>
                <div class="ice-button-bar ">
                    <el-button type="primary" @click="save">保存</el-button>
                    <el-button type="info" @click="closeSecond">返回</el-button>
                </div>
            </ice-dialog>
        </div>

    </ice-dialog>
</template>

<script>
    import IceQueryGrid from "../../../base/IceQueryGrid";
    import IceDialog from "../../../base/IceDialog";
    import IceSelect from "../../../base/IceSelect";
    import ScriptEditor from "../../others/ScriptEditor";

    export default {
        name: "TableRowButtonsEditor",
        props: {
            tableButtons: {
                type: Array,
                default: function () {
                    return []
                }
            },
            visible: {
                type: Boolean,
                default: false
            },
            tableCode: String
        },
        data() {
            return {
                gridData: [],
                dialogButtons: [
                    {
                        name: '确认', click: () => {
                            /* debugger*/
                            let buttons = this.gridData.map(item => {
                                let button = {};
                                button.name = item.buttonName;
                                button.code = item.buttonCode;
                                button.opType = item.buttonType;
                                button.showExpress = item.showExpress;
                                button.buttonAction = item.buttonAction;
                                // button.isShow=(row)=>row['columnName']!='123'
                                return button
                            })
                            debugger
                            this.$emit("operations-update", buttons)
                        }
                    }, {name: '取消', iscannel: true}],

                columns: [
                    {label: '按钮名称', code: 'buttonName', width: 100,},
                     {label: '按钮编码', code: 'buttonCode', width: 120},
                    /*{
                        label: '按钮风格', code: 'buttonStyle', width: 120, formatter: row => {
                            let item = this.buttonStyleList.find(item => item.code == row['buttonStyle'])
                            return item.text;
                        }
                    },*/
                    {
                        label: '按钮类型', code: 'buttonType', width: 120, formatter: row => {
                            let item = this.buttonTypeList.find(item => item.code == row['buttonType'])
                            return item.text;
                        }
                    },
                ],
                buttons: [{
                    name: '新增', icon: 'el-icon-plus', type: 'primary', callback: () => {
                        this.dialogVisible = true
                        this.editIndex = this.gridData.length;
                        this.resetForm();
                    }
                }],
                operations: [
                    {name: '编辑', callback: this.edit},
                    {name: '删除', callback: this.deleteItem},
                    {name: '上移', callback: this.moveup, isShow: (row, index) => index != 0},
                    {name: '下移', callback: this.movedown, isShow: (row, index) => index != this.gridData.length - 1}
                ],
                dialogVisible: false,
                selfDialogVisible: false,
                formData: {
                    buttonName: '',
                    buttonCode: '',
                    showExpress: '(function(row){\n\n\treturn true;\n\n})',
                    buttonType: "",
                    buttonAction: ''
                },
                rules: {
                    buttonName: [{required: true, whitespace: true, message: '请输入按钮名称', trigger: 'blur'}],
                    buttonCode: [{required: true, whitespace: true, message: '请输入按钮编码', trigger: 'blur'}],
                   /* buttonType: [{required: true, whitespace: true, message: '请选择按钮类型', trigger: 'blur'}],*/
                },
                buttonTypeList: [
                    {
                        text: '删除行',
                        code: 'deleteRow',
                        action: () => `(function(row,index){\n\n\tthis.getComponentByCode('${this.tableCode}').deleteRow(row,index);\n})`
                    },
                    {
                        text: '自定义',
                        code: 'custom',
                        action: () => `(function(){\n\n\tconsole.log(this.getComponentByCode('${this.tableCode}'));\n})`
                    }
                ],
                buttonStyleList: [
                    {text: '主题色', code: 'primary'},
                    {text: '朴素', code: ''},
                    {text: '成功', code: 'success'},
                    {text: '信息', code: 'info'},
                    {text: '警告', code: 'warning'},
                    {text: '危险', code: 'danger'},
                ],
                editIndex: 0
            }
        },
        methods: {
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.gridData[this.editIndex] = this.formData;
                        this.gridData = [...this.gridData]
                        this.dialogVisible = false;
                        this.resetForm();
                    }
                })
            },
            edit(item, index) {
                this.editIndex = index;
                this.dialogVisible = true;
                this.$nextTick(_ => {
                    Object.assign(this.formData, item)
                })

            },
            closeSecond() {
                this.dialogVisible = false;
                this.resetForm();
            },
            close() {
                this.selfDialogVisible = false;
            },
            resetForm() {
                this.formData = {
                    buttonName: '',
                    buttonCode: '',
                    showExpress: '(function(row){\n\n\treturn true;\n\n})',
                    buttonType: '',
                    buttonAction: ''

                }
                this.$refs.form.clearValidate();
            },
            deleteItem(row, index) {
                this.gridData.splice(index, 1);
            },
            /**此方法为替换，用于上移或下移操作*/
            swapArray(arr, index1, index2) {
                arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                return arr;
            },

            moveup(row, index) {
                if (index != 0) {
                    this.gridData = this.swapArray(this.gridData, index, index - 1);
                }
            },
            movedown(row, index) {
                if (index + 1 != this.gridData.length) {
                    this.gridData = this.swapArray(this.gridData, index, index + 1);
                }
            },
            //计算网格数据
            computeGridData() {
                this.gridData = this.tableButtons.map(item => {
                    return {
                        buttonName: item.name,
                        buttonCode: item.code,
                        buttonType: item.opType,
                        showExpress: item.showExpress,
                        buttonAction: item.buttonAction,
                    }
                })
            },
            buttonTypeChange() {
                const buttonTypeItem = this.buttonTypeList.find(item => item.code == this.formData.buttonType);
                if (buttonTypeItem) {
                    this.formData.buttonAction = buttonTypeItem.action()
                }
            }
        },
        created() {

        },
        mounted() {
            this.computeGridData()
        },
        watch: {
            selfDialogVisible(newValue, oldValue) {
                if (newValue != oldValue) {
                    this.$emit("update:visible", this.selfDialogVisible);
                }

            },
            visible() {
                this.selfDialogVisible = this.visible;
            },
            tableButtons() {
                this.computeGridData()
            }
        },
        components: {ScriptEditor, IceSelect, IceDialog, IceQueryGrid}
    }
</script>

<style lang="less" scoped>
    .editor-form {
        padding: 10px;
    }
</style>