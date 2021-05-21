<template>
    <div class="content-filled">
        <ice-query-grid data-url="/permission/res/ds/outer/get/ds_config_infos?loadDisabled=true"
                        ref="grid"
                        :query="query"
                        :columns="columns"
                        :buttons="buttons"
                        :pagination="false"
                        :operationsWidth=200
                        :operations="operations"></ice-query-grid>
        <data-origin-edit ref="dataOriginEdit"
                          :isSuccess="isSuccess"
                          :title="title"
                          :is-edit="isEdit"
                          :mainDataForm="mainDataForm"></data-origin-edit>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import DataOriginEdit from "./dataOriginEdit";

    export default {
        name: "dataOriginPage",
        components: {DataOriginEdit, IceQueryGrid},
        data() {
            return {
                query: [],       //组件查询
                columns : [
                    {code: 'oid', hidden: true},
                    {label: '数据源编码', code: 'dsCode', width: 200,align:'left'},
                    {label: '数据源名称', code: 'dsName', width: 200,align:'left'},
                    {label: '数据库类型', code: 'dsDbtype', width: 100, mapTypeCode: 'DATABASE_TYPE',align:'left'},
                    // {label:'所属项目',code:'projectId',width:200},
                    {
                        label: '状态', code: 'isEnabled', width: 80, renderCell(h, data) {
                            return data.row.isEnabled == 'Y' ? '启用' : '停用'
                        }
                    },
                    {label: '数据源描述', code: 'remark',align:'left'},
                ],     //组件table列展示
                buttons: [],     //组件按钮
                operations: [],  //组件table列按钮
                title: '',
                loadDisabled: true,      //是否加载停用数据
                mainDataForm: {//表单对象
                    dsCode: '',
                    dsName: '',
                    projectId: '',
                    dsDbtype: '',
                    remark: '',
                    dsUsercode: '',
                    dsPassword: '',
                    dsUrl: ''
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
                    /*{type: 'input', label: '数据源名称', code: 'serviceName', value: ''},
                    {type:'static',code:'loadDisabled',exp:'=',value:()=>{
                        return this.loadDisabled;
                        }}*/
                ];

                this.buttons = [
                    {name: '新增', callback: this.add},
                    {name: '刷新', callback: this.refresh},
                ];
                this.operations = [
                    {name: '编辑', callback: this.editDsInfo},
                    {
                        name: '启用', callback: this.enabledOrDisabled, isShow: function (row) {
                            if (row.isEnabled == 'N') {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: '停用', callback: this.enabledOrDisabled, isShow: function (row) {
                            if (row.isEnabled == 'Y') {
                                return true;
                            }
                            return false;
                        }
                    },
                    {name: '删除', callback: this.deleteItem},
                    {name: '测试', callback: this.textItem}
                ];
            },
            /**
             * 新增
             */
            add() {
                this.isEdit = false;
                this.title = '新增';
                this.$refs.dataOriginEdit.openDialog();
            },
            /**
             * 编辑
             */
            editDsInfo(row) {
                this.isEdit = true;
                this.title = '编辑';
                this.$nextTick(() => {
                    let obj = {};
                    Object.assign(obj, row);
                    this.mainDataForm = obj;
                    this.$refs.dataOriginEdit.openDialog();
                });
            },

            refresh() {
                this.$refs.grid.refresh();
            },
            /**
             * 停用或启用
             */
            enabledOrDisabled(row) {
                let isEnabled = false;
                if (row.isEnabled == 'N') {
                    isEnabled = true;
                }
                this.$axios.post("/permission/res/ds/outer/save/set_enabled", {
                    dsId: row.oid,
                    isEnabled: isEnabled,
                    version: row.version
                }).then(success => {
                    this.$message.success("操作成功");
                    this.refresh();
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                })
            },

            /**
             * 删除
             */
            deleteItem(row) {
                this.$axios.get("/permission/res/ds/outer/del/by_id", {params: {"dsId": row.oid}}).then(success => {
                    this.$message.success("删除成功");
                    this.refresh();
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                })

            },
            /**
             * 测试
             */
            textItem(row) {
                this.$axios.delete("/permission/res/ds/outer/test_connect",
                    {params: {password: row.dsPassword, url: row.dsUrl, user: row.dsUsercode}}).then(success => {
                    this.$message.success("连接成功");
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            },
            /**
             * 回调
             */
            isSuccess() {
                this.$refs.grid.refresh();
            }
        },
        mounted() {
            this.initComponent();
        }
    }
</script>

<style scoped>

</style>
