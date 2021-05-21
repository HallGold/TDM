<template>
    <ice-dialog title="网格列编辑"
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

            <ice-dialog title="网格列属性维护" :visible.sync="dialogVisible" width="800px">
                <el-form :model="formData" :rules="rules" label-position="right" class="editor-form"
                         ref="form" style="">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="列名称:" label-width="100px" prop="columnName">
                                <el-input placeholder="请输入列名称" v-model="formData.columnName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="列编码:" label-width="100px" prop="columnCode">
                                <el-input placeholder="请输入列编码" v-model="formData.columnCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="列宽度(px):" label-width="100px" prop="columnWidth">
                                <el-input-number v-model="formData.columnWidth"></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="列类型:" label-width="100px" prop="columnType">
                                <ice-select :options="columnTypeList" placeholder="请选择列类型"
                                            v-model="formData.columnType"></ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="60">

                        <el-col :span="4">
                            <el-form-item label="是否可编辑:" label-width="100px" prop="sortable">
                                <el-checkbox v-model="formData.editable" :disabled="editable===false"></el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" v-if="!formData.editable">
                            <el-form-item label="是否隐藏列:" label-width="100px" prop="showTips">
                                <el-checkbox v-model="formData.hidden"></el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" v-if="!formData.editable">
                            <el-form-item label="是否显示tips:" label-width="100px" prop="showTips">
                                <el-checkbox v-model="formData.showTips"></el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" v-if="!formData.editable">
                            <el-form-item label="是否可排序:" label-width="100px" prop="sortable">
                                <el-checkbox v-model="formData.sortable"></el-checkbox>
                            </el-form-item>
                        </el-col>

                        <el-col :span="4" v-if="!formData.editable">
                            <el-form-item label="是否字段撑开:" label-width="100px" prop="fit">
                                <el-checkbox v-model="formData.fit"></el-checkbox>
                            </el-form-item>
                        </el-col>

                    </el-row>

                    <el-row :gutter="60" v-if="(formData.editable===false&&editable===true)||editable===false">
                        <el-col :span="12">
                            <el-form-item label="数据格式化:" label-width="100px" prop="formatterExpress">
                                <script-editor v-model="formData.formatterExpress"
                                               :init-script="initScript"></script-editor>
                            </el-form-item>
                        </el-col>
                    </el-row>


                    <el-row :gutter="60" v-if="formData.editable==true">
                        <el-col :span="4">
                            <el-form-item label="是否必填:" label-width="100px" prop="required">
                                <el-checkbox v-model="formData.required"></el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="是否只读:" label-width="100px" prop="readonly">
                                <el-checkbox v-model="formData.readonly"></el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" v-if="formData.columnType=='input'">
                            <el-form-item label="是否可为空格:" label-width="100px" prop="whitespace">
                                <el-checkbox v-model="formData.whitespace"></el-checkbox>
                            </el-form-item>
                        </el-col>

                        <el-col :span="3">
                            <el-form-item label="是否可重复:" label-width="100px" prop="repeatable">
                                <el-checkbox v-model="formData.repeatable"></el-checkbox>
                            </el-form-item>
                        </el-col>

                        <el-col :span="9" v-if="formData.columnType=='input'">
                            <el-form-item label="校验类型:" label-width="100px" prop="validate">
                                <ice-select :options="validateTypeList" placeholder="请选择校验类型"
                                            v-model="formData.validate"></ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>


                    <el-row :gutter="60">
                        <el-col :span="12" v-if="formData.columnType=='mapTypeCode'">
                            <el-form-item label="数据字典编码:" label-width="100px" prop="mapTypeCode">
                                <el-input placeholder="请输入数据字典编码" v-model="formData.mapTypeCode"></el-input>
                            </el-form-item>
                        </el-col>
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
        name: "TableColumnEditor",
        props: {
            tableColumns: {
                type: Array,
                default: function () {
                    return []
                }
            },
            visible: {
                type: Boolean,
                default: false
            },
            editable: Boolean
        },
        data() {
            return {
                gridData: [],
                dialogButtons: [
                    {
                        name: '确认', click: () => {
                            /* debugger*/
                            let columns = this.gridData.map(item => {
                                let column = {};
                                column.label = item.columnName;
                                column.code = item.columnCode;
                                column.width = item.columnWidth;

                                if (item.columnType == 'mapTypeCode') {
                                    column.mapTypeCode = item.mapTypeCode;
                                    column.type = 'select';
                                } else {
                                    column.type = item.columnType;
                                }
                                column.formatterExpress = item.formatterExpress;
                                column.hidden = item.hidden === undefined ? false : item.hidden;
                                column.showTips = item.showTips === undefined ? true : item.showTips;
                                column.sortable = item.sortable === undefined ? false : item.sortable;
                                column.editable = item.editable === undefined ? false : item.editable;
                                column.required = item.required === undefined ? false : item.required;
                                column.readonly = item.readonly === undefined ? false : item.readonly;
                                column.whitespace = item.whitespace === undefined ? false : item.whitespace;
                                column.repeatable = item.repeatable === undefined ? true : item.repeatable;
                                column.validate = item.validate === undefined ? 'string' : item.validate;
                                column.fit = item.fit === undefined ? false : item.fit;
                                return column
                            })

                            this.$emit("columns-update", columns)
                        }
                    }, {name: '取消', iscannel: true}],

                columns: [
                    {label: '列名称', code: 'columnName', width: 100,},
                    {label: '列编码', code: 'columnCode', width: 120},
                    {
                        label: '列宽度', code: 'columnWidth', width: 80, formatter: row => {
                            return row['columnWidth'] + 'px'
                        }
                    },
                    {
                        label: '列类型', code: 'columnType', width: 80, formatter: row => {
                            let item = this.columnTypeList.find(item => item.code == row['columnType'])
                            return item.text;
                        }
                    },
                    {
                        label: '是否隐藏', code: 'hidden', width: 100, formatter: row => {
                            return row['hidden'] ? '是' : '否'
                        }
                    },
                    {
                        label: '是否显示tips', code: 'showTips', width: 100, formatter: row => {
                            return row['showTips'] ? '是' : '否'
                        }
                    },
                    {
                        label: '是否可排序', code: 'sortable', width: 100, formatter: row => {
                            return row['sortable'] ? '是' : '否'
                        }
                    },
                    {label: '数据字典编码', code: 'mapTypeCode', width: 100},
                  /*  {label: '数据格式化工具', code: 'formatterExpress', width: 160}*/
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
                    columnName: '',
                    columnCode: '',
                    columnWidth: 160,
                    columnType: 'input',
                    mapTypeCode: '',
                    formatterExpress: '',
                    hidden: false,
                    showTips: true,
                    sortable: false,
                    editable: false,
                    required: false,
                    readonly: false,
                    whitespace: false,
                    repeatable: true,
                    validate: 'string',
                },
                rules: {
                    columnName: [{required: true, whitespace: true, message: '请输入列名称', trigger: 'blur'}],
                    columnCode: [{required: true, whitespace: true, message: '请输入列编码', trigger: 'blur'}],
                },
                columnTypeList: [
                    {text: '普通文本', code: 'input'},
                    {text: '数字', code: 'number'},
                    {text: '日期', code: 'date'},
                    {text: 'checkbox', code: 'checkbox'},
                    {text: '数据字典', code: 'mapTypeCode'},
                    /*{text: '自定义', code: 'custom'}*/
                ],
                validateTypeList: [
                    {text: '文本', code: 'string'},
                    {text: '数字', code: 'number'},
                    {text: '整数', code: 'integer'},
                    {text: '浮点数', code: 'float'},
                    {text: '邮件', code: 'email'},
                    {text: 'URL', code: 'url'},
                    /*{text: '自定义', code: 'custom'}*/
                ],
                editIndex: 0,
                initScript: "(function(row){\n\t\n  \n  \n})\n"
            }
        },
        methods: {
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        debugger
                        console.log(this.formData)
                        this.gridData[this.editIndex] = {...this.formData};
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
                this.$refs.form.resetFields();
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
            computeGridData() {
                this.gridData = this.tableColumns.map(item => {
                    return {
                        columnName: item.label,
                        columnCode: item.code,
                        columnWidth: item.width,
                        columnType: item.type,
                        mapTypeCode: item.mapTypeCode,
                        formatterExpress: item.formatterExpress,
                        hidden: item.hidden,
                        showTips: item.showTips,
                        sortable: item.sortable,
                        editable: item.editable,
                        fit: item.fit,
                        required: item.required,
                        readonly: item.readonly,
                        whitespace: item.whitespace,
                        repeatable: item.repeatable,
                        validate: item.validate ? item.validate : 'string',
                    }
                })
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
            tableColumns() {
                this.computeGridData()
            },
            editable() {
                this.formData.editable = false;
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