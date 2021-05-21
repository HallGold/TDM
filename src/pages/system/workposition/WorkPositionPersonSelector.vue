<template>
    <ice-dialog
            title="岗位人员选择"
            :visible.sync="dialogVisible"
            width="1200px"
            :before-close="closeDialog"
            remounted>
        <div class="outer dialog_cls">
            <div class="inner_tree" style="width: 15%;float:left">
                <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="filterText">
                </el-input>
                <div style="margin-top: 3px">
                    <el-scrollbar class="ice-scroll-bar-extend"
                                  style="width: 100%; overflow-x: hidden;height: 427px;">
                        <el-tree class="filter-tree"
                                 node-key="oid"
                                 :expand-on-click-node="false"
                                 :check-on-click-node="true"
                                 :data="treeData"
                                 :highlight-current="false"
                                 :props="defaultProps"
                                 :auto-expand-parent="true"
                                 :default-expanded-keys="defaultExpandKey"
                                 :filter-node-method="filterNode"
                                 @node-click="handleNodeClick"
                                 ref="tree">
                        </el-tree>
                    </el-scrollbar>
                </div>
            </div>
            <div class="inner_tbl" style="width:85%;float:right">
                <div style="width: 100%;" class="el-input el-input--small">
                    <div style="float: right; width:447px; margin-right: 2px">
                        <el-input placeholder="输入用户账号，用户名"
                                  v-model="inputValue"
                                  @keyup.enter.native="search(true)">
                            <i class="el-icon-search el-input__icon"
                               style="cursor: pointer"
                               slot="suffix"
                               @click="search(true)"></i>
                        </el-input>
                    </div>
                </div>
                <div class="outer_table" style="width: 100%">
                    <div class="inner_table" style="float: left; width: 446px;margin-left: 2px">
                        <div style="margin: 5px">待选择用户</div>
                        <ice-query-grid style="height: 430px;"
                                        data-url="/permission/position_user/outer/search_not_position_user"
                                        chooseItem="multiple"
                                        @selection-change="notSelect"
                                        :query="query"
                                        :hidden-qucik-query="true"
                                        :beforeBindData="beforeNotData"
                                        ref="gridNot"
                                        :grid-index="false"
                                        pageLayout="total, sizes, prev, next, jumper"
                                        :columns="columns"></ice-query-grid>
                    </div>
                    <div style="text-align: center; float:left;margin-top:100px;padding: 0 5px">
                        <div class="inner_button">
                            <el-button @click="leftToRight" :disabled="this.notData.length<1">
                                进行选择 <i class="el-icon-d-arrow-right el-icon--right"></i>
                            </el-button>
                        </div>
                        <div class="inner_button">
                            <el-button icon="el-icon-d-arrow-left"
                                       @click="rightToLeft"
                                       :disabled="this.alreadyData.length<1">取消选择
                            </el-button>
                        </div>
                        <div class="inner_button">
                            <el-button @click="allConductAuth" :disabled="this.isNot">
                                选择全部<i class="el-icon-d-arrow-right el-icon--right"></i>
                            </el-button>
                        </div>
                        <div class="inner_button">
                            <el-button icon="el-icon-d-arrow-left"
                                       @click="allCancelAuth"
                                       :disabled="isAlready">取消全部
                            </el-button>
                        </div>
                    </div>
                    <div class="inner_table" style="float: right; width: 446px">
                        <div style="margin: 5px">已选择用户</div>
                        <ice-query-grid style="height: 430px;"
                                        data-url="/permission/position_user/outer/search_position_user"
                                        chooseItem="multiple"
                                        @selection-change="alreadySelect"
                                        :query="query"
                                        :hidden-qucik-query="true"
                                        :beforeBindData="beforeAlreadyData"
                                        ref="gridAlready"
                                        :grid-index="false"
                                        pageLayout="total, sizes, prev, next, jumper"
                                        :columns="columns"></ice-query-grid>
                    </div>
                </div>
            </div>
        </div>
    </ice-dialog>

</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "WorkPositionPersonSelector",
        components: {IceQueryGrid},
        props: {},
        data() {
            return {
                defaultExpandKey: [],
                deptLevCode: '',             //部门层级码
                positionId: '',              //岗位ID
                dialogVisible: false,        //弹框开关属性
                filterText: '',              //用于树形搜索
                inputValue: '',
                treeData: [],                //树形数据
                defaultProps: {
                    children: 'children',
                    label: 'deptName'
                },
                columns: [
                    {code: 'oid', hidden: true}, //岗位用户关系ID
                    {code: 'userId', hidden: true}, //用户ID
                    {label: '姓名', code: 'name', width:100}, //用户姓名
                    {label: '登陆账号', code: 'code', width:120}, //用户账号
                    {label: '部门', code: 'deptName'}, //用户所属部门
                    {
                        label: '是否兼职', code: 'partTimeWorker', width:60, renderCell(h, data) {
                            return data.row.partTimeWorker && data.row.partTimeWorker == '1' ? '是' : '否'
                        }
                    },
                ],                 //待授权,已授权用户列表
                query: [
                    {
                        type: 'static', code: 'positionId', value: () => {
                            return this.positionId;
                        }
                    },
                    {
                        type: 'static', code: 'deptLevCode', value: () => {
                            return this.deptLevCode;
                        }
                    },
                    {type: 'input', label: '用户名', code: 'name', value: () => this.inputValue, exp: 'like'},
                    {type: 'input', label: '用户账号', code: 'code', value: () => this.inputValue, exp: 'like'}
                ],
                notIds: '',                  //待授权数据Id
                alreadyIds: '',              //已授权数据Id
                isNot: true,                //待授权列表里是否有数据
                isAlready: true,            //已授权列表里是否有数据
                notData: [],                 //未授权勾选的数据
                alreadyData: []             //已授权勾选的数据
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            /**
             *获取grid查询条件
             */
            createIceQueryWrapper() {
                let params = {
                    conditionLink: 'OR',
                    staticConditions: [],
                    conditions: []
                };
                this.query.forEach(item => {
                    let cond = {};
                    if (item.value) {
                        cond.column = item.code;
                        cond.exp = item.exp ? item.exp : '=';
                        cond.value = item.value();
                    }
                    if (item.type === 'static') {
                        params.staticConditions.push(cond);
                    } else if (item.type === 'input') {
                        params.conditions.push(cond);
                    }
                });
                return params;
            },
            /**待选择用户加载数据时的处理*/
            beforeNotData(data) {
                this.isNot = true;
                if (data.length > 0) {
                    this.isNot = false;
                }
                return data;
            },
            /**已选择用户加载数据时的处理*/
            beforeAlreadyData(data) {
                this.isAlready = true;
                if (data.length > 0) {
                    this.isAlready = false;
                }
                return data;
            },
            /**
             * 树形搜索过滤
             * @param value
             * @param data
             * @returns {boolean}
             */
            filterNode(value, data) {
                if (!value) return true;
                let b = data.deptName.indexOf(value) !== -1;
                return b;
            },
            /**
             * 初始化组件部分
             */
            initComponent() {
            },
            /**
             * 取消
             */
            closeDialog() {
                //this.defaultExpandKey = [];
                this.deptLevCode = '';
                this.positionId = '';
                this.dialogVisible = false;
            },
            /**
             * 打开弹出
             */
            openDialog(row) {
                this.positionId = row.oid
                this.dialogVisible = true;
                this.refreshTree();
            },
            /**
             * 把选择的用户保存到岗位上
             */
            leftToRight() {
                this.$axios.patch("/permission/position_user/outer/save_position_users", {
                    // params: {
                    positionId: this.positionId,
                    positionUsers: this.notData
                    // }
                }).then(success => {
                    this.$message.success("操作成功！");
                    this.refresh();
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                })

            },
            /**
             * 删除选择的岗位人员
             */
            rightToLeft() {
                if (this.alreadyData && this.alreadyData.length > 0) {
                    console.log('rightToLeft, ids : %o', this.alreadyIds)
                    this.$axios.delete("/permission/position_user/outer/remove_position_users", {
                        params: {
                            ids: this.alreadyIds
                        }
                        // params: {
                        //     positionId: this.positionId,
                        //     positionUsers: this.alreadyData
                        // }
                    }).then(success => {
                        this.$message.success("操作成功！");
                        this.refresh();
                    }).catch(error => {
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                    })
                }
            },

            /**
             * 设置所有用户为岗位人员
             */
            allConductAuth() {
                let params = this.createIceQueryWrapper();
                this.$axios.patch("/permission/position_user/outer/save_position_users_by_condition", {
                    ...params, positionId: this.positionId
                }).then(success => {
                    this.$message.success("操作成功！")
                    this.refresh();
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            },
            /**
             * 移除所有岗位人员
             */
            allCancelAuth() {
                let params = this.createIceQueryWrapper();
                this.$axios.delete("/permission/position_user/outer/remove_position_users_by_condition", {
                    // positionId: this.positionId,
                    params: {...params, positionId: this.positionId}
                }).then(success => {
                    this.$message.success("操作成功！")
                    this.refresh();
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            },

            /**
             * 待授权用户--列表选择的数据
             * @param rows
             */
            notSelect(rows) {
                this.notData = rows;
                this.notIds = '';
                let arr = [];
                rows.forEach(item => {
                    arr.push(item.userId);
                });
                if (arr.length > 0) {
                    this.notIds = arr.join(',');
                }
            },
            /**
             * 已授权用户--列表选择的数据
             * @param rows
             */
            alreadySelect(rows) {
                this.alreadyData = rows;
                this.alreadyIds = '';
                let arr = [];
                rows.forEach(item => {
                    arr.push(item.oid);
                });
                if (arr.length > 0) {
                    this.alreadyIds = arr.join(',');
                }
            },
            /**
             * 树节点点击获取节点数据
             * @param data
             */
            handleNodeClick(data) {
                // console.log('handleNodeClick, data: %o', data);
                this.deptLevCode = data.deptLevCode ? data.deptLevCode : data.dataDeptLevcode;
                this.refresh()
            },
            search(isQuick) {
                this.$refs.gridNot.search(isQuick);
                this.$refs.gridAlready.search(isQuick);
            },
            refresh() {
                this.alreadyData = [];
                this.notData = [];
                this.$refs.gridNot.refresh();
                this.$refs.gridAlready.refresh();
            },
            refreshTree(){
                this.$axios.get("/permission/frame_org/load_table_tree?loadDisabled=false").then(success => {
                    this.treeData = success.data;
                    if (this.treeData && this.treeData.length > 0) {
                        this.defaultExpandKey.push(this.treeData[0].oid);
                    }
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                })
            }
        },
        mounted() {
            this.initComponent();
        }
    }
</script>

<style>
    .ice-scroll-bar-extend.el-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .ice-scroll-bar-extend.el-scrollbar .el-scrollbar__bar.is-horizontal > div {
        top: 2px;
    }

    .ice-scroll-bar-extend .el-tree > .el-tree-node {
        display: inline-block;
    }
</style>
<style scoped>
    .dialog_cls {
        padding: 3px 0;
        background-color: #ffffff;
    }

    .outer {
        width: 100%;
        height: 500px;
    }

    .inner_tree {
        height: 100%;
        width: 160px;
        /* margin-right: 5px;
         min-width: 150px;*/
    }

    .inner_tbl {
        height: 100%;
    }

    .outer_table {
        /*width: 100%;*/
        /*align-items: center;*/
    }

    .inner_table {
        /*float: left;*/
        /*height: 45%;*/
    }

    .inner_button {
        width: 100px;
        margin-top: 10px;
    }
</style>
