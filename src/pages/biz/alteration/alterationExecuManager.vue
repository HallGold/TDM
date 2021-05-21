<template>
    <div class="main">
        <div class="right">
            <ice-query-grid title=""
                            :data-url="ENUM.ACTIONS.QUERY_EXEC_LIST.URL()"
                            :query="query"
                            :columns="columns.left"
                            ref="mainQueryGrid"
                            :operations="alterationOperation"
                            :operationsWidth=50
                            :minHeight="650"
                            chooseItem="single"
                            :after-bind-data="afterBindData"
                            @selection-change="tableChange"
                            :buttons="buttons.left">
            </ice-query-grid>
        </div>
        <div class="left">
            <ice-query-grid title=""
                            :gridData="executeUser"
                            :query="[]"
                            :columns="columns.right"
                            ref="executeUserGrid"
                            :operations="operations"
                            :operationsWidth=100
                            :gridAutoRefresh="true"
                            :minHeight="650"
                            :pagination="false"
                            :buttons="buttons.right">
            </ice-query-grid>
        </div>
        <template v-if="assignShow">
            <el-dialog title="变更排程" :visible.sync="assignShow" width="800px">
                <alteration-assign :alteration-num="selectAlteration.alterationNum" :show-delete-btn="false"
                                   :close-handler="closeAssign"></alteration-assign>
            </el-dialog>
        </template>
    </div>
</template>

<script>
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import comm from "./js/comm";
    import renderer from "./js/renderer";
    import AlterationAssign from "./alterationAssign";

    export default {
        name: "alterationExecuManager",
        mixins: [comm, renderer],
        components: {IceQueryGrid, AlterationAssign},
        data() {
            return {
                assignShow: false,
                selectAlteration: "",
                buttons: {
                    left: [],
                    right: []
                },
                query: [],
                columns: {
                    left: [],
                    right: []
                },
                operations: [],
                alterationOperation: [],
                executeUser: [],//实施人员
                executeUserMap: {}//实施人员map
            }
        },
        methods: {
            /**
             *表格加载完以后的方法
             */
            afterBindData() {
                if (this.$refs.mainQueryGrid.getDataList().length == 0) {
                    this.executeUser = [];
                } else {
                    this.$refs.mainQueryGrid.toggleSelectionByIndex(0);
                }
            },
            cancelSelectUser(e) {
            },
            selectUserConfirm(e) {
                for (let i = 0; i < e.length; i++) {
                    let _user = e[i];
                    if (!this.executeUserMap[_user.code]) {
                        this.executeUser.push(_user);
                    }
                }
            },
            initControls() {
                //初始化页面按钮
                this.initButtons();
                //初始化表格操作按钮
                this.initOperation();
                //初始化查询
                this.initQuery();
                //初始化表格列
                this.initColumns();
            },
            //初始化表格查询
            initQuery() {
                let that = this;
                this.query = [{type: 'input', label: '变更单号', code: 'alterationNum', value: ''},
                    {
                        type: 'select',
                        label: '状态',
                        code: 'apprStatus',
                        textProp: 'label',
                        codeProp: 'value',
                        options: that.enumCodeNameToValueLabel(that.ENUM.APPR_STATUS.properties)
                    },
                    {
                        type: 'select',
                        label: '变更类型',
                        textProp: 'name',
                        codeProp: 'code',
                        code: 'alterationType',
                        options: that.ENUM.ALTERATION_TYPE.properties
                    }]
            },
            //初始化表格操作按钮
            initOperation() {
                let that = this;
                this.operations = [
                    Object.assign({}, this.ENUM.OPERATION.RETRACT, {callback: this.reject}, {
                        isShow(row) {
                            return that.isOperationShow(row.execuStatus);
                        }
                    }),
                    Object.assign({}, this.ENUM.OPERATION.VIEW, {callback: this.view})
                ];
                this.alterationOperation = [Object.assign({}, this.ENUM.OPERATION.VIEW, {callback: this.viewAltearion})];
            },
            //操作按钮是否显示
            isOperationShow(value) {
                if (value == this.ENUM.EXECUTE_STATUS.START) {
                    return true;
                }
                return false;
            },
            //初始化表格按钮
            initButtons() {
                this.buttons.right = [
                    Object.assign({}, this.ENUM.BUTTON.ADD, {callback: this.addUser})
                ]
            },
            initColumns() {
                let that = this;
                this.columns.left = [
                    {code: 'oid', hidden: true},
                    {
                        label: '变更类型', code: 'alterationType', width: 120, renderCell(h, data) {
                            return that.onTypeRenderer(data.row);
                        }
                    },
                    {
                        label: '状态', code: 'apprStatus', width: 80, renderCell(h, data) {
                            return that.onStateRenderer(data.row);
                        }
                    },
                    {label: '变更单号', code: 'alterationNum', width: 170},
                    {label: '区域type', code: 'netType', hidden: true},
                    {label: '区域code', code: 'netArea', hidden: true},
                    {
                        label: '区域', width: 140, renderCell(h, data) {
                            return that.onNetAndTypeRenderer(data.row);
                        }
                    }
                ];
                this.columns.right = [
                    {code: 'oid', hidden: true},
                    {label: '实施工程师', code: 'executorName', width: 120},
                    {label: '单位', code: 'executorUnit', width: 140},
                    {
                        label: '实施状态', code: 'execuStatus', width: 100, renderCell(h, data) {
                            return that.onExecuteStateRenderer(data.row);
                        }
                    },
                    {label: '变更工作事项', code: 'alterationItems', width: 100}
                ];
            },
            //表格选择行改变响应事件
            tableChange(row) {
                this.selectAlteration = row[0];
                let that = this;
                Promise.all([this.getExecuteUser(row[0].alterationNum)]).then((res) => {
                    that.executeUser = res[0].data;
                });
            },
            /**
             * 关闭排程弹出框
             */
            closeAssign() {
                this.assignShow = false;
                let that = this;
                Promise.all([this.getExecuteUser(this.selectAlteration.alterationNum)]).then((res) => {
                    let assembleExecute = that.assembleExecuteFlowList(res[0].data);
                    this.createExecuFlow(that.selectAlteration.oid, assembleExecute).then(res => {
                        for (let i = 0; i < assembleExecute.length; i++) {
                            assembleExecute[i].execuStatus = that.ENUM.EXECUTE_STATUS.START;
                        }
                        that.executeUser = that.executeUser.concat(assembleExecute);
                        that.executeUser.reverse();
                        this.$message({
                            message: '发起子流程成功',
                            type: 'success'
                        });
                    });
                }).catch(()=>{
                    this.$message({
                        message: '发起子流程失败',
                        type: 'error'
                    });
                });
            },
            //新增按钮响应事件
            addUser() {
                if (this.selectAlteration == "") {
                    this.$confirm('请选择相关变更', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                    })
                } else {
                    this.assignShow = true;
                }
            },
            /**
             * 查看变更详情
             */
            viewAltearion(row) {
                this.$router.push(this.ENUM.ROUTER.ALTERATION_EDIT.URL({
                    dataId: row.oid,
                    actionType: this.ENUM.ACTIONTYPE.VIEW
                }));
            },
            /**
             *查看变更实施详情
             */
            view(row) {
                this.openEditPage(row.oid, this.ENUM.ACTIONTYPE.VIEW);
            },
            //打开编辑页面
            openEditPage(id, actionType) {
                this.$router.push(this.ENUM.ROUTER.ALTERATION_EXECUTE.URL({
                    dataId: id,
                    actionType: actionType
                }));
            },
            //撤回
            reject(row) {
                this.$confirm('确认撤回该实施子流程', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let _row = row;
                    let that = this;
                    this.axios(this.ENUM.ACTIONS.DESTORY_EXECUTE, {oid: _row.oid}, [res => {
                        if (res.data) {
                            this.$message({
                                message: '撤回成功',
                                type: 'success'
                            });
                            _row.execuStatus = that.ENUM.EXECUTE_STATUS.REVOKE;
                        }
                    }]);
                }).catch(() => {
                });
            }
        },
        mounted() {
            let _this = this;
            Promise.all([_this.initEnumExecuteStatus(), _this.initEnumApprStatus(), this.requestNetAreaData()]).then(res => {
                _this.initControls();
            });
        }
    }
</script>

<style scoped>
    .main {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: center;
        background-color: white;
    }

    .right {
        width: 50%;
        height: 100%;
        padding-right: 4px
    }

    .left {
        width: 50%;
        height: 100%;
        padding-left: 4px;
        margin-left: 0px !important;
    }
</style>