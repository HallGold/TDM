<template>
    <ice-dialog title="查询条件编辑"
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

            <ice-dialog title="查询条件属性维护" :visible.sync="dialogVisible" width="800px">
                <el-form :model="formData" :rules="rules" label-position="right" class="editor-form"
                         ref="form" style="">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="条件名称:" label-width="100px" prop="queryName">
                                <el-input placeholder="请输入条件名称" v-model="formData.queryName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="条件编码:" label-width="100px" prop="queryCode">
                                <el-input placeholder="请输入条件编码" v-model="formData.queryCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="条件类型:" label-width="100px" prop="queryType">
                                <ice-select :options="queryTypeList" placeholder="请选择条件类型"
                                            v-model="formData.queryType"></ice-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="条件操作符:" label-width="100px" prop="queryExp">
                                <ice-select :options="queryExpList" placeholder="请选择条件操作符"
                                            v-model="formData.queryExp"></ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>


                    <el-row :gutter="60">
                        <el-col :span="12" v-if="formData.queryType=='mapTypeCode'">
                            <el-form-item label="数据字典:" label-width="100px" prop="mapTypeCode">
                                <el-input v-model="formData.mapTypeCode" placeholder="请输入数据字典"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="formData.queryType=='static'">
                            <el-form-item label="条件值表达式:" label-width="100px" prop="valueExpress">
                                <script-editor v-model="formData.valueExpress"
                                               init-value-model="function"></script-editor>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <editable-table ref="tablist"
                                v-if="formData.queryType=='tab'"
                                min-height="300px"
                                v-model="formData.tablist"
                                :rules="{label:[{required: true, message:'名称不能为空'},{repeatable: false, message: '名称不能重复'}],value:[{required: true, message:'值不能为空'},{repeatable: false, message: '值不能重复'}]}"
                                :columns="[{label: 'tab名称', code: 'label',type:'input',editable:true, width: 270},{label: 'tab值', code: 'value',type:'input',editable:true, width: 270},{label: '默认选中', code: 'default',type:'checkbox',editable:true, width: 100}]"
                                :buttons="[{name:'新增',callback:_=>$refs.tablist.addRow()}]"
                                :operations="[{name:'删除',callback:(item,index)=>$refs.tablist.deleteRow(item,index)}]">

                </editable-table>
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
    import EditableTable from "./EditableTable";

    export default {
        name: "TableColumnEditor",
        props: {
            tableQuerys: {
                type: Array,
                default: function () {
                    return []
                }
            },
            visible: {
                type: Boolean,
                default: false
            },
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
                                column.label = item.queryName;
                                column.code = item.queryCode;

                                if (item.queryType == 'mapTypeCode') {
                                    column.mapTypeCode = item.mapTypeCode;
                                    column.type = 'select';
                                } else {
                                    column.type = item.queryType;
                                }
                                column.exp = item.queryExp;
                                column.valueExpress = item.valueExpress;
                                column.tablist = item.tablist;
                                /*column.value = '';*/
                                return column
                            })

                            this.$emit("querys-update", columns)
                        }
                    }, {name: '取消', iscannel: true}],

                columns: [
                    {label: '条件名称', code: 'queryName', width: 140,},
                    {label: '条件编码', code: 'queryCode', width: 140},
                    {
                        label: '条件类型', code: 'queryType', width: 80, formatter: row => {
                            let item = this.queryTypeList.find(item => item.code == row['queryType'])
                            return item.text;
                        }
                    },
                    {
                        label: '条件操作符', code: 'queryExp', width: 100, formatter: row => {
                            let item = this.queryExpList.find(item => item.code == row['queryExp'])
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
                    queryName: '',
                    queryCode: '',
                    queryType: 'input',
                    mapTypeCode: '',
                    queryExp: '=',
                    valueExpress: '',
                    tablist: []
                },
                rules: {
                    queryName: [{required: true, whitespace: true, message: '请输入条件名称', trigger: 'blur'}],
                    queryCode: [{required: true, whitespace: true, message: '请输入条件编码', trigger: 'blur'}],
                    mapTypeCode: [{required: true, whitespace: true, message: '请输入数据字典编码', trigger: 'blur'}],
                },
                queryTypeList: [
                    {text: '普通文本', code: 'input'},
                    {text: '日期', code: 'date'},
                    {text: '数据字典', code: 'mapTypeCode'},
                    {text: '静态条件', code: 'static'},
                    {text: 'tab条件', code: 'tab'},
                ],
                queryExpList: [
                    {text: '等于=', code: '='},
                    {text: '小于<', code: '<'},
                    {text: '小于等于<=', code: '<='},
                    {text: '大于>', code: '>'},
                    {text: '大于等于>=', code: '>='},
                    {text: '包含in', code: 'in'},
                    {text: '不包含notin', code: 'notin'},
                    {text: '匹配like', code: 'like'},
                ],
                editIndex: 0
            }
        },
        methods: {
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if (this.formData.queryType == 'tab') {
                            this.$refs.tablist.validateAll(result => {
                                if (result) {
                                    if (this.gridData.length == this.editIndex) {
                                        //新增
                                        if (this.gridData.find(item => item.type == 'tab')) {
                                            this.$message.warning("tab过滤条件最多只能存在一个")
                                            return
                                        }
                                    }
                                    this.gridData[this.editIndex] = {...this.formData};
                                    this.gridData = [...this.gridData]
                                    this.dialogVisible = false;
                                    this.resetForm();
                                }
                            })
                        } else {
                            this.gridData[this.editIndex] = {...this.formData};
                            this.gridData = [...this.gridData]
                            this.dialogVisible = false;
                            this.resetForm();
                        }

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
                this.gridData = this.tableQuerys.map(item => {
                    return {
                        queryName: item.label,
                        queryCode: item.code,
                        queryType: item.type,
                        mapTypeCode: item.mapTypeCode,
                        queryExp: item.exp,
                        valueExpress: item.valueExpress,
                        tablist: item.tablist
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
            tableQuerys() {
                this.computeGridData()
            }/*,
            'formData.tablist': {
                handler(newValue, oldValue) {
                    //if(newValue)
                }
                ,
                deep: true,
                immediate: true,
            }*/
        },
        components: {EditableTable, ScriptEditor, IceSelect, IceDialog, IceQueryGrid}
    }
</script>

<style lang="less" scoped>
    .editor-form {
        padding: 10px;
    }
</style>