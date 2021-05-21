<template>
    <!--<div class="content-filled">
        <div class="ice-button-bar" v-if="buttons.length>0">
            <slot name="operation-bar">
                <el-button :type="button.type?button.type:'primary'"
                           :icon="button.icon?button.icon:''"
                           v-for="button in buttons"
                           @click="buttonClick(button.callback)" :key="button.name">{{button.name}}
                </el-button>
            </slot>
        </div>
        <div class="main-content">
            <ice-tree-table ref="orgTreeTable" :data="tableData" showProp="deptName" :beforeExpanded="loadChildren"
                            border>
                <el-table-column label="操作" width="300" v-if="operations.length>0">
                    <template slot-scope="scope">
                        <el-dropdown v-for="operation in operations" :key="operation.name" v-if="!!operation.dropdown"
                                     @command="(command)=>{
                                    dropDownItemClick(command,scope.row,scope.$index,operation.callback);
                                }">
                            <el-button size="small"
                                       :type="!!operation.type?operation.type:`primary`">
                                        <span v-if="!!operation.render">
                                        {{operation.render(scope.row)}}
                                        </span>
                                <span v-else>
                                        {{operation.name}}
                                        </span>
                                <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="item in operation.dropdown" :key="item.key"
                                                  :command="item.key"
                                                  :disabled="scope.row._level == 1 && item.key==`1`">&lt;!&ndash;1级节点不能增加同级&ndash;&gt;
                                    {{item.name}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-button v-else @click="operationClick(scope.row,scope.$index,operation.callback)"
                                   size="small"
                                   :type="!!operation.type?typeof operation.type == `function`?operation.type(scope.row):operation.type:`primary`">
                                    <span v-if="!!operation.render">
                                        {{operation.render(scope.row)}}
                                    </span>
                            <span v-else>
                                        {{operation.name}}
                                    </span>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="类型" width="80">
                    <template slot-scope="scope">
                        {{orgTypeMap[scope.row.typeCode]}}
                    </template>
                </el-table-column>
                <el-table-column label="法人机构" width="80">
                    <template slot-scope="scope">
                        {{scope.row.corporation == YES_NO_ENUM.YES?YES_NO_ENUM.properties[
                        YES_NO_ENUM.YES].name:YES_NO_ENUM.properties[ YES_NO_ENUM.NO].name}}
                    </template>
                </el-table-column>
                <el-table-column label="虚拟部门" width="80">
                    <template slot-scope="scope">
                        {{scope.row.viral == YES_NO_ENUM.YES?YES_NO_ENUM.properties[
                        YES_NO_ENUM.YES].name:YES_NO_ENUM.properties[ YES_NO_ENUM.NO].name}}
                    </template>
                </el-table-column>
                <el-table-column label="部门编码" width="100">
                    <template slot-scope="scope">
                        {{scope.row.inputDeptCode}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100">
                    <template slot-scope="scope">
                        {{getEnumName(ENABLED_ENUM, scope.row.enabled)}}
                    </template>
                </el-table-column>
            </ice-tree-table>
        </div>
        <org-edit ref="orgEdit" @beforeClose="close"/>
    </div>-->
    <!--<div style="width: 100%;">
        <div>
            <el-button type="primary" class="el-icon-plus" @click="add">新增</el-button>
        </div>
        <div style="height: 2000px">
            <el-table
                    :data="tableData"
                    style="width: 100%;margin-bottom: 20px;"
                    border
                    row-key="oid">
                <el-table-column
                        prop="url"
                        label="URL"
                        sortable
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="bigIconUrl"
                        label="大图"
                        sortable
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="smallIconUrl"
                        label="小图">
                </el-table-column>
                <el-table-column
                        prop="openType"
                        label="打开方式">
                </el-table-column>
                <el-table-column
                        prop="enabled"
                        label="启用状态">
                </el-table-column>
                <el-table-column
                        prop="sequencing"
                        label="排序">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="200">
                    <template slot-scope="scope">
                        <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
                        <el-button @click="enabled(scope.row)" type="text" size="small">启用</el-button>
                        <el-button @click="disabled(scope.row)" type="text" size="small">禁用</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div>
            <el-dialog v-dialogDrag title="新增功能节点" custom-class="ice-dialog" center :visible.sync="addFuncDialogVisible"
                       width="1000px" append-to-body :close-on-click-modal="false" height=500px>
                <div class="ice-container">
                    <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="form"
                             style="margin-top: 20px">
                        <el-row :gutter="60">
                            <el-col :span="12">
                                <el-form-item label="URL" label-width="100px" prop="url">
                                    <el-input placeholder="URL" v-model="mainDataForm.url"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="大图" label-width="100px" prop="bigIconUrl">
                                    <el-input placeholder="大图URL" v-model="mainDataForm.bigIconUrl"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="60">
                            <el-col :span="12">
                                <el-form-item label="小图" label-width="100px" prop="smallIconUrl">
                                    <el-input placeholder="小图URL" v-model="mainDataForm.smallIconUrl"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="打开方式" label-width="100px" prop="openType">
                                    <el-input placeholder="打开方式" v-model="mainDataForm.openType"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="60">
                            <el-col :span="12">
                                <el-form-item label="请用状态" label-width="100px" prop="enabled">
                                    <el-checkbox v-model="mainDataForm.enabled">{{mainDataForm.enabled?'启用':'停用'}}
                                    </el-checkbox>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="排行" label-width="100px" prop="sequencing">
                                    <el-input placeholder="排行" v-model="mainDataForm.sequencing"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div class="ice-button-bar ">
                        <el-button type="primary" @click="save">保存</el-button>
                        <el-button type="info" @click="closeDialog">返回</el-button>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>-->
</template>

<script>
    import IceTreeTable from "@/components/common/base/IceTreeTable";
    import OrgEdit from "./OrgEdit";
    import OrgComm from "@/pages/system/comm/OrgComm";

    export default {
        name: "OrgManage",
        components: {IceTreeTable, OrgEdit},
        /*data(){
            return{
                mainDataForm:{},
                addFuncDialogVisible:false,
                tableData:[]
            }
        },
        methods:{
            init(){
                this.$axios.get("/permission/frame_org/load_table_next_children",{"params":{"deptCode":0,"loadDisabled":true}}).then(success=>{
                    if (!success.data){
                        return;
                    }
                    this.tableData =success.data;
                }).catch(error=>{
                    this.$message.error("出错了")
                });
            },
            add(){
                this.addFuncDialogVisible=true;
            },
            remove(){

            },
            enabled(){

            },
            disabled(){

            },
            save(){
                this.addFuncDialogVisible=false;
                this.tableData.push(this.mainDataForm);
            },
            closeDialog(){
                this.addFuncDialogVisible=false;
            }

        },*/
        mixins: [OrgComm],
        data() {
            return {
                NEW_NODE_TYPE_ENUM: {
                    SAME: {name: `同级节点`, code: 1},
                    CHILD: {name: `子级节点`, code: 2},
                },
                tableData: {},
                curTableData: {parentCode: "0"},
                columns: [],
                buttons: [],
                operations: [],
                curTrIndex: 0,
                orgTypeMap: {}
            }
        },
        methods: {
            dropDownItemClick(command, row, trIndex, callback) {
                this.curTrIndex = trIndex;
                if (typeof callback == "function") {
                    callback(command, row);
                }
            },
            operationClick(item, trIndex, callback) {
                this.curTrIndex = trIndex;
                if (typeof callback == "function") {
                    callback(item);
                }
            },
            buttonClick(callback) {
                callback();
            },
            initControls() {
                this.initButtons();
                this.initColumns();
            },
            initOrgTypeMap() {
                let _this = this;
                return new Promise((resolve, reject) => {
                    let _URL = this.ACTIONS_ENUM.ORG_TYPE.LOAD_LIST;
                    let _param = {enabled: this.ENABLED_ENUM.ENABLED};
                    this.axios(_URL, _param, [res => {
                        for (let i in res.data) {
                            let _record = res.data[i];
                            this.orgTypeMap[_record.code] = _record.name;
                        }
                        resolve();
                    }]);
                });
            },
            loadChildren(record) {
                //加载子节点
                let _this = this;
                this.curTableData = record;
                return new Promise((resolve, reject) => {
                    if (!!record.children) {
                        //数据已经加载过，不请求ajax
                        resolve();
                    } else {
                        this.axios(this.ACTIONS_ENUM.ORG.LOAD_DEPTS_TREE_BY_PARENT_CODE, {
                            deptCode: this.curTableData.deptCode,
                            loadDisabled: true
                        }, [res => {
                            let _level = 1 + _this.curTableData._level;
                            for (let i in res.data) {
                                Object.assign(res.data[i], {
                                    _expanded: false,
                                    _show: true,
                                    _level: _level,
                                    parent: _this.curTableData
                                });
                            }
                            _this.$set(_this.curTableData, "children", res.data);
                            resolve();
                        }, res => {
                            reject();
                        }, res => {
                            this.$message.error(res);
                            reject();
                        }]);
                    }
                });
            },
            initButtons() {
                this.buttons = [
                    Object.assign(this.BUTTON_ENUM.REFRESH, {callback: this.refresh})
                ];
                this.operations = [
                    {
                        name: '新增',
                        dropdown: [
                            {
                                name: this.NEW_NODE_TYPE_ENUM.SAME.name,
                                key: this.NEW_NODE_TYPE_ENUM.SAME.code
                            }, {
                                name: this.NEW_NODE_TYPE_ENUM.CHILD.name,
                                key: this.NEW_NODE_TYPE_ENUM.CHILD.code
                            }],
                        callback: this.add
                    },
                    {name: '编辑', callback: this.edit},
                    {
                        name: '停用', callback: this.changeStatus, type: (row) => {
                            if (row.enabled == this.ENABLED_ENUM.ENABLED) {
                                return "primary";
                            }
                            return `success`;
                        }, render: this.changeStatusButtonNameRender
                    },
                ];
            },
            initColumns() {
            },
            changeStatusButtonNameRender(row) {
                //启用停用操作按钮渲染方法
                return this.getEnumName(this.ENABLED_ENUM, !row.enabled ? this.ENABLED_ENUM.ENABLED : this.ENABLED_ENUM.DISABLED);
            },
            add(command, row) {
                this.curTableData = row;
                let newRow = {};
                //新增按钮响应
                if (command == this.NEW_NODE_TYPE_ENUM.SAME.code) {
                    //同级节点
                    newRow.parentCode = row.parentCode;
                    newRow._level = row._level;
                    if (!!row.parent) {
                        newRow.parentName = row.parent.deptName;
                        newRow.parent = row.parent;
                    }
                } else if (command == this.NEW_NODE_TYPE_ENUM.CHILD.code) {
                    //子节点
                    newRow.parentCode = row.deptCode;
                    newRow._level = row._level + 1;
                    newRow.parentName = row.deptName;
                    newRow.parent = row;
                }
                newRow._expanded = false;
                newRow._show = true;
                this.$refs.orgEdit.open(newRow);
            },
            afterAddFriend(_returnData) {
                //向根节点新增
                let _child = Object.assign({}, _returnData);
                this.curTableData.parent.children.unshift(_child);
                // let children = [].concat(this.curTableData.parent.children);
                // debugger;
                // this.$set(this.curTableData.parent, "children", children);
                // debugger;
            },
            afterAddChild(_returnData) {
                let _children = null;
                let _child = Object.assign({}, _returnData);
                if (!!this.curTableData.children) {
                    _children = this.curTableData.children;
                } else {
                    _children = [];
                }
                _children.unshift(_child);
                this.$set(this.curTableData, "children", _children);
                this.$refs.orgTreeTable.expand(this.curTrIndex);
            },
            edit(row) {
                this.curTableData = row;
                this.$refs.orgEdit.open(Object.assign({}, row));
            },
            afterEdit(_returnData) {
                // for (let i in _returnData) {
                //     let _value = _returnData[i];
                //     this.$set(this.curTableData, i, _value);
                // }
                Object.assign(this.curTableData, _returnData);
            },
            close(_returnData) {
                if (!!_returnData) {
                    if (this.curTableData.oid == _returnData.oid) {
                        //编辑模式
                        this.afterEdit(_returnData);
                    } else {
                        //新增模式
                        if (this.curTableData.parentCode == _returnData.parentCode) {
                            //新增同级
                            this.afterAddFriend(_returnData);
                        } else {
                            //新增子级
                            this.afterAddChild(_returnData);
                        }
                    }
                }
                this.$refs.orgEdit.close();
            },
            changeStatus(_row) {
                this.curTableData = _row;
                let _this = this;
                let newEnabled = _row.enabled == this.ENABLED_ENUM.ENABLED ? this.ENABLED_ENUM.DISABLED : this.ENABLED_ENUM.ENABLED;
                this.axios(this.ACTIONS_ENUM.ORG.CHANGE_STATUS, {
                    deptCode: _row.deptCode,
                    status: newEnabled
                }, [res => {
                    _this.curTableData.enabled = newEnabled;
                }]);
            },
            enabled() {
            },
            disabled() {
            },
            remove() {
            },
            refresh() {
                this.loadData();
            },
            loadData() {
                this.axios(this.ACTIONS_ENUM.ORG.LOAD_DEPTS_TREE_BY_PARENT_CODE, {
                    deptCode: this.curTableData.parentCode,
                    loadDisabled: true
                }, [res => {
                    this.tableData = res.data;
                }, res => {
                }, res => {
                    this.$message.error(res);
                }]);
            },
        },
        watch: {},
        mounted() {
            let _this = this;
            this.initOrgTypeMap().then(() => {
                _this.initControls();
                _this.loadData();
            });
        }
    }
</script>

<style scoped>
    .content-filled {
        flex-direction: column;
    }

    .content-filled .ice-button-bar {
        justify-content: flex-start;
    }

    .content-filled .main-content {
        flex: initial
    }

    .el-dropdown {
        margin-right: 10px;
    }
</style>
