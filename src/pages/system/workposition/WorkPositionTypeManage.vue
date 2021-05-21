<template>
    <div class="content-filled">
        <div class="type-div">
            <ice-query-grid ref="typeGrid"
                            style="height:100%;margin-top:-10px"
                            :data-url="this.ACTIONS_ENUM.WORK_POSITION_TYPE.LOAD_LIST.URL()"
                            :pagination="false"
                            :operationsWidth="80"
                            :columns="type.columns"
                            :tableCurrentChange="typeCurrentChangeHandler"
                            :operations="type.operations"
                            :buttons="type.buttons"
            >
            </ice-query-grid>
        </div>
        <div class="position-div">
            <div class="ice-button-bar" v-if="position.buttons.length>0">
                <slot name="operation-bar">
                    <el-button :type="button.type?button.type:'primary'"
                               :icon="button.icon?button.icon:''"
                               v-for="button in position.buttons"
                               @click="button.callback" :key="button.name">{{button.name}}
                    </el-button>
                </slot>
            </div>
            <div>
                <ice-tree-table ref="positionTreeTable" :data="position.tableData" showProp="name"
                                :rowClickHandler="this.positionTreeTableRowClickHandler"
                                border :expand-all="true">
                    <el-table-column label="操作" width="210" v-if="position.operations.length>0">
                        <template slot-scope="scope">
                            <el-dropdown v-for="operation in position.operations" :key="operation.name"
                                         v-if="!!operation.dropdown"
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
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-for="item in operation.dropdown" :key="item.key"
                                                      :command="item.key"
                                                      :disabled="scope.row._level == 1 && item.key==`1`">
                                        <!--1级节点不能增加同级-->
                                        {{item.name}}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-button v-else
                                       @click="positionOperationClick(scope.row,scope.$index,operation.callback)"
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
                </ice-tree-table>
            </div>
        </div>
        <div class="user-div">
            <div class="button-bar">
                <el-button type="primary" icon="el-icon-plus" @click="addUsers">新增</el-button>
                <el-button type="primary" icon="el-icon-remove" @click="removeUsers">删除</el-button>
            </div>
            <div class="main">
                <el-table ref="userGrid"
                          height="100%"
                          :data="user.tableData"
                          @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="40">
                    </el-table-column>
                    <el-table-column
                            width="50"
                            type="index"
                            label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="orgName"
                            label="单位"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="deptName"
                            label="部门"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="姓名"
                            width="110">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <type-edit ref="typeEdit" @beforeClose="beforeTypeClose"></type-edit>
        <position-edit ref="positionEdit" @beforeClose="beforePositionClose"></position-edit>
        <template v-if="openFlag">
        <comm-select ref="commSelect" :multiple="true" :userTab="true" :roleTab="true"
                     @beforeClose="beforeSelectClose"></comm-select>
        </template>
    </div>
</template>

<script>
    import OrgComm from "@/pages/system/comm/OrgComm";
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import TypeEdit from "./WorkPositionTypeEdit";
    import PositionEdit from "./WorkPositionEdit"
    import IceTreeTable from "@/components/common/base/IceTreeTable";
    import CommSelect from "@/pages/system/comm/CommSelect"

    export default {
        name: "WorkPositionTypeManage",
        mixins: [OrgComm],
        components: {IceQueryGrid, TypeEdit, IceTreeTable, PositionEdit, CommSelect},
        watch: {},
        data() {
            return {
                openFlag: false,
                type: {
                    curData: null,
                    dialogVisible: false,
                    columns: [],
                    operations: [],
                    buttons: [],
                },
                position: {
                    tableData: [],
                    curTableData: {},
                    columns: [],
                    buttons: [],
                    operations: [],
                    curTrIndex: 0,
                },
                user: {
                    tableData: [],
                    curData: null,
                    dialogVisible: false,
                    columns: [],
                    buttons: [],
                    selections: [],
                },
                NEW_NODE_TYPE_ENUM: {
                    SAME: {name: `同级节点`, code: 1},
                    CHILD: {name: `子级节点`, code: 2},
                },
            };
        },
        methods: {
            initControls() {
                this.initButtons();
                this.initColumns();
            },
            initTypeButtons() {
                this.type.buttons = [
                    Object.assign({}, this.BUTTON_ENUM.ADD, {callback: this.addType}),
                ];
            },
            initPositionButtons() {
                this.position.buttons = [
                    Object.assign({}, this.BUTTON_ENUM.ADD, {callback: this.addRootPosition}),
                ];
            },
            openSelect(data){
                this.openFlag = true;
                this.$nextTick(() => {
                    this.$refs.commSelect.open(data);
                });
            },
            closeSelect() {
                this.openFlag = false;
            },
            initButtons() {
                this.initTypeButtons();
                this.initPositionButtons();
                // this.initUserButtons();
            },
            initTypeColumns() {
                this.type.columns = [
                    {
                        label: '岗位线名称', code: 'name', width: 80, render: (record) => {
                            if (record.enabled == this.ENABLED_ENUM.ENABLED) {
                                return (<span class="enabled-word">{record.name}</span>);
                            } else {
                                return (<span class="disabled-word">{record.name}</span>);
                            }
                        }
                    },
                    {label: '编码', code: 'code', width: 80},
                    {label: '排序', code: 'sequencing', width: 45},
                    {label: '备注', code: 'remark', width: 100}
                ];
                this.type.operations = [{name: '编辑', callback: this.editType},
                    {
                        name: '启用', callback: this.changeTypeStatus, isShow: (row) => {
                            return row.enabled == this.ENABLED_ENUM.DISABLED;
                        }
                    },
                    {
                        name: '停用', callback: this.changeTypeStatus, isShow: (row) => {
                            return row.enabled == this.ENABLED_ENUM.ENABLED;
                        }
                    },];
            },
            initPositionColumns() {
                this.position.operations = [
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
                        callback: this.addPosition
                    },
                    {name: '编辑', callback: this.editPosition},
                    {name: '删除', callback: this.removePosition},
                ];
            },
            initColumns() {
                this.initTypeColumns();
                this.initPositionColumns();
            },
            beforeTypeClose(_returnData) {
                if (!!_returnData) {
                    if (!!this.type.curData && this.type.curData.oid == _returnData.oid) {
                        //编辑模式
                        this.afterTypeEdit(_returnData);
                    } else {
                        //新增模式
                        this.afterTypeAdd(_returnData);
                    }
                }
                this.$refs.typeEdit.close();
            },
            addType() {
                this.$refs.typeEdit.open({enabled: this.ENABLED_ENUM.ENABLED});
            },
            afterTypeAdd(record) {
                let newRow = {};
                Object.assign(newRow, record);
                this.$refs.typeGrid.getDataList().unshift(newRow);
            },
            editType(record) {
                this.type.curData = record;
                this.$refs.typeEdit.open(record);
            },
            afterTypeEdit(record) {
                Object.assign(this.type.curData, record);
            },
            changeTypeStatus(record) {
                let newEnabled = record.enabled == this.ENABLED_ENUM.ENABLED ? this.ENABLED_ENUM.DISABLED : this.ENABLED_ENUM.ENABLED;
                this.axios(this.ACTIONS_ENUM.WORK_POSITION_TYPE.CHANGE_STATUS, {
                    ids: record.oid,
                    status: newEnabled
                }, [res => {
                    record.enabled = newEnabled;
                }]);
            },
            positionOperationClick(item, trIndex, callback) {
                this.position.curTrIndex = trIndex;
                if (typeof callback == "function") {
                    callback(item);
                }
            },
            dropDownItemClick(command, row, trIndex, callback) {
                this.position.curTrIndex = trIndex;
                if (typeof callback == "function") {
                    callback(command, row);
                }
            },
            addRootPosition() {
                //增加顶级的岗位
                if (!!this.type.curData) {
                    let newRow = {
                        typeId: this.type.curData.oid,
                        level: 1,
                        parentCode: this.ROOT_CODE
                    };
                    this.$refs.positionEdit.open(newRow);
                } else {
                    this.$message.warning("请选择岗位线!");
                }
            },
            afterAddRoot() {
                let _this = this;
                this.loadPosition(this.type.curData.oid).then(res => {
                    //装载岗位treeTable
                    _this.position.tableData = res.data;
                    this.updatePositionCurTableData(null);
                });
            },
            updatePositionCurTableData(record, refreshUsers) {
                this.position.curTableData = record;
                if (!!refreshUsers) {
                    this.axios(this.ACTIONS_ENUM.WORK_POSITION_USER.LOAD_USERS, {workPositionId: this.position.curTableData.oid}, [res => {
                        this.user.tableData = res.data;
                    }], false);
                }
            },
            addPosition(command, row) {
                //新增岗位
                this.updatePositionCurTableData(row);
                let newRow = {};
                //新增按钮响应
                if (command == this.NEW_NODE_TYPE_ENUM.SAME.code) {
                    //同级节点
                    newRow.parentCode = row.parentCode;
                    newRow._level = row._level;
                    if (!!row.parent) {
                        // newRow.parentName = row.parent.name;
                        newRow.parent = row.parent;
                    }
                } else if (command == this.NEW_NODE_TYPE_ENUM.CHILD.code) {
                    //子节点
                    newRow.parentCode = row.code;
                    newRow._level = row._level + 1;
                    // newRow.parentName = row.deptName;
                    newRow.parent = row;
                }
                newRow.typeId = row.typeId;
                newRow._expanded = false;
                newRow._show = true;
                this.$refs.positionEdit.open(newRow);
            },
            afterAddFriend(_returnData) {
                //向根节点新增
                let _child = Object.assign({}, _returnData);
                this.position.curTableData.parent.children.unshift(_child);
            },
            afterAddChild(_returnData) {
                let _children = null;
                let _child = Object.assign({}, _returnData);
                if (!!this.position.curTableData.children) {
                    _children = this.position.curTableData.children;
                } else {
                    _children = [];
                }
                _children.unshift(_child);
                this.$set(this.position.curTableData, "children", _children);
                this.$refs.positionTreeTable.expand(this.position.curTrIndex);
            },
            editPosition(row) {
                //编辑岗位
                this.updatePositionCurTableData(row);
                this.$refs.positionEdit.open(Object.assign({}, row));
            },
            afterEdit(_returnData) {
                Object.assign(this.position.curTableData, _returnData);
            },
            removePosition(row) {
                //删除岗位
                this.$confirm('此操作将永久删除该岗位以及下属岗位和相关人员, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios(this.ACTIONS_ENUM.WORK_POSITION.REMOVE, {oid: row.oid}, [res => {
                        this.afterAddRoot();
                    }, res => {
                        this.$message.error(res.data);
                    }, res => {
                        this.$message.error(res.data);
                    }]);
                }).catch(() => {
                    this.$message.info(`已取消删除!`);
                });
            },
            loadPosition(typeId) {
                //根据岗位线获取岗位树
                return new Promise((resolve, reject) => {
                    this.axios(this.ACTIONS_ENUM.WORK_POSITION.LOAD_TREE, {typeId: typeId}, [res => {
                        resolve(res);
                    }, res => {
                        reject(res);
                    }, res => {
                        reject(res);
                    }], false);
                });
            },
            positionTreeTableRowClickHandler(row, column, event) {
                this.updatePositionCurTableData(row, true);
            },
            typeCurrentChangeHandler(currentRow, oldCurrentRow) {
                let _this = this;
                //刷新岗位子表
                if (!!currentRow.oid) {
                    this.type.curData = currentRow;
                    this.loadPosition(currentRow.oid).then(res => {
                        //装载岗位treeTable
                        // _this.$set(_this.position, "tableData", res.data);
                        _this.position.tableData = res.data;
                    });
                }
            },
            addUsers() {
                if (!!this.position.curTableData.oid) {
                    this.openSelect();
                    // this.$refs.commSelect.open();
                } else {
                    this.$message.warning("请选择岗位!")
                }
            },
            removeUsers() {
                this.$confirm('此操作将删除选中人员, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let _this = this;
                    this.doRemoveUsers().then(res => {
                        _this.updatePositionCurTableData(this.position.curTableData, true);
                    }).catch(res => {
                        this.$message.error(`删除失败! errorCode = ` + res.code);
                    });
                }).catch(() => {
                    this.$message.info(`已取消删除!`);
                });
            },
            doRemoveUsers() {
                let _this = this;
                return new Promise((resolve, reject) => {
                    //已选数据
                    let selections = _this.user.selections;//array
                    let ids = [];
                    for (let i in selections) {
                        ids.push(selections[i].oid);
                    }
                    _this.axios(_this.ACTIONS_ENUM.WORK_POSITION_USER.REMOVE_USERS, {ids: ids.toString()}, [res => {
                        resolve();
                    }, res => {
                        reject(res);
                    }, res => {
                        reject(res);
                    }])
                });
            },
            beforeSelectClose(_returnData) {
                //选择页面关闭处理,将人员增加到列表中
                if (!!_returnData && !!_returnData.users) {
                    let oldUsers = this.user.tableData;
                    let users = [];
                    let usersMap = [];
                    for (let i in oldUsers) {
                        let _user = oldUsers[i];
                        usersMap[_user.code] = true;
                    }
                    let returnUsers = _returnData.users;
                    for (let o in returnUsers) {
                        let deptUsers = returnUsers[o];
                        for (let j in deptUsers) {
                            let _user = deptUsers[j];
                            if (!usersMap[_user.code]) {
                                users.push(_user);
                            }
                        }
                    }
                    //执行保存操作
                    this.savePositionUsers(users);
                }else{
                    this.closeSelect();
                }
            },
            savePositionUsers(users) {
                if (users && users.length > 0) {
                    //批量保存岗位人员
                    this.axios(this.ACTIONS_ENUM.WORK_POSITION_USER.SAVE_USERS, {
                        positionId: this.position.curTableData.oid,
                        positionUsers: users
                    }, [res => {
                        //成功回调
                        this.closeSelect();
                        this.user.tableData.concat(users);
                        this.updatePositionCurTableData(this.position.curTableData, true);
                    }, res => {
                        //失败回调
                        this.closeSelect();
                        this.$message.error("保存失败!errorCode ="+ res.code);
                    }, res => {
                        this.closeSelect();
                    }]);
                }
            },
            beforePositionClose(_returnData) {
                if (!!_returnData) {
                    if (this.position.curTableData.oid == _returnData.oid) {
                        //编辑模式
                        this.afterEdit(_returnData);
                    } else {
                        if (_returnData.parentCode == this.ROOT_CODE) {
                            //顶级节点新增
                            this.afterAddRoot();
                        } else {
                            //新增模式
                            if (this.position.curTableData.parentCode == _returnData.parentCode) {
                                //新增同级
                                this.afterAddFriend(_returnData);
                            } else {
                                //新增子级
                                this.afterAddChild(_returnData);
                            }
                        }
                    }
                }
                this.$refs.positionEdit.close();
            },
            handleSelectionChange(val) {
                this.user.selections = val;
            },
        },
        mounted() {
            this.initControls();
        }
    }
</script>

<style scoped>
    .ice-button-bar {
        justify-content: flex-start
    }

    .content-filled {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        height: 100%;
        background-color: #ffffff;
    }

    .type-div {
        width: 40%
    }

    .position-div {
        background-color: white;
    }

    .user-div {
        width: 30%;
        display: -webkit-flex; /* Safari */
        display: inline-flex;
        height: 100%;
        flex-direction: column;
        justify-content: space-between;
    }

    .user-div .button-bar {
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .user-div .main {
        height: 100%;
    }

    .el-dropdown {
        margin-right: 10px;
        background: red;
    }
</style>