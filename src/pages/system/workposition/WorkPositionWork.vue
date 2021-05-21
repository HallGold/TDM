<template>
    <div class="ice-container">
        <div class="ice-title" >
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>岗位</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div style="flex-grow: 1;display: flex;flex-direction: column;">
            <!--<ice-query-grid title="岗位"
                            :data-url="dataUrl"
                            :pagination="false"
                            :query="queryWork"
                            :columns="columnsWork"
                            ref="grid"
                            :operations="operationsWork"
                            :buttons="buttonsWork"></ice-query-grid>-->


            <div class="ice-grid-button-bar">
                <el-button type="primary" icon="el-icon-plus" @click="addItem">新增</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="saveItem">保存</el-button>
            </div>
            <div class="grid-bar" style="height: 100%">
                <ice-editable-table :data="dataTable" :rules="tableRules" ref="editTable">
                    <el-table-column :width="50"
                                     label="序号">
                        <template slot-scope="scope">
                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column :width="130"
                                     prop="name"
                                     label="岗位名称">
                    </el-table-column>
                    <el-table-column :width="100"
                                     prop="code"
                                     label="岗位编码">
                    </el-table-column>
                    <el-table-column :width="150"
                                     prop="desp"
                                     label="描述">
                    </el-table-column>
                    <ice-editable-table-column prop="rank"
                                               :width="100"
                                               label="职级码"
                                               input-type="input">
                    </ice-editable-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text"
                                       size="small" @click="deleteDetailItem(scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </ice-editable-table>
            </div>
            <ice-pop-selector style="box-sizing: border-box"
                              label=""
                              title="请选择岗位"
                              text-prop="name"
                              :pagination="false"
                              chooseItem="multiple"
                              code-prop="code"
                              mode="hidden"
                              :query="queryWork"
                              :columns="columnsWork"
                              data-url="/permission/work_position/list" ref="selectPosition"
                              @select-confirm="selectConfirmPosition">
            </ice-pop-selector>
            <el-dialog v-dialogDrag title="维护层级" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                       width="800px" append-to-body :close-on-click-modal="false">
                <div class="grid-container">
                    <el-form :model="mainDataForm">
                        <el-row :gutter="60">
                            <el-col :span="24">
                                <el-form-item label="请输入层级" label-width="100px" prop="rank">
                                    <el-input placeholder="只能输入1至7为数字哦" v-model="mainDataForm.rank" maxlength="7"
                                              @keyup.native="number"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div class="ice-button-bar">
                        <el-button type="primary" @click="save">保存</el-button>
                        <el-button type="info" @click="closeDialog">返回</el-button>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IcePopSelector from "../../../components/common/base/IcePopSelector";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";

    export default {
        mixins: [IceQueryGrid],
        name: "WorkPositionLine",
        components: {IceEditableTableColumn, IceEditableTable, IcePopSelector, IceQueryGrid},
        props: {
            dataUrl: String,
            parentCode: String,
            typeId: String,
            dataTable: [],
            tableRules: {}
        },
        data() {
            return {
                queryWork: [
                    {type: 'input', label: '岗位名称', code: 'name', value: ''},
                    {type: 'input', label: '岗位编码', code: 'code', value: ''},
                ],
                columnsWork: [
                    {code: "oid", hidden: true},
                    {label: '岗位名称', code: 'name', width: 100},
                    {label: '岗位编码', code: 'code', width: 100},
                    {label: '描述', code: 'desp', width: 100},

                ],
                operationsWork: [
                    {name: '删除', callback: this.deleteItem},
                ],
                buttonsWork: [
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addItem}
                ],
                mainDataForm: {},
                /*formRules:{
                    code: [{required: true, message: '请输入岗位编码', trigger: 'blur'}],
                    name: [{required: true, message: '请输入岗位名称', trigger: 'blur'}],
                },*/
                dialogVisible: false,
                gridData: [],
                detailRules: []
            }
        },
        methods: {

        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>