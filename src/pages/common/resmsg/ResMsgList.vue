<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="站内信管理"
                        data-url="/resources/ResMsg/list"
                        :query="query"
                        :columns="columns"
                        ref="grid"
                        :operations="operations"
                        :buttons="buttons">
        </ice-query-grid>
        <!--<el-dialog v-dialogDrag title="邮件发送管理" custom-class="ice-dialog" center :visible.sync="dialogVisible"-->
                   <!--width="800px" append-to-body :close-on-click-modal="false">-->
            <!--<div class="ice-container">-->
                <!--<el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="form"-->
                         <!--style="margin-top: 20px">-->
                    <!--<el-row :gutter="60">-->
                        <!--<el-col :span="12">-->

                            <!--<el-form-item label="所属应用:" label-width="100px" prop="appCode">-->
                                <!--<el-select placeholder="所属应用" v-model="mainDataForm.appCode">-->
                                    <!--<el-option label="区域一" value="shanghai"></el-option>-->
                                    <!--<el-option label="区域二" value="beijing"></el-option>-->
                                <!--</el-select>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                        <!--<el-col :span="12">-->
                            <!--<el-form-item label="类型编码:" label-width="100px" prop="code">-->
                                <!--<el-input placeholder="类型编码" v-model="mainDataForm.code"></el-input>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                    <!--</el-row>-->
                    <!--<el-row :gutter="60">-->
                        <!--<el-col :span="12">-->
                            <!--<el-form-item label="类型名称:" label-width="100px" prop="name">-->
                                <!--<el-input placeholder="类型名称" v-model="mainDataForm.name"></el-input>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                        <!--<el-col :span="12">-->
                            <!--<el-form-item label="父节点:" label-width="100px" prop="parentid">-->
                                <!--<el-select placeholder="父节点" v-model="mainDataForm.parentid">-->
                                    <!--<el-option label="区域一" value="shanghai"></el-option>-->
                                    <!--<el-option label="区域二" value="beijing"></el-option>-->
                                <!--</el-select>-->
                            <!--</el-form-item>-->

                        <!--</el-col>-->
                    <!--</el-row>-->
                    <!--<el-row :gutter="60">-->
                        <!--<el-col :span="24">-->
                            <!--<el-form-item label="启用状态:" label-width="100px" prop="enabled">-->
                                <!--<el-checkbox v-model="mainDataForm.enabled">{{mainDataForm.enabled?'启用':'停用'}}-->
                                <!--</el-checkbox>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                    <!--</el-row>-->
                    <!--<el-row :gutter="60">-->
                        <!--<el-col :span="24">-->
                            <!--<el-form-item label="描述说明:" label-width="100px" prop="desc">-->
                                <!--<el-input placeholder="描述说明" type="textarea" :rows="4"-->
                                          <!--v-model="mainDataForm.desp"></el-input>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                    <!--</el-row>-->


                <!--</el-form>-->
                <!--<div class="ice-button-bar ">-->
                    <!--<el-button type="primary" @click="save">保存</el-button>-->
                    <!--<el-button type="info" @click="closeDialog">返回</el-button>-->
                <!--</div>-->
                <!--<div class="ice-streak"></div>-->
                <!--<div class="ice-grid-button-bar">-->
                    <!--<el-button type="primary" icon="el-icon-plus" @click="addDetailItem">新增</el-button>-->
                <!--</div>-->
                <!--<div class="grid-bar">-->
                    <!--<ice-editable-table :data="detailGridData" :rules="detailRules" ref="detailtable">-->
                        <!--<el-table-column :width="50"-->
                                         <!--label="序号">-->
                            <!--<template slot-scope="scope">-->
                                <!--{{scope.$index+1}}-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<ice-editable-table-column prop="code"-->
                                                   <!--:width="140"-->
                                                   <!--label="值编码"-->
                                                   <!--input-type="input">-->

                        <!--</ice-editable-table-column>-->
                        <!--<ice-editable-table-column prop="name"-->
                                                   <!--label="值名称"-->
                                                   <!--:width="140"-->
                                                   <!--input-type="input">-->

                        <!--</ice-editable-table-column>-->
                        <!--<ice-editable-table-column prop="enabled"
                                                   label="启用/停用"
                                                   :width="100"
                                                   input-type="checkbox"
                                                   :checkbox-label="['停用','启用']">

                        </ice-editable-table-column>-->
                        <!--<ice-editable-table-column prop="remark"-->
                                                   <!--label="备注"-->
                                                   <!--:width="200"-->
                                                   <!--input-type="input">-->

                        <!--</ice-editable-table-column>-->
                        <!--<el-table-column label="操作">-->
                            <!--<template slot-scope="scope">-->
                                <!--<el-button type="text"-->
                                           <!--size="small" @click="deleteDetailItem(scope.$index)">删除-->
                                <!--</el-button>-->
                                <!--<el-button type="text" v-if="scope.$index!=0"-->
                                           <!--size="small" @click="moveup(scope.$index)">上移-->
                                <!--</el-button>-->
                                <!--<el-button type="text" v-if="scope.$index!=detailGridData.length-1"-->
                                           <!--size="small" @click="movedown(scope.$index)">下移-->
                                <!--</el-button>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                    <!--</ice-editable-table>-->
                <!--</div>-->


            <!--</div>-->

        <!--</el-dialog>-->
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";

    export default {
        name: "ResMsgList",
        data() {
            return {
                query: [
                     // {type: 'select', label: '所属应用', code: 'typeDesc', mapTypeCode: 'select'},
                    {type: 'input', label: '标题', code: 'title', value: ''},
                    {type: 'input', label: '发送用户', code: 'sendUse', value: ''},
                    {type: 'select', label: '是否已读', code: 'ifRead', mapTypeCode: 'ifRead', value: ''}
                ],
                columns: [
                    {code:'oid',hidden:true},
                    {label: '标题', code: 'msgTitle', width: 190},
                    {label: '消息内容', code: 'msgContent', width: 240},
                    {label: '是否已读', code: 'ifRead', width: 320},
                    {label: '消息类型', code: 'type', width: 160},
                    {label: '发送用户', code: 'userCodeTo', width: 100},
                    /* {label: '最后操作时间', code: 'updateDate', width: 120}*/],
                operations: [
                    {name: '查看', callback: this.updateItem},
                    {name: '删除', callback: this.deleteItem},
                ],
                // buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addItem}],
                dialogVisible: false,
                // mainDataForm: {
                //     appCode: '',
                //     code: '',
                //     name: '',
                //     parentid: '',
                //     enabled: true,
                //     desp: ''
                // },
                // formRules: {
                //     appCode: [{required: true, message: '请选择所属应用', trigger: 'blur'}],
                //     code: [{required: true, message: '请输入类型编码', trigger: 'blur'}],
                //     name: [{required: true, message: '请输入类型名称', trigger: 'blur'}],
                // },
                detailGridData: [
                    {valueCode: '', valueName: '', enabled: true, desc: ''},
                ],
                // detailRules: {
                //     code: {required: true, message: '请输入值编码', repeatable: false},
                //     name: {required: true, message: '请输入值名称'},
                // }
            }
        },
        methods: {
            addItem() {
                this.mainDataForm.oid = '';
                this.mainDataForm.appCode = '';
                this.mainDataForm.code = '';
                this.mainDataForm.name = '';
                this.mainDataForm.enabled = true;
                this.mainDataForm.desp = '';
                this.detailGridData = [{valueCode: '', valueName: '', enabled: true, desc: ''}];
                this.dialogVisible = true;
            },
            updateItem(row) {
                this.mainDataForm.oid = row.oid;
                this.mainDataForm.appCode = row.appCode;
                this.mainDataForm.code = row.code;
                this.mainDataForm.name = row.name;
                this.mainDataForm.enabled = row.enabled ? true : false;
                this.mainDataForm.desp = row.desp;
                this.detailGridData = row.appDataList;
                this.detailGridData.forEach(item => item.enabled = item.enabled ? true : false)
                this.dialogVisible = true;
            },
            deleteItem(row) {
                // this.mainDataForm.oid = row.oid;
                // console.log(this.mainDataForm);
                // this.$refs.detailtable.validateAll((valid) => {
                //     if (valid && formValid) {
                //         console.log(valid); console.log(formValid);
                        // this.mainDataForm.appDataList = this.detailGridData;
                        // this.mainDataForm.enabled = this.mainDataForm.enabled ? 1 : 0;
                        // this.mainDataForm.appDataList.forEach(item => item.enabled = item.enabled ? 1 : 0);
                        this.$axios.post("/resources/ResMsg/delete",  row)
                            .then(result => {
                                this.$message.success("保存成功");
                                this.$refs.grid.refresh();
                                this.closeDialog();
                            })
                //     }
                // })

            },
            addDetailItem() {
                this.detailGridData.push({valueCode: '', valueName: '', enabled: true, desc: ''})
            },
            deleteDetailItem(index) {
                this.detailGridData.splice(index, 1);
            },
            swapArray(arr, index1, index2) {
                arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                return arr;
            },
            moveup(index) {
                if (index != 0) {
                    this.detailGridData = this.swapArray(this.detailGridData, index, index - 1);
                }
            },
            movedown(index) {
                if (index + 1 != this.detailGridData.length) {
                    this.detailGridData = this.swapArray(this.detailGridData, index, index + 1);
                }
            },
            save() {
                let formValid = false;
                this.$refs['form'].validate((valid) => {

                    if (valid) {
                        formValid = true
                    } else {

                        return false;
                    }
                });
                this.$refs.detailtable.validateAll((valid) => {
                    if (valid && formValid) {
                        this.mainDataForm.appDataList = this.detailGridData;
                        this.mainDataForm.enabled = this.mainDataForm.enabled ? 1 : 0;
                        this.mainDataForm.appDataList.forEach(item => item.enabled = item.enabled ? 1 : 0);
                        //remark by rocky 2019-08-20
                        // this.$axios.patch("/permission/dataDictionary/saveOrUpdate", this.mainDataForm)
                        //     .then(result => {
                        //         this.$message.success("保存成功");
                        //         this.$refs.grid.refresh();
                        //         this.closeDialog();
                        //     })
                    }
                })


            },
            closeDialog() {
                this.dialogVisible = false;
            }
        },
        computed: {},
        watch: {},
        mounted() {

        },
        components: {IceEditableTableColumn, IceEditableTable, IceGridLayout, IceQueryGrid}
    }

</script>


<style lang="less" scoped>
    .editor-wrapper {
        display: flex;
        flex-direction: column;
    }
        .button-area {
            display: flex;
            justify-content: flex-end;
        }

</style>
