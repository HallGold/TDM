<template>
    <div class="content-filled">
        <ice-query-grid data-url="/permission/res/app/outer/get/can_managed_applist"
                        ref="grid"
                        :pagination="false"
                        :query="query"
                        queryType="local"
                        :columns="columns"
                        :buttons="buttons"
                        :operationsWidth="160"
                        :operations="operations">
        </ice-query-grid>
        <app-manage-edit :title="title"
                         ref="appManageEdit"
                         :mainDataForm="appManageData"
                         :is-edit="isEdit"
                         :isSuccess="isSuccess"></app-manage-edit>
        <app-define-page ref="appDefinePage"></app-define-page>
        <constant-manage ref="constantManage"></constant-manage>
    </div>

</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import AppManageEdit from "./appManageEdit";
    import AppDefinePage from "./appDefinePage";
    import ConstantManage from "../constant/ConstantManage";

    export default {
        name: "appManagePage",
        components: {ConstantManage, AppDefinePage, AppManageEdit, IceQueryGrid},
        data() {
            return {
                query: [],       //组件查询
                columns: [],     //组件table列展示
                buttons: [],     //组件按钮
                operations: [],  //组件table列按钮
                title: '',
                appManageData: {//表单对象
                    name: '',
                    smallIconUrl: '',
                    openType: '',
                    appCode: '',
                    url: '',
                    desp: '',
                    visible: 1,
                    enabled: 1,
                    appType: 'B'
                },
                isEdit: false
            }
        },
        methods: {
            /**
             * 初始化组件部分
             */
            initComponent() {
                this.query = [
                    {type: 'input', label: 'APP名称', code: 'name', value: ''},
                    {type: 'input', label: 'APP编码', code: 'appCode', value: ''}
                ];

                this.columns = [
                    {code: 'oid', hidden: true},
                    {
                        label: '图标', code: 'smallIconUrl', width: 60, renderCell: (h, data)=> {
                            return <img src={this.$showImage(data.row.smallIconUrl)} width="22px" height="22px"/>
                        }
                    },
                    {label: 'APP名称', code: 'name', width: 210,align:'left'},
                    {label: '编码', code: 'appCode', width: 210,align:'left'},
                    {
                        label: '启用状态', code: 'enabled', width: 110, renderCell(h, data) {
                            return data.row.enabled == '1' ? '启用' : '停用'
                        }
                    },
                    {label: '描述', code: 'desp', width: 200, align:'left'},
                ];
                this.buttons = [
                    {name: '新增', icon: 'el-icon-plus',  callback: this.addAPPInfo},
                    {name: '刷新', icon: 'el-icon-refresh', callback: this.refreAppData},
                ];
                this.operations = [
                    {
                        name: '菜单', callback: this.editAppMenuList, isShow: function (row) {
                            return row.doEdit != 1;
                        }
                    },
                    {
                        name: '编辑', callback: this.editAPPInfo, isShow: function (row) {
                            return row.doEdit;
                        }
                    },
                    {
                        name: '启用', callback: this.enabledOrDisabled, isShow: function (row) {
                            if (row.enabled == '0' && row.doEdit > 1) {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: '停用', callback: this.enabledOrDisabled, isShow: function (row) {
                            if (row.enabled == '1' && row.doEdit > 1) {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: '常量', callback: this.constantItem, isShow: (row) => {
                            return row.doEdit > 1
                        }
                    }
                ];
            },
            /**
             * 新增
             */
            addAPPInfo() {
                this.isEdit = false
                this.$nextTick(() => {
                    this.title = '新增';
                    this.$refs.appManageEdit.openDialog();
                })

            },
            refreAppData() {
                this.$refs.grid.refreshFromRemote();
            },
            /**
             * APP常量
             */
            constantItem(row) {
                this.$refs.constantManage.open(row.appCode);
            },
            isSuccess() {
                this.refreAppData()
            },
            /**
             * 菜单
             */
            editAppMenuList(row) {
                this.$refs.appDefinePage.openDialog(row.oid, row.appCode);
                this.$nextTick(() => {
                    this.$refs.appDefinePage.refresh();
                });
            },
            /**
             * 编辑app信息
             */
            editAPPInfo(row) {
                this.isEdit = true;
                this.title = '编辑';
                let obj = {};
                Object.assign(obj, row);
                this.$refs.appManageEdit.openDialog();
                this.$nextTick(() => {
                    let s = {dataSecretLevcode: '1'}
                    this.appManageData = {...obj, ...s};
                });
            },
            /**
             * 删除
             */
            deleteItem() {

            },
            /**
             * 停用或启用
             */
            enabledOrDisabled(row) {
                let isEnabled = 0;
                if (row.enabled == '0') {
                    isEnabled = 1;
                }
                this.$axios.post("/permission/res/app/outer/save/set_enabled", {
                    appId: row.oid,
                    enabled: isEnabled,
                    version: row.version
                }).then(success => {
                    this.isSuccess();
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            },
        },
        mounted() {
            this.initComponent();

        }
    }
</script>

<style scoped>

</style>
