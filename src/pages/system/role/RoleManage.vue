<template>
    <div class="content-filled">
        <ice-query-grid
                ref="iceGrid"
                :dataUrl="dataUrl"
                :operationsWidth="260"
                :query="query"
                :pagination="false"
                :columns="columns"
                :operations="operations"
                :buttons="buttons"></ice-query-grid>
        <role-edit ref="roleEdit" @beforeClose="close"/>
        <ice-persion-selector
                text-prop="name"
                code-prop="code"
                mode="hidden"
                :selectedPersion="selectedPersion"
                title="选择需要授权人员"
                ref="selectUser"
                choose-item="multiple"
                @select-cannel="selectCannel"
                @select-confirm="selectUserConfirm">
        </ice-persion-selector>
        <!--<ice-pop-selector
                title="选择需要授权APP"
                load-url="/permission/frame_org/load_table_tree?loadDisabled=false"
                label-prop="deptName"
                value-prop="deptCode"
                :lazy="false"
                parent-prop="deptCode"
                data-url="/permission/app/list"
                textProp="name"
                codeProp="appCode"
                ref="selectAPP"
                :pagination="false"
                :height="600"
                :gridIndex="false"
                mode="hidden"
                :query="queryAPP"
                :columns="columnsAPP"
                v-on="$listeners"
                v-bind="$attrs"></ice-pop-selector>-->
        <!--<ice-tree-grid load-url="/permission/frame_org/load_table_tree?loadDisabled=true"
                       label-prop="deptName"
                       value-prop="deptCode"
                       :lazy="false"
                       parent-prop="deptCode"
                       :query="query"
                       :columns="columns"
                       :operations="operations"
                       :buttons="buttons"
                       @node-click="dataTree"
                       :operations-width="140"></ice-tree-grid>-->
        <el-dialog v-dialogDrag title="选择需要授权的资源" custom-class="ice-dialog" center :visible.sync="dialogVisibleResource"
                   width="1000px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">内容待定</div>
        </el-dialog>
        <el-dialog v-dialogDrag title="选择需要授权的APP" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="500px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <div class="select_outer">
                    <div class="select_inner">
                        <el-tree
                                :props="defaultProps"
                                :data="dataApp"
                                :default-expanded-keys="treeSelect"
                                :default-checked-keys="treeSelect"
                                node-key="oid"
                                ref="treeItem"
                                show-checkbox>
                        </el-tree>
                    </div>
                </div>
            </div>
            <div class="ice-button-bar ">
                <el-button type="primary" @click="saveApp">保存</el-button>
                <el-button type="info" @click="closeDialogApp">返回</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import OrgComm from "@/pages/system/comm/OrgComm";
    import RoleEdit from "./RoleEdit";
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IcePopSelector from "../../../components/common/base/IcePopSelector";
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";

    export default {
        mixins: [OrgComm],
        components: {IceTreeGrid, IcePopSelector, IcePersionSelector, IceQueryGrid, RoleEdit},
        name: "RoleManage",
        data() {
            return {
                dataUrl: "",
                curTableData: {},
                columns: [],
                dialogVisible: false,
                dialogVisibleResource: false,
                query: [{type: 'input', label: '角色', code: 'name', model: ``, placeholder: `输入角色名称搜索`},],
                buttons: [],
                operations: [],
                OID: '',
                selectedPersion: [],
                /**选择APP*/
                queryAPP: [
                    {type: 'input', label: 'APP名', code: 'name', value: '', exp: 'like'},
                    {type: 'input', label: 'APP编码', code: 'appCode', value: '', exp: 'like'},
                ],
                columnsAPP: [
                    {code: 'oid', hidden: true},
                    {label: 'APP名', code: 'name', width: 120},
                    {label: 'APP编码', code: 'appCode', width: 120},
                    {
                        label: 'APP图标', code: 'smallIconUrl', width: 60, renderCell: (h, data) => {
                            return <img src={this.$showImage(data.row.smallIconUrl)} width="22px"
                                        height="22px"/>
                        }
                    },
                    {label: 'APP描述', code: 'desp', width: 120},
                ],
                defaultProps: {
                    label: 'name',
                    children: 'children'
                },
                dataApp: [],
                count: 1,
                app: [],
                arryName: [],
                appList: [],                                 /*用来存储授权APP勾选的值传给后台*/
                rowCode: '',                                 /*用来存储角色编码，菜单授权使用*/
                treeSelect: [],                              /*用来存储初始化树形勾选的节点*/
            };
        },
        methods: {
            /**角色资源*/
            roleResource() {
                this.dialogVisibleResource = true;
            },
            appListLoad(arr) {
                arr.forEach(item => {
                    if (item.children) {
                        this.appListLoad(item.children);
                    }else{
                        if (item.selected) {
                            this.treeSelect.push(item.oid);
                        }
                    }
                });
            },
            /**角色APP*/
            roleApp(row) {
                this.rowCode = row.code;
                this.treeSelect = [];
                this.$axios.get("/permission/app_authorize/load_accredit_tree", {"params": {"roleCode": row.code}}).then(success => {
                    this.dataApp = success.data;
                    this.appListLoad(this.dataApp);
                    this.appList = [];
                    this.dialogVisible = true;
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '操作出错了'
                    })
                })
            },
            /**角色授权*/
            roleAuthorize(row) {
                this.selectedPersion = [];
                this.$axios.get("/permission/role_user/users_by_role_id", {"params": {"roleId": row.oid}}).then(success => {
                    this.selectedPersion = success.data.map(item => item.userCode);
                    this.$nextTick(() => {
                        this.$refs.selectUser.openDialog();
                    })
                    this.OID = row.oid;
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '操作出错了'
                    })
                })
            },
            userSync() {
                this.$axios.get("/permission/role_user/assign_normalrole_to_all").then(success => {
                    this.$message.success("同步成功")
                }).catch(error => {
                    this.$message.error("同步失败")
                })
            },
            selectCannel() {
                this.$refs.selectUser.cleanColumnSelect();
            },
            /**选择需要授权的人员弹窗下的确定*/
            selectUserConfirm(rows) {
                let str = '';
                for (let i = 0; i < rows.length; i++) {
                    if (rows.length <= 1) {
                        str = rows[i].code
                    } else {
                        if (i == rows.length - 1) {
                            str += rows[i].code
                        } else {
                            str += rows[i].code + ',';
                        }
                    }
                }
                this.$axios.post("/permission/role_user/role_id", {
                    "deleteOld": true,
                    "roleId": this.OID,
                    "userCodes": str
                }).then(success => {
                    this.$message.success("授权成功")
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '操作出错了'
                    })
                })
            },
            /**保存授权的APP*/
            saveApp() {
                this.appList = [];
                let appList = this.$refs.treeItem.getCheckedNodes(true);
                this.appListItem(appList);
                this.$axios.post("/permission/app_authorize/save_function_useable_app", {"appFunctionUseAbleVoList": this.appList,"roleCode":this.rowCode}).then(success => {
                    this.$message.success("授权成功");
                    this.dialogVisible = false;
                }).catch(error => {
                    this.$message.error("授权APP出错了")
                })
            },
            /**关闭授权APP界面*/
            closeDialogApp() {
                this.dialogVisible = false;
            },
            /**选中的节点格式转换*/
            appListItem(arr) {
                arr.forEach(item => {
                    let obj = {};
                    obj.code = this.rowCode;
                    obj.functionId = item.oid;
                    obj.name = item.name;
                    obj.type = 1;
                    this.appList.push(obj);
                })
            },
            /**初始化根节点*/
            initloadNode() {
                this.$axios.get("/permission/auth/user/get_auth_applist").then(success => {
                    let arry = success.data;
                    for (let i = 0; i < arry.length; i++) {
                        let obj = {};
                        let objName = {};
                        obj.name = arry[i].name;
                        objName.name = arry[i].appCode;
                        this.app.push(obj);
                        this.arryName.push(objName);
                    }
                    for (let i = 0; i < this.app.length; i++) {
                        this.$axios.get("/permission/auth/user/get_auth_appmenu", {"params": {"appCode": this.arryName[i].name}}).then(success => {
                            this.app[i].children = success.data;
                        }).catch(error => {
                            this.$message.error("加载子节点出错了")
                        })
                    }
                }).catch(error => {
                })
            },
            /**初始化主页面按钮与列表*/
            initControls() {
                this.initButtons();
                this.initColumns();
                this.dataUrl = this.ACTIONS_ENUM.ROLE.LOAD_ROLES.URL();
            },
            /**初始化主页面添加按钮*/
            initButtons() {
                this.buttons = [
                    Object.assign({}, this.BUTTON_ENUM.ADD, {callback: this.add}),
                    /*Object.assign({}, this.BUTTON_ENUM.REFRESH, {callback: this.refresh}),*/
                ];
            },
            /**初始化主页面列表*/
            initColumns() {
                this.columns = [
                    {
                        label: '名称', code: 'name', width: 200, render: (record) => {
                            if (record.enabled == this.ENABLED_ENUM.ENABLED) {
                                return (<span class="enabled-word">{record.name}</span>);
                            } else {
                                return (<span class="disabled-word">{record.name}</span>);
                            }
                        }
                    },
                    {label: 'id', code: 'oid', width: 0, hidden: true},
                    {label: '编码', code: 'code', hidden: true},
                    {label: '机构编码', code: 'orgCode', width: 0, hidden: true},
                    {label: '启用状态', code: 'enabled', width: 0, hidden: true},
                    {label: '描述', code: 'desp', width: 200},
                    {label: '备注', code: 'remark', width: 200},
                    {label: '排序', code: 'sequencing', width: 100},
                ];
                let _this = this;
                this.operations = [
                    {name: '编辑', callback: this.edit},
                    {
                        name: '启用', callback: this.changeStatus, isShow: (row) => {
                            return row.enabled == _this.ENABLED_ENUM.DISABLED;
                        }
                    },
                    {
                        name: '停用', callback: this.changeStatus, isShow: (row) => {
                            return row.enabled == _this.ENABLED_ENUM.ENABLED;
                        }
                    },
                    {name: '资源', callback: this.roleResource},
                    {name: '菜单', callback: this.roleApp},
                    {name: '人员', callback: this.roleAuthorize, isShow: row => row.code != 'NORMAL'},
                    {name: '人员同步', callback: this.userSync, isShow: row => row.code == 'NORMAL'},
                    /*{name: '已授权', callback: this.lookAuthorize}*/
                ];
            },
            add() {
                let _newRow = {
                    oid: null,
                    name: "",
                    code: "",
                    enabled: this.ENABLED_ENUM.ENABLED
                };
                this.$refs.roleEdit.open(_newRow);
            },
            afterAdd(_returnData) {
                let newRow = {};
                Object.assign(newRow, _returnData);
                this.$refs.iceGrid.getDataList().unshift(newRow);
            },
            edit(_row) {
                this.curTableData = _row;
                this.$refs.roleEdit.open(Object.assign({}, _row));
            },
            afterEdit(_returnData) {
                Object.assign(this.curTableData, _returnData);
            },
            /**启用/停用*/
            changeStatus(_row) {
                let newEnabled = _row.enabled == this.ENABLED_ENUM.ENABLED ? this.ENABLED_ENUM.DISABLED : this.ENABLED_ENUM.ENABLED;
                this.axios(this.ACTIONS_ENUM.ROLE.CHANGE_STATUS, {
                    orgCode: _row.orgCode,
                    roleCode: _row.code,
                    status: newEnabled
                }, [res => {
                    _row.enabled = newEnabled;
                }, res => {
                    this.$message.error("状态切换失败! errorCode = " + res.code)
                }, res => {
                    this.$message.error("状态切换失败! errorCode = " + res.code)
                }]);
            },
            close(_returnData) {
                if (!!_returnData) {
                    if (this.curTableData.oid == _returnData.oid) {
                        //编辑模式
                        this.afterEdit(_returnData);
                    } else {
                        //新增模式
                        this.afterAdd(_returnData);
                    }
                }
                this.$refs.roleEdit.close();
            },
            refresh() {
                this.$refs.iceGrid.refresh();
            }
        },
        mounted() {
            this.initControls();
            this.initloadNode();
        },
        created() {
        },
    }
</script>

<style scoped>
    .select_outer {
        width: 100%;
        height: 300px;
        position: relative;
        overflow: hidden
    }

    .select_inner {
        position: absolute;
        right: -17px;
        width: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        max-height: 300px
    }
</style>
