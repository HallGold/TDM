<template>
    <div class="content-filled">
        <div class="main">
            <!-- 分派列表-->
            <div>
                <el-button icon="el-icon-plus" type="primary"
                           @click="addItemClickHandler"
                           class="tableBtn">
                    增加
                </el-button>
                <el-button icon="el-icon-delete" type="primary"
                           @click="removeItemsClickHandler" v-if="showDeleteBtn"
                           class="tableBtn">删除
                </el-button>
                <ice-editable-table height="300" :ref="PAGE_CONSTANT.REFS.GRID_REF" :riles="formRules"
                                    :data="executeData" @selection-change="formSelectionChange">
                    <el-table-column
                            type="selection"
                            width="30">
                    </el-table-column>
                    <el-table-column
                            v-if="false"
                            label="oid"
                            prop="oid">
                    </el-table-column>
                    <el-table-column
                            v-if="false"
                            label="executorDept"
                            prop="executorDept">
                    </el-table-column>
                    <el-table-column
                            v-if="false"
                            label="executorCode"
                            prop="executorCode">
                    </el-table-column>
                    <el-table-column
                            label="姓名"
                            :width="200"
                            prop="executorName">
                    </el-table-column>
                    <el-table-column
                            label="部门"
                            :width="200"
                            prop="executorUnit">
                    </el-table-column>
                    <ice-editable-table-column label="工作事项" :width="300" prop="alterationItems">
                        <template slot-scope="scope">
                            <el-input type="textarea" :rows="2"
                                      v-model="scope.row.alterationItems">
                            </el-input>
                        </template>
                    </ice-editable-table-column>
                </ice-editable-table>
            </div>
            <!-- 事项编辑框-->
            <template v-if="PAGE_CONSTANT.DIALOG.VISIBLE">
                <el-dialog
                        :modal="false"
                        :title="PAGE_CONSTANT.DIALOG.TITLE"
                        :visible.sync="PAGE_CONSTANT.DIALOG.VISIBLE"
                        width="40%"
                        :close-on-click-modal="false"
                        :before-close="dialogHandleClose">
                    <ice-query-grid data-url="/permission/position_user/lists"
                                    :pagination="false"
                                    :query="PAGE_CONSTANT.QUERY_LOOK"
                                    :columns="PAGE_CONSTANT.COLUMNS_LOOK"
                                    @selection-change="handleSelectionChange"
                                    chooseItem="multiple"
                                    ref="grid"></ice-query-grid>
                    <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="enter">确 定</el-button>
                <el-button @click="dialogHandleClose">取 消</el-button>
            </span>
                </el-dialog>
            </template>
        </div>
        <div class="footer">
            <el-button type="primary" @click="doAssign">确 定</el-button>
            <el-button @click="doCancel">关 闭</el-button>
        </div>
    </div>
</template>

<script>
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import comm from "./js/comm";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";

    export default {
        //变更排程页面
        name: "alterationAssign",
        mixins: [comm],
        components: {
            IceEditableTableColumn,
            IceEditableTable,
            IceQueryGrid
        },
        props: {
            showDeleteBtn: {
                type: Boolean,
                default: true
            },
            alterationNum: {
                type: String,
                default: null
            },
            closeHandler: {
                type: Function,
                required: true,
                default: function () {
                    alert("请在父页面传入close-handler属性实现关闭按钮回调方法!");
                }
            }
        },
        data() {
            return {
                //页面常量
                PAGE_CONSTANT: {
                    TITLE: "变更排程",
                    REFS: {
                        //分派表ref
                        GRID_REF: "grid",
                        FORM_REF: "form"
                    },
                    //编辑框常量
                    DIALOG: {
                        TITLE: "选择排程人员",
                        VISIBLE: false
                    },
                    DATA_URL: "",
                    CHOOSE_ITEM: "multiple",
                    OPERATIONS: [],
                    QUERY_LOOK: [
                        {type: 'input', label: '人员名称', code: 'name', value: ''},
                        /*{
                            type: 'static', code: "workPositionCode", exp: "=", value: () => {
                                return this.workPositionCode;
                            }
                        },*/ {
                            type: 'static', code: "positionId", exp: "=", value: () => {
                                return "bd07e505ad5c88b4d7b1278bcfab1cf9";
                            }
                        }
                    ],
                    COLUMNS_LOOK: [
                        {code: "oid", hidden: true},
                        {code: "code", hidden: true},
                        {code: "deptCode", hidden: true},
                        {code: "orgCode", hidden: true},
                        {label: '人员名称', code: 'name', width: 120},
                        {label: '单位名称', code: 'orgName', width: 160},
                        {label: '部门名称', code: 'deptName', width: 150},
                    ],
                },
                formRules: {
                    alterationItems: {min: 1, max: 512, message: `最多输入512个汉字!`, trigger: 'blur'}
                },
                curTableData: null,
                executeData: [],
                //岗位编码code
                workPositionCode: 'dutyDept',
                //变更实施主对象
                alterationExecuteData: {
                    oid: "",
                    //变更单号
                    alterationNum: "",
                    //变更实施单号
                    execuNum: "",
                    //变更实施单状态
                    execuStatus: "",
                    //执行人CODE
                    executorCode: "",
                    //执行人姓名
                    executorName: "",
                    //执行人单位
                    executorUnit: "",
                    //执行人部门
                    executorDept: "",
                    //变更工作事项
                    alterationItems: "",
                    //变更耗时（分钟）
                    executeTime: "",
                    //贡献值（工分）
                    score: 0,
                    //派单人CODE
                    assignerCode: "",
                    //派单人姓名
                    assignerName: "",
                    //初始派单时间
                    gmtFirst: null,
                    //重新派单时间
                    gmtAfresh: null,
                    //开始实施时间
                    gmtStart: null,
                    //结束实施时间
                    gmtEnd: null,
                    //退单时间
                    gmtBack: null,
                    //挂起时间
                    gmtHangup: null,
                    //解除挂起时间
                    gmtReleaseHangup: null,
                },
                executeUser: [],//实施工程师
                formGrid: [],//排程表格选中事件
            }
        },
        methods: {
            formSelectionChange(rows) {
                this.formGrid = rows;
            },
            /**
             * 页面初始化
             */
            initPageConstant() {
                let _this = this;
                this.alterationExecuteData.alterationNum = this.$props.alterationNum;
                this.PAGE_CONSTANT.DATA_URL = this.assembleUrl(this.ENUM.ACTIONS.GET_ALTERATION_EXECUTE_LIST.URL(), {alterationNum: this.$props.alterationNum});
                this.getExecuteUser(this.alterationExecuteData.alterationNum).then(res => {
                    _this.executeData = res.data;
                });
            },
            /**
             * 获取实施人员列表
             * @param alterationNum
             */
            getExecuteUser(alterationNum) {
                return new Promise((resolve, reject) => {
                    this.axios(this.ENUM.ACTIONS.GET_ALTERATION_EXECUTE_LIST, {alterationNum: alterationNum}, [res => {
                        resolve(res);
                    }, rej => {
                        reject();
                    }]);
                });
            },
            /**
             * 新增执行人按钮响应
             */
            addItemClickHandler() {
                //调用工程师选择页面,目前没有改页面,直接在grid上增加数据
                let _data = Object.assign({}, this.alterationExecuteData);
                // this.getGrid().getDataList().unshift(_data);
                this.curTableData = _data;
                this.openEditDialog();
            },
            /**
             * 删除多个执行人按钮响应
             */
            removeItemsClickHandler() {
                let _this = this;
                //将打勾项进行删除
                this.axios(this.ENUM.ACTIONS.DEL_LIST, {alterationExecuteVos: this.formGrid}, [res => {
                    _this.$message.success("执行人删除完成!");
                    _this.deletes(_this.executeData, _this.formGrid);
                }, res => {
                    _this.$message.success("执行人删除失败!Ret = " + res);
                }])
            },
            /**
             * 打开编辑框
             */
            openEditDialog() {
                this.PAGE_CONSTANT.DIALOG.VISIBLE = true;
            },
            /**
             *  关闭编辑框
             */
            closeEditDialog() {
                this.PAGE_CONSTANT.DIALOG.VISIBLE = false;
            },
            /**
             * 弹出窗口关闭响应
             */
            dialogHandleClose() {
                this.closeEditDialog();
            },
            /**
             * 实施工程师选择以后
             * @param rows
             */
            handleSelectionChange(rows) {
                this.executeUser = rows;
            },
            /**
             * 确定变更工作事项编辑完成按钮响应
             */
            enter() {
                let _this = this;
                //获取formData中的值，向curTableData填充
                this.executeUser.forEach(item => {
                    if (_this.findSameRowByCode(_this.executeData, item.code, "executorCode") == -1) {
                        _this.executeData.push({
                            executorName: item.name,
                            executorCode: item.code,
                            executorUnit: item.deptName + "[" + item.orgName + "]",
                            executorDept: item.deptCode,
                            alterationNum: this.$props.alterationNum
                        });
                    }
                });
                this.closeEditDialog();
            },
            /**
             * 执行分派,并尝试关闭页面
             */
            doAssign() {
                //将oid为空的上传，执行分派
                let _origin = this.executeData;
                let _list = [];
                for (let i = 0; i < _origin.length; i++) {
                    if (!_origin[i].oid) {
                        _list.push(_origin[i]);
                    }
                }
                if (_list.length > 0) {
                    this.axios(this.ENUM.ACTIONS.ASSIGN, {alterationExecuteVos: _list}, [res => {
                        this.$message.success("分派完成!");
                        this.doCancel();
                    }])
                } else {
                    this.$message.warning("没有可以分派的任务!");
                    this.doCancel();
                }
            },
            /**
             * 关闭页面
             */
            doCancel() {
                this.$props.closeHandler();
            }
        },
        mounted() {
            this.initPageConstant();
        }
    }
</script>

<style lang="less" scoped>
    .content-filled {
        flex-direction: column;

        .main {
            width: 100%;
            display: flex;
            height: 100%;
            margin-bottom: 30px;
        }

        .footer {
            width: 100%;
            display: flex;
            justify-content: flex-end;
        }
    }
</style>