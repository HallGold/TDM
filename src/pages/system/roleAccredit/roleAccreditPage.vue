<template>
    <div class="content-filled">
        <ice-query-grid data-url="/permission/role/outer/search"
                        ref="grid"
                        :pagination="false"
                        queryType="local"
                        :afterBindData="afterBindData"
                        :query="query"
                        :columns="columns"
                        :buttons="buttons"
                        :operations="operations">
        </ice-query-grid>
        <accredit-user-edit ref="accreditUserEdit"></accredit-user-edit>
        <copy-user-edit ref="copyUserEdit"></copy-user-edit>
        <role-accredit-edit ref="roleAccreditEdit"></role-accredit-edit>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import AccreditUserEdit from "./accreditUserEdit";
    import CopyUserEdit from "./copyUserEdit";
    import RoleAccreditEdit from "./roleAccreditEdit";

    export default {
        name: "roleAccreditPage",
        components: {RoleAccreditEdit, CopyUserEdit, AccreditUserEdit, IceQueryGrid},
        data() {
            return {
                query: [
                    {type: 'input', label: '角色名称', code: 'name', value: ''},
                ],       //组件查询
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'type', hidden: true},
                    {label: '角色名称', code: 'name', width: 200,align:'left'},
                    {label: '角色编码', code: 'code', width: 200,align:'left'},
                    {label: '角色类型', code: 'type', width: 120, mapTypeCode: 'Role_Type',align:'left'},
                    {label: '排序', code: 'sequencing', width: 100,align:'left'},
                    {
                        label: '是否启用', code: 'enabled', width: 90, renderCell(h, data) {
                            return data.row.enabled == '1' ? '是' : '否'
                        }
                    },
                    {label: '角色描述', code: 'desp',align:'left'},
                ],     //组件table列展示
                operations: [
                    // {
                    //     name: '复制', code: 'bjsfz', callback: this.copyItem, isShow: (row) => {
                    //         return row.doEdit && row.type == 20;
                    //     }
                    // },
                    {
                        name: '授权', code: 'bjssq', callback: this.accreditItem, isShow: (row) => {
                            return row.doEdit;
                        }
                    },
                    {
                        name: '人员', code: 'brysq', callback: this.roleAuthToUser, isShow: (row) => {
                            if (row.type == 40 || row.type == 30) {
                                return false;
                            }
                            return row.doEdit;;
                        }
                    },
                ],  //组件table列按钮
                buttons: [
                    {
                        name: '刷新', icon: 'el-icon-refresh', callback: this.refreshData, loading: () => {
                            return this.refreshDataloading;
                        }
                    }
                ],
                refreshDataloading: false
            }
        },
        methods: {
            /**
             * 初始化组件部分
             */
            initComponent() {

            },
            refreshData() {
                //从后台刷新数据
                this.refreshDataloading = true;
                this.$refs.grid.refreshFromRemote();
            },
            afterBindData() {
                this.refreshDataloading = false;
            },
            /**
             * 复制
             */
            copyItem(row) {
                this.$refs.copyUserEdit.openDialog();
            },
            /**
             * 授权
             */
            accreditItem(row) {
                this.$refs.roleAccreditEdit.openDialog(row);
            },
            /**
             * 人员
             */
            roleAuthToUser(row) {
                this.$refs.accreditUserEdit.openDialog(row);
            }
        },
        mounted() {
            this.initComponent();
        }
    }
</script>

<style scoped>

</style>
