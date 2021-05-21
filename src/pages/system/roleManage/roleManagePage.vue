<template>
    <div class="content-filled">
        <ice-query-grid data-url="/permission/role/outer/search"
                        ref="grid"
                        queryType="local"
                        :pagination="false"
                        :columns="columns"
                        :operations="operations"
                        :buttons="buttons"
                        :query="query"></ice-query-grid>
        <role-edit ref="roleEdit"
                   :title="title"
                   :isSuccess="isSuccess"
                   :is-edit="isEdit"
                   :mainDataForm="mainDataForm"></role-edit>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import RoleEdit from "../roleManage/roleEdit";

    export default {
        name: "roleManagePage",
        components: {RoleEdit, IceQueryGrid},
        data() {
            return {
                query: [
                    {type: 'input', label: '角色名称', code: 'name', value: ''},
                    {type: 'input', label: '角色编码', code: 'code', value: ''}
                ],       //组件查询
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'version', hidden: true},
                    {code: 'orgId', hidden: true},
                    {code: 'isPublic', hidden: true},
                    {code: 'isSystem', hidden: true},
                    {label: '角色名称', code: 'name', width: 200,align:'left'},
                    {label: '角色编码', code: 'code', width: 200,align:'left'},
                    {label: '角色类型', code: 'type', width: 120, mapTypeCode: 'Role_Type', showTips:true,align:'left'},
                    {label: '排序', code: 'sequencing', width: 90},
                    {label: '是否启用', code: 'enabled', width: 80, mapTypeCode: 'YES_NO'},
                    {label: '角色描述', code: 'desp', showTips:true, align:'left'}
                ],     //组件table列展示N
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', callback: this.add},
                    {name: '刷新', icon: 'el-icon-refresh', callback: this.refreshRoles}
                ],     //组件按钮
                operations: [
                    {
                        name: '编辑', callback: this.editPageFuncItem, isShow: function (row) {
                            return row.doEdit
                        }
                    },
                    {
                        name: '启用', callback: this.enabledOrDisabled, isShow: function (row) {
                            if (row.doEdit) {
                                if (row.enabled != 1) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    },
                    {
                        name: '停用', callback: this.enabledOrDisabled, isShow: function (row) {
                            if (row.doEdit) {
                                if (row.enabled == 1) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    },
                    {
                        name: '删除', callback: this.deleteItem, isShow: function (row) {
                            return row.doEdit
                        }
                    }
                ],  //组件table列按钮
                title: '',
                mainDataForm: {//表单对象
                    name: '',
                    code: '',
                    type: '',
                    sequencing: '',
                    desp: ''
                },
                isEdit: false,
            }
        },
        methods: {
            /**
             * 初始化组件部分
             */
            initComponent() {
            },
            /**
             * 新增
             */
            add() {
                this.isEdit = false;
                this.title = '新增角色';
                this.$refs.roleEdit.openDialog();
            },
            refreshRoles() {
                this.$refs.grid.refreshFromRemote();
            },
            /**
             * 停用或启用
             */
            enabledOrDisabled(row) {
                let enabled = false;
                if (row.enabled == 0) {
                    enabled = true;
                }
                this.$axios.post("/permission/role/outer/save/role_enabled", {
                    "roleId": row.oid,
                    "enabled": enabled
                }).then(success => {
                    this.$message.success("操作成功");
                    this.$refs.grid.refresh();
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            },
            /**
             * 编辑
             */
            editPageFuncItem(row) {
                this.isEdit = true;
                this.title = '角色信息维护';
                let obj = {};
                Object.assign(obj, row);
                obj.type = obj.type.toString()
                this.$refs.roleEdit.openDialog();
                this.$nextTick(() => {
                    this.mainDataForm = obj;
                });
            },

            /**
             * 删除
             */
            deleteItem(row) {
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/permission/role/outer/del/role_byid", {"params": {"roleId": row.oid}}).then(success => {
                        this.$message.success("删除成功");
                        this.refresh();
                    }).catch(error => {
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                    });
                });
            },
            /**
             * 刷新
             */
            refresh() {
                this.$nextTick(() => {
                    this.refreshRoles();
                })
            },
            isSuccess() {
                this.refresh();
            }
        },
        mounted() {
            this.initComponent();
            // console.log("mounted")
        }
    }
</script>

<style scoped>

</style>
