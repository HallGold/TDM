<template>
    <div class="dialog_cls">
        <el-dialog v-dialog-drag
                   title="角色人员授权"
                   custom-class="ice-dialog"
                   center
                   :visible.sync="dialogVisible"
                   width="1200px"
                   append-to-body
                   :before-close="closeDialog"
                   :close-on-click-modal="false">
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
                            <div style="margin: 5px">待授权用户</div>
                            <ice-query-grid style="height: 430px;"
                                            :data-url="'/permission/role/outer/get/unauth_users?deptLevCode='+deptLevCode+'&roleId='+roleId"
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
                                    进行授权<i class="el-icon-d-arrow-right el-icon--right"></i>
                                </el-button>
                            </div>
                            <div class="inner_button">
                                <el-button icon="el-icon-d-arrow-left"
                                           @click="rightToLeft"
                                           :disabled="this.alreadyData.length<1">取消授权
                                </el-button>
                            </div>
                            <div class="inner_button">
                                <el-button @click="allConductAuth" :disabled="this.isNot">
                                    授权所有<i class="el-icon-d-arrow-right el-icon--right"></i>
                                </el-button>
                            </div>
                            <div class="inner_button">
                                <el-button icon="el-icon-d-arrow-left"
                                           @click="allCancelAuth"
                                           :disabled="isAlready">取消所有
                                </el-button>
                            </div>
                        </div>
                        <div class="inner_table" style="float: right; width: 446px">
                            <div style="margin: 5px">已授权用户</div>
                            <ice-query-grid style="height: 430px;"
                                            :data-url="'/permission/role/outer/get/authed_users?deptLevCode='+deptLevCode+'&roleId='+roleId"
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
            <!--            <div class="ice-button-bar dialog_cls">-->
            <!--                <el-button type="info" @click="closeDialog">取消</el-button>-->
            <!--            </div>-->
        </el-dialog>
    </div>

</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "accreditUserEdit",
        components: {IceQueryGrid},
        props: {},
        data() {
            return {
                defaultExpandKey: [],
                deptLevCode: '',             //部门层级码
                roleId: '',                  //角色ID
                dialogVisible: false,        //弹框开关属性
                filterText: '',              //用于树形搜索
                inputValue: '',
                treeData: [],                //树形数据
                defaultProps: {
                    children: 'children',
                    label: 'deptName'
                },
                columns : [
                    {code: 'userId', hidden: true},
                    {label: '姓名', code: 'userName'},
                    {label: '登陆账号', code: 'userCode'},
                    {label: '部门', code: 'deptName'},
                    {
                        label: '是否兼职', code: 'partTimeWorker', renderCell(h, data) {
                            return data.row.partTimeWorker && data.row.partTimeWorker == '1' ? '是' : '否'
                        }
                    },
                ],                 //待授权,已授权用户列表
                query: [],
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
            beforeNotData(data) {
                this.isNot = true;
                if (data.length > 0) {
                    this.isNot = false;
                }
                return data;
            },
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

                this.query = [
                    {type: 'input', label: '用户名', code: 'USER_CODE', value: () => this.inputValue, exp: 'like'},
                    {type: 'input', label: '用户账号', code: 'USER_NAME', value: () => this.inputValue, exp: 'like'}
                ];
            },
            /**
             * 取消
             */
            closeDialog() {
                this.defaultExpandKey = [];
                this.deptLevCode = '';
                this.dialogVisible = false;
            },
            /**
             * 打开弹出
             */
            openDialog(row) {
                this.dialogVisible = true;
                this.roleId = row.oid;
                this.defaultExpandKey = [];
                if (this.treeData && this.treeData.length > 0) {
                    this.defaultExpandKey.push(this.treeData[0].oid);
                    this.deptLevCode = this.treeData[0].deptLevCode;
                    this.deptId = this.treeData[0].oid;
                    this.$nextTick(() => {
                        if (this.deptId) {
                            this.$refs.tree.setCurrentNode(this.deptId);
                        }
                    })
                }
            },
            /**
             * 待授权用户进行授权
             */
            leftToRight() {
                this.$axios.post("/permission/role/outer/save/auth_selected_users", {
                    roleId: this.roleId,
                    userIds: this.notIds
                }).then(success => {
                    this.$message.success("授权成功");
                    this.refresh();
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                })

            },
            /**
             * 已授权用户取消授权
             */
            rightToLeft() {
                this.$axios.post("/permission/role/outer/save/unauth_selected_users", {
                    roleId: this.roleId,
                    userIds: this.alreadyIds
                }).then(success => {
                    this.$message.success("取消授权成功");
                    this.refresh();
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                })
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
                    arr.push(item.userId);
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
            /**
             * 所有用户进行角色授权
             */
            allConductAuth() {
                this.$axios.post("/permission/role/outer/save/auth_all_users", {
                    deptLevCode: this.deptLevCode,
                    roleId: this.roleId,
                    queryCond: this.inputValue
                }).then(success => {
                    this.$message.success("操作成功")
                    this.refresh();
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            },
            /**
             * 所有用户取消角色授权
             */
            allCancelAuth() {
                this.$axios.post("/permission/role/outer/save/unauth_all_users", {
                    deptLevCode: this.deptLevCode,
                    roleId: this.roleId,
                    queryCond: this.inputValue
                }).then(success => {
                    this.$message.success("操作成功")
                    this.refresh();
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            }
        },
        mounted() {
            this.initComponent();
            this.$axios.get("/permission/frame_org/load_table_tree?loadDisabled=false").then(success => {
                this.treeData = success.data;
                if (this.treeData && this.treeData.length > 0) {
                    this.defaultExpandKey.push(this.treeData[0].oid);
                }
            }).catch(error => {
                this.$message.error(error.msg ? error.msg : '操作出错了');
            })
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
