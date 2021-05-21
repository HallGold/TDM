<template>
    <div>
        <el-dialog v-dialog-drag
                   title="角色授权"
                   custom-class="ice-dialog"
                   center
                   :visible.sync="dialogVisible"
                   width="92%"
                   append-to-body

                   :before-close="closeDialog"
                   :close-on-click-modal="false">
            <div class="outer" v-loading="loading">
                <div class="inner_left">
                    <div style="max-height: 500px;overflow-x: hidden;">
                        <el-tree :data="treeData"
                                 :props="defaultProps"
                                 node-key="oid"
                                 :default-expanded-keys="[1]"
                                 @node-click="handleNodeClick"
                                 ref="tree">
                        </el-tree>
                    </div>
                </div>
                <div class="inner_right">
                    <div style="margin-bottom: 2px">
                        <el-button @click="save" type="primary" v-loading>保存</el-button>
                    </div>
                    <el-table :data="tableData"
                              ref="grid"
                              :stripe="true"
                              :height="530"
                              @selection-change="handleSelectionChange"
                              @select-all="onselect"
                              @select="onselect"
                              row-key="id">
                        <el-table-column type="selection" width="48" :selectable="isSelectabled">

                        </el-table-column>
                        <el-table-column prop="name" label="名称" align="left"></el-table-column>
                        <el-table-column prop="itemTypeName"
                                         label="类型" width="90"></el-table-column>
                        <el-table-column prop="funcAuthEnabled"
                                         label="启用授权" width="90">
                            <template slot-scope="scope">
                                {{scope.row.funcAuthEnabled == 'Y'?'是':'否'}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="funcAuthMode"
                                         label="授权模式" width="100">
                            <template slot-scope="scope">
                                {{scope.row.funcAuthMode == 'A'?'整体授权':'非整体授权'}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="url" align="left"
                                         label="URL"></el-table-column>
                        <el-table-column prop="dataAuthEnabled"
                                         label="数据隔离"
                                         width="90">
                            <template slot-scope="scope">
                                {{scope.row.dataAuthEnabled == 'Y'?'启用':'停用'}}
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right"
                                         width="100"
                                         label="操作">
                            <template slot-scope="scope">
                                <el-button @click="strategyConfig(scope.row)" type="text"
                                           v-if="scope.row.selected && scope.row.itemType=='service' && scope.row.dataAuthEnabled=='Y'">
                                    策略配置
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <!--            <div class="ice-button-bar dialog_cls">-->
            <!--                <el-button type="info" @click="closeDialog">关闭</el-button>-->
            <!--            </div>-->
        </el-dialog>
        <data-config-edit ref="dataConfigEdit" :isChange="isChange"
                          @data-changed="dataConfigChanged"></data-config-edit>
    </div>
</template>

<script>
    import DataConfigEdit from "./dataConfigEdit";

    export default {
        name: "roleAccreditEdit",
        components: {DataConfigEdit},
        data() {
            return {
                isChange: false,                 //是否有修改
                dialogVisible: false,            //弹窗开关属性
                tableData: [],                   //列表数据
                isFirst: false,                  //是否为打开弹窗
                treeData: [{
                    oid: 1,
                    name: 'APP列表',
                    children: []
                }],                    //树形数据
                defaultProps: {//树形属性
                    children: 'children',
                    label: 'name'
                },
                appAuthMap: {},
                appId: '',
                roleId: '',                       //角色ID
                loading:false,
            }
        },
        methods: {
            /**
             * 隔离策略配置发生改变事件
             */
            dataConfigChanged() {
                this.isChange = true
            },
            /**
             *
             */
            isSelectabled(row) {
                return row.enabled ? true : false;
            },
            /**
             * 关闭弹窗
             */
            closeDialog() {
                this.dialogVisible = false;
                this.appAuthMap = {}
                this.treeData[0].children = [];
                this.tableData = [];
            },
            /**
             * 打开弹窗
             */
            openDialog(row) {
                this.roleId = row.oid;
                this.dialogVisible = true;
                this.getTreeData();
                this.isFirst = true;
            },
            /**
             * 获取左边树形菜单
             */
            getTreeData() {
                let _this = this;
                this.$axios.get("/permission/res/app/outer/get/auth_role_applist").then(success => {
                    _this.treeData[0].children = success.data;
                    if (_this.isFirst) {
                        if (_this.treeData[0].children.length > 0) {
                            _this.appId = _this.treeData[0].children[0].oid;
                            _this.getData();
                        }
                    }
                    _this.isFirst = false;
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                })
            },
            /**
             * 获取table树形数据
             */
            getData() {
                if (this.appAuthMap[this.appId]) {
                    // console.log("getData:: %o", this.appAuthMap[this.appId]);
                    //deepcopy
                    this.tableData = JSON.parse(JSON.stringify(this.appAuthMap[this.appId]));
                    this.$nextTick(() => {
                        this.setSelectedRow(this.tableData);
                    })
                } else {
                    this.loading = true;
                    this.$axios.get("/permission/role/outer/get/app_authmenu_tree", {
                        "params": {
                            "appId": this.appId,
                            "roleId": this.roleId
                        }
                    }).then(success => {
                        this.loading = false;
                        this.appAuthMap[this.appId] = success.data;
                        this.getData();
                    }).catch(error => {
                        this.loading = false;
                        this.tableData = [];
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                    });
                }
            },

            setSelectedRow(rows, parent) {
                let allSelected = true;
                for (let i = 0; i < rows.length; i++) {
                    let row = rows[i];
                    if (row.selected == true) {
                        if (parent != null) {
                            this.$refs.grid.toggleRowExpansion(parent, true);
                        }
                        this.$refs.grid.toggleRowSelection(row, true);
                    } else {
                        allSelected = false;
                    }
                    if (row.children && row.children.length > 0) {
                        this.setSelectedRow(row.children, row);
                    }
                }
                if (allSelected && parent != null && parent.itemType == "menuItem") {
                    this.$refs.grid.toggleRowSelection(parent, true);
                }

            },
            /**
             * 获取table列勾选的数据
             * @param rows
             */
            handleSelectionChange(rows, check) {

            },
            setChildSelection(parent, checked, grid) {
                if (parent.children && parent.children.length > 0) {
                    if (checked) {
                        grid.toggleRowExpansion(parent, true);
                    }
                    parent.children.forEach(child => {
                        if (parent.itemType == 'menuItem') {
                            child.selected = checked
                            grid.toggleRowSelection(child, checked);
                            this.setChildSelection(child, checked, grid);
                        } else {
                            if (!child.enabled || child.itemType == 'button') {
                                child.selected = checked
                                grid.toggleRowSelection(child, checked);
                                this.setChildSelection(child, checked, grid);
                            }
                            if ((parent.itemType == 'subpage' || parent.itemType == 'mainPage') && parent.funcAuthMode == 'P' && parent.funcAuthEnabled == 'Y') {
                                child.enabled = checked;
                            }
                        }
                    })
                }
            },
            onselect(rows, obj) {
                let isTrue = true;//第一层子节点是否全部选中
                for (let i = 0; i < this.tableData.length; i++) {
                    if(!this.tableData[i].selected){
                        isTrue = false;
                        break;
                    }
                }
                this.isChange = true;
                if (obj && rows.indexOf(obj) != -1) {
                    obj.selected = true;
                } else if (obj) {
                    obj.selected = false;
                }
                if(!obj){//当obj为undefined时，则表示为点击全选按钮
                    if(!isTrue){
                        this.selectAll(true);
                    }else{
                        this.selectAll(false);
                    }
                }else{
                    this.$nextTick(() => {
                        this.setChildSelection(obj, obj.selected, this.$refs.grid)
                    });
                }
            },
            selectAll(isTrue){//是否全选
                this.tableData.forEach(item=>{
                    if(isTrue){
                        item.selected = true;
                    }else{
                        item.selected = false;
                    }
                    this.$nextTick(() => {
                        this.setChildSelection(item, isTrue, this.$refs.grid)
                    })
                })
            },

            /**
             * 点击树形获取树形数据
             */
            handleNodeClick(row) {
                if (this.isChange) {
                    this.$confirm('切换分支会加载新的数据，之前没保存的数据会冲掉！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.isChange = false;
                        this.appId = row.oid;
                        if (this.appId) {
                            this.getData();
                        }
                    });
                } else {
                    this.appId = row.oid;
                    if (this.appId) {
                        this.getData();
                    }
                }

            },

            /**load_table_next_children
             * 保存
             */
            save() {
                let authInfos = {
                    roleId: this.roleId,
                    children: this.tableData
                }
                this.$axios.post("/permission/role/outer/save/auth_infos", {"$json": authInfos}).then(success => {
                    this.appAuthMap[this.appId] = success.data;
                    this.getData();
                    this.$message.success("保存成功");
                    this.isChange = false;
                }).catch(error => {
                    if (error.msg) {
                        this.$message.error(error.msg);
                    } else {
                        this.$message.error('保存失败！')
                    }
                });
            },
            /**
             * 策略配置
             */
            strategyConfig(row) {
                this.$refs.dataConfigEdit.openDialog(row, this.roleId);
            }
        }
    }
</script>

<style scoped>
    .dialog_cls {
        background-color: #ffffff;
    }

    .outer {
        display: flex;
        width: 100%;
        height: 580px;
        background-color: #ffffff;
    }

    .inner_left {
        width: 15%;
        height: 100%;
    }

    .inner_right {
        height: 100%;
        width: 85%;
    }
</style>
